define(["baseService"], function (BaseService) {
    "use strict";

    const Model = function () {
        const baseService = BaseService.getInstance();

        return {
            mepartyget: function () {
                const params = {},
                    options = {
                        url: "/me/party",
                        version: "v1"
                    };

                return baseService.fetch(options, params);
            },
            counterpartypost: function (payload) {
                const options = {
                    url: "supplyChainFinance/associatedParties",
                    version: "v1",
                    data: payload
                };

                return baseService.add(options);
            },
            countryget: function () {
                const params = {},
                    options = {
                        url: "/enumerations/country",
                        version: "v1"
                    };

                return baseService.fetch(options, params);
            },
            stateget: function (countryCode) {
                const params = {
                        countryCode: countryCode
                    },

                    options = {
                        url: "/enumerations/country/{countryCode}/state",
                        version: "v1"
                    };

                return baseService.fetch(options, params);
            },
            corporatecategoryget: function () {
                const params = {},
                    options = {
                        url: "/scfApplicationParams?key=NON_CUSTOMER_CATEGORY",
                        version: "ext/v1"
                    };

                return baseService.fetch(options, params);
            },
            getNewModel: function () {
                return {
                    category: null,
                    categoryDesc: null,
                    onboarded: false,
                    emailId: null,
                    mobileNumber: null,
                    countryCode: null,
                    name: null,
                    phoneNumber: null,
                    preferredModeOfCommunication: "EMAIL",
                    corporateRegistrationNumber: null,
                    shortName: null,
                    taxRegistrationNumber: null,
                    address: {
                        line1: "",
                        line2: "",
                        city: "",
                        state: "",
                        stateName: "",
                        country: "",
                        countryName: "",
                        zipCode: ""
                    }
                };
            }
        };
    };

    return new Model();
});