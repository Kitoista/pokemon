export const weathers = [
    'None',
    'Hars sunlight',
    'Rain',
    'Hail',
    'Sandstorm'
] as const;
export type Weather = typeof weathers[number];

export const terrains = [
    'None',
    'Electric',
    'Grassy',
    'Misty'
] as const;
export type Terrain = typeof terrains[number];

export interface Context {
    weather: Weather,
    terrain: Terrain
}
