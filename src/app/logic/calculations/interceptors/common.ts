import { Context, Pokemon } from "../../models";

export type Interceptor<T> = (value: T) => T;

export function runInterceptors<T>(interceptorList: Interceptor<T>[], value: T): T {
    interceptorList.forEach(interceptor => value = interceptor(value));
    return value;
}

export const triggerWeatherAbility = (pokemon: Pokemon, context: Context): Context => {
    let weather = context.weather;
    switch(pokemon.ability) {
        case 'Drought': weather = 'Harsh sunlight'; break;
        case 'Drizzle': weather = 'Rain'; break;
        case 'Sand Stream': weather = 'Sandstorm'; break;
        case 'Snow Warning': weather = 'Hail'; break;
    }
    return {
        weather,
        terrain: context.terrain
    };
}
