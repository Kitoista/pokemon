import { Injectable } from '@angular/core';
import { DefenderList, DefenderListSaveHandler, Save, SaveHandler, Saveable, Setup, SetupSaveHandler } from '../logic/common';

export abstract class SaveService<T extends Saveable> {
    saves: Save<T>;
    saveId?: string;
    
    get currentSave(): T | undefined {
        return this.saveId ? this.saves[this.saveId] : undefined;
    }

    get loadedNumber(): number {
        return Object.keys(this.saves).length;
    }

    get loadedIndex(): number {
        return this.saveId ? Object.keys(this.saves).indexOf(this.saveId) : -1;
    }

    constructor(protected saveHandler: SaveHandler<T>) {
        this.saves = this.saveHandler.loadAll();
        this.saveId = Object.keys(this.saves)[0];
    }

    createSave() {
        this.save();
        this.saveId = undefined;
    }

    save(newSave?: T) {
        newSave = newSave ?? this.currentSave;
        if (newSave) {
            this.saveId = this.saveHandler.save(newSave);
            this.saves = this.saveHandler.loadAll();
        }
    }

    loadNextSave() {
        this.save();
        const ids = Object.keys(this.saves);
        this.saveId = ids[(this.loadedIndex + 1) % ids.length];
    }

    copySave() {
        if (this.saveId) {
            this.save();
            const newSave = this.currentSave!;
            newSave.id = undefined;
            this.save(newSave);
        }
    }

    deleteSave() {
        if (this.saveId) {
            this.saveHandler.delete(this.saveId);
            this.saveId = undefined;
            this.saves = this.saveHandler.loadAll();
        }
    }

    deleteAllSaves() {
        this.saveHandler.deleteAll();
        this.saveId = undefined;
        this.saves = this.saveHandler.loadAll();
    }
}

@Injectable({ providedIn: 'root' })
export class SetupSaveService extends SaveService<Setup> {
    constructor() {
        super(new SetupSaveHandler());
    }
}

@Injectable({ providedIn: 'root' })
export class DefenderListSaveService extends SaveService<DefenderList> {
    constructor() {
        super(new DefenderListSaveHandler());
    }
}
