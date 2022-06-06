/// <reference types="@sveltejs/kit" />

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare namespace App {
	// interface Locals {}
	// interface Platform {}
	// interface Session {}
	// interface Stuff {}
}


declare module '@alisey/pcg32' {
  /**
   * Returns a uniformly distributed 32-bit unsigned random integer.
   */
  export function randomInt32(): number;
  /**
   * Returns a uniformly distributed 32-bit unsigned random integer in the range
   * [0, bound).
   */
  export const randomInt: (bound: number) => number;
  /**
   * Returns a uniformly distributed  floating point number in the range [0, 1)
   * that has been rounded down to the nearest multiple of 2⁻⁵³.
   *
   * This includes all possible double-precision floating-point numbers in the
   * range [0.5, 1), but only half of numbers in the range [0.25, 0.5), a quarter
   * of numbers in the range [0.125, 0.25), and so forth, because the floating
   * point format has a higher resolution for numbers closer to zero. This is also
   * the reason why selecting a number from all floating point numbers in the
   * range [0, 1) with equal probability would not result in a uniform
   * distribution.
   *
   * Multiplying the result by 2⁵³ can be used to generate a random integer in the
   * range [0, 2⁵³), but for other ranges of integers it's preferable to use
   * randomInt() because it's more efficient and doesn't introduce a bias due to
   * rounding when the upper bound is not a power of two.
   */
  export const random: () => number;
  /**
   * Updates the internal state of the generator, which has 2⁶⁴ possible internal
   * states, and iterates through all of them.
   * @param state - a 64-bit unsigned BigInt representing the new state.
   */
  export const setState: (state: bigint) => void;
  /**
   * Returns a 64-bit unsigned BigInt representing the internal state of the
   * generator.
   */
  export const getState: () => bigint;
  /**
   * For this generator, there are 2⁶³ possible sequences of pseudorandom numbers.
   * Each sequence is entirely distinct and has a period of 2⁶⁴. This function
   * selects one of the sequences.
   * @param sequence - a 64-bit odd BigInt.
   */
  export const setSequence : (sequence: bigint) => void;
  /**
   * Returns a 64-bit unsigned BigInt representing the selected sequence.
   */
  export const getSequence: () => bigint;

  /**
   * Seeds the generator. If the value is not provided, uses a value based on
   * Math.random().
   * @param value - a 64-bit BigInt.
   */
  export const seed: (value?: bigint) => void;
}
