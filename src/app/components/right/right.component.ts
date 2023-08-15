import { Component } from '@angular/core';
import { smallBracketBreakpoints } from 'src/app/logic/calculations/evaluator';
import { Pokemon, SituationEvaluation, SituationSetEvaluation, allTypes } from 'src/app/logic/models';
import { SelectedSituationSetService } from 'src/app/services/selected-situation-set.service';

@Component({
  selector: 'poke-right',
  templateUrl: './right.component.html',
  styleUrls: ['./right.component.scss']
})
export class RightComponent {
  smallBracketBreakpoints = smallBracketBreakpoints;
  allTypes = allTypes;
  
  get situationSetEvaluation(): SituationSetEvaluation | undefined {
    return this.selectedSituationSetService.situationSetEvaluation;
  }
  
  get evaluations(): SituationEvaluation[] {
    return this.situationSetEvaluation!.evaluations;
  }

  constructor(public selectedSituationSetService: SelectedSituationSetService) {}

  percentageOf(pokemon: Pokemon): number {
    const cases = this.evaluations.filter(evaluation => evaluation.situation.attacker === pokemon).length;
    const all = this.evaluations.length;
    return cases / all;
  }
}
