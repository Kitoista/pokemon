export const abilities = ['None', 'Tinted Lens', 'Levitate', 'Unaware'] as const;
export type Ability = typeof abilities[number];
