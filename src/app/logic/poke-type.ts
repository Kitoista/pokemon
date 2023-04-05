export class PokeType {
    attack: AttackStats;
    defense: DefenseStats;
    constructor(public name: string) { }
}

class AttackStats {
    // effectiveAgainst: PokeType[];

    constructor(
        public strongAgainst: PokeType[],
        public weakAgainst: PokeType[],
        public noEffectAgainst: PokeType[]
    ) {
        // this.effectiveAgainst = typeList.filter(other => !this.strongAgainst.includes(other) && !this.weakAgainst.includes(other) && !this.noEffectAgainst.includes(other));
    }

    damageAgainst(types: PokeType[], isStab: boolean, ability: Ability): number {
        let re = 1;
        types.forEach(type => {
            if (this.strongAgainst.includes(type)) {
                re *= 2;
            } else if (this.weakAgainst.includes(type)) {
                re *= 0.5;
            } else if (this.noEffectAgainst.includes(type)) {
                re *= 0;
            }
        });
        if (ability === 'Tinted Lens' && re < 1) {
            re *= 2;
        }
        if (isStab) {
            re *= 1.5;
        }
        return re;
    }
}

class DefenseStats {
    // effective: PokeType[];
    immune: PokeType[];
    superEffective: PokeType[];
    resists: PokeType[];
}

const createDef = (type: PokeType): DefenseStats => {
    const re = new DefenseStats();
    re.immune = typeList.filter(other => other.attack.noEffectAgainst.includes(type));
    re.superEffective = typeList.filter(other => other.attack.strongAgainst.includes(type));
    re.resists = typeList.filter(other => other.attack.weakAgainst.includes(type));
    // re.effective = typeList.filter(other => !re.immune.includes(other) && !re.superEffective.includes(other) && !re.resists.includes(other));
    return re;
}

export const NORMAL = new PokeType('NORMAL');
export const FIRE = new PokeType('FIRE');
export const WATER = new PokeType('WATER');
export const ELECTRIC = new PokeType('ELECTRIC');
export const GRASS = new PokeType('GRASS');
export const ICE = new PokeType('ICE');
export const FIGHTING = new PokeType('FIGHTING');
export const POISON = new PokeType('POISON');
export const GROUND = new PokeType('GROUND');
export const FLYING = new PokeType('FLYING');
export const PSYCHIC = new PokeType('PSYCHIC');
export const BUG = new PokeType('BUG');
export const ROCK = new PokeType('ROCK');
export const GHOST = new PokeType('GHOST');
export const DRAGON = new PokeType('DRAGON');
export const DARK = new PokeType('DARK');
export const STEEL = new PokeType('STEEL');
export const FAIRY = new PokeType('FAIRY');

export const Types = {
    NORMAL: NORMAL,
    FIRE: FIRE,
    WATER: WATER,
    ELECTRIC: ELECTRIC,
    GRASS: GRASS,
    ICE: ICE,
    FIGHTING: FIGHTING,
    POISON: POISON,
    GROUND: GROUND,
    FLYING: FLYING,
    PSYCHIC: PSYCHIC,
    BUG: BUG,
    ROCK: ROCK,
    GHOST: GHOST,
    DRAGON: DRAGON,
    DARK: DARK,
    STEEL: STEEL,
    FAIRY: FAIRY
}

export const typeList: PokeType[] = Object.values(Types);

NORMAL.attack = new AttackStats([], [ROCK, STEEL], [GHOST]);
FIRE.attack = new AttackStats([GRASS, ICE, BUG, STEEL], [FIRE, WATER, ROCK, DRAGON], []);
WATER.attack = new AttackStats([FIRE, GROUND, ROCK], [WATER, GRASS, DRAGON], []);
ELECTRIC.attack = new AttackStats([WATER, FLYING], [ELECTRIC, GRASS, DRAGON], [GROUND]);
GRASS.attack = new AttackStats([WATER, GROUND, ROCK], [FIRE, GRASS, POISON, FLYING, BUG, DRAGON, STEEL], []);
ICE.attack = new AttackStats([GRASS, GROUND, FLYING, DRAGON], [FIRE, WATER, ICE, STEEL], []);
FIGHTING.attack = new AttackStats([NORMAL, ICE, ROCK, DARK, STEEL], [POISON, FLYING, PSYCHIC, BUG, FAIRY], [GHOST]);
POISON.attack = new AttackStats([GRASS, FAIRY], [POISON, GROUND, ROCK, GHOST], [STEEL]);
GROUND.attack = new AttackStats([FIRE, ELECTRIC, POISON, ROCK, STEEL], [GRASS, BUG], [FLYING]);
FLYING.attack = new AttackStats([GRASS, FIGHTING, BUG], [ELECTRIC, ROCK, STEEL], []);
PSYCHIC.attack = new AttackStats([FIGHTING, POISON], [PSYCHIC, STEEL], [DARK]);
BUG.attack = new AttackStats([GRASS, PSYCHIC, DARK], [FIRE, FIGHTING, POISON, FLYING, GHOST, STEEL, FAIRY], []);
ROCK.attack = new AttackStats([FIRE, ICE, FLYING, BUG], [FIGHTING, GROUND, STEEL], []);
GHOST.attack = new AttackStats([PSYCHIC, GHOST], [DARK], [NORMAL]);
DRAGON.attack = new AttackStats([DRAGON], [STEEL], [FAIRY]);
DARK.attack = new AttackStats([PSYCHIC, GHOST], [FIGHTING, DARK, FAIRY], []);
STEEL.attack = new AttackStats([ICE, ROCK, FAIRY], [FIRE, WATER, ELECTRIC, STEEL], []);
FAIRY.attack = new AttackStats([FIGHTING, DRAGON, DARK], [FIRE, POISON, STEEL], []);

typeList.forEach(type => type.defense = createDef(type));

export const dualTypes: PokeType[][] = [];
for (let i = 0; i < typeList.length; ++i) {
    for (let j = i + 1; j < typeList.length; ++j) {
        dualTypes.push([typeList[i], typeList[j]]);
    }
}

export const allTypes = typeList.map(t => [t]).concat(dualTypes);

export const movesetAgainst = (moveset: Attack[], defender: PokeType[], stabTypes: PokeType[], ability: Ability): AttackEffect => {
    let re: AttackEffect = {
        dmg: 0,
        multiplier: 0,
        type: NORMAL
    };
    moveset.forEach(attack => {
        const multiplier = attack.type.attack.damageAgainst(defender, stabTypes.includes(attack.type), ability);
        const dmg = multiplier * attack.power;
        if (dmg > re.dmg) {
            const type = attack.type;
            re = { dmg, multiplier, type };
        }
    });
    return re;
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

export const generateMovesets = (attacks?: Attack[], num = 4) => {
    if (!attacks || attacks.length === 0) {
        attacks = typeList.concat([]).map(type => ({ type, power: 1 }));
    }
    num = Math.min(attacks.length, num);
    let re: Attack[][] = [];
    attacks.sort((a, b) => {
        if (a.type === GROUND) return -1;
        if (b.type === GROUND) return 1;

        if (a.type === FAIRY) return -1;
        if (b.type === FAIRY) return 1;

        if (a.type === ROCK) return -1;
        if (b.type === ROCK) return 1;

        if (a.type === ICE) return -1;
        if (b.type === ICE) return 1;
        return 0;
    });
    for (let i = 0; i < attacks.length; ++i) {
        if (num > 1) {
            for (let j = i + 1; j < attacks.length; ++j) {
                if (num > 2) {
                    for (let k = j + 1; k < attacks.length; ++k) {
                        if (num > 3) {
                            for (let l = k + 1; l < attacks.length; ++l) {
                                if (num > 4) {
                                    for (let m = l + 1; m < attacks.length; ++m) {
                                        re.push([
                                            attacks[i],
                                            attacks[j],
                                            attacks[k],
                                            attacks[l],
                                            attacks[m]
                                        ]);
                                    }
                                } else {
                                    re.push([
                                        attacks[i],
                                        attacks[j],
                                        attacks[k],
                                        attacks[l]
                                    ]);
                                }
                            }
                        } else {
                            re.push([attacks[i], attacks[j], attacks[k]]);
                        }
                    }
                } else {
                    re.push([attacks[i], attacks[j]]);
                }
            }
        } else {
            re.push([attacks[i]]);
        }
    }
    return re;
}

const toRemove = [
    // Non existent
    [NORMAL, BUG],
    [NORMAL, ROCK],
    [NORMAL, STEEL],
    [FIRE, FAIRY],
    [ICE, POISON],
    [GROUND, FAIRY],
    [BUG, DRAGON],
    [ROCK, GHOST],

    // Alternate only
    [NORMAL, GHOST],
    [FIRE, ELECTRIC],
    [FIRE, ICE],
    [ELECTRIC, GRASS],
    [ELECTRIC, PSYCHIC],
    [ICE, STEEL],
    [ICE, FAIRY],
    [POISON, PSYCHIC],
    [POISON, FAIRY],
    [PSYCHIC, GHOST],
    [PSYCHIC, DRAGON],

    // Legendary only
    // [FIRE, WATER],
    // [FIRE, STEEL],
    // [FIGHTING, ROCK],
    // [PSYCHIC, GHOST],
    // [PSYCHIC, DRAGON],

    // Mega only
    [PSYCHIC, DRAGON],
    [DRAGON, FAIRY],
];

toRemove.forEach(r => {
    const duo = allTypes.filter(tl => tl.includes(r[0]) && tl.includes(r[1]))[0];
    const index = allTypes.indexOf(duo);
    allTypes.splice(index, 1);
});

export const singleTypeCounts = {
    NORMAL: 79,
    FIRE: 37,
    WATER: 81,
    ELECTRIC: 37,
    GRASS: 46,
    ICE: 22,
    FIGHTING: 30,
    POISON: 16,
    GROUND: 17,
    FLYING: 4,
    PSYCHIC: 47,
    BUG: 25,
    ROCK: 20,
    GHOST: 19,
    DRAGON: 13,
    DARK: 16,
    STEEL: 12,
    FAIRY: 21
}

export class Brackets {
    '0' = 0;
    '0.25' = 0;
    '0.375' = 0;
    '0.5' = 0;
    '0.75' = 0;
    '1' = 0;
    '1.5' = 0;
    '2' = 0;
    '3' = 0;
    '4' = 0;
    '6' = 0;
}

export interface Matchup {
    effect: AttackEffect,
    defender: PokeType[]
}

export interface MovesetHighscore {
    moveset: Attack[],
    score: number,
    avgEffect: AttackEffect,
    brackets: Brackets,
    matchups: Matchup[]
}

export const abilities = ['None', 'Tinted Lens'] as const;
export type Ability = typeof abilities[number];

export interface Attack {
    type: PokeType,
    power: number
}

export interface AttackEffect {
    dmg: number,
    multiplier: number,
    type: PokeType
}