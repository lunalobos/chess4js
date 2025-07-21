import test from "ava";
import { squares } from "../src/squares.js";
import { bitboardFromSquares } from "../src/bitboards.js";
import { VisibleMetrics } from "../src/VisibleMetrics.js";
import { MatrixUtil } from "../src/MatrixUtil.js";

const {
	A1,
	B1,
	C1,
	D1,
	E1,
	F1,
	G1,
	H1,
	A2,
	B2,
	C2,
	D2,
	E2,
	F2,
	G2,
	H2,
	A3,
	B3,
	C3,
	D3,
	E3,
	F3,
	G3,
	H3,
	A4,
	B4,
	C4,
	D4,
	E4,
	F4,
	G4,
	H4,
	A5,
	B5,
	C5,
	D5,
	E5,
	F5,
	G5,
	H5,
	A6,
	B6,
	C6,
	D6,
	E6,
	F6,
	G6,
	H6,
	A7,
	B7,
	C7,
	D7,
	E7,
	F7,
	G7,
	H7,
	A8,
	B8,
	C8,
	D8,
	E8,
	F8,
	G8,
	H8,
} = squares;

const matrixUtil = new MatrixUtil();
let visibleMetrics = new VisibleMetrics(matrixUtil);

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

test("visibleSquaresWhitePawn should returns correct moves", (t) => {
	const square = D3;
	const friends = bitboardFromSquares(E4, C3);
	const result = visibleMetrics.visibleSquaresWhitePawn(
		square.index(),
		friends
	);
	t.is(result.value(), bitboardFromSquares(C4).value());
});

test("visibleSquaresBlackPawn should returns correct moves", (t) => {
	const square = D6;
	const friends = bitboardFromSquares(A7, B7, C7, E7, F7, G7, H7);
	const enemies = bitboardFromSquares(A2, B2, C2, D4, E2, F2, G2, H2);
	const result = visibleMetrics.visibleSquaresBlackPawn(
		square.index(),
		friends,
		enemies
	);
	t.is(result.value(), bitboardFromSquares(E5, C5).value());
});

test("visibleSquaresKnight should returns correct moves", (t) => {
	const square = F3;
	const friends = bitboardFromSquares(A2, B2, C2, D2, E2, F2, G3, H2);
	const enemies = bitboardFromSquares(A7, B7, C7, D7, E7, F7, G7, H7);
	const result = visibleMetrics.visibleSquaresKnight(
		square.index(),
		friends,
		enemies
	);
	t.is(result.value(), bitboardFromSquares(G1, E1, D4, E5, G5, H4).value());
});

test("visibleSquaresBishop should returns correct moves", (t) => {
	const square = G2;
	const friends = bitboardFromSquares(A2, B2, C2, D2, E2, F2, G3, H2);
	const enemies = bitboardFromSquares(A7, B7, C7, D7, E7, F7, G7, H7);
	const result = visibleMetrics.visibleSquaresBishop(
		square.index(),
		friends,
		enemies
	);
	t.is(
		result.value(),
		bitboardFromSquares(F1, H1, H3, F3, E4, D5, C6, B7).value()
	);
});

test("visibleSquaresRook should returns correct moves", (t) => {
	const square = E1;
	const friends = bitboardFromSquares(E4);
	const enemies = bitboardFromSquares(F7, H7);
	const result = visibleMetrics.visibleSquaresRook(
		square.index(),
		friends,
		enemies
	);
	t.is(
		result.value(),
		bitboardFromSquares(A1, B1, C1, D1, F1, G1, H1, E2, E3).value()
	);
});

test("visibleSquaresQueen should returns correct moves", (t) => {
	const square = E1;
	const friends = bitboardFromSquares(E4);
	const enemies = bitboardFromSquares(F7, H7);
	const result = visibleMetrics.visibleSquaresQueen(
		square.index(),
		friends,
		enemies
	);
	t.is(
		result.value(),
		bitboardFromSquares(
			A1,
			B1,
			C1,
			D1,
			F1,
			G1,
			H1,
			E2,
			E3,
			F2,
			G3,
			H4,
			D2,
			C3,
			B4,
			A5
		).value()
	);
});

test("visibleSquaresKing should returns correct moves", (t) => {
  const square = E1;
	const friends = bitboardFromSquares(E2);
	const enemies = bitboardFromSquares(F7, H7);
	const result = visibleMetrics.visibleSquaresKing(
		square.index(),
		friends,
		enemies
	);
  t.is(
		result.value(),
		bitboardFromSquares(D1, D2, F2, F1).value()
	);
});