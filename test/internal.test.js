import { equal } from "assert";
import {
	numberOfLeadingZerosBigInt,
	toBinaryString,
	numberOfLeadingZeros
} from "../src/internal.js";

describe("internal test", function () {
    describe("leadingZerosBigInt", function () {
        let leadingZerosBigInt = numberOfLeadingZerosBigInt(32n);

        it("should return 58 when value is 32", function () {
            equal(leadingZerosBigInt, 58);
        });
    });

    describe("leadingZeros", function () {
        let leadingZeros = numberOfLeadingZeros(32);

        it("should return 26 when value is 32", function () {
            equal(leadingZeros, 26);
        });
    });

    describe("binaryString", function () {
        let binaryString = toBinaryString(8n);

        it("should return 1000 when value is 8", function () {
            equal(binaryString, "1000");
        });
    });
});