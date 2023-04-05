import { Injectable } from '@angular/core';
import { MovesetHighscore } from 'src/app/logic/poke-type';

@Injectable({
  providedIn: 'root'
})
export class SelectedMovesetService {

  moveset?: MovesetHighscore;

}
