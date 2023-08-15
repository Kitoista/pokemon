import { PokeType } from "./poke-type"

export interface Move {
    type: PokeType,
    power: number
}

export interface MoveEffect {
    dmg: number,
    multiplier: number,
    type: PokeType
}
