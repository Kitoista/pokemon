const tickMap = {};

export const tick = (str: string) => {
    tickMap[str] = Date.now();
    console.log('Started: ' + str);
}

export const tock = (str: string) => {
    console.log('Stopped: ' + str + ' ' + ((Date.now() - tickMap[str]) / 1000));
}
