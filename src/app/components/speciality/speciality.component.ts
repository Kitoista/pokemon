import { Component, Input } from '@angular/core';

@Component({
    selector: 'poke-speciality',
    templateUrl: './speciality.component.html'
})
export class SpecialityComponent {
    @Input() isSpecial: boolean;
    @Input() display: string;
}