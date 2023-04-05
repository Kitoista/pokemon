import { Component, EventEmitter, Output } from '@angular/core';
import { SelectedMovesetService } from 'src/app/services/selected-moveset.service';
import { Offensive } from 'src/app/logic/offensive';
import { Ability, Attack, MovesetHighscore, PokeType, abilities, log, typeList } from 'src/app/logic/poke-type';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'poke-left',
  templateUrl: './left.component.html',
  styleUrls: ['./left.component.scss']
})
export class LeftComponent {
  typeList = typeList;

  stabTypes: PokeType[] = [];
  attackTypes: PokeType[] = [];
  mustHaveAttackTypes: PokeType[] = [];
  chosenAbility: Ability = 'None';
  attackAmount: number = 4;
  topX = 15;
  abilities = abilities;

  attackPowers: { [key in PokeType['name']]: string };

  movesets: MovesetHighscore[] = [];

  constructor(public selectedMovementService: SelectedMovesetService) {
  }

  ngOnInit() {
    this.attackPowers = {};
    typeList.forEach(type => {
      this.attackPowers[type.name] = '';
    });
    console.log(this.attackPowers);
  }

  toggleStabType(type: PokeType) {
    if (!this.stabTypes.includes(type) && this.stabTypes.length > 1) {
      return;
    }
    this.toggleType(this.stabTypes, type);
  }

  toggleAttackType(type: PokeType) {
    if (!this.attackTypes.includes(type)) {
      this.attackTypes.push(type);
    } else {
      this.removeFrom(this.mustHaveAttackTypes, type);
      this.removeFrom(this.attackTypes, type);
    }
  }

  toggleMustHaveAttackType(event: Event, type: PokeType) {
    event.preventDefault();
    console.log(this.mustHaveAttackTypes);
    if (!this.attackTypes.includes(type)) {
      this.attackTypes.push(type);
    }
    if (!this.mustHaveAttackTypes.includes(type)) {
      this.mustHaveAttackTypes.push(type);
    } else {
      this.removeFrom(this.mustHaveAttackTypes, type);
    }
  }

  toggleType(list: PokeType[], type: PokeType) {
    if (list.includes(type)) {
      this.removeFrom(list, type);
    } else {
      list.push(type);
    }
  }

  removeFrom(list: PokeType[], type: PokeType) {
    if (list.includes(type)) {
      list.splice(list.indexOf(type), 1);
    }
  }

  reset() {
    this.stabTypes = [];
    this.attackTypes = [];
    this.movesets = [];
    this.selectedMovementService.moveset = undefined;
  }

  calculate() {
    const offensive = new Offensive;
    
    let attacks: Attack[] = this.attackTypes.map(aType => ({
      type: aType,
      power: Number.parseFloat(this.attackPowers[aType.name] || '1')
    }));
    
    if (this.mustHaveAttackTypes.length === this.attackTypes.length) {
      attacks = [];
    }
    
    const mustHaveAttacks = this.mustHaveAttackTypes.map(aType => ({
      type: aType,
      power: Number.parseFloat(this.attackPowers[aType.name] || '1')
    }));
    
    this.movesets = offensive.getBestMovesets(this.stabTypes, this.chosenAbility, attacks, mustHaveAttacks, this.attackAmount, this.topX);
  }
}
