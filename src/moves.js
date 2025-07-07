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

import { Move } from "./Move.js";
import { Piece } from "./Piece.js";
import { WQ, WR, WN, WB, EMPTY, BQ, BR, BN, BB, getPieceByName } from "./pieces.js";
import { Square } from "./Square.js";
import { getSquareFromName, getSquare } from "./squares.js";
import { uciRegex, getColIndex } from "./internal.js";
import { Bitboard } from "./Bitboard.js";

/**
 *
 * @param {Move} move
 * @param {Array<Move>} moves
 */
function checkCollision(move, moves) {
	let m = moves[move.hashCode()];
	if (m && !m.equals(move)) {
		throw new Error(`hash collision for ${m} and ${move}`);
	}
}

/**
 *
 * @param {number} origin
 * @param {number} target
 * @param {number} promotionPiece
 * @returns {number}
 */
function hash(origin, target, promotionPiece = 0) {
	return origin | (target << 6) | (promotionPiece << 12);
}

/**
 * @type {Array<Move>}
 */
const moves = new Array(65535);

const movesCollection = [];
const cols = ["a", "b", "c", "d", "e", "f", "g", "h"];

// white promotions
const white = [WQ, WR, WN, WB];

cols
	.map((col) => col.toUpperCase())
	.flatMap((col) => {
		const origin = getSquareFromName(col + "7");
		const target = getSquareFromName(col + "8");
		return white.map((piece) => Move.fromSquares(origin, target, piece));
	})
	.forEach((move) => movesCollection.push(move));

cols
	.slice(0, 7)
	.map((col) => col.toUpperCase())
	.flatMap((col) => {
		const origin = getSquareFromName(col + "7");
		const target = getSquare(getSquareFromName(col + "8").index() + 1);
		return white.map((piece) => Move.fromSquares(origin, target, piece));
	})
	.forEach((move) => movesCollection.push(move));

cols
	.slice(1, 8)
	.map((col) => col.toUpperCase())
	.flatMap((col) => {
		const origin = getSquareFromName(col + "7");
		const target = getSquare(getSquareFromName(col + "8").index() - 1);
		return white.map((piece) => Move.fromSquares(origin, target, piece));
	})
	.forEach((move) => movesCollection.push(move));

// black promotions
const black = [BQ, BR, BN, BB];

cols
	.map((col) => col.toUpperCase())
	.flatMap((col) => {
		const origin = getSquareFromName(col + "1");
		const target = getSquareFromName(col + "2");
		return black.map((piece) => Move.fromSquares(origin, target, piece));
	})
	.forEach((move) => movesCollection.push(move));

cols
	.slice(0, 7)
	.map((col) => col.toUpperCase())
	.flatMap((col) => {
		const origin = getSquareFromName(col + "1");
		const target = getSquare(getSquareFromName(col + "2").index() + 1);
		return black.map((piece) => Move.fromSquares(origin, target, piece));
	})
	.forEach((move) => movesCollection.push(move));

cols
	.slice(1, 8)
	.map((col) => col.toUpperCase())
	.flatMap((col) => {
		const origin = getSquareFromName(col + "1");
		const target = getSquare(getSquareFromName(col + "2").index() - 1);
		return black.map((piece) => Move.fromSquares(origin, target, piece));
	})
	.forEach((move) => movesCollection.push(move));

// regular moves, some are not possible
for (let i = 0; i < 64; i++) {
	for (let j = 0; j < 64; j++) {
		if (j != i) {
			movesCollection.push(Move.fromSquares(getSquare(i), getSquare(j)));
		}
	}
}

movesCollection.forEach((move) => {
	checkCollision(move, moves);
	moves[move.hashCode()] = move;
});

/**
 * Returns a Move instance from origin and target squares, and an optional promotion piece.
 * @param {Square} origin - The origin square of the move.
 * @param {Square} target - The target square of the move.
 * @param {Piece} promotionPiece - The promotion piece, or EMPTY if not a promotion.
 * @returns {Move} A new Move instance.
 */
export function moveFromSquares(origin, target, promotionPiece = EMPTY) {
	return moves[hash(origin.index(), target.index(), promotionPiece.index())];
}

/**
 * Converts a UCI string to a Move instance.
 *
 * The UCI string should be in the format "[a-h][1-8][a-h][1-8][nbrq]?",
 * where the first two characters represent the origin square, the next two
 * characters represent the target square, and the optional last character
 * represents a promotion piece.
 *
 * @param {string} str - The UCI string representing the move.
 * @param {boolean} whiteMove - Indicates if the move is made by the white pieces.
 * @returns {Move} The Move instance corresponding to the UCI string.
 * @throws {Error} If the UCI string is invalid.
 */
export function moveFromUciString(str, whiteMove) {
	let match = str.match(uciRegex);
	if (!match) {
		throw new Error("Invalid UCI string: " + str);
	} else {
		const xOrigin = getColIndex(match.groups.colOrigin);
		const yOrigin = Number(match.groups.rowOrigin) - 1;
		const xTarget = getColIndex(match.groups.colTarget);
		const yTarget = Number(match.groups.rowTarget) - 1;
		const origin = getSquare(xOrigin + yOrigin * 8);
		const target = getSquare(xTarget + yTarget * 8);
		const promotionPieceGroup = match.groups.promotion;
		if (promotionPieceGroup) {
			const promotionPieceName =
				(whiteMove ? "W" : "B") + promotionPieceGroup.toUpperCase();
			const promotionPiece = getPieceByName(promotionPieceName);
			return moveFromSquares(origin, target, promotionPiece);
		} else {
			return moveFromSquares(origin, target);
		}
	}
}

/**
 * Creates a Move instance from a bitboard, an origin square, and an optional promotion piece.
 * @param {Bitboard} moveBitboard
 * @param {Square} origin
 * @param {Piece} promotionPiece
 * @returns {Move} a Move instance
 */
export function moveFromBitboard(moveBitboard, origin, promotionPiece = EMPTY) {
	return moves[
		hash(origin.index(), moveBitboard.trailingZeros(), promotionPiece.index())
	];
}
