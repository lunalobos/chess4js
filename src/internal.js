import { Square } from "./Square";

export const bitboardMask = mask64();

/**
 *
 * @returns {BigInt}
 */
function mask64() {
  return BigInt("0b" + "1".repeat(64));
}

const intMask = mask32();

/**
 *
 * @returns {BigInt}
 */
function mask32() {
  return BigInt("0b" + "1".repeat(32));
}

/**
 *
 * @param {number} i
 * @returns {number}
 */
function numberOfTrailingZeros(i) {
  // HD, Count trailing 0's
  i = ~i & (i - 1);
  if (i <= 0) return i & 32;
  let n = 1;
  if (i > 1 << 16) {
    n += 16;
    i >>>= 16;
  }
  if (i > 1 << 8) {
    n += 8;
    i >>>= 8;
  }
  if (i > 1 << 4) {
    n += 4;
    i >>>= 4;
  }
  if (i > 1 << 2) {
    n += 2;
    i >>>= 2;
  }
  return n + (i >>> 1);
}

/**
 *
 * @param {BigInt} i
 * @returns
 */
export function numberOfTrailingZerosBigInt(i) {
  let x = Number(i & intMask);
  return x == 0
    ? 32 + numberOfTrailingZeros(Number(i >> 32n).valueOf())
    : numberOfTrailingZeros(Number(x).valueOf());
}

/**
 *
 * @param {BigInt} i
 * @returns {number}
 */
export function bitCount(i) {
  i = i - ((i >> 1n) & BigInt("0x5555555555555555"));
  i =
    (i & BigInt("0x3333333333333333")) +
    ((i >> 2n) & BigInt("0x3333333333333333"));
  i = (i + (i >> 4n)) & BigInt("0x0f0f0f0f0f0f0f0f");
  i = i + (i >> 8n);
  i = i + (i >> 16n);
  i = i + (i >> 32n);
  return Number(i & BigInt("0x7f")).valueOf();
}

/**
 * 
 * @param {BigInt} i 
 * @returns {BigInt}
 */
export function signum(i) {
    return (i >> 63n) | (-i >>> 63n);
}
