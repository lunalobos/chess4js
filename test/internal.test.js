import test from "ava";
import {
	numberOfLeadingZerosBigInt,
	toBinaryString,
	numberOfLeadingZeros
} from "../src/internal.js";

test("internal leadingZerosBigInt should return 58 when value is 32", t => {
    const leadingZerosBigInt = numberOfLeadingZerosBigInt(32n);
    t.is(leadingZerosBigInt, 58);
});

test("internal leadingZeros should return 26 when value is 32", t => {
    const leadingZeros = numberOfLeadingZeros(32);
    t.is(leadingZeros, 26);
});

test("internal binaryString should return 1000 when value is 8", t => {
    const binaryString = toBinaryString(8n);
    t.is(binaryString, "1000");
});