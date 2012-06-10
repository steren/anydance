define(function() {
    "use strict";
    
    /** duration between two comparison*/
    var COMPAREDURATION = 5000;

    return {
        COMPAREDURATION : COMPAREDURATION,
        
        // max score depends on the COMPAREDURATION;
        MAX_RANGESCOREQUALITY_PERFECT : 0.002 * COMPAREDURATION,
        MAX_RANGESCOREQUALITY_EXCELLENT : 0.1 * COMPAREDURATION,
        MAX_RANGESCOREQUALITY_GOOD : 0.2 * COMPAREDURATION,
        MAX_RANGESCOREQUALITY_OK :0.4  * COMPAREDURATION
    };
});