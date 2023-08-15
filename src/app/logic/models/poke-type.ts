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
}

class DefenseStats {
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
