import {
    NORMAL, FIRE, WATER, ELECTRIC, GRASS, ICE, FIGHTING, POISON, GROUND, FLYING, PSYCHIC, BUG, ROCK, GHOST, DRAGON, DARK, STEEL, FAIRY, 
    Ability, Move, MoveEffect, Item, PokeType, Terrain, Weather, Pokemon, Context, Situation, typeList, calculateStatModifier
} from "../models";

export const stabInterceptor = (situation: Situation): number => {
    return situation.attacker.types.includes(situation.move.type) ? 1.5 : 1;
}

export const typeInterceptor = (situation: Situation): number => {
    const offensiveTypeStats = situation.move.type.attack;

    let re = 1;
    situation.defender.types.forEach(type => {
        if (offensiveTypeStats.strongAgainst.includes(type)) {
            re *= 2;
        } else if (offensiveTypeStats.weakAgainst.includes(type)) {
            re *= 0.5;
        } else if (offensiveTypeStats.noEffectAgainst.includes(type)) {
            re *= 0;
        }
    });
    return re;
}

export const itemInterceptor = (situation: Situation): number => {
    switch (situation.attacker.item) {
        case 'Life orb': return 1.3;
        case 'Expert belt': return typeInterceptor(situation) > 1 ? 1.2 : 1;
        case 'Choice dmg': return 1.5;
    }
    return 1;
}

export const offensiveAbilityInterceptor = (situation: Situation): number => {
    switch(situation.attacker.ability) {
        case 'Tinted Lens': return typeInterceptor(situation) < 1 ? 2 : 1;
        case 'Solar Power': return situation.context.weather === 'Harsh sunlight' ? 1.5 : 1;
    }
    return 1;
}

export const defensiveAbilityInterceptor = (situation: Situation): number => {
    switch (situation.defender.ability) {
        case 'Levitate': return situation.move.type === GROUND ? 0 : 1;
        case 'Flash Fire': return situation.move.type === FIRE ? 0 : 1;
        case 'Water Absorb': return situation.move.type === WATER ? 0 : 1;
        case 'Volt Absorb': return situation.move.type === ELECTRIC ? 0 : 1;
        case 'Unaware': return 1 / calculateStatModifier(situation.attacker.stats.attack);
    }
    return 1;
}

export const weatherInterceptor = (situation: Situation): number => {
    const type = situation.move.type;
    const weather = situation.context.weather;
    const defender = situation.defender;
    let re = 1;

    if (weather === 'Harsh sunlight') {
        if (type === FIRE) {
            re *= 1.5;
        } else if (type === WATER) {
            re *= 0.5;
        }
    } else if (weather === 'Rain') {
        if (type === FIRE) {
            re *= 0.5;
        } else if (type === WATER) {
            re *= 1.5;
        }
    } else if (weather === 'Sandstorm') {
        if (defender.types.includes(ROCK) && situation.move.isSpecial) {
            re *= 0.75;
        }
    }
    return re;
}

export const terrainInterceptor = (situation: Situation): number => {
    const terrain = situation.context.terrain;
    const type = situation.move.type;
    
    let re = 1;
    if (terrain === 'Electric' && type === ELECTRIC) {
        re *= 1.5;
    } else if (terrain === 'Grassy' && type === GRASS) {
        re *= 1.5;
    } else if (terrain === 'Misty' && type === DRAGON) {
        re *= 0.5;
    }
    return re;
}

export const uniqueMoveInterceptor = (situation: Situation): number => {
    const move = situation.move;
    const weather = situation.context.weather;

    // Solar beam
    if (move.isSpecial && move.power === 120 && move.type === GRASS) {
        if (weather === 'None') {
            return 0.25;
        } else if (weather !== 'Harsh sunlight') {
            return 0.125;
        }
    }

    return 1;
}

export const calculateMultiplier = (situation: Situation): number => {
    return stabInterceptor(situation) *
        typeInterceptor(situation) *
        offensiveAbilityInterceptor(situation) *
        defensiveAbilityInterceptor(situation) *
        weatherInterceptor(situation) *
        terrainInterceptor(situation) *
        uniqueMoveInterceptor(situation);
}

export const calculateDamage = (situation: Situation): MoveEffect => {
    const multiplier = calculateMultiplier(situation);

    const isSpecial = situation.move.isSpecial;
    const attackerStats = situation.attacker.stats;
    const defenderStats = situation.defender.stats;

    const itemMultiplier = itemInterceptor(situation);
    const POWER = Math.round(situation.move.power * itemMultiplier);

    const A = isSpecial ? attackerStats.spAttack.value : attackerStats.attack.value;
    const D = isSpecial ? defenderStats.spDefense.value : defenderStats.defense.value;

    const dmg = Math.round((POWER * A / D * 22 / 50 + 2) * multiplier);
    
    const remainingHp = Math.max(situation.defender.stats.hp.value - dmg, 0);
    const dmgPercentage = dmg / situation.defender.stats.hp.value;

    return {
        damage: dmg,
        remainingHp,
        damagePercentage: dmgPercentage,
        multiplier,
        type: situation.move.type,
        isSpecial
    };
}

// export const logObject = (arg: any, level = 1): any => {
//     if (level < 0) {
//         return null;
//     }
//     if (Array.isArray(arg)) {
//         return arg.map(v => {
//             return logObject(v, level - 1);
//         });
//     }
//     if (arg instanceof PokeType && level === 0) {
//         return arg.name;
//     }
//     if (typeof arg === 'object') {
//         const re = {} as any;
//         Object.keys(arg).forEach(v => {
//             re[v] = logObject(arg[v], level);
//         });
//         return re;
//     }
//     return arg;
// }

// export const log = (arg: any, level = 1): void => {
//     console.log(logObject(arg, level));
// }
