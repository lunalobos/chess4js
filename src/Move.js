import { Bitboard } from "./Bitboard.js";
import { getSquare } from "./squares.js";
import { Piece } from "./Piece.js";
import { Square } from "./Square.js";
import { EMPTY, getPieceByName } from "./pieces.js";
import { uciRegex, getColIndex } from "./internal.js";

/**
 * Represents a chess move, including origin, target, and optional promotion piece.
 *
 * Instances of this class are immutable: all properties are set at construction and cannot be changed.
 */
export class Move {
	/**
	 * Creates a Move instance from origin and target squares, and an optional promotion piece.
	 * @param {Square} origin - The origin square of the move.
	 * @param {Square} target - The target square of the move.
	 * @param {Piece} promotionPiece - The promotion piece, or EMPTY if not a promotion.
	 * @returns {Move} A new Move instance.
	 */
	static fromSquares(origin, target, promotionPiece = EMPTY) {
		return new Move(target.toBitboard(), origin, promotionPiece);
	}

	
	/**
	 * Creates a Move instance from a UCI string.
	 *
	 * The UCI string is expected to be in the format "[a-h][1-8][a-h][1-8][nbrq]?", 
	 * where the first two characters represent the origin square, 
	 * the next two characters represent the target square, 
	 * and the optional last character represents a promotion piece.
	 *
	 * @param {string} str - The UCI string representing the move.
	 * @param {boolean} whiteMove - Whether the move is made by the white pieces.
	 * @returns {Move} A new Move instance.
	 * @throws {Error} If the UCI string is invalid.
	 */
	static fromUciString(str, whiteMove){
		let match = str.match(uciRegex);
		if(!match){
			throw new Error("Invalid UCI string: " + str);
		} else {
			const xOrigin = getColIndex(match.groups.colOrigin);
			const yOrigin = Number(match.groups.rowOrigin) - 1;
			const xTarget = getColIndex(match.groups.colTarget);
			const yTarget = Number(match.groups.rowTarget) - 1;
			const origin = getSquare(xOrigin + yOrigin * 8);
			const target = getSquare(xTarget + yTarget * 8);
			const promotionPieceGroup = match.groups.promotion;
			if(promotionPieceGroup){
				const promotionPieceName = (whiteMove ? "W" : "B") + promotionPieceGroup.toUpperCase();
				const promotionPiece = getPieceByName(promotionPieceName);
				return Move.fromSquares(origin, target, promotionPiece);
			} else {
				return Move.fromSquares(origin, target);
			}
		}
	}

	/**
	 * Constructs a new Move.
	 * @param {Bitboard} moveBitboard - Bitboard with the target square set.
	 * @param {Square} origin - The origin square.
	 * @param {Piece} promotionPiece - The promotion piece, or EMPTY if not a promotion.
	 */
	constructor(moveBitboard, origin, promotionPiece = EMPTY) {
		/**
		 * Returns the bitboard representing the target square.
		 * @returns {Bitboard}
		 */
		this.moveBitboard = function () {
			return moveBitboard;
		};
		/**
		 * Returns the origin square.
		 * @returns {Square}
		 */
		this.origin = function () {
			return origin;
		};
		/**
		 * Returns the promotion piece.
		 * @returns {Piece}
		 */
		this.promotionPiece = function () {
			return promotionPiece;
		};

		const t = getSquare(moveBitboard.trailingZeros());
		/**
		 * Returns the target square.
		 * @returns {Square}
		 */
		this.target = function () {
			return t;
		};
	}

	/**
	 * Returns a string representation of the move in uci notation,
	 * with promotion piece if present (e.g., "e7e8q").
	 * @returns {string} the string representation of the move
	 */
	toString() {
		return (
			this.origin().name().toLowerCase() +
			this.target().name().toLowerCase() +
			(this.promotionPiece() === EMPTY
				? ""
				: this.promotionPiece().name().toLowerCase()[1])
		);
	}

	/**
	 * Checks if this move is equal to another move.
	 * @param {Move} other
	 */
	equals(other) {
		if (!other) {
			return false;
		}
		if (other === this) {
			return true;
		}
		if (!(other instanceof Move)) {
			return false;
		} else {
			return (
				this.origin() === other.origin() &&
				this.target() === other.target() &&
				this.promotionPiece() === other.promotionPiece()
			);
		}
	}
}
