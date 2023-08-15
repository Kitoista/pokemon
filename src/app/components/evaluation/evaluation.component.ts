import { Component, Input } from "@angular/core";
import { bigBracketBreakpoints } from "src/app/logic/calculations/evaluator";
import { BracketBreakpoint, SituationSetEvaluation, allTypes } from "src/app/logic/models";
import { SelectedSituationSetService } from "src/app/services/selected-situation-set.service";

@Component({
    selector: 'poke-evaluation',
    templateUrl: './evaluation.component.html',
    styleUrls: ['./evaluation.component.scss']
})
export class EvaluationComponent {
    @Input()
    evaluation: SituationSetEvaluation;

    bigBracketBreakpoints: BracketBreakpoint[] = bigBracketBreakpoints;
    allTypes = allTypes;

    constructor(public selectedSituationSetService: SelectedSituationSetService) {}

    info() {
        console.log(bigBracketBreakpoints);
        console.log(this.evaluation)
        this.selectedSituationSetService.situationSetEvaluation = this.evaluation;
    }
}
