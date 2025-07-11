import test from "ava";
import { prime } from "../src/primes.js";
import { Random } from "../src/Random.js";

test("should generate a probably prime number of the correct bit length", (t) => {
    const rnd = new Random(32);
    for (let bits = 3; bits <= 10; bits++) {
        const p = prime(bits, rnd);
        t.true(p >= 1 << (bits - 1), `Prime ${p} too small for ${bits} bits`);
        t.true(p <= (1 << bits) - 1, `Prime ${p} too large for ${bits} bits`);
        t.true(p % 2 === 1, `Prime ${p} is not odd`);
    }
});

test("should throw if bitLength is out of range", (t) => {
    const rnd = new Random(32);
    t.throws(() => prime(1, rnd), { message: "bitLength must be between 2 and 53" });
    t.throws(() => prime(54, rnd), { message: "bitLength must be between 2 and 53" });
});
