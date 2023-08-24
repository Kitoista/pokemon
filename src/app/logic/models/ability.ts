export const abilities = [
    'None',
    'Tinted Lens',
    'Levitate',
    'Unaware',
    'Water Absorb',
    'Flash Fire',
    'Volt Absorb',
    'Drought',
    'Drizzle',
    'Sand Stream',
    'Snow Warning',
    'Intimidate',
    'Technician',
    'Solar Power'
] as const;
export type Ability = typeof abilities[number];
