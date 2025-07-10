import { Random } from "./Random.js";
/**
 * Returns a probably prime number of bitLength bits using a Random instance.
 * @param {number} bitLength - Number of bits of the prime to generate (between 2 and 53).
 * @param {Random} rnd - Instance of your Random class.
 * @returns {number} An odd probably prime number.
 */
export function prime(bitLength, rnd) {
    if (bitLength < 2 || bitLength > 53) {
        throw new Error("bitLength must be between 2 and 53");
    }

    const low = 1 << (bitLength - 1);     // Minimum value with bitLength bits
    const high = (1 << bitLength) - 1;    // Maximum value

    while (true) {
        let candidate = rnd.nextInt();
        candidate = low + (candidate % (high - low + 1)); // Ensure exact range
        if ((candidate & 1) === 0) candidate++;            // Ensure it is odd

        if (isProbablyPrime(candidate)) {
            return candidate;
        }
    }
}

/**
 * Checks if a number is probably prime.
 * Uses fast filtering with small primes and a Miller-Rabin test base 2.
 * @param {number} n - The number to check.
 * @returns {boolean} true if it appears prime, false if composite.
 */
function isProbablyPrime(n) {
    if (n < 2) return false;
    if (n === 2 || n === 3) return true;
    if (n % 2 === 0) return false;

    const smallPrimes = [3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41];
    for (let p of smallPrimes) {
        if (n % p === 0 && n !== p) return false;
    }

    return millerRabin(n, 2); // Fixed base for speed
}

/**
 * Miller-Rabin test with fixed base.
 * @param {number} n - Number to test.
 * @param {number} base - Base for the test.
 * @returns {boolean} true if it passes the test, false if probably not prime.
 */
function millerRabin(n, base) {
    let d = n - 1;
    let s = 0;

    while ((d & 1) === 0) {
        d >>= 1;
        s++;
    }

    let aPow = modPow(base, d, n);
    if (aPow === 1 || aPow === n - 1) return true;

    for (let r = 1; r < s; r++) {
        aPow = (aPow * aPow) % n;
        if (aPow === n - 1) return true;
    }

    return false;
}

/**
 * Fast modular exponentiation.
 * @param {number} base - Base.
 * @param {number} exp - Exponent.
 * @param {number} mod - Modulus.
 * @returns {number} (base^exp) % mod
 */
function modPow(base, exp, mod) {
    let result = 1;
    base = base % mod;

    while (exp > 0) {
        if (exp % 2 === 1) result = (result * base) % mod;
        base = (base * base) % mod;
        exp = Math.floor(exp / 2);
    }

    return result;
}