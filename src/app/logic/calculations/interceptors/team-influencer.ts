import { Parser } from "../../common";
import { Context, ELECTRIC, Move, Pokemon, Stat } from "../../models";
import { runInterceptors, triggerWeatherAbility } from "./common";

export interface TeamInfluencer {
    attackers: Pokemon[];
    context: Context
}

const weatherAbilityInfluencerInterceptor = (teamInfluencer: TeamInfluencer): TeamInfluencer => {
    let context = teamInfluencer.context;
    const attackers = teamInfluencer.attackers;

    attackers.forEach(attacker => {
        context = triggerWeatherAbility(attacker, context);
    });

    return {
        attackers,
        context
    }
}

const weatherMoveInfluencerInterceptor = (teamInfluencer: TeamInfluencer): TeamInfluencer => {
    if (teamInfluencer.context.weather === 'None') {
        return teamInfluencer;
    }

    const context = teamInfluencer.context;
    let attackers = teamInfluencer.attackers;

    attackers = attackers.map(attacker => {
        let re = attacker;
        const toBeReplaced: { old: Move, new: Move }[] = [];
        attacker.moveset.forEach(move => {
            let newMove: Move | undefined = undefined;
            
            if (context.weather === 'Rain') {
                if (move.isSpecial && (move.power === 90 || move.power === 117) && move.type === ELECTRIC) {
                    newMove = { ...move, power: Math.floor(move.power * 110 / 90) };
                }
            }
    
            if (newMove) {
                toBeReplaced.push({ old: move, new: newMove});
            }
        });
        if (toBeReplaced.length > 0) {
            re = new Pokemon(
                re.name,
                re.types,
                re.stats,
                re.ability,
                re.moveset.map(move => toBeReplaced.find(moveUpdate => moveUpdate.old === move)?.new || move),
                re.item,
                re.role,
                re.roleFailure
            );
            
        }
        return re;
    });

    return {
        attackers,
        context
    };
}

const roleInfluencerInterceptor = (teamInfluencer: TeamInfluencer): TeamInfluencer => {
    const context = teamInfluencer.context;
    let attackers = teamInfluencer.attackers;

    if (attackers.some(attacker => attacker.role === 'Swords Dance Passer' && !attacker.roleFailure)) {
        attackers = attackers.map(attacker => {
            let re = Parser.pokemon(attacker);
            re.stats.attack.stage = Math.max(2, re.stats.attack.stage);
            return re;
        });
    }

    return {
        attackers,
        context
    };
}

export const teamInfluencerInterceptors = [
    weatherAbilityInfluencerInterceptor,
    weatherMoveInfluencerInterceptor,
    roleInfluencerInterceptor
];
