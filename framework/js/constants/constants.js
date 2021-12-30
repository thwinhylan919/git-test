define([], function() {
    "use strict";

    /**
     * Below Global Variable contains all the application level constants.
     * @namespace ApplicationConstants
     * @global
     */
    const CONSTANTS = {
        userSegment: null,
        currentServerDate: new Date(0),
        timezoneOffset: 0,
        currentEntity: null,
        jsonContext: null,
        bankConfig: null,
        localization: null
    };

    return Object.seal(CONSTANTS);
});