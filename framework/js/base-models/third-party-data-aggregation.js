define(["framework/js/configurations/config"], function(Configurations) {
    "use strict";

    let returnedPromise;

    function WebAnalytics(resolve) {
        const self = this,
            behaviours = {};

        self.callBehaviour = function() {
            if (behaviours[arguments[0]]) {
                const args = [].slice.call(arguments).splice(1);

                return behaviours[arguments[0]].apply(this, args);
            }

            return null;
        };

        if (Configurations.analytics.thirdPartyAnalytics.enabled) {
            require(["third-party-data-aggregation/" + Configurations.analytics.thirdPartyAnalytics.analyticsProvider], function(operations) {
                Object.assign(behaviours, operations);
                resolve(self.callBehaviour);
            }, function() {
                //Analytic Engine not found.
                resolve(self.callBehaviour);
            });
        } else {
            resolve(self.callBehaviour);
        }
    }

    const generatePromise = function() {
        return new Promise(function(resolve) {
            new WebAnalytics(resolve);
        });
    };

    return {
        getInstance: function() {
            if (returnedPromise) {
                return returnedPromise;
            }

            return returnedPromise = generatePromise();
        }
    };
});