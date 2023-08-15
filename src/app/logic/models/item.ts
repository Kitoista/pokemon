export const items = [
    'None',
    'Life orb',
    'Plate',
    'Expert belt',
    'Choice dmg'
] as const;
export type Item = typeof items[number];
