import { Component } from '@angular/core';
import { DefenderListSaveService, SetupSaveService } from './services/save-service';

@Component({
    selector: 'poke-root',
    templateUrl: './poke.component.html',
    styleUrls: ['./poke.component.scss']
})
export class PokeComponent {
    constructor(
        public setupSaveService: SetupSaveService,
        public defenderListSaveService: DefenderListSaveService
    ) {}
}
