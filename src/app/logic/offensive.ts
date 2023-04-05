import {
NORMAL,FIRE,WATER,ELECTRIC,GRASS,ICE,FIGHTING,POISON,GROUND,FLYING,PSYCHIC,BUG,ROCK,GHOST,DRAGON,DARK,STEEL,FAIRY,
PokeType, typeList, Types, dualTypes, allTypes, log, logObject, movesetAgainst, generateMovesets, singleTypeCounts, Brackets, MovesetHighscore, Ability, Attack, AttackEffect, Matchup
} from './poke-type';

export const MyEvaluator = (damage: number, defender: PokeType[], stabTypes: PokeType[]): number => {
    return damage;
}

export class Offensive {
    evaluator: (damage: number, defender: PokeType[], stabTypes: PokeType[]) => number = MyEvaluator;

    public getBestMovesets(stabTypes: PokeType[], ability: Ability, attacks?: Attack[], mustHaveAttacks: Attack[] = [], number = 4, topX = 10): MovesetHighscore[] {
        const movesets = generateMovesets(attacks, number);

        const highscores: MovesetHighscore[] = [];
        
        movesets.filter(moveset => {
            return mustHaveAttacks.every(attack => moveset.find(move => move.type === attack.type));
        }).forEach(moveset => {
            let score = 0;
            const brackets = new Brackets();
            const matchups: Matchup[] = [];
            const avgEffect: AttackEffect = { dmg: 0, multiplier: 0, type: NORMAL };

            allTypes.forEach(defender => {
                const effect = movesetAgainst(moveset, defender, stabTypes, ability);
                brackets[effect.multiplier] += 1;
                score += this.evaluator(effect.dmg, defender, stabTypes);
                avgEffect.dmg += effect.dmg;
                avgEffect.multiplier += effect.multiplier;
                matchups.push({ effect, defender });
            });
            score = score / allTypes.length;
            avgEffect.dmg = avgEffect.dmg / allTypes.length;
            avgEffect.multiplier = avgEffect.multiplier / allTypes.length;

            matchups.sort((a, b) => {
                if (a.effect.dmg !== b.effect.dmg) {
                    return a.effect.dmg - b.effect.dmg;
                }
                if (a.effect.multiplier !== b.effect.multiplier) {
                    return a.effect.multiplier - b.effect.multiplier;
                }
                if (a.effect.type.name < b.effect.type.name) {
                    return -1;
                }
                return 1;
            });
            
            if (highscores.length < topX) {
                highscores.push({ moveset, score, avgEffect, brackets, matchups });
                return;
            }

            highscores.sort((a, b) => b.score - a.score);

            for (let i = 0; i < highscores.length; ++i) {
                if (highscores[i].score < score) {
                    highscores.splice(i, 0, { moveset, score, avgEffect, brackets, matchups });
                    highscores.pop();
                    return;
                }
            }
        });

        highscores.sort((a, b) => b.score - a.score);

        return highscores;
    }
}
