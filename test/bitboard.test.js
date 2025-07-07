import { equal } from "assert";
import { Bitboard } from "../src/Bitboard.js";
import { squares } from "../src/squares.js";
import {
    bitboardFromBigInt,
    bitboardFromBinaryString,
    bitboardFromSquares
} from "../src/bitboards.js";

const {
    A1, B1, C1, D1, E1, F1, G1, H1,
    A2, B2, C2, D2, E2, F2, G2, H2,
    A3, B3, C3, D3, E3, F3, G3, H3,
    A4, B4, C4, D4, E4, F4, G4, H4,
    A5, B5, C5, D5, E5, F5, G5, H5,
    A6, B6, C6, D6, E6, F6, G6, H6,
    A7, B7, C7, D7, E7, F7, G7, H7,
    A8, B8, C8, D8, E8, F8, G8, H8
} = squares;

describe("Bitboard test", function () {
    describe("trailingZeros", function () {
        let board = bitboardFromBigInt(8n);
        let trailingZeros = board.trailingZeros();

        it("should return 3 when value is 8", function () {
            equal(trailingZeros, 3);
        });
    });
    describe("fromString", function () {
        it("should create a Bitboard from a binary string", function () {
            let board = bitboardFromBinaryString("0b1000");
            equal(board.value(), 8n);
        });
    });

    describe("fromSquares", function () {
        it("should create a Bitboard from multiple squares", function () {
            let board = bitboardFromSquares(A1, H8);
            equal(
                board.value(),
                (1n << BigInt(A1.index())) | (1n << BigInt(H8.index()))
            );
        });
    });

    describe("toString", function () {
        let bitboard = bitboardFromSquares(A1, B2, C3, D4, E5, F6, G7, H8);
        let str = bitboard.toString().trim();
        let expected = `
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
        it("should return expected string", function () {
            equal(str, expected);
        });
    });

    describe("and", function () {
        it("should perform bitwise AND between two bitboards", function () {
            let a = bitboardFromBigInt(0b1100n);
            let b = bitboardFromBigInt(0b1010n);
            equal(a.and(b).value(), 0b1000n);
        });
    });

    describe("or", function () {
        it("should perform bitwise OR between two bitboards", function () {
            let a = bitboardFromBigInt(0b1100n);
            let b = bitboardFromBigInt(0b1010n);
            equal(a.or(b).value(), 0b1110n);
        });
    });

    describe("xor", function () {
        it("should perform bitwise XOR between two bitboards", function () {
            let a = bitboardFromBigInt(0b1100n);
            let b = bitboardFromBigInt(0b1010n);
            equal(a.xor(b).value(), 0b0110n);
        });
    });

    describe("not", function () {
        it("should perform bitwise NOT on a bitboard", function () {
            let a = bitboardFromBigInt(0b1n);
            equal(
                a.not().value(),
                0b1111_1111_1111_1111_1111_1111_1111_1111_1111_1111_1111_1111_1111_1111_1111_1110n
            );
        });
    });

    describe("bitCount", function () {
        it("should count the number of set bits", function () {
            let a = bitboardFromBigInt(0b1011n);
            equal(a.bitCount(), 3);
        });
    });

    describe("booleanValue", function () {
        it("should return true for non-zero bitboard", function () {
            let a = bitboardFromBigInt(1n);
            equal(a.isPresent(), true);
        });
        it("should return false for zero bitboard", function () {
            let a = bitboardFromBigInt(0n);
            equal(a.isPresent(), false);
        });
    });

    describe("lastBit", function () {
        it("should extract the last set bit", function () {
            let a = bitboardFromBigInt(0b10100n);
            equal(a.lastBit().value(), 0b100n);
        });
    });

    describe("equals", function () {
        it("should return true for equal bitboards", function () {
            let a = bitboardFromBigInt(0b10100n);
            let b = bitboardFromBigInt(0b10100n);
            equal(a.equals(b), true);
        });
        it("should return false for non-equal bitboards", function () {
            let a = bitboardFromBigInt(0b10100n);
            let b = bitboardFromBigInt(0b10000n);
            equal(a.equals(b), false);
        });
    });
});