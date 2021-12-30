define(["build.fingerprint"], function(BuildFingerPrint) {
    "use strict";

    const configurations = {
        i18n: {
            rtlLocales: ["ar", "he", "ku", "fa", "ur", "dv", "ha", "ps", "yi"]
        },
        sharding: {
            imageResourcePath: "./images",
            apiBaseURL: "",
            webHelpContentURL : ""
        },
        serviceWorker: {
            enabled: true
        },
        authentication: {
            type: "OBDXAuthenticator",
            providerURL: "",
            pages: {
                securePage: "home.html",
                publicPage: "index.html"
            }
        },
        thirdPartyAPIs: {
            facebook: {
                url: "",
                sdkURL: "",
                apiKey: ""
            },
            linkedin: {
                sdkURL: "",
                apiKey: ""
            },
            googleMap: {
                url: "https://maps.googleapis.com/maps/api/js?key=AIzaSyBI_XBvJpxCrH0SKzgYu0R7HUJSe3tpt94&libraries=geometry,places",
                sdkURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyBI_XBvJpxCrH0SKzgYu0R7HUJSe3tpt94&libraries=geometry,places",
                apiKey: "AIzaSyBI_XBvJpxCrH0SKzgYu0R7HUJSe3tpt94"
            }
        },
        oracleJet: {
            hostedAt: "cdn",
            baseUrl: "https://static.oracle.com/cdn/jet/",
            version: "7.1.0"
        },
        apiCatalogue: {
            base: {
                contextRoot: "digx",
                defaultVersion: "v1"
            },
            extended: {
                contextRoot: "digx/ext",
                defaultVersion: "v1"
            },
            social: {
                contextRoot: "digx-social",
                defaultVersion: "v1"
            },
            "digx-auth": {
                contextRoot: "digx-auth/ext",
                defaultVersion: "v1"
            },
            "digx-auth-extended": {
                contextRoot: "digx-auth",
                defaultVersion: "v1"
            }
        },
        system: {
            componentAccessControlEnabled: true,
            requestThrottleSeconds: 5,
            defaultEntity: "",
            sslEnabled: false,
            loggingLevel: "LEVEL_ERROR",
            buildTimestamp: BuildFingerPrint.timeStamp
        },
        analytics: {
            thirdPartyAnalytics: {
                enabled: false,
                analyticsProvider: ""
            },
            obdxAnalytics: {
                enabled: false,
                eventsThreshold: 5,
                inactivityTimeout: 10 * 60 * 1000
            }
        },
        development: {
            enabled: true,
            checkAccessibility: false,
            axeUrl: "https://cdnjs.cloudflare.com/ajax/libs/axe-core/3.3.2/axe.min.js"
        }
    };

    function deepFreeze(object) {
        const propNames = Object.getOwnPropertyNames(object);

        propNames.forEach(function(item) {
            const value = object[item];

            object[item] = value && typeof value === "object" ? deepFreeze(value) : value;
        });

        return Object.freeze(object);
    }

    return deepFreeze(configurations);
});