import test from "ava";
import { squares } from "../src/squares.js";
import {
  bitboardFromBigInt,
  bitboardFromBinaryString,
  bitboardFromSquares,
} from "../src/bitboards.js";

const { A1, B2, C3, D4, E5, F6, G7, H8 } = squares;

test("Bitboard trailingZeros should return 3 when value is 8", (t) => {
  const board = bitboardFromBigInt(8n);
  const trailingZeros = board.trailingZeros();
  t.is(trailingZeros, 3);
});

test("Bitboard fromString should create a Bitboard from a binary string", (t) => {
  let board = bitboardFromBinaryString("0b1000");
  t.is(board.value(), 8n);
});

test("Bitboard fromSquares should create a Bitboard from multiple squares", (t) => {
  const board = bitboardFromSquares(A1, H8);
  t.is(board.value(), (1n << BigInt(A1.index())) | (1n << BigInt(H8.index())));
});

test("Bitboard toString should return expected string", (t) => {
  const bitboard = bitboardFromSquares(A1, B2, C3, D4, E5, F6, G7, H8);
  const str = bitboard.toString().trim();
  const expected = `
+---+---+---+---+---+---+---+---+ 
| 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |
+---+---+---+---+---+---+---+---+ 
| 0 | 0 | 0 | 0 | 0 | 0 | 1 | 0 |
+---+---+---+---+---+---+---+---+ 
| 0 | 0 | 0 | 0 | 0 | 1 | 0 | 0 |
+---+---+---+---+---+---+---+---+ 
| 0 | 0 | 0 | 0 | 1 | 0 | 0 | 0 |
+---+---+---+---+---+---+---+---+ 
| 0 | 0 | 0 | 1 | 0 | 0 | 0 | 0 |
+---+---+---+---+---+---+---+---+ 
| 0 | 0 | 1 | 0 | 0 | 0 | 0 | 0 |
+---+---+---+---+---+---+---+---+ 
| 0 | 1 | 0 | 0 | 0 | 0 | 0 | 0 |
+---+---+---+---+---+---+---+---+ 
| 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
+---+---+---+---+---+---+---+---+ 
`.trim();
  t.is(str, expected);
});

test("Bitboard and should perform bitwise AND between two bitboards", (t) => {
  let a = bitboardFromBigInt(0b1100n);
  let b = bitboardFromBigInt(0b1010n);
  t.is(a.and(b).value(), 0b1000n);
});

test("Bitboard or should perform bitwise OR between two bitboards", (t) => {
  const a = bitboardFromBigInt(0b1100n);
  const b = bitboardFromBigInt(0b1010n);
  t.is(a.or(b).value(), 0b1110n);
});

test("Bitboard xor should perform bitwise XOR between two bitboards", (t) => {
  const a = bitboardFromBigInt(0b1100n);
  const b = bitboardFromBigInt(0b1010n);
  t.is(a.xor(b).value(), 0b0110n);
});

test("Bitboard not should perform bitwise NOT on a bitboard", (t) => {
  const a = bitboardFromBigInt(0b1n);
  t.is(
    a.not().value(),
    0b1111_1111_1111_1111_1111_1111_1111_1111_1111_1111_1111_1111_1111_1111_1111_1110n
  );
});

test("Bitboard bitCount should count the number of set bits", (t) => {
  const a = bitboardFromBigInt(0b1011n);
  t.is(a.bitCount(), 3);
});

test("Bitboard isPresent should return true for non-zero bitboard", (t) => {
  const a = bitboardFromBigInt(1n);
  t.true(a.isPresent());
});

test("Bitboard isPresent should return false for zero bitboard", (t) => {
  const a = bitboardFromBigInt(0n);
  t.false(a.isPresent());
});

test("Bitboard lastBit should return the last set bit", (t) => {
  const a = bitboardFromBigInt(0b10100n);
  t.is(a.lastBit().value(), 0b100n);
});

test("Bitboard equals should return true for equal bitboards", (t) => {
  const a = bitboardFromBigInt(0b10100n);
  const b = bitboardFromBigInt(0b10100n);
  t.true(a.equals(b));
});

test("Bitboard equals should return false for different bitboards", (t) => {
  const a = bitboardFromBigInt(0b10100n);
  const b = bitboardFromBigInt(0b10000n);
  t.false(a.equals(b));
});
