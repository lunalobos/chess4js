import {
  bitboardMask as mask,
  numberOfTrailingZerosBigInt as trailingZeros,
  bitCount,
  signum,
} from "./internal";
import { Square } from "./Square";

/**
 * Represents a bitboard, a compact representation of a chessboard using a 64-bit integer.
 * Each bit in the bitboard corresponds to a square on the chessboard.
 */
export class Bitboard {
  /**
   * Creates a new Bitboard instance from a binary string.
   *
   * @param {string} binaryString - A string representing the binary value of the bitboard.
   * @return {Bitboard} A new Bitboard instance.
   */
  static of(binaryString) {
    return new Bitboard(BigInt(binaryString));
  }

  /**
   *
   * @param {Array<Square>} squares
   * @return {Bitboard} A new Bitboard instance.
   */
  static fromSquares(squares) {
    return squares
      .map((sq) => new Bitboard(1n << BigInt(sq.index())))
      .reduce((prev, curr) => {
        return curr.or(prev);
      });
  }

  #value;

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
     */
    this.#value = value & mask;
  }

  /**
   * Returns the internal value of the bitboard.
   *
   * @return {BigInt} The 64-bit value of the bitboard.
   */
  value() {
    return this.#value;
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
    return new Bitboard(-this.value());
  }

  /**
   * Counts the number of set bits (1s) in the bitboard.
   *
   * @return {number} The number of set bits.
   */
  bitCount() {
    return bitCount(this.#value);
  }

  /**
   * Returns a boolean representation of the bitboard.
   *
   * @return {boolean} True if the bitboard has any set bits, false otherwise.
   */
  booleanValue() {
    return Boolean(signum(this.#value) * signum(this.#value)).valueOf();
  }

  /**
   * Extracts the last set bit (least significant bit) from the bitboard.
   *
   * @return {Bitboard} A new Bitboard with only the last set bit.
   */
  lastBit() {
    const newValue = this.#value & -this.#value;
    return new Bitboard(newValue);
  }

  /**
   * Counts the number of trailing zeros in the bitboard.
   *
   * @return {number} The number of trailing zeros.
   */
  trailingZeros() {
    return trailingZeros(this.#value);
  }
}
