import { Context, SuperPokemon } from "../models";
import { Parser } from "./parser";

const genRanHex = size => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');

export interface Save<T extends Saveable> {
    [id: string]: T
}

export interface Saveable {
    id?: string;
}

export interface Setup extends Saveable {
    attackers: SuperPokemon[];
    context: Context;
    maxAttackersNum: number;
}

export interface DefenderList extends Saveable {
    defenders: SuperPokemon[];
}

export abstract class SaveHandler<T extends Saveable> {
    protected abstract get key(): string;
    
    protected abstract parse(id: string, obj: any): T;

    protected getCurrentObjects(): Save<any> {
        const osString = localStorage.getItem(this.key);
        return osString ? JSON.parse(osString) : {};
    }
    
    protected saveObjects(os: Save<T>): void {
        localStorage.setItem(this.key, Parser.stringify(os));
    }
    
    public save(o: T): string {
        if (!o.id) {
            o.id = genRanHex(32);
        }
        const os = this.getCurrentObjects();
        os[o.id] = o;
    
        this.saveObjects(os);
        return o.id;
    }
    
    public loadAll(): Save<T> {
        const rawSaves = this.getCurrentObjects();
        const os: Save<T> = {};
        try {
            Object.keys(rawSaves).forEach(id => {
                os[id] = this.parse(id, rawSaves[id]);
            });
        } catch(e) {
            console.error('An error has happened during parsing');
            console.error(e);
        }
        return os;
    }

    public deleteAll(): void {
        this.saveObjects({});
    }
    
    public delete(id: string): void {
        const os = this.getCurrentObjects();
        delete(os[id]);
        this.saveObjects(os);
    }
}

export class SetupSaveHandler extends SaveHandler<Setup> {
    protected get key(): string {
        return 'setups';
    }

    protected parse(id: string, obj: any): Setup {
        return {
            id: id,
            attackers: Parser.superPokemons(obj.attackers),
            context: obj.context,
            maxAttackersNum: obj.maxAttackersNum
        };
    }
}

export class DefenderListSaveHandler extends SaveHandler<DefenderList> {
    protected get key(): string {
        return 'defenders';
    }

    protected parse(id: string, obj: any): DefenderList {
        return {
            id: id,
            defenders: Parser.superPokemons(obj.defenders)
        };
    }
}
