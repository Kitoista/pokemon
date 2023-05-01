import { Component, Input } from '@angular/core';
import { Brackets, allTypes } from 'src/app/logic/poke-type';

@Component({
  selector: 'poke-effectiveness',
  templateUrl: './effectiveness.component.html',
  styleUrls: ['./effectiveness.component.scss']
})
export class EffectivenessComponent {
  @Input() min: number;
  @Input() max: number;
  @Input() brackets: Brackets;
  
  @Input() value: number;

  intervals = [0.25, 0.5, 1, 2, 4, Number.POSITIVE_INFINITY];

  allTypes = allTypes;

  get xClass() {
    let val = this.min || this.max;
    let re = '';
    if (this.value !== undefined) {
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
    }
    return re + ('x' + val).replace('.', '');
  }

  get title() {
    if (this.value !== undefined) {
      return undefined;
    }
    return ((this.min === 0 && this.max !== 0) ? '\< ' : '') + 'x' + (this.min === 0 ? this.max : this.min);
  }

  sum(min: number, max: number): number {
    if (!this.brackets) {
      return 0;
    }
    return Object.keys(this.brackets).reduce((accum, index) => {
      if (min === max) {
        return Number.parseFloat(index) === 0 ? accum + this.brackets[index] : accum;
      }
      if (min === 0) {
        return Number.parseFloat(index) > 0 && Number.parseFloat(index) < max ? accum + this.brackets[index] : accum;
      }
      return Number.parseFloat(index) >= min && Number.parseFloat(index) < max ? accum + this.brackets[index] : accum;
    }, 0);
  }
}
