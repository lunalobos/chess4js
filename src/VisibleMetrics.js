import { Bean } from "./Bean";
import { getLogger } from "./loggers";
import { numberOfTrailingZeros } from "./internal";
import { MatrixUtil } from "./MatrixUtil";
import { bitboardFromBigInt } from "./bitboards";

export class VisibleMetrics extends Bean {
	static logger = getLogger("VisibleMetrics");
	#matrixUtil;
	#random;
	#visibleOptions;
	#trailingZeros;
	/**
	 *
	 * @param {MatrixUtil} matrixUtil
	 * @param {*} random
	 */
	constructor(matrixUtil, random) {
		this.#matrixUtil = matrixUtil;
		this.#random = random;
		this.#visibleOptions = new Array(64);
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
	}
}
