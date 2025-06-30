import {
	bitboardMask as mask,
	numberOfTrailingZerosBigInt as trailingZeros,
	bitCount,
	reverse,
	numberOfLeadingZerosBigInt as leadingZeros,
	toBinaryString,
} from "./internal.js";
import { Square } from "./Square.js";

/**
 * Represents a bitboard, a compact representation of a chessboard using a 64-bit variable.
 * Each bit in the bitboard corresponds to a square on the chessboard.
 * 
 * Instances of this class are immutable: all operations return new Bitboard instances
 * and never modify the original object.
 */
export class Bitboard {
    /**
     * Creates a new Bitboard instance from a binary string.
     *
     * @param {string} binaryString - A string representing the binary value of the bitboard.
     * @return {Bitboard} A new Bitboard instance.
     */
    static fromString(binaryString) {
        return new Bitboard(BigInt(binaryString));
    }

    /**
     * Creates a new Bitboard from one or more Square objects.
     *
     * @param {...Square} squares - One or more Square instances.
     * @return {Bitboard} A new Bitboard instance.
     */
    static fromSquares(...squares) {
        return squares
            .map((sq) => new Bitboard(1n << BigInt(sq.index())))
            .reduce((prev, curr) => {
                return curr.or(prev);
            });
    }

    /**
     * Constructs a new Bitboard.
     *
     * @param {BigInt} value - A BigInt representing the bitboard value.
     * The value is masked to ensure it fits within 64 bits.
     */
    constructor(value) {
        /**
         * Internal value of this bitboard, masked to 64 bits.
         * @type {BigInt}
         * @private
         */
        const v = value & mask;

        /**
         * Returns the internal value of this bitboard.
         *
         * @returns {BigInt} The internal value of the bitboard, masked to 64 bits.
         */
        this.value = function () {
            return v;
        };
    }

    /**
     * Performs a bitwise AND operation with another bitboard.
     *
     * @param {Bitboard} other - The other bitboard to AND with.
     * @return {Bitboard} A new Bitboard representing the result.
     */
    and(other) {
        return new Bitboard(this.value() & other.value());
    }

    /**
     * Performs a bitwise OR operation with another bitboard.
     *
     * @param {Bitboard} other - The other bitboard to OR with.
     * @return {Bitboard} A new Bitboard representing the result.
     */
    or(other) {
        return new Bitboard(this.value() | other.value());
    }

    /**
     * Performs a bitwise XOR operation with another bitboard.
     *
     * @param {Bitboard} other - The other bitboard to XOR with.
     * @return {Bitboard} A new Bitboard representing the result.
     */
    xor(other) {
        return new Bitboard(this.value() ^ other.value());
    }

    /**
     * Performs a bitwise NOT operation on the bitboard.
     *
     * @return {Bitboard} A new Bitboard representing the negated value.
     */
    not() {
        return new Bitboard(~this.value());
    }

    /**
     * Counts the number of set bits (1s) in the bitboard.
     *
     * @return {number} The number of set bits.
     */
    bitCount() {
        return bitCount(this.value());
    }

    /**
     * Returns a boolean representation of the bitboard.
     *
     * @return {boolean} True if the bitboard has any set bits, false otherwise.
     */
    isPresent() {
        return Boolean(this.value()).valueOf();
    }

    /**
     * Extracts the last set bit (least significant bit) from the bitboard.
     *
     * @return {Bitboard} A new Bitboard with only the last set bit.
     */
    lastBit() {
        const newValue = this.value() & -this.value();
        return new Bitboard(newValue);
    }

    /**
     * Counts the number of trailing zeros in the bitboard.
     *
     * @return {number} The number of trailing zeros.
     */
    trailingZeros() {
        return trailingZeros(this.value());
    }

    /**
     * Returns a string representation of the bitboard as an 8x8 chessboard.
     *
     * @returns {string}
     */
    toString() {
        let str = "";
        let inverted = reverse(this.value());
        let mask = BigInt("0b11111111");
        str += "\n+---+---+---+---+---+---+---+---+ \n";
        for (let i = 0n; i < 8n; i++) {
            let s = "";
            let masked = (inverted & (mask << (i * 8n))) >> (i * 8n);
            let lz = leadingZeros(masked) - 56;
            s += "0".repeat(Math.max(0, lz));
            s += masked == 0n ? "" : toBinaryString(masked);
            let chars = s.split("");
            for (let c of chars) {
                str += "|";
                str += " ";
                str += c;
                str += " ";
            }
            str += "|";
            str += "\n+---+---+---+---+---+---+---+---+ \n";
        }
        return str;
    }

    /**
     * Checks if this bitboard is equal to another bitboard.
     * @param {Bitboard} other 
     * @returns {boolean} true if the bitboards are equal, false otherwise
     */
    equals(other){
        if(!other){
            return false;
        }
        if(other === this){
            return true;
        }
        if(!(other instanceof Bitboard)) {
            return false;
        } else {
            return this.value() === other.value();
        }
    }
}
