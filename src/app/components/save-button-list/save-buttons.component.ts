import { Component, Output, EventEmitter } from '@angular/core';
import { DefenderList, Saveable, Setup, SetupSaveHandler } from 'src/app/logic/common';
import { DefenderListSaveService, SaveService, SetupSaveService } from 'src/app/services/save-service';

@Component({
    selector: 'poke-base-save-buttons',
    template: ''
})
export abstract class BaseSaveButtonsComponent<T extends Saveable> {
    @Output() 
    public onSave = new EventEmitter<void>();

    constructor(public saveService: SaveService<T>) { }
}

@Component({
    selector: 'poke-setup-save-buttons',
    templateUrl: './save-buttons.component.html'
})
export class SetupSaveButtonsComponent extends BaseSaveButtonsComponent<Setup> {
    constructor(saveService: SetupSaveService) {
        super(saveService);
    }
}

@Component({
    selector: 'poke-defender-list-save-buttons',
    templateUrl: './save-buttons.component.html'
})
export class DefenderListSaveButtonsComponent extends BaseSaveButtonsComponent<DefenderList> {
    constructor(saveService: DefenderListSaveService) {
        super(saveService);
    }
}
