import { Component, Input } from '@angular/core';
import { evaluateSituationSets } from 'src/app/logic/calculations/evaluator';
import { generateSituationSets } from 'src/app/logic/calculations/generator';
import { SetupSaveHandler, Setup, DefenderList } from 'src/app/logic/common';
import { Context, HpStat, SituationSetEvaluation, Stat, SuperPokemon, allTypes, terrains, weathers } from 'src/app/logic/models';
import { DefenderListSaveService, SetupSaveService } from 'src/app/services/save-service';
import { SituationSetService } from 'src/app/services/situation-set.service';

@Component({
  selector: 'poke-left',
  templateUrl: './left.component.html',
  styleUrls: ['./left.component.scss']
})
export class LeftComponent {
    weathers = weathers;
    terrains = terrains;

    setupId?: string;
    attackers: SuperPokemon[];
    defenders: SuperPokemon[];
    context: Context;
    maxAttackersNum: number;

    defenderListId?: string;

    setupSaveHandler = new SetupSaveHandler();

    @Input()
    set currentSetup(setup: Setup | undefined) {
        this.setupId = setup?.id;
        this.attackers = setup?.attackers || [this.newPokemon];
        this.context = setup?.context || { weather: 'None', terrain: 'None' };
        this.maxAttackersNum = setup?.maxAttackersNum || 3;
    }

    @Input()
    set currentDefenderList(defenderList: DefenderList | undefined) {
        this.defenderListId = defenderList?.id;
        this.defenders = defenderList?.defenders || [this.createDummy(false), this.createDummy(true)];
    }

    constructor(
        public situationSetService: SituationSetService,
        public setupSaveService: SetupSaveService,
        public defenderListSaveService: DefenderListSaveService
    ) {}

    get newPokemon(): SuperPokemon {
        return new SuperPokemon('', [], {
            hp: new HpStat(100, 0),
            attack: new Stat(100, 1.1, 255, 0),
            defense: new Stat(100, 1, 255, 0),
            spAttack: new Stat(100, 1.1, 255, 0),
            spDefense: new Stat(100, 1, 255, 0)
        }, 'None', [], 'None', 4, false);
    }

    get mustHaveAttackers(): SuperPokemon[] {
        return this.attackers.filter(attacker => attacker.isRequired);
    }

    get evaluations(): SituationSetEvaluation[] {
        return this.situationSetService.evaluations;
    }

    get markedCount(): number {
        return this.attackers.filter(attacker => attacker.isRequired).length;
    }

    get exactDefenderCount(): number {
        return  this.defenders.filter(defender => defender.types.length > 0).length;
    }

    get generatedDefenderCount(): number {
        const typeless = this.defenders.filter(defender => defender.types.length === 0).length;
        return typeless * allTypes.length;
    }

    createDummy(isSpecial: boolean): SuperPokemon {
        const weakStat = new Stat(80, 1, 0, 0);
        const strongStat = new Stat(130, 1.1, 0, 0);
        return new SuperPokemon((isSpecial ? 'Special' : 'Physical') + ' Dummy', [], {
            hp: new HpStat(100, 255),
            attack: new Stat(0, 1, 0, 0),
            defense: isSpecial ? weakStat : strongStat,
            spAttack: new Stat(0, 1, 0, 0),
            spDefense: isSpecial ? strongStat : weakStat
        }, 'None', [], 'None', 0, false);
    }

    addAttacker() {
        this.attackers.push(this.newPokemon);
    }

    deleteAttacker(pokemon: SuperPokemon) {
        this.attackers.splice(this.attackers.indexOf(pokemon), 1);
    }

    addDefender() {
        const isSpecial = this.defenders.some(pokemon => pokemon.name === 'Physical Dummy');
        this.defenders.push(this.createDummy(isSpecial));
    }

    deleteDefender(pokemon: SuperPokemon) {
        this.defenders.splice(this.defenders.indexOf(pokemon), 1);
    }

    resetMustHave() {
        this.mustHaveAttackers.forEach(attacker => attacker.isRequired = false);
        this.attackers.forEach(attacker => attacker.moveset.forEach(move => move.isRequired = false));
    }

    calculate() {
        this.situationSetService.calculate(this.attackers, this.defenders, this.context, this.maxAttackersNum);
    }

    saveSetup() {
        this.setupSaveService.save({
            id: this.setupId,
            attackers: this.attackers,
            context: this.context,
            maxAttackersNum: this.maxAttackersNum
        });
    }

    saveDefenders() {
        this.defenderListSaveService.save({
            id: this.defenderListId,
            defenders: this.defenders
        });
    }
}
