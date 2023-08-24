export const roles = [
    'None',
    'Growth Abuser',
    'Swords Dance Passer',
    'Shell Smash',
    'Sand Rush Dancer'
] as const;
export type Role = typeof roles[number];
