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
    }
    return 1;
}

export const defensiveAbilityInterceptor = (situation: Situation): number => {
    switch(situation.defender.ability) {
        case 'Levitate': return situation.move.type === GROUND ? 0 : 1;
        case 'Unaware': return 1 / calculateStatModifier(situation.attacker.stats.attack);
    }
    return 1;
}

export const weatherInterceptor = (situation: Situation): number => {
    const type = situation.move.type;
    const weather = situation.context.weather;
    let re = 1;

    if (weather === 'Hars sunlight') {
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

export const calculateMultiplier = (situation: Situation): number => {
    return stabInterceptor(situation) *
        typeInterceptor(situation) *
        itemInterceptor(situation) *
        offensiveAbilityInterceptor(situation) *
        defensiveAbilityInterceptor(situation) *
        weatherInterceptor(situation) *
        terrainInterceptor(situation);
}

export const calculateDamage = (situation: Situation): MoveEffect => {
    const multiplier = calculateMultiplier(situation);

    const A = situation.attacker.stats.attack.value;
    const D = situation.defender.stats.defense.value;

    const dmg = (situation.move.power * A / D * 22 / 50 + 2) * multiplier;
    
    return {
        dmg,
        multiplier,
        type: situation.move.type
    };
}

export const logObject = (arg: any, level = 1): any => {
    if (level < 0) {
        return null;
    }
    if (Array.isArray(arg)) {
        return arg.map(v => {
            return logObject(v, level - 1);
        });
    }
    if (arg instanceof PokeType && level === 0) {
        return arg.name;
    }
    if (typeof arg === 'object') {
        const re = {} as any;
        Object.keys(arg).forEach(v => {
            re[v] = logObject(arg[v], level);
        });
        return re;
    }
    return arg;
}

export const log = (arg: any, level = 1): void => {
    console.log(logObject(arg, level));
}
