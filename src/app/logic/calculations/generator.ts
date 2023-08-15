import { Context, FAIRY, GROUND, ICE, Move, Pokemon, ROCK, Situation, SituationSet, SuperPokemon, allTypes, dualTypes, typeList } from "../models";

export const generatePokemons = (origin: SuperPokemon): Pokemon[] => {
    const movesets = generateMovesets(origin.moveset, origin.numberOfAttacks);
    return movesets.map(moveset => new Pokemon(origin.name, origin.types, origin.stats, origin.ability, moveset, origin.item));
}

export const generateSituationSets = (attackers: SuperPokemon[], defender: SuperPokemon, context: Context, maxAttackersNum: number): SituationSet[] => {
    const possiblePokemonSets: Pokemon[][] = attackers.map(attacker => generatePokemons(attacker));
    const attackerSets: Pokemon[][] = limitedCombiner(possiblePokemonSets, maxAttackersNum);
    const defenders: Pokemon[] = generateDefenders(defender);
    
    let re: SituationSet[] = [];
    attackerSets.forEach(attackerSet => {
        re.push(generateSituationSet(attackerSet, defenders, context));
    });

    return re;
}

// function recursiveCombiner<T>(toBeCombined: T[][], knownCombinations: T[][] = []): T[][] {
//     if (toBeCombined.length === 0) {
//         return knownCombinations;
//     }
//     const newCombinations: T[][] = [];

//     if (knownCombinations.length === 0) {
//         toBeCombined[0].forEach(pokemon => {
//             newCombinations.push([pokemon]);
//         });
//     } else {
//         knownCombinations.forEach(knownSet => {
//             toBeCombined[0].forEach(pokemon => {
//                 newCombinations.push([ ...knownSet, pokemon ]);
//             });
//         });
//     }

//     const remainingtoBeCombined: T[][] = [...toBeCombined];
//     remainingtoBeCombined.shift();
//     return recursiveCombiner(remainingtoBeCombined, newCombinations);
// }

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

console.log(limitedCombiner)

export const generateSituationSet = (attackers: Pokemon[], defenders: Pokemon[], context: Context): SituationSet => {
    const res: Situation[][] = [];
    defenders.forEach(defender => {
        const re: Situation[] = [];
        res.push(re);
        attackers.forEach(attacker => {
            attacker.moveset.forEach(move => {
                re.push({
                    attacker,
                    defender,
                    move,
                    context
                });
            });
        });
    });
    return {
        attackers,
        defenders,
        situationMatrix: res
    };
}

export const generateDefenders = (defender: SuperPokemon): Pokemon[] => {
    return allTypes.map(types => new Pokemon(defender.name, types, defender.stats, defender.ability, defender.moveset, defender.item));
}

export const generateMovesets = (moves?: Move[], num = 4): Move[][] => {
    if (!moves || moves.length === 0) {
        moves = typeList.concat([]).map(type => ({ type, power: 1 }));
    }
    num = Math.min(moves.length, num);
    let re: Move[][] = [];
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
    for (let i = 0; i < moves.length; ++i) {
        if (num > 1) {
            for (let j = i + 1; j < moves.length; ++j) {
                if (num > 2) {
                    for (let k = j + 1; k < moves.length; ++k) {
                        if (num > 3) {
                            for (let l = k + 1; l < moves.length; ++l) {
                                if (num > 4) {
                                    for (let m = l + 1; m < moves.length; ++m) {
                                        re.push([
                                            moves[i],
                                            moves[j],
                                            moves[k],
                                            moves[l],
                                            moves[m]
                                        ]);
                                    }
                                } else {
                                    re.push([
                                        moves[i],
                                        moves[j],
                                        moves[k],
                                        moves[l]
                                    ]);
                                }
                            }
                        } else {
                            re.push([moves[i], moves[j], moves[k]]);
                        }
                    }
                } else {
                    re.push([moves[i], moves[j]]);
                }
            }
        } else {
            re.push([moves[i]]);
        }
    }
    return re;
}
