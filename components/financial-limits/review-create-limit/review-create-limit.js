define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/review-create-limit",
    "ojs/ojknockout-validation",
    "ojs/ojinputtext",
    "ojs/ojbutton",
    "ojs/ojtable",
    "ojs/ojarraytabledatasource",
    "ojs/ojgauge",
    "ojs/ojchart",
    "ojs/ojlistview"
], function(oj, ko, $, ReviewCreateLimitModel, resourceBundle) {
    "use strict";

    return function(rootParams) {
        const self = this;

        ko.utils.extend(self, rootParams.rootModel);
        rootParams.baseModel.registerElement("action-header");
        rootParams.baseModel.registerElement("page-section");
        rootParams.baseModel.registerElement("confirm-screen");
        self.nls = resourceBundle;
        self.transactionLimitSection = ko.observable(false);
        self.cummulativeLimitSection = ko.observable(false);
        self.coolingPeriodLimitSection = ko.observable(false);
        self.loadData = ko.observable(false);
        self.showConfirm = ko.observable(false);
        self.isReview = ko.observable(rootParams.isReview);
        rootParams.dashboard.headerName(self.nls.common.limitheader);
        self.isApprovalReview = ko.observable(false);
        self.httpStatus = ko.observable();
        self.transactionStatus = ko.observable();
        self.limitFlag = ko.observable();
        self.limitId = ko.observable();
        self.limitType = ko.observable();
        self.checkedOption = ko.observable();
        self.reviewCoolingDatasource = ko.observable();
        self.payload = ko.observable();
        self.paramsData = ko.mapping.fromJS(self.params.data);

        if (self.transactionDetails) {
            self.isApprovalReview(true);
            self.isReview(true);
        }

        if (!ko.isObservable(self.paramsData.limitType)) { self.paramsData.limitType = ko.observable(self.paramsData.limitType); }

        self.limitFlag(self.paramsData.limitType());

        if (self.limitFlag() === "TXN") {
            self.transactionLimitSection(true);
            self.checkedOption(self.nls.limitType.transaction);
            self.limitType(self.nls.limitType.transaction);
        } else if (self.limitFlag() === "PER") {
            self.checkedOption(self.nls.limitType.cummulative);
            self.limitType(self.nls.limitType.cummulative);
            self.frequency = ko.observable(self.paramsData.periodicity());
            self.cummulativeLimitSection(true);
        } else if (self.limitFlag() === "DUR") {
            if (self.paramsData.durationLimitSlots() && self.paramsData.durationLimitSlots().length > 0 && self.paramsData.durationLimitSlots()[0].id) {
                self.reviewCoolingDatasource(new oj.ArrayTableDataSource(self.paramsData.durationLimitSlots, {
                    idAttribute: "id"
                }));
            } else {
                const coolingPeriodData = $.map(self.paramsData.durationLimitSlots(), function(coolingDataLocal) {
                    coolingDataLocal.id = coolingDataLocal.startDuration.days() + coolingDataLocal.startDuration.hours() + coolingDataLocal.startDuration.minutes();

                    return coolingDataLocal;
                });

                self.reviewCoolingDatasource(new oj.ArrayTableDataSource(coolingPeriodData, {
                    idAttribute: "id"
                }));
            }

            self.checkedOption(self.nls.limitType.durational);
            self.limitType(self.nls.limitType.coolingPeriod);
            self.coolingPeriodLimitSection(true);
        }

        self.loadData(true);
        rootParams.baseModel.registerComponent("create-limit", "financial-limits");

        self.edit = function() {
            if (self.limitFlag() === "TXN") {
                self.checkedOption(self.nls.limitType.transaction);
            } else if (self.limitFlag() === "PER") {
                self.checkedOption(self.nls.limitType.cummulative);
            } else if (self.limitFlag() === "DUR") {
                self.checkedOption(self.nls.limitType.durational);
            }

            rootParams.dashboard.loadComponent("create-limit", {
                mode: "edit",
                data: self.params.data,
                payLoadFlag: self.params.payLoadFlag,
                checkedOption: self.checkedOption,
                showTransactionAmount:self.params.showTransactionAmount,
                showCummulativeAmount:self.params.showCummulativeAmount,
                showCoolingAmount:self.params.showCoolingAmount,
                transactionLimitSection:self.params.transactionLimitSection,
                coolingPeriodLimitSection:self.params.coolingPeriodLimitSection,
                cummulativeLimitSection:self.params.cummulativeLimitSection,
                nls:self.nls

            });
        };

        self.confirm = function() {
            self.payload = {};

            if (self.limitFlag() === "DUR") {
                self.payload.currency = self.paramsData.currency();
                self.payload.limitDescription = self.paramsData.limitDescription();
                self.payload.limitName = self.paramsData.limitName();
                self.payload.limitType = self.paramsData.limitType();

                const durationLimitSlots = [];

                for (let k = 0; k < self.paramsData.durationLimitSlots().length; k++) {
                    durationLimitSlots.push({
                        amount: self.paramsData.durationLimitSlots()[k].amount,
                        startDuration: self.paramsData.durationLimitSlots()[k].startDuration,
                        endDuration: self.paramsData.durationLimitSlots()[k].endDuration
                    });
                }

                self.payload.durationLimitSlots = durationLimitSlots;
            } else {
                self.payload = self.paramsData;
            }

            ReviewCreateLimitModel.createLimit(ko.mapping.toJSON(self.payload)).done(function(data, status, jqXhr) {
                self.httpStatus(jqXhr.status);
                self.transactionStatus(data.status);

                if (data.limitDTO && data.limitDTO.limitId) {
                    self.limitId(data.limitDTO.limitId);
                }

                let transactionName = null;

                if (self.limitFlag() === "TXN") {
                    transactionName = self.nls.transactionName.transaction;
                } else if (self.limitFlag() === "PER") {
                    transactionName = self.nls.transactionName.cummulative;
                } else if (self.limitFlag() === "DUR") {
                    transactionName = self.nls.transactionName.duration;
                }

                rootParams.dashboard.loadComponent("confirm-screen", {
                    jqXHR: jqXhr,
                    transactionName: transactionName
                });
            });
        };

        self.cancel = function() {
            rootParams.dashboard.switchModule(true);
        };
    };
});