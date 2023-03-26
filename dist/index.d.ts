/**
 * Takes a list of SVG path strings and returns an object
 * that can be used to easily morph between them.
 *
 * To be used in combination with `morph()`, e.g.:
 * ```typescript
 * const paths = compile(['M0,0 L100,100', 'M5,5 L250,50'])
 *
 * // Get the path halfway between the two paths
 * const between = morph(paths, [0.5, 0.5])
 * document.getElementById('myPath').setAttribute('d', between)
 * ```
 *
 * @param paths SVG path strings. Each string must be
 * a variation of the same path, i.e. same number of commands in the same order.
 * The command parameters may vary as needed.
 * @returns A object containing:
 * 1. `commands`: An array of path commands,
 * 2. `average`: An array of command parameters as averaged between all passed paths, and
 * 3. `diffs`: An array of command parameters as relative to the average for each path provided in `paths`
 */
export declare const compile: (paths: string[]) => {
    commands: string[];
    average: number[][];
    diffs: number[][][];
};
/**
 * Takes a compiled paths object (see `compile()`) and a list of weights
 * and returns a morphed path as a weighted combination of the paths.
 *
 * ```typescript
 * // Provided two variations of the same path
 * const angryFace = 'M0,0 L100,100...'
 * const happyFace = 'M0,0 L100,100...'
 *
 * const paths = compile([angryFace, happyFace])
 *
 * // Get the path halfway between the two paths, i.e. 50% angry, 50% happy
 * const neutralFace = morph(paths, [0.5, 0.5])
 * ```
 * @param compiled The compiled paths object (see `compile()`)
 * @param weights An array of weights, one for each path in the compiled object.
 * @returns The weighted combination of the compiled paths as an SVG path string.
 */
export declare const morph: (compiled: ReturnType<typeof compile>, weights: number[]) => string;
