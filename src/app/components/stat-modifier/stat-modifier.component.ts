import { Component, Input } from '@angular/core';
import { Pokemon } from 'src/app/logic/models';

@Component({
    selector: 'poke-stat-modifier',
    templateUrl: './stat-modifier.component.html'
})
export class StatModifierComponent {
    @Input() isSpecial: boolean;
    @Input() pokemon: Pokemon;
}
