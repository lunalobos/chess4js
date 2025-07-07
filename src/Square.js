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
/**
 * Represents a square on a chessboard.
 * Each square is identified by its name (e.g., "a1", "h8") and its corresponding index.
 * Instances of this class are immutable.
 * Do not create instances of this class directly; use the getSquare or the squares object from the squares.js module.
 */
export class Square {
	/**
	 * Creates a new Square instance.
	 * @param {string} name the name of the square
	 */
	constructor(name) {
		let chars = name.toLowerCase().split("");
		if (chars.length != 2) {
			throw new Error(`invalid square name length ${chars.length}`);
		}
		let value = 0;
		switch (chars[0]) {
			case "a":
				break;
			case "b":
				value += 1;
				break;
			case "c":
				value += 2;
				break;
			case "d":
				value += 3;
				break;
			case "e":
				value += 4;
				break;
			case "f":
				value += 5;
				break;
			case "g":
				value += 6;
				break;
			case "h":
				value += 7;
				break;
			default:
				throw new Error(`invalid column ${chars[0]}`);
		}
		value += (Number(chars[1]).valueOf() - 1) * 8;

		/**
		 * Returns the index of this square, from 0 (A1) to 63 (H8).
		 * @returns {number} The index of this square.
		 */
		this.index = function () {
			return value;
		};
		/**
		 * Returns the name of this square, e.g. "a1" or "h8".
		 * @returns {string} The name of this square.
		 */
		this.name = function () {
			return name;
		};

		/**
		 * Converts the square to its corresponding bitboard representation.
		 * @returns {Bitboard} A Bitboard instance with the bit corresponding to this square set to 1.
		 */
		this.toBitboard = function () {
			return new Bitboard(1n << BigInt(this.index()));
		};
	}
}
