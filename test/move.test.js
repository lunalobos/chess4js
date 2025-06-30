import { equal } from "assert";
import { squares } from "../src/squares.js";
import { Move } from "../src/Move.js";
import { pieces } from "../src/pieces.js";

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

const {
	EMPTY, WP, WN, WB, WR, WQ, WK, BP, BN, BB, BR, BQ, BK
} = pieces;

describe("Move", function () {
    describe("fromSquares", function () {
        it("should create a Move with correct origin and target", function () {
            let move = Move.fromSquares(A2, A4);
            equal(move.origin(), A2);
            equal(move.target(), A4);
            equal(move.promotionPiece().name(), "EMPTY");
        });
        it("should create a Move with promotion piece", function () {
            let move = Move.fromSquares(A7, A8, WQ);
            equal(move.origin(), A7);
            equal(move.target(), A8);
            equal(move.promotionPiece(), WQ);
        });
    });

    describe("fromUciString", function () {
        it("should parse a normal move", function () {
            let move = Move.fromUciString("e2e4", true);
            equal(move.origin().name(), "E2");
            equal(move.target().name(), "E4");
            equal(move.promotionPiece().name(), "EMPTY");
        });
        it("should parse a promotion move for white", function () {
            let move = Move.fromUciString("e7e8q", true);
            equal(move.origin().name(), "E7");
            equal(move.target().name(), "E8");
            equal(move.promotionPiece().name(), "WQ");
        });
        it("should parse a promotion move for black", function () {
            let move = Move.fromUciString("a2a1n", false);
            equal(move.origin().name(), "A2");
            equal(move.target().name(), "A1");
            equal(move.promotionPiece().name(), "BN");
        });
        it("should throw error for invalid UCI string", function () {
            let threw = false;
            try {
                Move.fromUciString("invalid", true);
            } catch (e) {
                threw = true;
            }
            equal(threw, true);
        });
    });

    describe("toString", function () {
        it("should return correct UCI string for normal move", function () {
            let move = Move.fromSquares(E2, E4);
            equal(move.toString(), "e2e4");
        });
        it("should return correct UCI string for promotion move", function () {
            let move = Move.fromSquares(E7, E8, WQ);
            equal(move.toString(), "e7e8q");
        });
    });

    describe("equals", function () {
        it("should return true for equal moves", function () {
            let m1 = Move.fromSquares(E2, E4);
            let m2 = Move.fromSquares(E2, E4);
            equal(m1.equals(m2), true);
        });
        it("should return false for different moves", function () {
            let m1 = Move.fromSquares(E2, E4);
            let m2 = Move.fromSquares(E2, E3);
            equal(m1.equals(m2), false);
        });
        it("should return false when compared with non-Move", function () {
            let m1 = Move.fromSquares(E2, E4);
            equal(m1.equals(null), false);
            equal(m1.equals({}), false);
        });
    });
});
