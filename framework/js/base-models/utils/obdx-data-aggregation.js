define([
        "base-models/utils/background-tasks",
        "baseService",
        "framework/js/configurations/config"
    ],
    function(EnqueueBackgroundTasks, BaseService, Configurations) {
        "use strict";

        const events = [],
            baseService = BaseService.getInstance(),
            maxEventThreshold = Configurations.analytics.obdxAnalytics.eventsThreshold,
            inactivityTimeout = Configurations.analytics.obdxAnalytics.inactivityTimeout,
            checkOverFlow = function() {
                return events.length >= maxEventThreshold;
            },
            getNonceHeader = function(isSync) {
                if (isSync) {
                    const nonce = baseService.props("nonceKeys").pop();

                    if (nonce) {
                        return {
                            "x-nonce": nonce
                        };
                    }
                }

                return {
                    "x-nonce": null
                };
            },
            postAnalytics = function(isSync, data) {
                if (!Array.isArray(data) || !Configurations.analytics.obdxAnalytics.enabled) {
                    return Promise.resolve();
                }

                isSync = isSync || false;

                return baseService.batch({
                    url: "batch",
                    showMessage: false,
                    async: !isSync,
                    headers: Object.assign({}, getNonceHeader(isSync))
                }, null, {
                    batchDetailRequestList: data.map(function(event, index) {
                        return {
                            methodType: "POST",
                            payload: JSON.stringify(event),
                            headers: Object.assign({
                                "Content-Type": "application/json",
                                "Content-Id": index
                            }, getNonceHeader(isSync)),
                            uri: {
                                value: "/analytics"
                            }
                        };
                    })
                }).then(function() {
                    events.length = 0;
                });
            },
            pushAggregatedData = postAnalytics.bind(null, false),
            flush = postAnalytics.bind(null, true);

        function OBDXDataAggregation() {
            window.onunload = function() {
                events.push({
                    event: "UNLOAD"
                });

                flush(events);
            };

            setInterval(function() {
                if (events.length) {
                    pushAggregatedData(events);
                }
            }, inactivityTimeout);
        }

        OBDXDataAggregation.prototype.addEvent = function(event) {
            events.push(event);

            if (checkOverFlow()) {
                EnqueueBackgroundTasks(function() {
                    pushAggregatedData(events);
                });
            }
        };

        OBDXDataAggregation.prototype.pushAggregatedData = pushAggregatedData.bind(null, events);

        return new OBDXDataAggregation();
    });