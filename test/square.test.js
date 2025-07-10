import test from "ava";
import { Square } from "../src/Square.js";

test("Square constructor should create a square with correct name and index", (t) => {
    const sq = new Square("A1");
    t.is(sq.name(), "A1");
    t.is(sq.index(), 0);

    const sq2 = new Square("H8");
    t.is(sq2.name(), "H8");
    t.is(sq2.index(), 63);
});

test("Square toBitboard should return a Bitboard with only this square set", (t) => {
    const sq = new Square("B2");
    const bb = sq.toBitboard();
    t.is(bb.value(), 1n << BigInt(sq.index()));
});