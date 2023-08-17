import { Ability } from "./ability";
import { Item } from "./item";
import { Move } from "./move";
import { PokeType } from "./poke-type";
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
        public item: Item = 'None'
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
        public numberOfAttacks: number,
        public isRequired: boolean,
    ) {
        super(name, types, stats, ability, moveset, item);
    }
}
