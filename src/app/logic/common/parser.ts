import { HpStat, Move, PokeType, Pokemon, Stat, Stats, SuperPokemon, typeList } from "../models";

interface Replacer {
    type: any,
    replaceFn: (toReplace: any) => any
}

export class Parser {
    static knownReplacers: Replacer[] = [
        { type: PokeType, replaceFn: (type: PokeType) => ({ name: type.name }) }
    ];

    public static pokemons(pokemons: any): Pokemon[] {
        if (!Array.isArray(pokemons)) {
            pokemons = [pokemons];
        }
        return pokemons.map(pokemon => Parser.pokemon(pokemon));
    }

    public static pokemon(obj: any): Pokemon {
        return new Pokemon(
            obj.name,
            Parser.pokeTypes(obj.types),
            Parser.stats(obj.stats),
            obj.ability,
            Parser.moveset(obj.moveset),
            obj.item
        );
    }

    public static superPokemons(pokemons: any): SuperPokemon[] {
        if (!Array.isArray(pokemons)) {
            pokemons = [pokemons];
        }
        return pokemons.map(pokemon => Parser.superPokemon(pokemon));
    }

    public static superPokemon(obj: any): SuperPokemon {
        return new SuperPokemon(
            obj.name,
            Parser.pokeTypes(obj.types),
            Parser.stats(obj.stats),
            obj.ability,
            Parser.moveset(obj.moveset, obj.name),
            obj.item,
            obj.numberOfAttacks,
            obj.isRequired
        );
    }

    public static pokeType(type: any): PokeType {
        return typeList.find(t => t.name === type.name)!;
    }
    
    public static pokeTypes(types: any): PokeType[] {
        return types.map(type => Parser.pokeType(type));
    }

    public static stat(stat: any): Stat {
        if (!stat) {
            return new Stat(100, 1.1, 255, 0);
        }
        return new Stat(stat.base, stat.nature, stat.ev, stat.stage);
    }

    public static hpStat(stat: any): HpStat {
        if (!stat) {
            return new HpStat(100, 0);
        }
        return new HpStat(stat.base, stat.ev);
    }

    public static stats(stats: any): Stats {
        return {
            hp: Parser.hpStat(stats.hp),
            attack: Parser.stat(stats.attack),
            defense: Parser.stat(stats.defense),
            spAttack: Parser.stat(stats.spAttack),
            spDefense: Parser.stat(stats.spDefense),
        }
    }

    public static moveset(moveset: any, userName?: string): Move[] {
        return moveset.map(move => Parser.move(move, userName));
    }

    public static move(move: any, userName?: string): Move {
        return {
            userName: userName || move.userName,
            power: move.power,
            type: Parser.pokeType(move.type),
            isSpecial: !!move.isSpecial,
            isRequired: !!move.isRequired
        }
    }

    static replace(obj: any, replacer: Replacer): any {
        if (obj instanceof replacer.type) {
            return replacer.replaceFn(obj);
        }

        if (typeof obj !== "object") {
            return obj;
        }

        if (Array.isArray(obj)) {
            return obj.map(e => Parser.replace(e, replacer));
        }

        const re = {};
        Object.keys(obj).forEach(key => {
            re[key] = Parser.replace(obj[key], replacer);
        });
        return re;
    }

    public static stringify(obj: any): any {
        let re = obj;
        
        Parser.knownReplacers.forEach(replacer => {
            re = Parser.replace(re, replacer);
        });
        return JSON.stringify(re);
    }
}
