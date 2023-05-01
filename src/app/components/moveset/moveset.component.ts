import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SelectedMovesetService } from 'src/app/services/selected-moveset.service';
import { MovesetHighscore, allTypes, log } from 'src/app/logic/poke-type';

@Component({
  selector: 'poke-moveset',
  templateUrl: './moveset.component.html',
  styleUrls: ['./moveset.component.scss']
})
export class MovesetComponent {
  @Input() highscore: MovesetHighscore;
  allTypes = allTypes;
  get superEffectiveNumber(): number {
    return this.sum(2, Number.POSITIVE_INFINITY);
  }
  get effectiveNumber(): number {
    return this.sum(1, 2);
  }
  get notVeryEffectiveNumber(): number {
    return this.sum(0, 1);
  }

  constructor(public selectedMovesetService: SelectedMovesetService) {
  }

  info() {
    this.selectedMovesetService.moveset = this.highscore;
  }

  sum(min: number, max: number): number {
    return Object.keys(this.highscore.brackets).reduce(
      (accum, index) => {
        return Number.parseFloat(index) >= min && Number.parseFloat(index) < max ? accum + this.highscore.brackets[index] : accum;
      }, 0);
  }
}
