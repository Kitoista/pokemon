export const binomialCoefficient = (n: number, k: number): number => {
    if (k > n) {
        return 1;
    }
    let re = 1;
    for (let i = 1; i <= k; ++i) {
        re *= (n - (k - i)) / i;
    }
    return re;
}
