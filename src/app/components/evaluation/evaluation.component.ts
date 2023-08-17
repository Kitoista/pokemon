import { Component, Input } from "@angular/core";
import { bigBracketBreakpoints } from "src/app/logic/calculations/evaluator";
import { BracketBreakpoint, SituationSetEvaluation, allTypes } from "src/app/logic/models";
import { SituationSetService } from "src/app/services/situation-set.service";

@Component({
    selector: 'poke-evaluation',
    templateUrl: './evaluation.component.html',
    styleUrls: ['./evaluation.component.scss']
})
export class EvaluationComponent {
    @Input()
    evaluation: SituationSetEvaluation;

    bigBracketBreakpoints: BracketBreakpoint[] = bigBracketBreakpoints;

    constructor(public situationSetService: SituationSetService) {}

    info() {
        this.situationSetService.situationSetEvaluation = this.evaluation;
    }
}
