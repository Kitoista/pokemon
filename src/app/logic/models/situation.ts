import { Context, Weather } from "./context";
import { Move, MoveEffect } from "./move";
import { Pokemon } from "./pokemon";

export interface Situation {
    attacker: Pokemon,
    defender: Pokemon,
    move: Move,
    context: Context
}

export interface SituationCandidate {
    attacker: Pokemon,
    defender: Pokemon,
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
    averageDamagePercentage: number,
    averageRemainingHp: number,
    ohKoPercentage: number,
    dominantWeather: Weather,
    usedMoves: Move[],
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
