define([
    "jquery",
    "baseService"
], function ($, BaseService) {
    "use strict";

    const corporateDetailsModel = function () {
        const baseService = BaseService.getInstance(),
            Model = function () {
                this.applicantDetails = {
                    customerName: "",
                    shortName: "",
                    dateOfIncorporation: null,
                    countryOfIncorporation: "IN",
                    pan: null,
                    addressLine1: "",
                    addressLine2: "",
                    addressLine3: "",
                    addressLine4: "",
                    constitutionId: null,
                    fax: null,
                    homeBranch: null,
                    telephoneNumber: "",
                    email: null,
                    externalCreditCheckRequired: null,
                    kycRequired: false,
                    remarks: null,
                    typeofFirm: null,
                    customerRMname: null,
                    customerNumber: "",
                    creditApprovalCheck: false,
                    legalStatus: "LC",
                    applicantContact: [],
                    applicantDetailsDocument: []
                };

                this.applicantContact = {
                    name: "",
                    designation: "",
                    addressType: "",
                    addressLine1: "",
                    addressLine2: "",
                    addressLine3: "",
                    city: "",
                    email: "",
                    telephoneNumber: "",
                    faxNumber: "",
                    principalContactFlag: null,
                    applicantDetailId: "",
                    telephonePreferred: "",
                    emailPreferred: null,
                    faxPreferred: null,
                    addressPreferred: null
                };

                this.basicapplicationDetails = {
                    applicationBranch: "004",
                    applicationChannel: "Brnch",
                    applicationDate: "",
                    applicationSubmittedBy: "",
                    businessProductCode: "",
                    customerName: "",
                    customerNumber: "",
                    customerType: "E",
                    email: "",
                    facilityDetails: null,
                    lifeCycleCode: "LoanOrig",
                    loanPurpose: "TERM_LOAN",
                    name: "",
                    priority: "H"
                };
            };

        this.getNewModel = function () {
            return new this.Model();
        };

        let allPartyDetailsDeferred;
        const allPartyDetails = function (deferred) {
            const options = {
                url: "me/party",
                success: function (data) {
                    deferred.resolve(data);
                },
                error: function (data) {
                    deferred.reject(data);
                }
            };

            baseService.fetch(options);
        };

        let listUserPartiesDeferred;
        const listUserParties = function (deferred) {
            const options = {
                url: "me/party/relations",
                success: function (data) {
                    deferred.resolve(data);
                },
                error: function (data) {
                    deferred.reject(data);
                }
            };

            baseService.fetch(options);
        };
        let fetchPartyDetailsDeferred;
        const fetchPartyDetails = function (deferred, partyId) {
            const options = {
                    url: "me/party/relations/{partyId}",
                    success: function (data) {
                        deferred.resolve(data);
                    },
                    error: function (data) {
                        deferred.reject(data);
                    }
                },
                params = {
                    partyId: partyId
                };

            baseService.fetch(options, params);
        };

        return {
            getNewModel: function (modelData) {
                return new Model(modelData);
            },

            listUserParties: function () {
                listUserPartiesDeferred = $.Deferred();
                listUserParties(listUserPartiesDeferred);

                return listUserPartiesDeferred;
            },

            fetchPartyDetails: function (partyId) {
                fetchPartyDetailsDeferred = $.Deferred();
                fetchPartyDetails(fetchPartyDetailsDeferred, partyId);

                return fetchPartyDetailsDeferred;
            },

            allPartyDetails: function () {
                allPartyDetailsDeferred = $.Deferred();
                allPartyDetails(allPartyDetailsDeferred);

                return allPartyDetailsDeferred;
            }
        };
    };

    return new corporateDetailsModel();
});