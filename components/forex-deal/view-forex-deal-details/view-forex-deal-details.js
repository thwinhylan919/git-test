/**
 * Fetches the Details of a particular Deal selected.
 *
 * @module nominee
 * @requires {ojcore} oj
 * @requires {knockout} ko
 * @requires {jquery} $
 * @requires {object} viewForexDealDetailsModel
 * @requires {object} ResourceBundle
 */
define([
    "ojs/ojcore",
    "knockout",
    "jquery",
        "./model",
    "ojL10n!resources/nls/view-forex-deal-list",
    "promise",
    "ojs/ojlistview",
    "ojs/ojselectcombobox",
    "ojs/ojtable",
    "ojs/ojarraytabledatasource",
    "ojs/ojpagingtabledatasource",
    "ojs/ojdatacollection-utils",
    "ojs/ojarraytabledatasource",
    "ojs/ojknockout-validation",
    "ojs/ojbutton",
    "ojs/ojchart"
], function(oj, ko, $, viewForexDealDetailsModel, ResourceBundle) {
    "use strict";

    /**
     * User should see the landing page with Details of particular deal selected from the list.
     *
     * @param {Object}  rootParams  - An object which contains content of dashboard and param values.
     * @return {Function} Function.
     */
    return function(rootParams) {
        const self = this;

        ko.utils.extend(self, rootParams.rootModel);
        self.resource = ResourceBundle;

        if (self.params.reviewMode) {
            rootParams.dashboard.headerName(self.resource.viewForexDeal.header);
        }

        self.dataSourceLoaded = ko.observable(false);
        self.dealAmount = ko.observable();
        self.availableAmount = ko.observable();
        self.dealAmountCurrency = ko.observable();
        self.partyName = ko.observable();
        self.pieSeriesValue = ko.observableArray();
        self.paymentDealsDataSource = ko.observable();
        self.dealData = ko.observableArray([]);
        self.showReversal = ko.observable();
        rootParams.baseModel.registerElement(["row", "date-time", "confirm-screen"]);
        rootParams.baseModel.registerComponent("view-forex-deal", "forex-deal");

        const statusTypeMap = {},
            dealTypeMap = {},
            rateTypeMap = {};
        let confirmScreenDetailsArray,
            utilizationStatustypes = {};

        /**
         * This function will convert Expiry Date and Booking Date in Time to find the difference between both
         * and then calculate the validity period of the Deal.
         *
         * @memberOf view-forex-deal-details
         * @param {string} customBookingDate - Booking date.
         * @param {string} customValueDate - Expiry date.
         * @function customDateHandler
         * @returns {diffDays} Validity period.
         */
        self.customDateHandler = function(customBookingDate, customValueDate) {

            const valueDate = new Date(customValueDate),
                bookingDate = new Date(customBookingDate),
                timeDiff = Math.abs(valueDate.getTime() - bookingDate.getTime()),
                diffDays = Math.round(timeDiff / (1000 * 3600 * 24));

            return diffDays;
        };

        /**
         *  This function will allow the user to reverse a forex deal  when the user is either a Maker or .
         *  AutoAuth.
         *
         *  @memberOf review-forex-deal-create
         * @param {Object} data  - - - - - - - - - - - - - An object containing the current event of field.
         * @param {Object} status  An object containing the current event of field.
         * @param {object} jqXHR  An object containing the current event of field.
         *  @function confirmReverseForexDeal
         *  @returns {void}
         */
        function confirmReverseForexDeal(data, status, jqXHR) {
            self.httpStatus = jqXHR.status;

            let statusMessages, successMessage;

            if (self.httpStatus && self.httpStatus === 202) {
                successMessage = self.resource.confirmScreen.approvalMessages.PENDING_APPROVAL.successmsg;
                statusMessages = self.resource.confirmScreen.approvalMessages.PENDING_APPROVAL.statusmsg;
            } else if (self.httpStatus && (self.httpStatus === 201 || self.httpStatus === 200)) {
                successMessage = self.resource.confirmScreen.successMessage;
                statusMessages = self.resource.confirmScreen.approvalMessages.APPROVED.statusmsg;
            }

            rootParams.dashboard.loadComponent("confirm-screen", {
                jqXHR: jqXHR,
                hostReferenceNumber: data.forexDealDTO ? data.forexDealDTO.dealId : null,
                transactionName: self.resource.viewForexDeal.confirmheader,
                confirmScreenExtensions: {
                    statusMessages: statusMessages,
                    successMessage: successMessage,
                    isSet: true,
                    taskCode: "FX_M_DFX",
                    confirmScreenDetails: confirmScreenDetailsArray,
                    template: "confirm-screen/forex-deal-template"
                }
            });
        }

        /**
         * This function will be called to fetch utilization status type.
         *
         * @memberOf view-forex-deal-details
         * @function getUtilizationStatus
         * @param {string} status  - A string to represent utilization status type.
         * @returns {string} Description  A utilization status description of provided status type.
         */
        function getUtilizationStatus(status) {
            return ko.utils.arrayFirst(utilizationStatustypes, function(element) {
                return element.code === status;
            }).description;
        }

        /**
         *  This function will allow the user to reverse a forex deal booking when the user is either a Maker or .
         *  AutoAuth.
         *
         *  @memberOf view-forex-deal-details
         *  @function reverseConfirm
         *  @returns {void}
         */
        self.reverseConfirm = function() {
            $("#reverse-deal").trigger("openModal");
        };

        /**
         *  This function will allow the user to revrse a forex deal  when the user is either a Maker or AutoAuth.
         *
         *  @memberOf view-forex-deal-details
         *  @function reverseClose
         *  @returns {void}
         */
        self.reverseClose = function() {
            $("#reverse-deal").trigger("closeModal");
        };

        const dealId = ko.utils.unwrapObservable(self.params.dealId || self.params.data.dealId);
        let swapDealId;

        /**
         *  This function will allow the user to revrse a forex deal  when the user is either a Maker or AutoAuth.
         *
         *  @memberOf view-forex-deal-details
         *  @function dealUtilizationDetails
         *  @param {Object} dealId - It contains the dealId.
         *  @returns {void}
         */
        function dealUtilizationDetails(dealId) {
            viewForexDealDetailsModel.fetchDealUtilization(dealId).then(function(data) {
                self.dealAmount(self.dealData().deal.rateType === "B" ? self.dealData().deal.buyAmount.amount : self.dealData().deal.sellAmount.amount);
                self.availableAmount(self.dealData().deal.availableAmount.amount);
                self.dealAmountCurrency(self.dealData().deal.rateType === "B" ? self.dealData().deal.buyAmount.currency : self.dealData().deal.sellAmount.currency);

                self.pieSeriesValue([{
                        name: self.resource.viewForexDeal.utilizedAmount,
                        items: [self.dealAmount() - self.availableAmount()]
                    },
                    {
                        name: self.resource.viewForexDeal.availableAmount,
                        items: [self.availableAmount()]
                    }
                ]);

                if ((self.dealAmount() - self.availableAmount()) === 0) {
                    self.showReversal(true);
                } else {
                    self.showReversal(false);
                }

                const utilizedDealDetails = $.map(data.utilizationDetails, function(a) {
                    const dealUtilizationObj = {
                        dealNumber: a.dealId,
                        transactionDate: a.valueDate,
                        amount: a.amount.amount,
                        currency: a.amount.currency,
                        description: a.remarks,
                        paymentId: a.paymentId,
                        debitAccountId: a.debitAccountId.displayValue,
                        creditAccountId: a.creditAccountId.displayValue,
                        utilizationStatusDescription: getUtilizationStatus(a.status)
                    };

                    return dealUtilizationObj;
                });

                self.paymentDealsDataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(utilizedDealDetails, {
                    idAttribute: ["paymentId"]
                }) || []));

                confirmScreenDetailsArray = [
                    [{
                        label: self.resource.viewForexDeal.dealType,
                        value: self.dealData().dealType
                    }],
                    [{
                        label: self.resource.viewForexDeal.trnscType,
                        value: self.dealData().rateType
                    }],
                    [{
                        label: self.resource.viewForexDeal.amount,
                        value: rootParams.baseModel.formatCurrency(self.dealAmount(), self.dealAmountCurrency ())
                    },{
                        label: self.resource.viewForexDeal.exchgRate,
                        value: self.dealData().deal.rate.amount
                    }]
                ];

                self.dataSourceLoaded(true);

                if (self.confirmScreenExtensions) {
                    ko.utils.extend(self.confirmScreenExtensions, {
                        isSet: true,
                        taskCode: "FX_M_DFX",
                        confirmScreenDetails: confirmScreenDetailsArray,
                        confirmScreenMsgEval: self.getConfirmScreenMsg,
                        confirmScreenStatusEval: self.getConfirmScreenStatus,
                        template: "confirm-screen/forex-deal-template"
                    });
                }
            });
        }

        self.getConfirmScreenMsg = function(jqXHR) {
            if (jqXHR.responseJSON.transactionAction && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.status === "F" && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.currentStep === "exec") {
                return self.resource.confirmScreen.approvalMessages.FAILED.successmsg;
            } else if (jqXHR.responseJSON.transactionAction) {
                return self.resource.confirmScreen.approvalMessages[jqXHR.responseJSON.transactionAction.transactionDTO.approvalDetails.status].successmsg;
            }
        };

        self.getConfirmScreenStatus = function(jqXHR) {
            if (jqXHR.responseJSON.transactionAction && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.status === "F" && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.currentStep === "exec") {
                return self.resource.confirmScreen.approvalMessages.FAILED.statusmsg;
            } else if (jqXHR.responseJSON.transactionAction) {
                return self.resource.confirmScreen.approvalMessages[jqXHR.responseJSON.transactionAction.transactionDTO.approvalDetails.status].statusmsg;
            }
        };

        /**
         *  This function will allow the user to revrse a forex deal  when the user is either a Maker or AutoAuth.
         *
         *  @memberOf view-forex-deal-details
         *  @function dealData
         *  @param {Object} data - It contains the dealData.
         *  @returns {void}
         */
        function dealData(data) {
            self.dealData({
                deal: data.forexDealDTO,
                dealType: dealTypeMap[data.forexDealDTO.type],
                rateType: rateTypeMap[data.forexDealDTO.rateType],
                status: statusTypeMap[data.forexDealDTO.status]
            });
        }

        /**
         *  This function will allow the user to revrse a forex deal  when the user is either a Maker or AutoAuth.
         *
         *  @memberOf view-forex-deal-details
         *  @function viewDealDetails
         *  @param {Object} dealId - It contains the dealId.
         *  @returns {void}
         */
        function viewDealDetails(dealId) {
            Promise.all([viewForexDealDetailsModel.fetchStatusTypeList(), viewForexDealDetailsModel.fetchDealTypeList(), viewForexDealDetailsModel.fetchRateTypeList(), viewForexDealDetailsModel.fetchPartyDetails(), viewForexDealDetailsModel.fetchForexDeal(dealId), viewForexDealDetailsModel.fetchDealUtilizationStatusType()]).then(function(data) {
                for (let i = 0; i < data[0].enumRepresentations[0].data.length; i++) {
                    statusTypeMap[data[0].enumRepresentations[0].data[i].code] = data[0].enumRepresentations[0].data[i].description;
                }

                for (let j = 0; j < data[1].enumRepresentations[0].data.length; j++) {
                    dealTypeMap[data[1].enumRepresentations[0].data[j].code] = data[1].enumRepresentations[0].data[j].description;
                }

                for (let k = 0; k < data[2].enumRepresentations[0].data.length; k++) {
                    rateTypeMap[data[2].enumRepresentations[0].data[k].code] = data[2].enumRepresentations[0].data[k].description;
                }

                self.partyName(data[3].party.personalDetails.fullName);

                if (data[4].forexDealDTO.swap) {
                    swapDealId = data[4].forexDealDTO.swapDealDTO.forexDealDTO.dealId;
                }

                utilizationStatustypes = data[5].enumRepresentations[0].data;

                dealData(data[4]);
                dealUtilizationDetails(dealId);
            });
        }

        viewDealDetails(dealId);

        /**
         *  This function will allow the user to revrse a forex deal  when the user is either a Maker or AutoAuth.
         *
         *  @memberOf view-forex-deal-details
         *  @function viewSwapDetails
         *  @returns {void}
         */
        self.viewSwapDetails = function() {
            if (swapDealId) {
                dealData(self.dealData().deal.swapDealDTO);
                dealUtilizationDetails(swapDealId);
                self.dataSourceLoaded(false);
                ko.tasks.runEarly();
                self.dataSourceLoaded(true);
            }
        };

        /**
         *  This function will allow the user to reverse a forex deal  when the user is either a Maker or .
         *  AutoAuth.
         *
         *  @memberOf view-forex-deal-details
         *  @function reverseForexDeal
         *  @returns {void}
         */
        self.reverseForexDeal = function() {
            viewForexDealDetailsModel.reverseForexDeal(ko.utils.unwrapObservable(self.params.dealId || self.params.data.dealId)).done(function(data, status, jqXHR) {
                confirmReverseForexDeal(data, status, jqXHR);
            });
        };
    };
});