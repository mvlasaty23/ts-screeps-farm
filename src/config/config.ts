export namespace Config {

    // APPLICATION CORE CONFIGURATION
    /**
     * Enable this if you want a lot of text to be logged to console.
     * @type {boolean}
     */
    export const VERBOSE: boolean = false;

    // // APPLICATION GAMEPLAY CONFIGURATION
    // /**
    //  * @type {number}
    //  */
    // export const MAX_HARVESTERS: number = 3;
    // /**
    //  * @type {number}
    //  */
	// export const MAX_UPGRADERS: number = 3;
    // /**
    //  * @type {number}
    //  */
	// export const MAX_MAINTAINERS: number = 0;
    // /**
    //  * @type {number}
    //  */
	// export const MAX_HARVESTERCONTAINERS: number = 0;
    // /**
    //  * @type {number}
    //  */
	// export const MAX_HARVESTERTOWER: number = 1;
    // /**
    //  * @type {number}
    //  */
	// export const MAX_BUILDERS: number = 1;

    // /**
    //  * Default amount of minimal ticksToLive Screep can have, before it goes to renew.
    //  * @type {number}
    //  */
    // export const DEFAULT_MIN_LIFE_BEFORE_NEEDS_REFILL: number = 400;

    // /**
    //  * Default amount of maximal ticksToLive Screep can have, before it goes to finish his renew.
    //  * @type {number}
    //  */
	// export const DEFAULT_MAX_LIFE_UNTIL_REFILL_COMPLETE: number = 1100;

    /**
     * Default amount of maximal synchronous refills.
     * @type {number}
     */
	export const DEFAULT_MAX_RENEW_COUNT: number = 3;
}
