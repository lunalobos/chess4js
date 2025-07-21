import { Bean } from "./Bean.js";
import { Bitboard } from "./Bitboard.js";
import { getLogger } from "./loggers.js";
import { numberOfTrailingZeros } from "./internal.js";
import { MatrixUtil } from "./MatrixUtil.js";
import { bitboardFromBigInt } from "./bitboards.js";

export class VisibleMetrics extends Bean {
	static logger = getLogger("VisibleMetrics");
	/**
	 * @type {MatrixUtil}
	 */
	#matrixUtil;
	/**
	 * @type {Array<Array<Array<Bitboard>>>}
	 */
	#visibleOptions;
	/**
	 * @type {Array<number>}
	 */
	#trailingZeros;
	/**
	 * @type {Array<Function>}
	 */
	#calculators;

	/**
	 * Computes the visible squares from a given square.
	 *
	 * @param {MatrixUtil} matrixUtil
	 */
	constructor(matrixUtil) {
		super("VisibleMetrics");
		this.#matrixUtil = matrixUtil;

		this.#visibleOptions = new Array(64);
		for (let i = 0; i < 64; i++) {
			this.#visibleOptions[i] = new Array(8);
		}

		this.#trailingZeros = new Array(256);
		const opts = [
			0n,
			1n,
			0b11n,
			0b111n,
			0b1111n,
			0b11111n,
			0b111111n,
			0b1111111n,
		].map(bitboardFromBigInt);
		this.#trailingZeros[0] = 7;
		for (let i = 1; i < 0b10000000; i++) {
			this.#trailingZeros[i] = numberOfTrailingZeros(i);
		}

		for (let square = 0; square < 64; square++) {
			for (let directionIndex = 0; directionIndex < 8; directionIndex++) {
				let direction =
					this.#matrixUtil.queenMegaMatrix[square][directionIndex];
				/**
				 * @type {Array<Bitboard>}
				 */
				let options = new Array(8);
				for (let optionIndex = 0; optionIndex < 8; optionIndex++) {
					let image = opts[optionIndex];
					let visible = bitboardFromBigInt(0n);
					let counter = 0n;
					for (let sq of direction) {
						visible = visible.or(
							image
								.and(bitboardFromBigInt(1n << counter))
								.shiftRight(Number(counter).valueOf())
								.shiftLeft(sq)
						);
						counter++;
					}
					options[optionIndex] = visible;
				}
				this.#visibleOptions[square][directionIndex] = options;
			}
		}

		/**
		 *
		 * @param {number} square
		 * @param {number} index
		 * @param {Array<number>} direction
		 * @param {Bitboard} friends
		 * @param {Bitboard} enemies
		 *
		 * @returns {Bitboard}
		 */
		this.getVisible = (square, index, direction, friends, enemies) => {
			// space transformation: board -> direction
			let fimage = 0;
			let eimage = 0;
			let counter = 0;
			for (let sq of direction) {
				fimage |= Number(
					friends
						.and(bitboardFromBigInt(1n << BigInt(sq)))
						.shiftRight(sq)
						.shiftLeft(counter)
						.value()
				).valueOf();
				eimage |= Number(
					enemies
						.and(bitboardFromBigInt(1n << BigInt(sq)))
						.shiftRight(sq)
						.shiftLeft(counter + 1)
						.value()
				).valueOf();
				counter++;
			}
			// image for direction space with bit population always <= 7
			const image = (fimage | eimage) & 0b1111111;
			// trailing zeros count and visible bitboard selection
			return this.#visibleOptions[square][index][this.#trailingZeros[image]];
		};

		/**
		 *
		 * @param {number} square
		 * @param {Array<number>} directionsIndexes
		 * @param {Array<Array<number>>} directions
		 * @param {Bitboard} friends
		 * @param {Bitboard} enemies
		 * @returns {Bitboard}
		 */
		this.computeVisible = (
			square,
			directionsIndexes,
			directions,
			friends,
			enemies
		) => {
			let moves = bitboardFromBigInt(0n);
			for (let index of directionsIndexes) {
				moves = moves.or(
					this.getVisible(square, index, directions[index], friends, enemies)
				);
			}

			return moves;
		};

		// hashing some functions
		this.#calculators = [
			(sq, f, e) => {
				throw new Error("piece must be between 1 and 12");
			},
			(sq, f, e) => this.visibleSquaresWhitePawn(sq, f),
			(sq, f, e) => this.visibleSquaresKnight(sq, f),
			(sq, f, e) => this.visibleSquaresBishop(sq, f, e),
			(sq, f, e) => this.visibleSquaresRook(sq, f, e),
			(sq, f, e) => this.visibleSquaresQueen(sq, f, e),
			(sq, f, e) => this.visibleSquaresKing(sq, f),
			(sq, f, e) => this.visibleSquaresBlackPawn(sq, f),
			(sq, f, e) => this.visibleSquaresKnight(sq, f),
			(sq, f, e) => this.visibleSquaresBishop(sq, f, e),
			(sq, f, e) => this.visibleSquaresRook(sq, f, e),
			(sq, f, e) => this.visibleSquaresQueen(sq, f, e),
			(sq, f, e) => this.visibleSquaresKing(sq, f),
		];

		VisibleMetrics.logger.instantiation();
	}

	/**
	 *
	 * @param {Array<Bitboard>} bits
	 * @param {Array<number>} directionsIndexes
	 * @param {number} square
	 * @param {boolean} whiteMove
	 * @returns
	 */
	visibleSquares(bits, directionsIndexes, square, whiteMove) {
		let moves = bitboardFromBigInt(0n);
		const black = [6, 7, 8, 9, 10, 11]
			.map((i) => bits[i])
			.reduce((a, b) => a.or(b), bitboardFromBigInt(0n));
		const white = [0, 1, 2, 3, 4, 5]
			.map((i) => bits[i])
			.reduce((a, b) => a.or(b), bitboardFromBigInt(0n));
		let friends;
		let enemies;
		if (whiteMove) {
			friends = white;
			enemies = black;
		} else {
			friends = black;
			enemies = white;
		}
		for (let index of directionsIndexes) {
			moves = moves.or(
				getVisible(
					square,
					index,
					this.#matrixUtil.queenMegamatrix[square][index],
					friends,
					enemies
				)
			);
		}
		return moves;
	}

	/**
	 *
	 * @param {number} square
	 * @param {Bitboard} friends
	 */
	visibleSquaresWhitePawn(square, friends) {
		return this.#matrixUtil.whitePawnCaptureMoves[square].and(friends.not());
	}

	/**
	 *
	 * @param {number} square
	 * @param {Bitboard} friends
	 */
	visibleSquaresBlackPawn(square, friends) {
		return this.#matrixUtil.blackPawnCaptureMoves[square].and(friends.not());
	}

	/**
	 *
	 * @param {number} square
	 * @param {Bitboard} friends
	 */
	visibleSquaresKnight(square, friends) {
		return this.#matrixUtil.knightMoves[square].and(friends.not());
	}

	/**
	 *
	 * @param {number} square
	 * @param {Bitboard} friends
	 * @param {Bitboard} enemies
	 * @returns {Bitboard}
	 */
	visibleSquaresBishop(square, friends, enemies) {
		return this.computeVisible(
			square,
			this.#matrixUtil.bishopDirections,
			this.#matrixUtil.queenMegaMatrix[square],
			friends,
			enemies
		);
	}

	/**
	 *
	 * @param {number} square
	 * @param {Bitboard} friends
	 * @param {Bitboard} enemies
	 * @returns {Bitboard}
	 */
	visibleSquaresRook(square, friends, enemies) {
		return this.computeVisible(
			square,
			this.#matrixUtil.rookDirections,
			this.#matrixUtil.queenMegaMatrix[square],
			friends,
			enemies
		);
	}

	/**
	 *
	 * @param {number} square
	 * @param {Bitboard} friends
	 * @param {Bitboard} enemies
	 * @returns {Bitboard}
	 */
	visibleSquaresQueen(square, friends, enemies) {
		return this.computeVisible(
			square,
			this.#matrixUtil.queenDirections,
			this.#matrixUtil.queenMegaMatrix[square],
			friends,
			enemies
		);
	}

	/**
	 *
	 * @param {number} square
	 * @param {Bitboard} friends
	 * @returns {Bitboard}
	 */
	visibleSquaresKing(square, friends) {
		return this.#matrixUtil.kingMoves[square].and(friends.not());
	}

	/**
	 *
	 * @param {Array<Bitboard>} bitboards
	 * @param {Bitboard} friends
	 * @param {Bitboard} enemies
	 * @returns {Bitboard}
	 */
	immediateThreats(bitboards, friends, enemies) {
		let enemiesCopy = enemies;
		let enemiesVisible = bitboardFromBigInt(0n);
		while (enemiesCopy.value() !== 0n) {
			const bitboard = enemiesCopy.lastBit();
			enemiesCopy = enemiesCopy.add(bitboard.not());
			const square = bitboard.trailingZeros();
			let piece = 0;
			for (let j = 1; j < 13; j++) {
				piece +=
					j *
					Number(
						((1n << BigInt(square)) & bitboards[j - 1].value()) >>>
							BigInt(square)
					).valueOf();
			}
			enemiesVisible = enemiesVisible.or(
				this.#calculators[piece](square, enemies, friends)
			);
		}
		return enemiesVisible;
	}

	/**
	 *
	 * @param {Array<Bitboard>} bitboards
	 * @param {Bitboard} friends
	 * @param {Bitboard} enemies
	 * @param {Bitboard} kingSquare
	 * @param {Bitboard} wm
	 * @returns {Bitboard}
	 */
	threats(bitboards, friends, enemies, kingSquare, wm) {
		let enemiesVisible = bitboardFromBigInt(0n);
		const visibleKing = this.visibleSquaresKing(kingSquare, friends);
		const effectiveFriends = friends.or(visibleKing.and(enemies));
		const effectiveEnemies = enemies.or(visibleKing.and(enemies).not());
		const enemyPawn = 6 * (wm.isPresent() ? 1 : 0);
		const pawnFunction = calculators[enemyPawn + 1];
		let [
			pawnBitboard,
			knightBitboard,
			bishopBitboard,
			rookBitboard,
			queenBitboard,
			kingBitboard,
		] = [0, 1, 2, 3, 4, 5].map((i) => bitboards[i + enemyPawn]);

		while (pawnBitboard.isPresent()) {
			const bitboard = pawnBitboard.lastBit();
			pawnBitboard = pawnBitboard.and(bitboard.not());
			const square = bitboard.trailingZeros();
			enemiesVisible = enemiesVisible.or(
				pawnFunction(square, effectiveEnemies, effectiveFriends)
			);
		}

		while (knightBitboard.isPresent()) {
			const bitboard = knightBitboard.lastBit();
			knightBitboard = knightBitboard.and(bitboard.not());
			const square = bitboard.trailingZeros();
			enemiesVisible = enemiesVisible.or(
				this.visibleSquaresKnight(square, effectiveEnemies)
			);
		}

		while (bishopBitboard.isPresent()) {
			const bitboard = bishopBitboard.lastBit();
			bishopBitboard = bishopBitboard.and(bitboard.not());
			const square = bitboard.trailingZeros();
			enemiesVisible = enemiesVisible.or(
				this.visibleSquaresBishop(square, effectiveEnemies, effectiveFriends)
			);
		}

		while (rookBitboard.isPresent()) {
			const bitboard = rookBitboard.lastBit();
			rookBitboard = rookBitboard.and(bitboard.not());
			const square = bitboard.trailingZeros();
			enemiesVisible = enemiesVisible.or(
				this.visibleSquaresRook(square, effectiveEnemies, effectiveFriends)
			);
		}

		while (queenBitboard.isPresent()) {
			const bitboard = queenBitboard.lastBit();
			queenBitboard = queenBitboard.and(bitboard.not());
			const square = bitboard.trailingZeros();
			enemiesVisible = enemiesVisible.or(
				this.visibleSquaresQueen(square, effectiveEnemies, effectiveFriends)
			);
		}

		while (kingBitboard.isPresent()) {
			const bitboard = kingBitboard.lastBit();
			kingBitboard = kingBitboard.and(bitboard.not());
			const square = bitboard.trailingZeros();
			enemiesVisible = enemiesVisible.or(
				this.visibleSquaresKing(square, effectiveEnemies)
			);
		}
		return enemiesVisible;
	}
}
