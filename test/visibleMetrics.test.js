import test from "ava";
import { squares } from "../src/squares.js";
import { bitboardFromSquares } from "../src/bitboards.js";
import { VisibleMetrics } from "../src/VisibleMetrics.js";
import { MatrixUtil } from "../src/MatrixUtil.js";
import { Random } from "../src/Random.js";

const {
  A1,
  A2,
  A3,
  A4,
  A5,
  A6,
  A7,
  A8,
  B1,
  C1,
  D1,
  E1,
  F1,
  G1,
  H1,
  B2,
  C3,
  D4,
  B3,
  C2,
  E2,
  F2,
  H2,
  D3,
  G3,
  G2,
  B8,
  C8,
  D8,
  E8,
  G8,
  H8,
  B7,
  C7,
  E7,
  F7,
  H7,
  D7,
  G7,
  H3,
  F3,
  E4,
  D5,
  C6
} = squares;
const matrixUtil = new MatrixUtil();
const random = new Random();
const visibleMetrics = new VisibleMetrics(matrixUtil, random);

test("VisibleMetrics computeVisible should return correct bitboard for queen moves", (t) => {
  const friends = bitboardFromSquares(A1, B3);
  const enemies = bitboardFromSquares(C3, D4);

  const result = visibleMetrics.computeVisible(
    A1.index(),
    matrixUtil.queenDirections,
    matrixUtil.queenMegaMatrix[A1.index()],
    friends,
    enemies
  );

  t.is(
    result.value(),
    bitboardFromSquares(
      A2,
      A3,
      A4,
      A5,
      A6,
      A7,
      A8,
      B1,
      C1,
      D1,
      E1,
      F1,
      G1,
      H1,
      B2,
      C3
    ).value()
  );
});

test("VisibleMetrics computeVisible should return correct bitboard for rook moves", (t) => {
  const friends = bitboardFromSquares(A1, B2);
  const enemies = bitboardFromSquares(C3, D4);

  const result = visibleMetrics.computeVisible(
    A1.index(),
    matrixUtil.rookDirections,
    matrixUtil.queenMegaMatrix[A1.index()],
    friends,
    enemies
  );

  t.is(
    result.value(),
    bitboardFromSquares(
      A2,
      A3,
      A4,
      A5,
      A6,
      A7,
      A8,
      B1,
      C1,
      D1,
      E1,
      F1,
      G1,
      H1
    ).value()
  );
});

test("VisibleMetrics computeVisible should return correct bitboard for bishop moves", (t) => {
  const friends = bitboardFromSquares(
    A1,
    B1,
    C1,
    D1,
    E1,
    G1,
    H1,
    A2,
    B2,
    C2,
    E2,
    F2,
    H2,
    D3,
    G3,
    G2
  );
  const enemies = bitboardFromSquares(
    A8,
    B8,
    C8,
    D8,
    E8,
    G8,
    H8,
    A7,
    B7,
    C7,
    E7,
    F7,
    H7,
    D7,
    G7,
    G7
  );

  const result = visibleMetrics.computeVisible(
    G2.index(),
    matrixUtil.bishopDirections,
    matrixUtil.queenMegaMatrix[G2.index()],
    friends,
    enemies
  );

  t.is(result.value(), bitboardFromSquares(F1, H3, F3, E4, D5, C6, B7).value());
});


test("visibleSquaresWhitePawn returns correct moves", t => {
  const friends = bitboardFromSquares(E4, C3);
  const result = visibleMetrics.visibleSquaresWhitePawn(D3.index(), friends);
  t.is(result.value(), matrixUtil.whitePawnCaptureMoves[D3.index()].and(friends.not()).value());
});