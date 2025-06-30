import { equal } from "assert";
import { Square } from "../src/Square.js";

describe("Square", function () {
    describe("constructor", function () {
        it("should create a square with correct name and index", function () {
            let sq = new Square("A1");
            equal(sq.name(), "A1");
            equal(sq.index(), 0);
            let sq2 = new Square("H8");
            equal(sq2.name(), "H8");
            equal(sq2.index(), 63);
        });
    });

    describe("toBitboard", function () {
        it("should return a Bitboard with only this square set", function () {
            let sq = new Square("B2");
            let bb = sq.toBitboard();
            equal(bb.value(), 1n << BigInt(sq.index()));
        });
    });
});