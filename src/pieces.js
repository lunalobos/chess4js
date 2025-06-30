import { Piece } from "./Piece.js";

export const pieces = [
    ["none", "none"],
    ["pawn", "white"],
    ["knight", "white"],
    ["bishop", "white"],
    ["rook", "white"],
    ["queen", "white"],
    ["king", "white"],
    ["pawn", "black"],
    ["knight", "black"],
    ["bishop", "black"],
    ["rook", "black"],
    ["queen", "black"],
    ["king", "black"]
].map(([type, color], index) => new Piece(type, color, index))
.reduce((obj, piece) => {
    obj[piece.name()] = piece
    return obj;
}, {});

export const {
    EMPTY, WP, WN, WB, WR, WQ, WK, BP, BN, BB, BR, BQ, BK
} = pieces;

const piecesArray = [
    EMPTY, WP, WN, WB, WR, WQ, WK, BP, BN, BB, BR, BQ, BK
]

/**
 * Returns the Piece object at the given index in the pieces array.
 * @param {number} index
 * @returns {Piece}
 */
export const getPiece = function(index){
    return piecesArray[index];
}

/**
 * @type {Map<string, Piece>}
 */
const nameToPiece = new Map();

for (const [name, piece] of Object.entries(pieces)) {
    nameToPiece.set(name, piece);
}

/**
 * Returns the Piece object with the given name.
 * @param {string} name - The name of the piece (e.g., "EMPTY", "WP", "WN", ...).
 * @returns {Piece} The Piece object with the given name, or undefined if there is no such piece.
 */
export function getPieceByName(name) {
    return nameToPiece.get(name);
}