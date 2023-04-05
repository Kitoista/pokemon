import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SelectedMovesetService } from 'src/app/services/selected-moveset.service';
import { MovesetHighscore, allTypes } from 'src/app/logic/poke-type';

@Component({
  selector: 'poke-moveset',
  templateUrl: './moveset.component.html',
  styleUrls: ['./moveset.component.scss']
})
export class MovesetComponent {
  @Input() highscore: MovesetHighscore;
  allTypes = allTypes;

  constructor(public selectedMovesetService: SelectedMovesetService) {
  }

  info() {
    this.selectedMovesetService.moveset = this.highscore;
  }
}
