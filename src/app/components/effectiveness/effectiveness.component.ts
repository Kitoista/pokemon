import { Component, Input } from '@angular/core';
import { allTypes } from 'src/app/logic/models';

@Component({
    selector: 'poke-effectiveness',
    templateUrl: './effectiveness.component.html',
    styleUrls: ['./effectiveness.component.scss']
})
export class EffectivenessComponent {
    @Input() value: number;
    
    intervals = [0.25, 0.5, 1, 2, 4, Number.POSITIVE_INFINITY];
    allTypes = allTypes;

    get xClass() {
        let val = 0;
        let re = '';
        if (this.value === 0) {
            val = 0;
        } else {
            for (let i = 0; i < this.intervals.length - 1; ++i) {
                if (this.value < this.intervals[i + 1]) {
                    val = this.intervals[i];
                    break;
                }
            }
        }
        if (('' + this.value).length > 4) {
            re += 'long ';
        }
        return re + ('x' + val).replace('.', '');
    }
}
