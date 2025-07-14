import { Bean } from "./Bean.js";
import { Bitboard } from "./Bitboard.js";
import { getLogger } from "./loggers.js";
import { numberOfTrailingZeros, numberOfLeadingZeros } from "./internal.js";
import { MatrixUtil } from "./MatrixUtil.js";
import { bitboardFromBigInt } from "./bitboards.js";
import { Random } from "./Random.js";
import { prime } from "./primes.js";

export class VisibleMetrics extends Bean {
	static logger = getLogger("VisibleMetrics");
	#matrixUtil;
	#random;
	/**
	 * @type {Array<Array<Array<Bitboard>>>}
	 */
	#visibleOptions;
	/**
	 * @type {Array<number>}
	 */
	#trailingZeros;
	/**
	 * @type {MagicNumbers}
	 */
	#rookMagicNumbers;
	/**
	 * @type {MagicNumbers}
	 */
	#bishopMagicNumbers;
	/**
	 * @type {Array<Function>}
	 */
	#calculators;
	/**
	 *
	 * @param {MatrixUtil} matrixUtil
	 * @param {Random} random
	 */
	constructor(matrixUtil, random) {
		super("VisibleMetrics");
		this.#matrixUtil = matrixUtil;
		this.#random = random;

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

		// calculate magicNumbers
		const rookSize = new Size(20);
		const bishopSize = new Size(18);
		const combinator = new Combinator(this.#matrixUtil);
		const rookHasher = new MagicHasher(
			rookSize.bitsSize,
			this.#matrixUtil.queenMegaMatrix,
			this.#matrixUtil.rookDirections
		);
		const bishopHasher = new MagicHasher(
			bishopSize.bitsSize,
			this.#matrixUtil.queenMegaMatrix,
			this.#matrixUtil.bishopDirections
		);
		this.#rookMagicNumbers = new MagicNumbers(
			combinator,
			rookHasher,
			rookSize.capacity,
			this.#matrixUtil.rookDirections,
			this.#random
		);
		this.#bishopMagicNumbers = new MagicNumbers(
			combinator,
			bishopHasher,
			bishopSize.capacity,
			this.#matrixUtil.bishopDirections,
			this.#random
		);
		this.#rookMagicNumbers.calculate(this.#matrixUtil, this.computeVisible);
		this.#bishopMagicNumbers.calculate(this.#matrixUtil, this.computeVisible);

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
		return this.#bishopMagicNumbers
			.visibleHashed(square, friends | enemies)
			.and(friends.not());
	}

	/**
	 *
	 * @param {number} square
	 * @param {Bitboard} friends
	 * @param {Bitboard} enemies
	 * @returns {Bitboard}
	 */
	visibleSquaresRook(square, friends, enemies) {
		return this.#rookMagicNumbers
			.visibleHashed(square, friends | enemies)
			.and(friends.not());
	}

	/**
	 *
	 * @param {number} square
	 * @param {Bitboard} friends
	 * @param {Bitboard} enemies
	 * @returns {Bitboard}
	 */
	visibleSquaresQueen(square, friends, enemies) {
		return this.visibleSquaresBishop(square, friends, enemies).or(
			this.visibleSquaresRook(square, friends, enemies)
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

class Size {
	/**
	 *
	 * @param {number} bitsSize
	 */
	constructor(bitsSize) {
		this.bitsSize = bitsSize;
		this.capacity = 1 << bitsSize;
	}
}

class BitIterator {
	#bits;
	#pointer;
	#bitsLength;
	/**
	 *
	 * @param {number} bits
	 */
	constructor(bits) {
		this.#bits = bits;
		this.#pointer = 0;
		this.#bitsLength = 32 - numberOfLeadingZeros(bits);
	}

	hasNext() {
		return this.#pointer < this.#bitsLength;
	}

	next() {
		let currentPointer = this.#pointer;
		this.#pointer++;
		return (this.#bits & (1 << currentPointer)) >>> currentPointer;
	}
}

class Combinator extends Bean {
	static logger = getLogger("Combinator");
	/**
	 * @type {MatrixUtil}
	 */
	#matrixUtil;

	/**
	 * Constructor.
	 * @param {MatrixUtil} matrixUtil - The matrixUtil object which provides
	 * the matrix data.
	 */
	constructor(matrixUtil) {
		super("Combinator");
		this.#matrixUtil = matrixUtil;
		Combinator.logger.instantiation();
	}

	/**
	 *
	 * @param {number} square
	 * @param {Array<number>} directionsIndexes
	 * @return {Array<number>}
	 */
	#squaresList(square, directionsIndexes) {
		const directions = this.#matrixUtil.queenMegaMatrix[square];
		const list = [];
		for (let index of directionsIndexes) {
			for (let sq of directions[index]) {
				list.push(sq);
			}
		}
		return list;
	}

	/**
	 *
	 * @param {number} square
	 * @param {Array<number>} directionsIndexes
	 * @returns {Array<Bitboard>}
	 */
	compute(square, directionsIndexes) {
		const list = this.#squaresList(square, directionsIndexes);
		const combinationsSize = 1 << list.length;
		const combinationsList = new Map();
		for (let combination = 0; combination < combinationsSize; combination++) {
			const bitIterator = new BitIterator(combination);
			const listIterator = list[Symbol.iterator]();
			let bitboard = bitboardFromBigInt(0n);
			while (bitIterator.hasNext() && !listIterator.done()) {
				bitboard = bitboard.or(
					bitboardFromBigInt(
						BigInt(bitIterator.hasNext()) << BigInt(listIterator.next())
					)
				);
			}
			combinationsList.set(bitboard.value(), bitboard);
		}
		const output = [];
		for (let value of combinationsList.values()) {
			output.push(value);
		}
		return output;
	}
}

class MagicHasher extends Bean {
	static logger = getLogger("MagicHasher");
	/**
	 * @type {number}
	 */
	#indexBits;
	/**
	 * @type {Array<Bitboard>}
	 */
	#maskMatrix;

	/**
	 *
	 * @param {number} indexBits
	 * @param {Array<Array<Array<number>>>} queenMatrix
	 * @param {Array<number>} directions
	 */
	constructor(indexBits, queenMatrix, directions) {
		super("MagicHasher");
		this.#indexBits = indexBits;
		// createMaskMatrix
		const maskMatrix = new Array(64);
		for (let square = 0; square < 64; square++) {
			let mask = bitboardFromBigInt(0n);
			for (let directionIndex of directions) {
				for (let squareIdex of queenMatrix[square][directionIndex]) {
					mask = mask.or(bitboardFromBigInt(1n << BigInt(squareIdex)));
				}
			}
			maskMatrix[square] = mask;
		}
		this.#maskMatrix = maskMatrix;

		MagicHasher.logger.instantiation();
	}

	/**
	 *
	 * @param {Bitboard} occupied
	 * @param {Bitboard} magic
	 * @param {number} square
	 */
	hash(occupied, magic, square) {
		const mask = this.#maskMatrix[square];
		const blockers = occupied.and(mask);
		return (
			Number(blockers.value() * magic.value()).valueOf() >>>
			(64 - this.#indexBits)
		);
	}
}

class FastFailBitboardMap {
	/**
	 * @type {Array<Bitboard>}
	 */
	#map;
	constructor(capacity) {
		this.#map = new Array(capacity);
	}

	/**
	 *
	 * @param {number} index
	 * @param {Bitboard} value
	 */
	put(index, value) {
		if (index < 0 || index >= this.#map.length)
			throw new Error(
				`Index ${index} is out of range for this hashmap with capacity ${
					this.#map.length
				}.`
			);
		this.#map[index] = value;
	}

	/**
	 *
	 * @returns {Array<Bitboard>}
	 */
	toArray() {
		const copy = [];
		for (let value of this.#map) {
			copy.push(value);
		}
		return copy;
	}

	/**
	 *
	 * @param {number} index
	 * @returns {Bitboard}
	 */
	get(index) {
		if (index < 0 || index >= this.#map.length) {
			return undefined;
		} else {
			return this.#map[index];
		}
	}

	/**
	 *
	 * @param {number} index
	 * @returns {boolean}
	 */
	containsKey(index) {
		if (index < 0 || index >= this.#map.length) {
			return false;
		} else {
			return this.#map[index] != null;
		}
	}

	clear() {
		for (let i = 0; i < this.#map.length; i++) {
			this.#map[i] = undefined;
		}
	}
}

class MagicNumbers {
	/**
	 * @type {Combinator}
	 */
	#combinator;
	/**
	 * @type {MagicHasher}
	 */
	#hasher;
	/**
	 * @type {Array<Bitboard>}
	 */
	#magicNumbersArray;
	/**
	 * @type {Array<Array<Bitboard>>}
	 */
	#perfectHashMaps;
	/**
	 * @type {FastFailBitboardMap}
	 */
	#map;
	/**
	 * @type {Array<number>}
	 */
	#directionIndexes;
	/**
	 * @type {Random}
	 */
	#random;

	/**
	 * 
	 * @param {Combinator} combinator 
	 * @param {MagicHasher} hasher 
	 * @param {number} capacity 
	 * @param {Array<number>} directionIndexes 
	 * @param {Random} random 
	 */
	constructor(combinator, hasher, capacity, directionIndexes, random) {
		this.#combinator = combinator;
		this.#hasher = hasher;
		this.#perfectHashMaps = new Array(64);
		this.#map = new FastFailBitboardMap(capacity);
		this.#directionIndexes = directionIndexes;
		this.#random = random;
	}

	/**
	 *
	 * @param {MatrixUtil} matrixUtil
	 * @param {Function} computeVisible
	 */
	calculate(matrixUtil, computeVisible) {
		const magicNumbers = new Map();
		for (let square = 0; square < 64; square++) {
			const combinations = this.#combinator.compute(
				square,
				this.#directionIndexes
			);
			while (true) {
				let magicNumber = BigInt(prime(32, this.#random));
				if (magicNumber < 0n) {
					magicNumber = -magicNumber;
				}
				magicNumber = bitboardFromBigInt(magicNumber);
				this.#map.clear();
				let isMagic = true;
				for (let combination of combinations) {
					const directions = matrixUtil.queenMegaMatrix[square];
					const visible = computeVisible(
						square,
						this.#directionIndexes,
						directions,
						bitboardFromBigInt(0n),
						combination
					);
					const index = this.#hasher.hash(combination, magicNumber, square);
					if (this.#map.containsKey(index)) {
						if (!this.#map.get(index).equals(visible)) {
							isMagic = false;
						}
					} else {
						this.#map.put(index, visible);
					}
				}
				if (isMagic) {
					magicNumbers.put(square, magicNumber);
					this.#perfectHashMaps[square] = this.#map.toArray();
					break;
				}
			}
		}
		this.#magicNumbersArray = new Array(magicNumbers.size());
		for (let entry of magicNumbers.entries()) {
			this.#magicNumbersArray[entry[0]] = entry[1];
		}
	}

	/**
	 *
	 * @param {number} square
	 * @param {Bitboard} occupied
	 * @returns {Bitboard}
	 */
	visibleHashed(square, occupied) {
		var magic = this.#magicNumbersArray[square];
		var hash = this.#hasher.hash(occupied, magic, square);
		var result = this.#perfectHashMaps[square][hash];
		return result ? bitboardFromBigInt(0n) : result;
	}
}
