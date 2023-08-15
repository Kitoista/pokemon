import { BracketBreakpoint, MoveEffect, Situation, SituationEvaluationBrackets, SituationEvaluation as SituationEvaluation, SituationSet, SituationSetEvaluation } from "../models";
import { calculateDamage } from "./damage";

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

export const evaluateSituations = (situations: Situation[]): SituationEvaluation => {
    let best: Situation;
    let bestMoveEffect: MoveEffect;

    situations.forEach(situation => {
        const currentMoveEffect = calculateDamage(situation);
        if (!best || currentMoveEffect.dmg > bestMoveEffect!.dmg) {
            best = situation;
            bestMoveEffect = currentMoveEffect;
        }
    });

    return {
        situation: best!,
        moveEffect: bestMoveEffect!,
    };
}

let hasLogged = false;

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
    const sum = evaluations.reduce((sum, evalutaion) => sum + evalutaion.moveEffect.dmg, 0);

    evaluations.sort((a, b) => {
        return a.moveEffect.dmg - b.moveEffect.dmg;
    });

    return {
        situationSet,
        evaluations,
        averageDamage: sum / evaluations.length,
        smallBrackets: createBrackets(smallBracketBreakpoints, evaluations),
        bigBrackets: createBrackets(bigBracketBreakpoints, evaluations)
    }
}

export const evaluateSituationSets = (situationSets: SituationSet[]): SituationSetEvaluation[] => {
    const re: SituationSetEvaluation[] = situationSets.map(evaluateSituationSet);

    re.sort((a, b) => {
        return b.averageDamage - a.averageDamage;
    });

    return re;
}
