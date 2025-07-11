import { Bean } from "./Bean.js"
import { getLogger } from "./loggers.js"
/**
 * A random number generator.
 */
export class Random extends Bean{
    static logger = getLogger("Random");
    #maxValue;
    constructor(bitLength = 16){
        super("Random");
        if(bitLength < 1 || bitLength > 53){
            throw new Error("bitLength must be between 1 and 53");
        }
        this.#maxValue = Math.pow(2, bitLength) - 1;
    }

    /**
     * Generates a random integer between 0 (inclusive) and the maximum value
     * configured when the Random instance was created (exclusive).
     * 
     * @return {number} A random integer between 0 and the maximum value configured
     * when the Random instance was created (exclusive).
     */
    nextInt(){
        return Math.floor(Math.random() * this.#maxValue);
    }
}