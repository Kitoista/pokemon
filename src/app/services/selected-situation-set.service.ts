import { Injectable } from '@angular/core';
import { SituationSetEvaluation } from '../logic/models';

@Injectable({
  providedIn: 'root'
})
export class SelectedSituationSetService {

  situationSetEvaluation: SituationSetEvaluation;

}
