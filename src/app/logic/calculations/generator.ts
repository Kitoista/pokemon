import { tick } from "../common";
import { Context, FAIRY, GROUND, ICE, Move, NORMAL, Pokemon, ROCK, Situation, SituationSet, SituationSetEvaluation, SuperPokemon, allTypes, typeList } from "../models";
import { SituationCandidate, runInterceptors, situationCandidateInterceptors, teamInfluencerInterceptors } from "./interceptors";

export const generatePokemons = (origin: SuperPokemon): Pokemon[] => {
    const superMovelist = movesPrework(origin.moveset, origin.name);
    const requiredMoves = origin.moveset.filter(move => move.isRequired);
    const movesets = limitedCombiner(superMovelist.map(move => [move]), origin.numberOfAttacks)
        .filter(moveset => requiredMoves.every(requiredMove => moveset.some(move => move.isSpecial === requiredMove.isSpecial && move.type === requiredMove.type)));
    return movesets.map(moveset => new Pokemon(origin.name, origin.types, origin.stats, origin.ability, moveset, origin.item, origin.role, origin.roleFailure));
}

export const generateAttackerSets = (attackers: SuperPokemon[], maxAttackersNum): Pokemon[][] => {
    const mandatoryPokemons = attackers.filter(pokemon => pokemon.isRequired);
    const possiblePokemonSets: Pokemon[][] = attackers.map(attacker => generatePokemons(attacker));

    const possiblePokemonSetsMap: { [pokemonName: string]: Pokemon[] } = {};
    possiblePokemonSets.forEach(pokemonSet => {
        const pokemonName = pokemonSet[0].name.split(' ')[0];
        if (!possiblePokemonSetsMap[pokemonName]) {
            possiblePokemonSetsMap[pokemonName] = [];
        }
        possiblePokemonSetsMap[pokemonName] = [...possiblePokemonSetsMap[pokemonName], ...pokemonSet];
    });

    return limitedCombiner(Object.values(possiblePokemonSetsMap), maxAttackersNum).filter(pokemonSet => {
        return mandatoryPokemons.every(p => pokemonSet.some(pokemon => pokemon.name === p.name));
    });
}

export function limitedCombiner<T>(toBeCombined: T[][], limit: number): T[][] {
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

export const generateAttackerSituations = (situationCandidate: SituationCandidate): Situation[] => {
    situationCandidate = runInterceptors(situationCandidateInterceptors, situationCandidate);

    return situationCandidate.attacker.moveset.map(move => ({
        ...situationCandidate,
        move
    }));
}

export const generateSituationSet = (attackers: Pokemon[], defenders: Pokemon[], context: Context): SituationSet => {
    const res: Situation[][] = [];
    const teamInfluencer = runInterceptors(teamInfluencerInterceptors, { attackers, context });

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
            re.push(...allTypes.map(types => new Pokemon(defender.name, types, defender.stats, defender.ability, defender.moveset, defender.item, defender.role, defender.roleFailure)));
        } else {
            re.push(defender);
        }
    });
    return re;
}

export const movesPrework = (moves: Move[], userName: string): Move[] => {
    if (!moves || moves.length === 0) {
        moves = [{ type: NORMAL, power: 1, isSpecial: false, userName, isRequired: false }];
        // const physicalMoves: Move[] = typeList.map(type => ({ type, power: 1, isSpecial: false, userName, isRequired: false }));
        // const specialMoves: Move[] = typeList.map(type => ({ type, power: 1, isSpecial: true, userName, isRequired: false }));
        // moves = physicalMoves.concat(specialMoves);
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
