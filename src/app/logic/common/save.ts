import { Context, SuperPokemon } from "../models";
import { Parser } from "./parser";

const genRanHex = size => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');

const getCurrentSaves = (): RawSaves => {
    const savesString = localStorage.getItem('saves');
    return savesString ? JSON.parse(savesString) : {};
}

const saveThese = (saves: Saves): void => {
    localStorage.setItem('saves', Parser.stringify(saves));
}

export const save = (save: Save): string => {
    if (!save.saveId) {
        save.saveId = genRanHex(32);
    }
    const saves = getCurrentSaves();
    saves[save.saveId] = save;

    saveThese(saves);
    return save.saveId;
}

export const loadAll = (): Saves => {
    const rawSaves = getCurrentSaves();
    const saves: Saves = {};
    Object.keys(rawSaves).forEach(saveId => {
        const obj = rawSaves[saveId];
        console.log(obj);
        
        saves[saveId] = {
            saveId,
            attackers: Parser.superPokemons(obj.attackers),
            defender: Parser.superPokemon(obj.defender),
            context: obj.context,
            maxAttackersNum: obj.maxAttackersNum
        }
    });
    return saves;
}

export const clearSaves = (): void => {
    saveThese({});
}

export const clearSave = (saveId: string): void => {
    const saves = getCurrentSaves();
    delete(saves[saveId]);
    saveThese(saves);
}

interface RawSaves {
    [id: string]: any
}

export interface Saves {
    [id: string]: Save
}

export interface Save {
    saveId?: string;
    attackers: SuperPokemon[];
    defender: SuperPokemon;
    context: Context;
    maxAttackersNum: number;
}
