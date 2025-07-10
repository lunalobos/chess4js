import test from "ava";
import { squares } from "../src/squares.js";
import { Move } from "../src/Move.js";
import { pieces } from "../src/pieces.js";
import {
  moveFromSquares,
  moveFromBitboard,
  moveFromUciString,
} from "../src/moves.js";

const { A2, E2, E3, A4, E4, A7, E7, A8, E8 } = squares;

const { WQ } = pieces;

test("Move fromSquares should create a Move with correct origin and target", (t) => {
  const move = Move.fromSquares(A2, A4);
  t.is(move.origin(), A2);
  t.is(move.target(), A4);
  t.is(move.promotionPiece().name(), "EMPTY");
});

test("Move fromSquares should create a Move with promotion piece", (t) => {
  const move = Move.fromSquares(A7, A8, WQ);
  t.is(move.origin(), A7);
  t.is(move.target(), A8);
  t.is(move.promotionPiece().name(), "WQ");
});

test("Move fromUciString should parse a normal move", (t) => {
  const move = Move.fromUciString("e2e4", true);
  t.is(move.origin().name(), "E2");
  t.is(move.target().name(), "E4");
  t.is(move.promotionPiece().name(), "EMPTY");
});

test("Move fromUciString should parse a promotion move", (t) => {
  const move = Move.fromUciString("e7e8q", true);
  t.is(move.origin().name(), "E7");
  t.is(move.target().name(), "E8");
  t.is(move.promotionPiece().name(), "WQ");
});

test("Move fromUciString should parse a promotion move for black", (t) => {
  const move = Move.fromUciString("a2a1n", false);
  t.is(move.origin().name(), "A2");
  t.is(move.target().name(), "A1");
  t.is(move.promotionPiece().name(), "BN");
});

test("Move fromUciString should throw error for invalid UCI string", (t) => {
  let threw = false;
  try {
    Move.fromUciString("invalid", true);
  } catch (e) {
    threw = true;
  }
  t.true(threw);
});

test("Move toString should return correct UCI string for normal move", (t) => {
  const move = Move.fromSquares(E2, E4);
  t.is(move.toString(), "e2e4");
});

test("Move toString should return correct UCI string for promotion move", (t) => {
  const move = Move.fromSquares(E7, E8, WQ);
  t.is(move.toString(), "e7e8q");
});

test("Move equals should return true for equal moves", (t) => {
  const m1 = Move.fromSquares(E2, E4);
  const m2 = Move.fromSquares(E2, E4);
  t.true(m1.equals(m2));
});

test("Move equals should return false for different moves", (t) => {
  const m1 = Move.fromSquares(E2, E4);
  const m2 = Move.fromSquares(E2, E3);
  t.false(m1.equals(m2));
});

test("Move equals should return false when compared with non-Move", (t) => {
  let m1 = Move.fromSquares(E2, E4);
  t.false(m1.equals(null));
  t.false(m1.equals({}));
});

test("Move factory moveFromSquares should return the same Move instance for the same origin, target, and promotion", (t) => {
  const m1 = moveFromSquares(E2, E4);
  const m2 = moveFromSquares(E2, E4);
  t.is(m1, m2);
});

test("Move factory moveFromSquares should return a Move with correct origin, target, and promotion", (t) => {
  const move = moveFromSquares(A2, A4);
  t.is(move.origin(), A2);
  t.is(move.target(), A4);
});

test("Move factory moveFromSquares should return a Move with correct origin and targete", (t) => {
  const move = moveFromSquares(A7, A8, WQ);
  t.is(move.origin(), A7);
  t.is(move.target(), A8);
  t.is(move.promotionPiece(), WQ);
});

test("Move factory moveFromUciString should return the same Move instance as moveFromSquares for normal move", (t) => {
  const m1 = moveFromUciString("e2e4", true);
  const m2 = moveFromSquares(E2, E4);
  t.is(m1, m2);
});

test("Move factory moveFromUciString should return the same Move instance as moveFromSquares for promotion move", (t) => {
  const m1 = moveFromUciString("e7e8q", true);
  const m2 = moveFromSquares(E7, E8, WQ);
  t.is(m1, m2);
});

test("Move factory moveFromUciString should throw error for invalid UCI string", (t) => {
  let threw = false;
  try {
    moveFromUciString("invalid", true);
  } catch (e) {
    threw = true;
  }
  t.true(threw);
});

test("move factory moveFromBitboard should return the same Move instance as moveFromSquares", (t) => {
  const move = moveFromSquares(E2, E4);
  const move2 = moveFromBitboard(move.moveBitboard(), move.origin());
  t.is(move, move2);
});