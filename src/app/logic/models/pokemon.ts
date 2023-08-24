import { binomialCoefficient } from "../common";
import { Ability } from "./ability";
import { Item } from "./item";
import { Move } from "./move";
import { PokeType } from "./poke-type";
import { Role } from "./role";
import { HpStat, Stat, Stats } from "./stat";

export class Pokemon {
    public constructor(
        public name: string,
        public types: PokeType[] = [],
        public stats: Stats = {
            hp: new HpStat(100, 0),
            attack: new Stat(100, 1, 255, 0),
            defense: new Stat(100, 1, 255, 0),
            spAttack: new Stat(100, 1, 255, 0),
            spDefense: new Stat(100, 1, 255, 0),
        },
        public ability: Ability,
        public moveset: Move[] = [],
        public item: Item,
        public role: Role,
        public roleFailure: boolean
    ) { }
}

export class SuperPokemon extends Pokemon {
    public constructor(
        name: string,
        types: PokeType[],
        stats: Stats,
        ability: Ability,
        moveset: Move[],
        item: Item,
        role: Role,
        roleFailure: boolean,
        public numberOfAttacks: number,
        public isRequired: boolean,
    ) {
        super(name, types, stats, ability, moveset, item, role, roleFailure);
    }

    
    get mutantCounts(): number {
        return binomialCoefficient(this.moveset.length, this.numberOfAttacks);
    }
}
