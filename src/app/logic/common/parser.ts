import { Move, PokeType, Stat, Stats, SuperPokemon, typeList } from "../models";

interface Replacer {
    type: any,
    replaceFn: (toReplace: any) => any
}

export class Parser {
    static knownReplacers: Replacer[] = [
        { type: PokeType, replaceFn: (type: PokeType) => ({ name: type.name }) }
    ];

    public static superPokemons(pokemons: any): SuperPokemon[] {
        return pokemons.map(pokemon => Parser.superPokemon(pokemon));
    }

    public static superPokemon(obj: any): SuperPokemon {
        return new SuperPokemon(
            obj.name,
            Parser.pokeTypes(obj.types),
            Parser.stats(obj.stats),
            obj.ability,
            Parser.moveset(obj.moveset),
            obj.item,
            obj.numberOfAttacks
        );
    }

    public static pokeType(type: any): PokeType {
        return typeList.find(t => t.name === type.name)!;
    }
    
    public static pokeTypes(types: any): PokeType[] {
        return types.map(type => Parser.pokeType(type));
    }

    public static stat(stat: any): Stat {
        return new Stat(stat.base, stat.nature, stat.ev, stat.stage);
    }

    public static stats(stats: any): Stats {
        return {
            attack: Parser.stat(stats.attack),
            defense: Parser.stat(stats.defense),
        }
    }

    public static moveset(moveset: any): Move[] {
        return moveset.map(move => Parser.move(move));
    }

    public static move(move: any): Move {
        return {
            power: move.power,
            type: Parser.pokeType(move.type)
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
