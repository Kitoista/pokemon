import { Parser } from "../../common";
import { Context, ICE, Pokemon, Weather } from "../../models";
import { triggerWeatherAbility } from "./common";

export interface SituationCandidate {
    attacker: Pokemon,
    defender: Pokemon,
    context: Context
}

const weatherAbilityCandidateInterceptor = (situationCandidate: SituationCandidate): SituationCandidate => {
    let attacker = situationCandidate.attacker;
    let defender = situationCandidate.defender;
    let context = situationCandidate.context;

    context = triggerWeatherAbility(defender, context);

    return {
        attacker,
        defender,
        context
    }
}

const defenderAbilityCandidateInterceptor = (situationCandidate: SituationCandidate): SituationCandidate => {
    let attacker = situationCandidate.attacker;
    let defender = situationCandidate.defender;
    let context = situationCandidate.context;

    if (defender.ability === 'Intimidate') {
        attacker = Parser.pokemon(attacker);
        attacker.stats.attack.stage -= 1;
    }

    return {
        attacker,
        defender,
        context
    }
}

const roleCandidateInterceptor = (situationCandidate: SituationCandidate): SituationCandidate => {
    let attacker = situationCandidate.attacker;
    let defender = situationCandidate.defender;
    let context = situationCandidate.context;

    if (attacker.role !== 'None' && !attacker.roleFailure) {
        attacker = Parser.pokemon(attacker);
        let badWeathers: Weather[] = [];
        switch (attacker.role) {
            case 'Shell Smash': badWeathers = ['Sandstorm']; if (!attacker.types.includes(ICE)) { badWeathers.push('Hail') } break;
            case 'Sand Rush Dancer': badWeathers = ['Hail', 'Harsh sunlight', 'Rain', 'None']; break;
            case 'Growth Abuser': badWeathers = ['Hail', 'Sandstorm', 'Rain', 'None']; break;
        }
        if (badWeathers.includes(context.weather)) {
            attacker.roleFailure = true;
        }
        if (!attacker.roleFailure) {
            switch (attacker.role) {
                case 'Growth Abuser':
                case 'Shell Smash': attacker.stats.attack.stage = 2; attacker.stats.spAttack.stage = 2; break;
                case 'Sand Rush Dancer': attacker.stats.attack.stage = 2; break;
            }
        }
    }

    return {
        attacker,
        defender,
        context
    }
}

export const situationCandidateInterceptors = [
    weatherAbilityCandidateInterceptor,
    defenderAbilityCandidateInterceptor,
    roleCandidateInterceptor
];
