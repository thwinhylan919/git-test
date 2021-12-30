define(["base-models/utils/background-tasks"], function (EnqueueBackgroundTasks) {
    "use strict";

    const performance = window.performance,
        latency = Object.freeze({
            FAST: 0,
            AVERAGE: 1,
            SLOW: 2
        }),
        ectWindow = {
            "slow-2g": latency.SLOW,
            "2g": latency.SLOW,
            "3g": latency.AVERAGE,
            "4g": latency.FAST
        },
        latencyRecords = [],
        effectiveConnectionType = window.NetworkInformation && navigator.connection instanceof NetworkInformation && navigator.connection.effectiveType;

    function simpleMovingAverage(array, parseCurrentValue) {
        parseCurrentValue = parseCurrentValue || function (params) {
            return params;
        };

        return array.reduce(function (weightedMean, currentValue, index) {
            return weightedMean + ((parseCurrentValue(currentValue) - weightedMean) / (index + 1));
        }, 0);
    }

    function parseLatencyMillis(averageLatency) {
        if (averageLatency < 100) {
            return latency.FAST;
        }

        if (averageLatency < 300 && averageLatency >= 100) {
            return latency.AVERAGE;
        }

        if (averageLatency >= 300) {
            return latency.SLOW;
        }
    }

    function computeNetworkLatency() {
        if (effectiveConnectionType) {
            return ectWindow[effectiveConnectionType];
        }

        latencyRecords.push(parseLatencyMillis(simpleMovingAverage(performance.getEntriesByType("resource"), function (currentValue) {
            return currentValue.responseEnd - currentValue.startTime;
        })));

        performance.clearResourceTimings();

        return Math.ceil(simpleMovingAverage(latencyRecords));
    }

    function queueResources(arrayOfResources) {
        return new Promise(function (resolve) {
            EnqueueBackgroundTasks(function () {
                require(arrayOfResources, function () {
                    resolve();
                });
            });
        });
    }

    return function (arrayOfResources) {
        const negotiatedNetworkLatency = computeNetworkLatency() || latency.FAST;

        switch (negotiatedNetworkLatency) {
            case latency.FAST:
                return queueResources(arrayOfResources);
            case latency.AVERAGE:
                return queueResources(arrayOfResources.slice(0, arrayOfResources.length / 3))
                    .then(function () {
                        return queueResources(arrayOfResources.slice(arrayOfResources.length / 3, 2 * arrayOfResources.length / 3));
                    })
                    .then(function () {
                        return queueResources(arrayOfResources.slice(2 * arrayOfResources.length / 3));
                    });
            case latency.SLOW:
                return arrayOfResources.reduce(function (lastPromise, resource) {
                    return lastPromise.then(function () {
                        return queueResources([resource]);
                    });
                }, Promise.resolve());
        }
    };
});