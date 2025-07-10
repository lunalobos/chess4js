import { ok, notEqual, throws } from "assert";
import { prime } from "../src/primes.js";
import { Random } from "../src/Random.js";

describe("primes", function () {
	it("should generate a probably prime number of the correct bit length", function () {
		const rnd = new Random(32);
		for (let bits = 3; bits <= 10; bits++) {
			const p = prime(bits, rnd);
			ok(p >= 1 << (bits - 1), `Prime ${p} too small for ${bits} bits`);
			ok(p <= (1 << bits) - 1, `Prime ${p} too large for ${bits} bits`);
			ok(p % 2 === 1, `Prime ${p} is not odd`);
		}
	});

	it("should throw if bitLength is out of range", function () {
		const rnd = new Random(32);
		throws(() => prime(1, rnd), "bitLength must be between 2 and 53");
		throws(() => prime(54, rnd), "bitLength must be between 2 and 53");
	});

	it("should generate different primes for different seeds", function () {
		const rnd1 = new Random(32);
		const rnd2 = new Random(32);
		const p1 = prime(8, rnd1);
		const p2 = prime(8, rnd2);
		notEqual(p1, p2, "Primes should differ for different seeds");
	});
});
