import { Injectable } from '@angular/core';
import { Context, SituationSetEvaluation, SuperPokemon, Weather } from '../logic/models';
import { generateSituationSets } from '../logic/calculations/generator';
import { evaluateSituationSets } from '../logic/calculations/evaluator';
import { Parser } from '../logic/common';

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
        
        const situationSets = generateSituationSets(attackers, defenders, context, maxAttackersNum);
        this.evaluations = evaluateSituationSets(situationSets);
        this.evaluations = this.evaluations.slice(0, 20);
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
