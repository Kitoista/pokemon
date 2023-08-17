import { PokeType } from "./poke-type"

export interface Move {
    userName: string,
    type: PokeType,
    power: number,
    isSpecial: boolean,
    isRequired: boolean
}

export interface MoveEffect {
    damage: number,
    remainingHp: number,
    damagePercentage: number,
    isSpecial: boolean,
    multiplier: number,
    type: PokeType
}
