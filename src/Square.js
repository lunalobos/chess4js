import { Bitboard } from "./Bitboard";

/**
 * Represents a square on a chessboard.
 * Each square is identified by its name (e.g., "a1", "h8") and its corresponding index.
 */
export function Square(name) {
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

    this.index = function(){
        return value;
    };
    this.name = function(){
        return name;
    };
}

/**
 * Converts the square to its corresponding bitboard representation.
 * @returns {Bitboard} A Bitboard instance with the bit corresponding to this square set to 1.
 */
Square.prototype.toBitboard = function () {
    return new Bitboard(BigInt(this.index()));
};