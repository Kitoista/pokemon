import { Component } from '@angular/core';
import { SelectedMovesetService } from 'src/app/services/selected-moveset.service';
import { Matchup, MovesetHighscore, allTypes, log } from 'src/app/logic/poke-type';

@Component({
  selector: 'poke-right',
  templateUrl: './right.component.html',
  styleUrls: ['./right.component.scss']
})
export class RightComponent {
  constructor(public selectedMovesetService: SelectedMovesetService) {}

  get moveset(): MovesetHighscore | undefined {
    return this.selectedMovesetService.moveset;
  }

  get matchups(): Matchup[] | undefined {
    return this.moveset?.matchups.filter(matchup => !(matchup.effect.multiplier === 0 && matchup.defender.length > 1));
  }
}
