import { Parser, tock, tick } from "../common";
import { BracketBreakpoint, MoveEffect, Situation, SituationEvaluationBrackets, SituationEvaluation as SituationEvaluation, SituationSet, SituationSetEvaluation, Move, weathers, Weather, SuperPokemon, Context, Pokemon } from "../models";
import { calculateDamage } from "./damage";
import { generateAttackerSets, generateDefenders, generateSituationSet } from "./generator";

export const smallBracketBreakpoints: BracketBreakpoint[] = [
    { min: 6, max: Number.POSITIVE_INFINITY, display: 'x6', colorClass: 'x4' },
    { min: 4, max: 6, display: 'x4', colorClass: 'x4' },
    { min: 3, max: 4, display: 'x3', colorClass: 'x2' },
    { min: 2, max: 3, display: 'x2', colorClass: 'x2' },
    { min: 1.5, max: 2, display: 'x1.5', colorClass: 'x1' },
    { min: 1, max: 1.5, display: 'x1', colorClass: 'x1' },
    { min: 0.75, max: 1, display: 'x0.75', colorClass: 'x05' },
    { min: 0.5, max: 0.75, display: 'x0.5', colorClass: 'x05' },
    { min: 0.375, max: 0.5, display: 'x0.375', colorClass: 'x025' },
    { min: 0, max: 0.375, display: '< x0.375', colorClass: 'x025', minExclusive: true },
    { min: Number.NEGATIVE_INFINITY, max: 0, display: 'x0', colorClass: 'x0', maxInclusive: true },
];

export const bigBracketBreakpoints: BracketBreakpoint[] = [
    { min: 2, max: Number.POSITIVE_INFINITY, display: 'super effective', colorClass: 'x2' },
    { min: 1, max: 2, display: 'effective', colorClass: 'x1' },
    { min: Number.NEGATIVE_INFINITY, max: 1, display: 'not very effective or immune', colorClass: 'x05' },
];


export const evaluateAll = (attackers: SuperPokemon[], defenders: SuperPokemon[], context: Context, maxAttackersNum: number, topN: number): SituationSetEvaluation[] => {
    const attackerSets: Pokemon[][] = generateAttackerSets(attackers, maxAttackersNum);
    const generatedDefenders: Pokemon[] = generateDefenders(defenders);
    
    let re: SituationSetEvaluation[] = [];

    console.log(attackerSets.length);

    tick('evaluation');
    attackerSets.forEach(attackerSet => {
        let situationSet = generateSituationSet(attackerSet, generatedDefenders, context);
        let evaluation = evaluateSituationSet(situationSet);
        evaluation.usedMoves

        if (re.some(existing => {
            return existing.usedMoves.every(move => {
                return evaluation.usedMoves.some(m => m.isSpecial === move.isSpecial && m.power === move.power && m.userName === move.userName)
            });
        })) {
            return;
        }

        if (re.length < topN) {
            re.push(evaluation);
            re.sort(situationSetEvaluationComparator);
        } else {
            const worseIndex = re.findIndex(existing => situationSetEvaluationComparator(existing, evaluation) > 0);
            if (worseIndex > -1) {
                re.splice(worseIndex, 0, evaluation);
                re.pop();
            }
        }
    });
    tock('evaluation');

    return re;
}

export const evaluateSituations = (situations: Situation[]): SituationEvaluation => {
    let best: Situation;
    let bestMoveEffect: MoveEffect;

    situations.forEach(situation => {
        const currentMoveEffect = calculateDamage(situation);
        if (!best || currentMoveEffect.damage > bestMoveEffect!.damage) {
            best = situation;
            bestMoveEffect = currentMoveEffect;
        }
    });

    return {
        situation: best!,
        moveEffect: bestMoveEffect!,
    };
}

const createBrackets = (breakpoints: BracketBreakpoint[], evaluations: SituationEvaluation[]): SituationEvaluationBrackets => {
    const re: SituationEvaluationBrackets = {};

    breakpoints.forEach(bp => re[bp.display] = []);

    evaluations.forEach(evaluation => {
        const multiplier = evaluation.moveEffect.multiplier;
        let breakpoint = breakpoints.find(bp => (bp.minExclusive ? bp.min < multiplier : bp.min <= multiplier) && (bp.maxInclusive ? bp.max >= multiplier : bp.max > multiplier));
        re[breakpoint!.display].push(evaluation);
    });

    return re;
}

export const evaluateSituationSet = (situationSet: SituationSet): SituationSetEvaluation => {
    const evaluations = situationSet.situationMatrix.map(evaluateSituations);
    const sumDmg = evaluations.reduce((sum, evalutaion) => sum + evalutaion.moveEffect.damage, 0);
    const sumDmgPercentage = evaluations.reduce((sum, evalutaion) => sum + evalutaion.moveEffect.damagePercentage, 0);
    const sumRemainingHp = evaluations.reduce((sum, evalutaion) => sum + evalutaion.moveEffect.remainingHp, 0);
    const ohKoCount = evaluations.filter(evaluation => evaluation.moveEffect.remainingHp === 0).length;

    const usedMoves: Move[] = [];
    evaluations.forEach(evaluation => {
        if (!usedMoves.includes(evaluation.situation.move)) {
            usedMoves.push(evaluation.situation.move);
        }
    });

    situationSet.attackers = Parser.pokemons(situationSet.attackers)
    situationSet.attackers.forEach(attacker => {
        attacker.moveset = attacker.moveset.filter(move => usedMoves.some(m => Parser.stringify(move) === Parser.stringify(m)));
    });
    situationSet.attackers = situationSet.attackers.filter(attacker => {
        return attacker.moveset.length || ['Drought', 'Drizzle'].includes(attacker.ability) || ['Swords Dance Passer'].includes(attacker.role)
    });

    evaluations.sort((aEval, bEval) => {
        const a = aEval.moveEffect;
        const b = bEval.moveEffect;

        if (b.remainingHp === 0 && a.remainingHp === 0) {
            return a.damagePercentage - b.damagePercentage;
        }
        if (b.remainingHp === 0) return -1;
        if (a.remainingHp === 0) return 1;
        
        return a.damagePercentage - b.damagePercentage;
    });

    const weatherCounts = {};
    weathers.forEach(weather => {
        weatherCounts[weather] = evaluations.filter(evaluation => evaluation.situation.context.weather === weather).length;
    });

    const dominantWeather = Object.keys(weatherCounts).sort((a, b) => weatherCounts[b] - weatherCounts[a])[0] as Weather;

    return {
        situationSet,
        evaluations,
        averageDamage: sumDmg / evaluations.length,
        averageDamagePercentage: sumDmgPercentage / evaluations.length,
        averageRemainingHp: sumRemainingHp / evaluations.length,
        ohKoPercentage: ohKoCount / evaluations.length,
        dominantWeather,
        usedMoves,
        smallBrackets: createBrackets(smallBracketBreakpoints, evaluations),
        bigBrackets: createBrackets(bigBracketBreakpoints, evaluations)
    }
}

const situationSetEvaluationComparator = (a, b) => {
    const first = b.ohKoPercentage - a.ohKoPercentage;
    if (first !== 0) {
        return first
    }
    return b.averageDamagePercentage - a.averageDamagePercentage;
}

export const evaluateSituationSets = (situationSets: SituationSet[]): SituationSetEvaluation[] => {
    let re: SituationSetEvaluation[] = situationSets.map(evaluateSituationSet);

    const helperMap: { [concatedNames: string]: SituationSetEvaluation } = {};
    
    re.forEach(evaluation => {
        const key = evaluation.situationSet.attackers.map(pokemon => `[${pokemon.name}]${pokemon.moveset.join(',')}`).join('|');
        helperMap[key] = evaluation;
    });

    re = Object.values(helperMap);

    re.sort(situationSetEvaluationComparator);

    return re;
}
