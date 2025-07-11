import { Bean } from "./Bean.js";
import { Bitboard } from "./Bitboard.js";
import { getLogger } from "./loggers.js";
import { numberOfTrailingZeros } from "./internal.js";
import { MatrixUtil } from "./MatrixUtil.js";
import { bitboardFromBigInt } from "./bitboards.js";
import { Random } from "./Random.js";

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
    VisibleMetrics.logger.instantiation();
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
  getVisible(square, index, direction, friends, enemies) {
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
  }

  /**
   *
   * @param {number} square
   * @param {Array<number>} directionsIndexes
   * @param {Array<Array<number>>} directions
   * @param {Bitboard} friends
   * @param {Bitboard} enemies
   * @returns {Bitboard}
   */
  computeVisible(square, directionsIndexes, directions, friends, enemies) {
    let moves = bitboardFromBigInt(0n);
    for (let index of directionsIndexes) {
      moves = moves.or(
        this.getVisible(square, index, directions[index], friends, enemies)
      );
    }
    return moves;
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
}
