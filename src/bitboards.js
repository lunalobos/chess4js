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

import { Bitboard } from "./Bitboard.js";
import {
	A1,
	B1,
	C1,
	D1,
	E1,
	F1,
	G1,
	H1,
	A2,
	B2,
	C2,
	D2,
	E2,
	F2,
	G2,
	H2,
	A3,
	B3,
	C3,
	D3,
	E3,
	F3,
	G3,
	H3,
	A4,
	B4,
	C4,
	D4,
	E4,
	F4,
	G4,
	H4,
	A5,
	B5,
	C5,
	D5,
	E5,
	F5,
	G5,
	H5,
	A6,
	B6,
	C6,
	D6,
	E6,
	F6,
	G6,
	H6,
	A7,
	B7,
	C7,
	D7,
	E7,
	F7,
	G7,
	H7,
	A8,
	B8,
	C8,
	D8,
	E8,
	F8,
	G8,
	H8,
} from "./squares.js";
import { Square } from "./Square.js";

/**
 * @type {Square[][]}
 */
const rowsAndDiagonals = [
	[A1, B2, C3, D4, E5, F6, G7, H8],
	[H1, G2, F3, E4, D5, C6, B7, A8],
	[A7, B6, C5, D4, E3, F2, G1],
	[H7, G6, F5, E4, D3, C2, B1],
	[B8, C7, D6, E5, F4, G3, H2],
	[G8, F7, E6, D5, C4, B3, A2],
	[D8, D7, D6, D5, D4, D3, D2, D1],
	[E8, E7, E6, E5, E4, E3, E2, E1],
	[A4, B4, C4, D4, E4, F4, G4, H4],
	[A5, B5, C5, D5, E5, F5, G5, H5],
	[A1, B1, C1, D1, E1, F1, G1, H1],
	[A2, B2, C2, D2, E2, F2, G2, H2],
	[A3, B3, C3, D3, E3, F3, G3, H3],
	[A6, B6, C6, D6, E6, F6, G6, H6],
	[A7, B7, C7, D7, E7, F7, G7, H7],
	[A8, B8, C8, D8, E8, F8, G8, H8],
	[H1, H2, H3, H4, H5, H6, H7, H8],
	[G1, G2, G3, G4, G5, G6, G7, G8],
	[F1, F2, F3, F4, F5, F6, F7, F8],
	[C1, C2, C3, C4, C5, C6, C7, C8],
	[B1, B2, B3, B4, B5, B6, B7, B8],
	[A1, A2, A3, A4, A5, A6, A7, A8],
	[C8, D7, E6, F5, G4, H3],
	[D8, E7, F6, G5, H4],
	[E8, F7, G6, H5],
	[F8, G7, H6],
	[G8, H7],
	[A6, B5, C4, D3, E2, F1],
	[A5, B4, C3, D2, E1],
	[A4, B3, C2, D1],
	[A3, B2, C1],
	[A2, B1],
	[F8, E7, D6, C5, B4, A3],
	[E8, D7, C6, B5, A4],
	[D8, C7, B6, A5],
	[C8, B7, A6],
	[B8, A7],
	[H6, G5, F4, E3, D2, C1],
	[H5, G4, F3, E2, D1],
	[H4, G3, F2, E1],
	[H3, G2, F1],
	[H2, G1],
];

/**
 * 
 * @param {BigInt} a 
 * @param {BigInt} b 
 * @returns 
 */
const orOperation = (a, b) => a | b;

/**
 * @type {Map<BigInt, Bitboard>}
 */
const cache = new Map();

rowsAndDiagonals.forEach((squares) => {
	const value = squares
		.map((sq) => 1n << BigInt(sq.index()))
		.reduce(orOperation, 0n);
	const bb = new Bitboard(value);
	cache.set(bb.value(), bb);
});

for (let i = 0n; i < 64n; i++) {
	cache.set(1n << i, new Bitboard(1n << i));
}

cache.set(0n, new Bitboard(0n));

for (let i = 0n; i < 64n; i++) {
	cache.set(1n << i, new Bitboard(1n << i));
}

/**
 * Returns a Bitboard from a BigInt value.
 *
 * This is the recommended way to create Bitboard instances.
 * The function retrieves a Bitboard from the internal cache if it exists for the given
 * BigInt value to reduce memory usage and garbage collector pressure. If no cached
 * Bitboard is found, a new Bitboard is created and cached.
 *
 * @param {BigInt} value - A BigInt representing the bitboard value.
 * @return {Bitboard} A cached or new Bitboard instance representing the given value.
 */
export function bitboardFromBigInt(value) {
	if (cache.has(value)) {
		return cache.get(value);
	}
	return new Bitboard(value);
}


/**
 * Returns a Bitboard from one or more Square objects.
 *
 * This is the recommended way to create Bitboard instances from squares.
 * The function calculates the bitboard value by shifting 1 to the index of each square,
 * and performs a bitwise OR operation across all squares. It checks the cache for an
 * existing Bitboard with the calculated value to reduce memory usage and garbage collector
 * pressure. If no cached Bitboard is found, a new Bitboard is created and cached.
 *
 * @param {...Square} squares - One or more Square instances.
 * @return {Bitboard} A cached or new Bitboard instance representing the combined squares.
 */
export function bitboardFromSquares(...squares) {
	const value = squares
		.map((sq) => 1n << BigInt(sq.index()))
		.reduce(orOperation, 0n);
	if (cache.has(value)) {
		return cache.get(value);
	}
	return new Bitboard(value);
}

/**
 * Returns a Bitboard from a binary string.
 *
 * This is the recommended way to create Bitboard instances from a binary string.
 * The function calculates the bitboard value from the given binary string and
 * checks the cache for an existing Bitboard with the calculated value to reduce
 * memory usage and garbage collector pressure. If no cached Bitboard is found, a
 * new Bitboard is created and cached.
 *
 * @param {string} binaryString - A string representing the binary value of the
 * bitboard.
 * @return {Bitboard} A cached or new Bitboard instance representing the given
 * binary string.
 */
export function bitboardFromBinaryString(binaryString) {
	const value = BigInt(binaryString);
	if (cache.has(value)) {
		return cache.get(value);
	}
	return new Bitboard(value);
}
