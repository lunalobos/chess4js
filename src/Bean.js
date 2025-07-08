

/**
 * Basic bean class for dependency injection.
 */
export class Bean {
    #name;
    
    /**
     * Creates a new Bean instance.
     *
     * @param {string} name - The name of this Bean.
     */
    constructor(name){
        this.#name = name;
    }

    /**
     * Returns the name of this Bean.
     * @returns {string} The name of this Bean.
     */
    name(){
        return this.#name;
    }
}