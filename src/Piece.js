/**
 * Represents a chess piece with a specific type and color.
 *
 * Instances of this class are immutable: all properties are set at construction and cannot be changed.
 * Do not create instances of this class directly. Instead, use the predefined instances
 * provided by the 'pieces' module to obtain Piece objects.
 */
export class Piece {
	/**
	 * Creates a new Piece instance.
	 * @param {string} type - The type of the piece (e.g., "pawn", "knight", "bishop", "rook", "queen", "king", or "none").
	 * @param {string} color - The color of the piece ("white", "black", or "none").
	 * @param {number} index - The unique index of the piece.
	 * @private
	 */
	constructor(type, color, index) {
		const t = type.toUpperCase();
		/**
		 * Returns the type of the piece as an uppercase string.
		 *
		 * @returns {string} The type of the piece (e.g., "PAWN", "KNIGHT").
		 */

		this.type = function () {
			return t;
		};
		const c = color.toUpperCase();
		/**
		 * Returns the color of the piece as an uppercase string.
		 *
		 * @returns {string} The color of the piece (e.g., "WHITE", "BLACK").
		 */

		this.color = function () {
			return c;
		};
		let n = c[0] + (t === "KNIGHT" ? "N" : t[0]);
		if (type === "none") n = "EMPTY";
		/**
		 * Returns the name of the piece as an uppercase string.
		 * The name is a two-character string where the first character is the first character of the color
		 * and the second character is the first character of the type.
		 * The name of the empty piece is "EMPTY".
		 * @returns {string} The name of the piece (e.g., "WK", "BP", "EMPTY").
		 */
		this.name = function () {
			return n;
		};
		/**
		 * Returns the unique index of the piece.
		 *
		 * @returns {number} The index of the piece.
		 */

		this.index = function () {
			return index;
		};
	}
}
