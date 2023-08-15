import { Component, Input } from '@angular/core';
import { evaluateSituationSets } from 'src/app/logic/calculations/evaluator';
import { generateSituationSets } from 'src/app/logic/calculations/generator';
import { Save, Saves, clearSave, clearSaves, loadAll, save } from 'src/app/logic/common/save';
import { Context, SituationSetEvaluation, Stat, SuperPokemon, terrains, weathers } from 'src/app/logic/models';
import { SelectedSituationSetService } from 'src/app/services/selected-situation-set.service';

@Component({
  selector: 'poke-left',
  templateUrl: './left.component.html',
  styleUrls: ['./left.component.scss']
})
export class LeftComponent {
    weathers = weathers;
    terrains = terrains;

    saveId?: string;
    attackers: SuperPokemon[];
    defender: SuperPokemon;
    context: Context;
    maxAttackersNum: number;

    evaluations: SituationSetEvaluation[] = [];

    saves: Saves = {};

    @Input()
    set currentSave(save: Save | null) {
        this.saveId = save?.saveId;
        this.attackers = save?.attackers || [this.newPokemon];
        this.defender = save?.defender || new SuperPokemon('Dummy', [], {
            attack: new Stat(100, 1.1, 225, 1),
            defense: new Stat(100, 1, 0, 1)
        }, 'None', [], 'None', 0);
        this.context = save?.context || { weather: 'None', terrain: 'None' };
        this.maxAttackersNum = save?.maxAttackersNum || 3;
    }

    get loadedNumber(): number {
        return Object.keys(this.saves).length;
    }

    get loadedIndex(): number {
        return this.saveId ? Object.keys(this.saves).indexOf(this.saveId) : -1;
    }

    constructor(
        public selectedSituationSetService: SelectedSituationSetService
    ) {
        this.currentSave = null;
        this.saves = loadAll();
    }

    get newPokemon(): SuperPokemon {
        return new SuperPokemon('', [], {
            attack: new Stat(100, 1.1, 255, 0),
            defense: new Stat(100, 1, 255, 0)
        }, 'None', [], 'None', 4);
    }

    addPokemon() {
        this.attackers.push(this.newPokemon);
    }

    deletePokemon(pokemon: SuperPokemon) {
        this.attackers.splice(this.attackers.indexOf(pokemon), 1);
    }

    calculate() {
        this.attackers.forEach((pokemon, i) => !pokemon.name ? pokemon.name = 'Pokémon ' + (i + 1) : null);
        const situationSets = generateSituationSets(this.attackers, this.defender, this.context, this.maxAttackersNum);
        this.evaluations = evaluateSituationSets(situationSets);
        this.evaluations = this.evaluations.slice(0, 20);
        console.log(this.evaluations);
    }

    create() {
        if (this.saveId) {
            this.save();
        }
        this.currentSave = null;
    }

    save() {
        this.saveId = save({
            saveId: this.saveId,
            attackers: this.attackers,
            defender: this.defender,
            context: this.context,
            maxAttackersNum: this.maxAttackersNum
        });
        this.saves = loadAll();
    }

    loadNext() {
        if (this.saveId) {
            this.save();
        }
        console.log(this.saves);
        const ids = Object.keys(this.saves);
        this.currentSave = this.saves[ids[(this.loadedIndex + 1) % ids.length]];
    }

    copy() {
        if (this.saveId) {
            this.save();
        }
        this.saveId = undefined;
        this.save();
    }

    clear() {
        if (this.saveId) {
            clearSave(this.saveId);
            this.saves = loadAll();
        }
    }

    clearAll() {
        clearSaves();
        this.saves = loadAll();
    }
}
