import { Component } from '@angular/core';
import { smallBracketBreakpoints } from 'src/app/logic/calculations/evaluator';
import { Move, Pokemon, SituationEvaluation, SituationSetEvaluation, Weather, weathers } from 'src/app/logic/models';
import { SituationSetService } from 'src/app/services/situation-set.service';

@Component({
  selector: 'poke-right',
  templateUrl: './right.component.html',
  styleUrls: ['./right.component.scss']
})
export class RightComponent {
  smallBracketBreakpoints = smallBracketBreakpoints;
  weathers = weathers;

  get situationSetEvaluation(): SituationSetEvaluation | undefined {
    return this.situationSetService.situationSetEvaluation;
  }
  
  get evaluations(): SituationEvaluation[] {
    return this.situationSetEvaluation!.evaluations;
  }

  constructor(public situationSetService: SituationSetService) {}

  pokemonPercentage(pokemon: Pokemon): number {
    const cases = this.evaluations.filter(evaluation => evaluation.situation.attacker.name === pokemon.name).length;
    const all = this.evaluations.length;
    return cases / all;
  }

  movePercentage(pokemon: Pokemon, move: Move): number {
    const cases = this.evaluations.filter(evaluation => {
      const sameAttacker = evaluation.situation.attacker.name === pokemon.name;
      const sameMove = evaluation.moveEffect.type === move.type && evaluation.moveEffect.isSpecial === move.isSpecial;
      return sameAttacker && sameMove;
    }).length;
    const all = this.evaluations.length;
    return cases / all;
  }

  updateWeather(weather: Weather) {
    this.situationSetService.updateWeather(weather);
  }
}
