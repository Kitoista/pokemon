import { Component, Input } from "@angular/core";
import { binomialCoefficient } from "src/app/logic/common";
import { Move, PokeType, Stat, SuperPokemon, abilities, items, typeList } from "src/app/logic/models";
import { roles } from "src/app/logic/models/role";

@Component({
    selector: 'pokemon',
    templateUrl: './pokemon.component.html',
    styleUrls: ['./pokemon.component.scss']
})
export class PokemonComponent {
    @Input()
    public superPokemon: SuperPokemon;

    @Input()
    public isDefender = false;

    @Input()
    public choosable = false;

    typeList = typeList;
    abilities = abilities;
    items = items;
    roles = roles;
    physicalAttackPowers: { [key in PokeType['name']]: string };
    specialAttackPowers: { [key in PokeType['name']]: string };
    
    hasDefenderTypes = false;

    get stabTypes(): PokeType[] {
        return this.superPokemon.types;
    }

    ngOnChanges() {
        this.physicalAttackPowers = {};
        typeList.forEach(type => {
            this.physicalAttackPowers[type.name] = '';
        });
        this.specialAttackPowers = {};
        typeList.forEach(type => {
            this.specialAttackPowers[type.name] = '';
        });

        if (this.superPokemon) {
            Object.keys(this.physicalAttackPowers).forEach(typeName => {
                this.physicalAttackPowers[typeName] = (this.superPokemon.moveset.find(move => !move.isSpecial && move.type.name === typeName)?.power || '') + '';
            });
            Object.keys(this.specialAttackPowers).forEach(typeName => {
                this.specialAttackPowers[typeName] = (this.superPokemon.moveset.find(move => move.isSpecial && move.type.name === typeName)?.power || '') + '';
            });
        }
    }

    toggleStabType(type: PokeType) {
        const index = this.stabTypes.indexOf(type);
        if (index > -1) {
            this.stabTypes.splice(index, 1);
        } else {
            this.stabTypes.push(type);
        }
    }

    getAttackTypes(isSpecial: boolean): PokeType[] {
        return this.superPokemon.moveset.filter(move => move.isSpecial === isSpecial).map(move => move.type);
    }

    getMustHaveAttackTypes(isSpecial: boolean): PokeType[] {
        return this.superPokemon.moveset.filter(move => move.isSpecial === isSpecial && move.isRequired).map(move => move.type);
    }

    toggleAttackType(type: PokeType, isSpecial: boolean): Move | undefined {
        const attackPowers = isSpecial ? this.specialAttackPowers : this.physicalAttackPowers;
        
        if (!this.getAttackTypes(isSpecial).includes(type)) {
            const re = {
                userName: this.superPokemon.name,
                type,
                power: Number(attackPowers[type.name]) || 1,
                isSpecial,
                isRequired: false
            };
            this.superPokemon.moveset.push(re);
            return re;
        }

        const indexToRemove = this.superPokemon.moveset.findIndex(move => move.type === type && isSpecial === move.isSpecial);
        this.superPokemon.moveset.splice(indexToRemove, 1);
        return undefined;
    }

    toggleMustHaveAttackType(event: Event, type: PokeType, isSpecial: boolean) {
        event.preventDefault();
        const move = this.superPokemon.moveset.find(move => move.isSpecial === isSpecial && move.type === type);
        if (move) {
            move.isRequired = !move.isRequired;
        } else {
            const move = this.toggleAttackType(type, isSpecial)!;
            move.isRequired = true;
        }
    }

    attackPowerChange(type: PokeType, isSpecial: boolean, value: string) {
        const attackPowers = isSpecial ? this.specialAttackPowers : this.physicalAttackPowers;
        attackPowers[type.name] = value;
        const move = this.superPokemon.moveset.find(move => move.type === type && isSpecial === move.isSpecial);
        const power = Number(value) || 1;
        if (move) {
            move.power = power;
        } else {
            this.superPokemon.moveset.push({
                userName: this.superPokemon.name,
                type,
                power,
                isSpecial,
                isRequired: false
            });
        }
    }

    onRightClick() {
        if (this.choosable) {
            this.superPokemon.isRequired = !this.superPokemon.isRequired;
        }
    }

}
