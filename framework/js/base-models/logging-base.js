/**
 * This is the logger for the OBDX Framework.
 * @module baseLogger
 * @requires ojs/ojcore
 */
define([
    "ojs/ojcore",
    "framework/js/configurations/config"
], function(oj, Configuration) {
    "use strict";

    /**
     * @summary This is the constructor for the logger.
     * @class
     * @alias BaseLogger
     * @memberof module:baseLogger
     * @requires ojs/ojcore
     * @description This constructor returns three methods:<br><br>
     * <code>info</code> : Used as <code>Logger.info</code>, where <code>Logger</code> is the instance of <code>BaseLogger</code>.<br><br>
     * <code>error</code> : Used as <code>Logger.error</code>, where <code>Logger</code> is the instance of <code>BaseLogger</code>.<br><br>
     * <code>warn</code> : Used as <code>Logger.warn</code>, where <code>Logger</code> is the instance of <code>BaseLogger</code>.<br><br>
     */
    const BaseLogger = function() {
        oj.Logger.option("level", oj.Logger[Configuration.system.loggingLevel] || oj.Logger.LEVEL_ERROR);

        return {
            info: oj.Logger.info,
            error: oj.Logger.error,
            warn: oj.Logger.warn
        };
    };

    return new BaseLogger();
});