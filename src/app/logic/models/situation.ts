import { Context } from "./context";
import { Move, MoveEffect } from "./move";
import { Pokemon } from "./pokemon";

export interface Situation {
    attacker: Pokemon,
    defender: Pokemon,
    move: Move,
    context: Context
}

export interface SituationSet {
    attackers: Pokemon[],
    defenders: Pokemon[],
    situationMatrix: Situation[][]
}

export interface SituationSetEvaluation {
    situationSet: SituationSet,
    evaluations: SituationEvaluation[],
    averageDamage: number,
    smallBrackets: SituationEvaluationBrackets,
    bigBrackets: SituationEvaluationBrackets
}

export interface SituationEvaluation {
    situation: Situation,
    moveEffect: MoveEffect
}

export interface SituationEvaluationBrackets {
    [multiplier: string]: SituationEvaluation[];
}

export interface BracketBreakpoint {
    min: number,
    max: number,
    display: string,
    minExclusive?: boolean,
    maxInclusive?: boolean,
    colorClass: string
}
