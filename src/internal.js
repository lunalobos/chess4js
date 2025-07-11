/*
* Copyright 2025 Miguel Angel Luna Lobos
* 
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
* 
*     http://www.apache.org/licenses/LICENSE-2.0
* 
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

/*
 * Some functions in this file are adaptations of internal code from OpenJDK,
 * specifically from the Long and Integer classes. The algorithms and logic
 * are credited to Java and its developers; I have only adapted their work
 * for use in JavaScript. This is not original work, but a port to JS.
 */

export const bitboardMask = mask64();

/**
 *
 * @returns {BigInt}
 */
function mask64() {
	return BigInt("0b" + "1".repeat(64));
}

const intMask = mask32();

/**
 *
 * @returns {BigInt}
 */
function mask32() {
	return BigInt("0b" + "1".repeat(32));
}

/**
 *
 * @param {number} i
 * @returns {number}
 */
export function numberOfTrailingZeros(i) {
	// HD, Count trailing 0's
	i = ~i & (i - 1);
	if (i <= 0) return i & 32;
	let n = 1;
	if (i > 1 << 16) {
		n += 16;
		i >>>= 16;
	}
	if (i > 1 << 8) {
		n += 8;
		i >>>= 8;
	}
	if (i > 1 << 4) {
		n += 4;
		i >>>= 4;
	}
	if (i > 1 << 2) {
		n += 2;
		i >>>= 2;
	}
	return n + (i >>> 1);
}

/**
 *
 * @param {BigInt} i
 * @returns {number}
 */
export function numberOfTrailingZerosBigInt(i) {
	let x = Number(i & intMask);
	return x == 0
		? 32 + numberOfTrailingZeros(Number(i >> 32n).valueOf())
		: numberOfTrailingZeros(Number(x).valueOf());
}

/**
 *
 * @param {BigInt} i
 * @returns {number}
 */
export function bitCount(i) {
	i = i - ((i >> 1n) & BigInt("0x5555555555555555"));
	i =
		(i & BigInt("0x3333333333333333")) +
		((i >> 2n) & BigInt("0x3333333333333333"));
	i = (i + (i >> 4n)) & BigInt("0x0f0f0f0f0f0f0f0f");
	i = i + (i >> 8n);
	i = i + (i >> 16n);
	i = i + (i >> 32n);
	return Number(i & BigInt("0x7f")).valueOf();
}

/**
 *
 * @param {BigInt} i
 * @returns {BigInt}
 */
export function reverse(i) {
	i =
		((i & BigInt("0x5555555555555555")) << 1n) |
		((i >> 1n) & BigInt("0x5555555555555555"));
	i =
		((i & BigInt("0x3333333333333333")) << 2n) |
		((i >> 2n) & BigInt("0x3333333333333333"));
	i =
		((i & BigInt("0x0f0f0f0f0f0f0f0f")) << 4n) |
		((i >> 4n) & BigInt("0x0f0f0f0f0f0f0f0f"));

	return reverseBytes(i);
}

/**
 *
 * @param {BigInt} i
 * @returns {BigInt}
 */
function reverseBytes(i) {
	i =
		((i & BigInt("0x00ff00ff00ff00ff")) << 8n) |
		((i >> 8n) & BigInt("0x00ff00ff00ff00ff"));
	return (
		(i << 48n) |
		((i & BigInt("0xffff0000")) << 16n) |
		((i >> 16n) & BigInt("0xffff0000")) |
		(i >> 48n)
	);
}

/**
 *
 * @param {BigInt} i
 * @returns {number}
 */
export function numberOfLeadingZerosBigInt(i) {
	let x = Number((i >> 32n) & intMask).valueOf();
    return x == 0 ? 32 + numberOfLeadingZeros(Number(i & intMask).valueOf())
                : numberOfLeadingZeros(x);
}

/**
 *
 * @param {number} i
 * @returns {number}
 */
export function numberOfLeadingZeros(i) {
	if (i <= 0) return i == 0 ? 32 : 0;
	let n = 31;
	if (i >= 1 << 16) {
		n -= 16;
		i >>>= 16;
	}
	if (i >= 1 << 8) {
		n -= 8;
		i >>>= 8;
	}
	if (i >= 1 << 4) {
		n -= 4;
		i >>>= 4;
	}
	if (i >= 1 << 2) {
		n -= 2;
		i >>>= 2;
	}
	return n - (i >>> 1);
}

/**
 *
 * @param {BigInt} i
 * @returns {string}
 */
export function toBinaryString(i) {
	return toUnsignedString0(i, 1n);
}

/**
 *
 * @param {BigInt} val
 * @param {BigInt} shift
 * @returns {string}
 */
function toUnsignedString0(val, shift) {
	let mag = 64 - numberOfLeadingZerosBigInt(val);
	let chars = Math.max(
		(mag + Number(shift - 1n).valueOf()) / Number(shift).valueOf(),
		1
	);

	let buf = [];
	formatUnsignedLong0(val, shift, buf, 0, chars);
	return buf.join("");
}

const digits = [
	"0",
	"1",
	"2",
	"3",
	"4",
	"5",
	"6",
	"7",
	"8",
	"9",
	"a",
	"b",
	"c",
	"d",
	"e",
	"f",
	"g",
	"h",
	"i",
	"j",
	"k",
	"l",
	"m",
	"n",
	"o",
	"p",
	"q",
	"r",
	"s",
	"t",
	"u",
	"v",
	"w",
	"x",
	"y",
	"z",
];

/**
 *
 * @param {BigInt} val
 * @param {BigInt} shift
 * @param {Array<string>} byte
 * @param {number} offset
 * @param {number} len
 */
function formatUnsignedLong0(val, shift, buf, offset, len) {
	let charPos = offset + len;
	let radix = 1n << shift;
	let mask = radix - 1n;
	do {
		buf[--charPos] = digits[Number(val & mask).valueOf()];
		val >>= shift;
	} while (charPos > offset);
}

export const uciRegex = /(?<colOrigin>[a-h])(?<rowOrigin>[1-8])(?<colTarget>[a-h])(?<rowTarget>[1-8])(?<promotion>[nbrq])?/;

/**
 * Returns the column index for a given column letter 0-based.
 * @param {string} col 
 * @returns {number} the column index (0 for 'a', 1 for 'b', ..., 7 for 'h')
 */
export function getColIndex(col) {
	return col.charCodeAt(0) - "a".charCodeAt(0);
}