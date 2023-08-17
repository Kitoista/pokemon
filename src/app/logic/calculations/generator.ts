import { Parser } from "../common";
import { Context, ELECTRIC, FAIRY, GROUND, ICE, Move, Pokemon, ROCK, Situation, SituationCandidate, SituationSet, SuperPokemon, allTypes, dualTypes, typeList } from "../models";

export const generatePokemons = (origin: SuperPokemon): Pokemon[] => {
    const superMovelist = movesPrework(origin.moveset, origin.name);
    const requiredMoves = origin.moveset.filter(move => move.isRequired);
    const movesets = limitedCombiner(superMovelist.map(move => [move]), origin.numberOfAttacks)
        .filter(moveset => requiredMoves.every(requiredMove => moveset.some(move => move.isSpecial === requiredMove.isSpecial && move.type === requiredMove.type)));
    return movesets.map(moveset => new Pokemon(origin.name, origin.types, origin.stats, origin.ability, moveset, origin.item));
}

export const generateSituationSets = (attackers: SuperPokemon[], defenders: SuperPokemon[], context: Context, maxAttackersNum: number): SituationSet[] => {
    const mandatoryPokemons = attackers.filter(pokemon => pokemon.isRequired);
    const possiblePokemonSets: Pokemon[][] = attackers.map(attacker => generatePokemons(attacker));
    const attackerSets: Pokemon[][] = limitedCombiner(possiblePokemonSets, maxAttackersNum).filter(pokemonSet => {
        return mandatoryPokemons.every(p => pokemonSet.some(pokemon => pokemon.name === p.name));
    });
    const generatedDefenders: Pokemon[] = generateDefenders(defenders);
    
    let re: SituationSet[] = [];
    attackerSets.forEach(attackerSet => {
        re.push(generateSituationSet(attackerSet, generatedDefenders, context));
    });

    return re;
}

function limitedCombiner<T>(toBeCombined: T[][], limit: number): T[][] {
    if (toBeCombined.length === 0) {
        return [];
    }
    if (toBeCombined.length === 1) {
        return toBeCombined[0].map(element => [element]);
    }
    if (limit === 1) {
        const re: T[][] = [];
        toBeCombined.map(list => {
            re.push(...list.map(element => [element]));
        });
        return re;
    }
    const remainingToBeCombined: T[][] = [...toBeCombined];
    const firstList = remainingToBeCombined.shift()!;

    const alreadyCombined: T[][] = limitedCombiner(remainingToBeCombined, limit - 1);

    const re: T[][] = [];
    firstList.forEach(element => {
        alreadyCombined.forEach(combined => {
            re.push([element, ...combined]);
        });
    });
    if (toBeCombined.length > limit) {
        re.push(...limitedCombiner(remainingToBeCombined, limit));
    }
    return re;
}

export const weatherAbilityInterceptor = (pokemon: Pokemon, context: Context): Context => {
    let weather = context.weather;
    switch(pokemon.ability) {
        case 'Drought': weather = 'Harsh sunlight'; break;
        case 'Drizzle': weather = 'Rain'; break;
        case 'Sand Stream': weather = 'Sandstorm'; break;
        case 'Snow Warning': weather = 'Hail'; break;
    }
    return {
        weather,
        terrain: context.terrain
    };
}

interface TeamInfluencer {
    attackers: Pokemon[];
    context: Context
}

export const weatherAbilityInfluencerInterceptor = (teamInfluencer: TeamInfluencer): TeamInfluencer => {
    let context = teamInfluencer.context;
    const attackers = teamInfluencer.attackers;

    attackers.forEach(attacker => {
        context = weatherAbilityInterceptor(attacker, context);
    });

    return {
        attackers,
        context
    }
}

export const weatherMoveInfluencerInterceptor = (teamInfluencer: TeamInfluencer): TeamInfluencer => {
    if (teamInfluencer.context.weather === 'None') {
        return teamInfluencer;
    }

    const context = teamInfluencer.context;
    let attackers = teamInfluencer.attackers;

    attackers = attackers.map(attacker => {
        let re = attacker;
        const toBeReplaced: { old: Move, new: Move }[] = [];
        attacker.moveset.forEach(move => {
            let newMove: Move | undefined = undefined;
            
            if (context.weather === 'Rain') {
                if (move.isSpecial && (move.power === 90 || move.power === 117) && move.type === ELECTRIC) {
                    newMove = { ...move, power: Math.floor(move.power * 110 / 90) };
                }
            }
    
            if (newMove) {
                toBeReplaced.push({ old: move, new: newMove});
            }
        });
        if (toBeReplaced.length > 0) {
            re = new Pokemon(
                re.name,
                re.types,
                re.stats,
                re.ability,
                re.moveset.map(move => toBeReplaced.find(moveUpdate => moveUpdate.old === move)?.new || move),
                re.item
            );
            
        }
        return re;
    });

    return {
        attackers,
        context
    };
}

export const weatherAbilityCandidateInterceptor = (situationCandidate: SituationCandidate): SituationCandidate => {
    let attacker = situationCandidate.attacker;
    let defender = situationCandidate.defender;
    let context = situationCandidate.context;

    context = weatherAbilityInterceptor(defender, context);

    return {
        attacker,
        defender,
        context
    }
}

export const defenderAbilityCandidateInterceptor = (situationCandidate: SituationCandidate): SituationCandidate => {
    let attacker = situationCandidate.attacker;
    let defender = situationCandidate.defender;
    let context = situationCandidate.context;

    if (defender.ability === 'Intimidate') {
        attacker = Parser.pokemon(attacker);
        attacker.stats.attack.stage -= 1;
    }

    return {
        attacker,
        defender,
        context
    }
}

export const generateAttackerSituations = (situationCandidate: SituationCandidate): Situation[] => {
    situationCandidate = weatherAbilityCandidateInterceptor(situationCandidate);
    situationCandidate = defenderAbilityCandidateInterceptor(situationCandidate);

    return situationCandidate.attacker.moveset.map(move => ({
        ...situationCandidate,
        move
    }));
}

export const generateSituationSet = (attackers: Pokemon[], defenders: Pokemon[], context: Context): SituationSet => {
    const res: Situation[][] = [];
    let teamInfluencer = { attackers, context };
    teamInfluencer = weatherAbilityInfluencerInterceptor(teamInfluencer);
    teamInfluencer = weatherMoveInfluencerInterceptor(teamInfluencer);
    if (context.weather !== 'None') {
        teamInfluencer.context = context;
    }

    defenders.forEach(defender => {
        const re: Situation[] = [];
        res.push(re);
        teamInfluencer.attackers.forEach(attacker => {
            re.push(...generateAttackerSituations({ attacker, defender, context: teamInfluencer.context }));
        });
    });
    return {
        attackers: teamInfluencer.attackers,
        defenders,
        situationMatrix: res
    };
}

export const generateDefenders = (defenders: SuperPokemon[]): Pokemon[] => {
    const re: Pokemon[] = [];
    defenders.forEach(defender => {
        if (defender.types.length === 0) {
            re.push(...allTypes.map(types => new Pokemon(defender.name, types, defender.stats, defender.ability, defender.moveset, defender.item)));
        } else {
            re.push(defender);
        }
    });
    return re;
}

const movesPrework = (moves: Move[], userName: string): Move[] => {
    if (!moves || moves.length === 0) {
        const physicalMoves: Move[] = typeList.map(type => ({ type, power: 1, isSpecial: false, userName, isRequired: false }));
        const speicalMoves: Move[] = typeList.map(type => ({ type, power: 1, isSpecial: true, userName, isRequired: false }));
        moves = physicalMoves.concat(speicalMoves);
    }
    moves.sort((a, b) => {
        if (a.type === GROUND) return -1;
        if (b.type === GROUND) return 1;

        if (a.type === FAIRY) return -1;
        if (b.type === FAIRY) return 1;

        if (a.type === ROCK) return -1;
        if (b.type === ROCK) return 1;

        if (a.type === ICE) return -1;
        if (b.type === ICE) return 1;
        return 0;
    });
    return moves;
}
