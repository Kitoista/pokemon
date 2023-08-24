import { Injectable } from '@angular/core';
import { Context, Pokemon, SituationSetEvaluation, SuperPokemon, Weather } from '../logic/models';
import { evaluateAll } from '../logic/calculations/evaluator';

@Injectable({
    providedIn: 'root'
})
export class SituationSetService {

    evaluations: SituationSetEvaluation[] = [];
    situationSetEvaluation: SituationSetEvaluation;

    previousSettings: {
        attackers: SuperPokemon[],
        defenders: SuperPokemon[],
        context: Context,
        maxAttackersNum: number,
        autoMarked: boolean
    }

    calculate(attackers: SuperPokemon[], defenders: SuperPokemon[], context: Context, maxAttackersNum: number, autoMarked = false): SituationSetEvaluation[] {
        this.previousSettings = { attackers, defenders, context, maxAttackersNum, autoMarked };

        attackers.forEach((pokemon, i) => !pokemon.name ? pokemon.name = 'Pokémon ' + (i + 1) : null);
        
        this.evaluations = evaluateAll(attackers, defenders, context, maxAttackersNum, 20);
        return this.evaluations;
    }

    updateWeather(weather: Weather) {
        const attackers = this.autoMark();
        const context = {
            weather,
            terrain: this.previousSettings.context.terrain
        };

        this.calculate(
            attackers,
            this.previousSettings.defenders,
            context,
            this.previousSettings.maxAttackersNum,
            true
        );
        this.situationSetEvaluation = this.evaluations[0];
    }

    updateRoleFailure(pokemon: Pokemon) {
        const attackers = this.autoMark();
        const attacker = attackers.find(attacker => attacker.name === pokemon.name)!;
        attacker.roleFailure = !attacker.roleFailure;

        this.calculate(
            attackers,
            this.previousSettings.defenders,
            this.previousSettings.context,
            this.previousSettings.maxAttackersNum,
            true
        );
        this.situationSetEvaluation = this.evaluations[0];
    }

    autoMark(): SuperPokemon[] {
        if (this.previousSettings.autoMarked) {
            return this.previousSettings.attackers;
        }
        const currentSet = this.situationSetEvaluation.situationSet;
        return this.previousSettings.attackers
            .filter(attacker => currentSet.attackers.some(pokemon => pokemon.name === attacker.name))
            .map(attacker => {
                // const re = Parser.superPokemon(attacker);
                const re = attacker;
                re.isRequired = true;
                re.moveset.forEach(move => {
                    const isCurrentMove = currentSet.attackers.find(a => re.name === a.name)!.moveset.some(m => m.type === move.type && m.isSpecial === move.isSpecial);
                    if (isCurrentMove) {
                        move.isRequired = true;
                    }
                });
                return re;
            });
    }

}
