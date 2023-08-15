import { Component, Input } from "@angular/core";
import { PokeType, Stat, SuperPokemon, abilities, items, typeList } from "src/app/logic/models";

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

    typeList = typeList;
    abilities = abilities;
    items = items;
    mustHaveAttackTypes: PokeType[] = [];
    attackPowers: { [key in PokeType['name']]: string };

    get attackTypes(): PokeType[] {
        return this.superPokemon.moveset.map(move => move.type);
    }

    get stabTypes(): PokeType[] {
        return this.superPokemon.types;
    }

    ngOnChanges() {
        this.attackPowers = {};
        typeList.forEach(type => {
            this.attackPowers[type.name] = '';
        });

        if (this.superPokemon) {
            Object.keys(this.attackPowers).forEach(typeName => {
                this.attackPowers[typeName] = (this.superPokemon.moveset.find(move => move.type.name === typeName)?.power || '') + '';
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
    
    toggleAttackType(type: PokeType) {
        if (!this.attackTypes.includes(type)) {
            this.superPokemon.moveset.push({
                type,
                power: Number(this.attackPowers[type.name]) || 1
            })
        } else {
            const indexToRemove = this.superPokemon.moveset.findIndex(move => move.type === type);
            this.superPokemon.moveset.splice(indexToRemove, 1);
        }
    }

    toggleMustHaveAttackType(event: Event, type: PokeType) {
        // event.preventDefault();
        // if (!this.attackTypes.includes(type)) {
        //     this.attackTypes.push(type);
        // }
        // if (!this.mustHaveAttackTypes.includes(type)) {
        //     this.mustHaveAttackTypes.push(type);
        // } else {
        //     this.removeFrom(this.mustHaveAttackTypes, type);
        // }
    }

    attackPowerChange(type: PokeType, value: string) {
        this.attackPowers[type.name] = value;
        const move = this.superPokemon.moveset.find(move => move.type === type);
        const power = Number(value) || 1;
        if (move) {
            move.power = power;
        } else {
            this.superPokemon.moveset.push({
                type,
                power
            })
        }
    }

    log() {
        console.log(this.superPokemon);
    }
}
