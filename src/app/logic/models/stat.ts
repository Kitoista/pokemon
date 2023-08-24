export class Stat {
    constructor(
        public base: number,
        public nature: number,
        public ev: number,
        public stage: number
    ) {}

    public get value() {
        return calculateStatValue(this);
    }
}

export class HpStat {
    constructor(
        public base: number,
        public ev: number
    ) {}

    public get value() {
        return calculateHpStatValue(this);
    }
}

export interface Stats {
    hp: HpStat,
    attack: Stat,
    defense: Stat,
    spAttack: Stat,
    spDefense: Stat
}

export const calculateRawStat = (stat: Stat): number => {
    return Math.floor((Math.floor((2 * stat.base + 31 + stat.ev/4) * 50 / 100) + 5) * stat.nature);
}

export const calculateStatModifier = (stat: Stat): number => {
    let numerator = 2;
    let denominator = 2;

    if (stat.stage > 0) {
        numerator += Number(stat.stage);
    } else {
        denominator -= Number(stat.stage);
    }

    return numerator / denominator;
}

export const calculateStatValue = (stat: Stat): number => {
    return Math.floor(calculateRawStat(stat) * calculateStatModifier(stat));
}

export const calculateHpStatValue = (stat: HpStat): number => {
    return Math.floor(
        (2 * stat.base + 31 + Math.floor(stat.ev / 4)) * 50 / 100
    ) + 50 + 10;
}
