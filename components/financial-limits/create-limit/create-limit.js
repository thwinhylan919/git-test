define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/create-limit",
    "ojs/ojknockout-validation",
    "ojs/ojvalidationgroup",
    "ojs/ojinputtext",
    "ojs/ojbutton",
    "ojs/ojtable",
    "ojs/ojarraytabledatasource",
    "ojs/ojgauge",
    "ojs/ojchart",
    "ojs/ojlistview",
    "ojs/ojdatetimepicker",
    "ojs/ojinputnumber",
    "ojs/ojselectcombobox"
], function(oj, ko, $, CreateLimitModel, resourceBundle) {
    "use strict";

    return function(rootParams) {
        const self = this;

        ko.utils.extend(self, rootParams.rootModel);
        self.flag = ko.observable(false);
        self.checkedOption = self.params.checkedOption ? self.params.checkedOption : ko.observable();

        self.nls = resourceBundle;
        self.resource = resourceBundle;
        rootParams.dashboard.headerName(self.nls.common.limitheader);
        self.chekValidation = ko.observable(false);
        self.groupValid = ko.observable();
        self.templateValid = ko.observable();
        self.addTimeButton = ko.observable(false);
        self.validationTracker = ko.observable();
        self.currency = ko.observable();
        self.currencyLoaded = ko.observable(false);
        self.currencyList = ko.observableArray([]);
        self.showTransactionAmount = ko.observable(self.params.showTransactionAmount || false);
        self.showCummulativeAmount = ko.observable(self.params.showCummulativeAmount || false);
        self.showCoolingAmount = ko.observable(self.params.showCoolingAmount || false);
        rootParams.baseModel.registerComponent("review-create-limit", "financial-limits");
        rootParams.baseModel.registerElement("modal-window");
        rootParams.baseModel.registerElement("amount-input");
        self.frequency = ko.observable("DAILY");
        self.lastCoolingTransaction = ko.observable("");
        self.coolingDatasource = ko.observable();
        self.coolingDataArray = ko.observableArray();
        self.coolingDataLoaded = ko.observable(false);

        self.initializeTime = function() {
            for (let i = 0; i < 100; i++) {
                if (i < 24) {
                    self.hoursList().push(i);
                }

                if (i < 60) {
                    self.minutesList().push(i);
                }

                self.daysList().push(i);
            }
        };

        const paramsData = self.params.data;

        if (paramsData && paramsData.periodicity) {
            if (!ko.isObservable(paramsData.periodicity)) {
                paramsData.periodicity = ko.observable(paramsData.periodicity);
            }

            self.frequency(paramsData.periodicity());
        }

        if (self.params.data && !ko.isObservable(self.params.transactionLimitSection())) {
            self.transactionLimitSection = ko.observable(self.params.transactionLimitSection());
        }

        if (self.params.data && !ko.isObservable(self.params.coolingPeriodLimitSection())) {
            self.coolingPeriodLimitSection = ko.observable(self.params.coolingPeriodLimitSection());
        }

        if (self.params.data && !ko.isObservable(self.params.cummulativeLimitSection())) {
            self.cummulativeLimitSection = ko.observable(self.params.cummulativeLimitSection());
        }

        if (self.params.data) {
            if (self.params.payLoadFlag() && !ko.isObservable(self.params.payLoadFlag())) {
                const paramsPayLoadFlag = ko.observable(self.params.payLoadFlag());

                self.payLoadFlag = ko.observable(paramsPayLoadFlag());
            }
        }

        if (self.params.mode === "edit" && self.params.data) {
            if (self.params.data.limitType() === "TXN") {
                self.params.transactionLimitSection(true);
            } else if (self.params.data.limitType() === "PER") {
                self.params.cummulativeLimitSection(true);
            } else if (self.params.data.limitType() === "DUR") {
                self.params.coolingPeriodLimitSection(true);
            }
        }

        if (self.params.data) {
            if (!ko.isObservable(paramsData.currency)) {
                paramsData.currency = ko.observable(paramsData.currency);
            }

            self.currency(paramsData.currency());
        }

        const getNewKoModel = function() {
            const KoModel = CreateLimitModel.getNewModel();

            return ko.mapping.fromJS(KoModel);
        };

        self.setTransactionalData = function() {
            self.transactionLimitModelInstance(getNewKoModel().TransactionalLimitModel);
            self.transactionLimitModelInstance().currency(self.params.data.currency());
            self.transactionLimitModelInstance().amountRange.minTransaction.currency(self.params.data.amountRange.minTransaction.currency());
            self.transactionLimitModelInstance().amountRange.maxTransaction.currency(self.params.data.amountRange.maxTransaction.currency());
            self.transactionLimitModelInstance().amountRange.minTransaction.amount(self.params.data.amountRange.minTransaction.amount());
            self.transactionLimitModelInstance().amountRange.maxTransaction.amount(self.params.data.amountRange.maxTransaction.amount());
            self.transactionLimitModelInstance().limitName(self.params.data.limitName());
            self.transactionLimitModelInstance().limitDescription(self.params.data.limitDescription());
            self.checkedOption(self.nls.limitType.transaction);
        };

        self.setCumulativeData = function() {
            self.cummulativeLimitModelInstance(getNewKoModel().PeriodicLimitModel);
            self.cummulativeLimitModelInstance().currency(self.params.data.currency());
            self.cummulativeLimitModelInstance().maxAmount.currency(self.params.data.maxAmount.currency());
            self.cummulativeLimitModelInstance().maxAmount.amount(self.params.data.maxAmount.amount());
            self.cummulativeLimitModelInstance().maxCount(self.params.data.maxCount());
            self.cummulativeLimitModelInstance().periodicity(self.params.data.periodicity());
            self.cummulativeLimitModelInstance().limitName(self.params.data.limitName());
            self.cummulativeLimitModelInstance().limitDescription(self.params.data.limitDescription());
            self.checkedOption(self.nls.limitType.cummulative);
        };

        self.setDurationalData = function() {
            self.coolingPeriodLimitModelInstance(getNewKoModel().DurationLimitModel);
            self.daysList = ko.observableArray([]);
            self.hoursList = ko.observableArray([]);
            self.minutesList = ko.observableArray([]);
            self.initializeTime();
            self.coolingDataLoaded = ko.observable(false);
            self.coolingPeriodLimitModelInstance().currency(self.params.data.currency());
            self.coolingPeriodLimitModelInstance().limitName(self.params.data.limitName());
            self.coolingPeriodLimitModelInstance().limitDescription(self.params.data.limitDescription());
            paramsData.durationLimitSlots = ko.mapping.fromJS(self.params.data.durationLimitSlots());

            for (let i = 0; i < paramsData.durationLimitSlots().length; i++) {
                if (i > 0) {
                    const obj1 = getNewKoModel().DurationLimitModel.durationLimitSlots()[0];

                    self.coolingPeriodLimitModelInstance().durationLimitSlots.push(obj1);
                }

                self.coolingPeriodLimitModelInstance().durationLimitSlots()[i].amount.currency(paramsData.currency);
                self.coolingPeriodLimitModelInstance().durationLimitSlots()[i].amount.amount(paramsData.durationLimitSlots()[i].amount.amount());

                if (paramsData.durationLimitSlots()[i].endDuration.days()) {
                    self.coolingPeriodLimitModelInstance().durationLimitSlots()[i].endDuration.days( paramsData.durationLimitSlots()[i].endDuration.days());
                }

                if (paramsData.durationLimitSlots()[i].endDuration.hours()) {
                    self.coolingPeriodLimitModelInstance().durationLimitSlots()[i].endDuration.hours( paramsData.durationLimitSlots()[i].endDuration.hours());
                }

                if (paramsData.durationLimitSlots()[i].endDuration.minutes()) {
                    self.coolingPeriodLimitModelInstance().durationLimitSlots()[i].endDuration.minutes(paramsData.durationLimitSlots()[i].endDuration.minutes());
                }

                if (paramsData.durationLimitSlots()[i].startDuration.days()) {
                    self.coolingPeriodLimitModelInstance().durationLimitSlots()[i].startDuration.days(paramsData.durationLimitSlots()[i].startDuration.days());
                }

                if (paramsData.durationLimitSlots()[i].startDuration.hours()) {
                    self.coolingPeriodLimitModelInstance().durationLimitSlots()[i].startDuration.hours(paramsData.durationLimitSlots()[i].startDuration.hours());
                }

                if (paramsData.durationLimitSlots()[i].startDuration.minutes()) {
                    self.coolingPeriodLimitModelInstance().durationLimitSlots()[i].startDuration.minutes(paramsData.durationLimitSlots()[i].startDuration.minutes());
                }

                const coolingPeriodData = $.map(self.coolingPeriodLimitModelInstance().durationLimitSlots(), function(coolingDataLocal) {
                    coolingDataLocal.id = coolingDataLocal.startDuration.days() + coolingDataLocal.startDuration.hours() + coolingDataLocal.startDuration.minutes();

                    return coolingDataLocal;
                });

                self.coolingDataArray(coolingPeriodData);

                self.coolingDatasource(new oj.ArrayTableDataSource(self.coolingDataArray, {
                    idAttribute: "id"
                }));
            }

            self.checkedOption("Durational");

        };

        if (self.params.mode === "edit" && self.params.data) {
            self.transactionLimitModelInstance = ko.observable();
            self.cummulativeLimitModelInstance = ko.observable();
            self.coolingPeriodLimitModelInstance = ko.observable();

            if (self.params.data.limitType() === "TXN") {
                self.setTransactionalData();
            }

            if (self.params.data.limitType() === "PER") {
                self.setCumulativeData();
            }

            if (self.params.data.limitType() === "DUR") {
                self.setDurationalData();
            }
        }

        self.initialize = function() {
            self.transactionLimitModelInstance(getNewKoModel().TransactionalLimitModel);
            self.transactionLimitSection(true);
            self.payLoadFlag("TXN");
        };

        if (self.params.mode !== "edit") {
            self.transactionLimitSection = ko.observable(false);
            self.cummulativeLimitSection = ko.observable(false);
            self.coolingPeriodLimitSection = ko.observable(false);
            self.addTimeButton = ko.observable(true);
            self.transactionLimitModelInstance = ko.observable();
            self.cummulativeLimitModelInstance = ko.observable();
            self.coolingPeriodLimitModelInstance = ko.observable();
            self.payLoadFlag = ko.observable();
            self.payloadObj = {};
            self.checkedOption(self.nls.limitType.transaction);
            self.validationTracker = ko.observable();
            self.daysList = ko.observableArray([]);
            self.hoursList = ko.observableArray([]);
            self.minutesList = ko.observableArray([]);
            self.coolingDataLoaded = ko.observable(false);
            self.initializeTime();
            self.initialize();
        }

        self.handleCreateLimit = function(event) {
            if (event.type === "valueChanged") {
                if (event.detail.value.toUpperCase() === "TRANSACTION") {
                    self.transactionLimitModelInstance(getNewKoModel().TransactionalLimitModel);
                    self.showCummulativeAmount(false);
                    self.showCoolingAmount(false);
                    self.transactionLimitSection(true);
                    self.cummulativeLimitSection(false);
                    self.coolingPeriodLimitSection(false);
                    self.frequency("DAILY");

                    self.payLoadFlag("TXN");
                } else if (event.detail.value.toUpperCase() === "CUMULATIVE") {
                    self.cummulativeLimitModelInstance(getNewKoModel().PeriodicLimitModel);
                    self.showTransactionAmount(false);
                    self.showCoolingAmount(false);
                    self.transactionLimitSection(false);
                    self.cummulativeLimitSection(true);
                    self.coolingPeriodLimitSection(false);
                    self.payLoadFlag("PER");
                } else if (event.detail.value.toUpperCase() === "DURATIONAL") {
                    self.coolingPeriodLimitModelInstance(getNewKoModel().DurationLimitModel);
                    self.showTransactionAmount(false);
                    self.showCummulativeAmount(false);
                    self.transactionLimitSection(false);
                    self.cummulativeLimitSection(false);
                    self.coolingPeriodLimitSection(true);
                    self.frequency("DAILY");
                    self.payLoadFlag("DUR");
                    self.daysList = ko.observableArray([]);
                    self.hoursList = ko.observableArray([]);
                    self.minutesList = ko.observableArray([]);
                    self.coolingDataLoaded = ko.observable(false);
                    self.initializeTime();
                }
            }
        };

        self.save = function() {
            if (!(rootParams.baseModel.showComponentValidationErrors(document.getElementById("tracker")) && rootParams.baseModel.showComponentValidationErrors(document.getElementById("templateTracker")))) {
                return;
            }

            if (self.payLoadFlag() === "TXN") {
                self.transactionLimitModelInstance().currency(self.currency());
                self.transactionLimitModelInstance().amountRange.minTransaction.currency(self.currency());
                self.transactionLimitModelInstance().amountRange.maxTransaction.currency(self.currency());

                if (self.transactionLimitModelInstance().amountRange.minTransaction.amount() > self.transactionLimitModelInstance().amountRange.maxTransaction.amount()) {
                    rootParams.baseModel.showMessages(null, [self.nls.common.invalidAmountMsg], "ERROR");

                    return;
                }

                self.payloadObj = self.transactionLimitModelInstance();

            } else if (self.payLoadFlag() === "PER") {
                self.cummulativeLimitModelInstance().currency(self.currency());
                self.cummulativeLimitModelInstance().maxAmount.currency(self.currency());
                self.cummulativeLimitModelInstance().periodicity(self.frequency());
                self.payloadObj = self.cummulativeLimitModelInstance();

            } else if (self.payLoadFlag() === "DUR") {
                self.coolingPeriodLimitModelInstance().currency(self.currency());
                self.payloadObj = self.coolingPeriodLimitModelInstance();

                let i;

                for (i = 0; i < self.payloadObj.durationLimitSlots().length; i++) {
                    self.verifyTimestamp(i);
                }

                if (self.chekValidation() || self.addTimeButton() === true) {
                    rootParams.baseModel.showMessages(null, [self.nls.common.invalidEntryMsg], "ERROR");

                    return;
                }

                for (i = 0; i < self.payloadObj.durationLimitSlots().length; i++) {

                    self.payloadObj.durationLimitSlots()[i].amount.currency(self.currency());

                    if (self.payloadObj.durationLimitSlots()[i].endDuration.days() instanceof Array) {
                        self.payloadObj.durationLimitSlots()[i].endDuration.days(self.payloadObj.durationLimitSlots()[i].endDuration.days());
                    }

                    if (self.payloadObj.durationLimitSlots()[i].endDuration.hours() instanceof Array) {
                        self.payloadObj.durationLimitSlots()[i].endDuration.hours(self.payloadObj.durationLimitSlots()[i].endDuration.hours());
                    }

                    if (self.payloadObj.durationLimitSlots()[i].endDuration.minutes() instanceof Array) {
                        self.payloadObj.durationLimitSlots()[i].endDuration.minutes(self.payloadObj.durationLimitSlots()[i].endDuration.minutes());
                    }

                    if (self.payloadObj.durationLimitSlots()[i].startDuration.days() instanceof Array) {
                        self.payloadObj.durationLimitSlots()[i].startDuration.days(self.payloadObj.durationLimitSlots()[i].startDuration.days());
                    }

                    if (self.payloadObj.durationLimitSlots()[i].startDuration.hours() instanceof Array) {
                        self.payloadObj.durationLimitSlots()[i].startDuration.hours(self.payloadObj.durationLimitSlots()[i].startDuration.hours());
                    }

                    if (self.payloadObj.durationLimitSlots()[i].startDuration.minutes() instanceof Array) {
                        self.payloadObj.durationLimitSlots()[i].startDuration.minutes(self.payloadObj.durationLimitSlots()[i].startDuration.minutes());
                    }
                }
            }

            rootParams.dashboard.loadComponent("review-create-limit", {
                data: self.payloadObj,
                payLoadFlag: self.payLoadFlag,
                showTransactionAmount:self.showTransactionAmount,
                showCummulativeAmount:self.showCummulativeAmount,
                showCoolingAmount:self.showCoolingAmount,
                transactionLimitSection:self.transactionLimitSection,
                coolingPeriodLimitSection:self.coolingPeriodLimitSection,
                cummulativeLimitSection:self.cummulativeLimitSection

            });

        };

        self.cancel = function() {
            rootParams.dashboard.switchModule(true);
        };

        self.closeDialogBox = function() {
            $("#invalidTimeDialog").hide();
            $("#cancelDialog").hide();
            $("#invalidAmountDialog").hide();
        };

        self.back = function() {
            self.showTransactionAmount(false);
            self.showCummulativeAmount(false);
            self.showCoolingAmount(false);
            rootParams.dashboard.loadComponent("limit-base", {});
        };

        self.removePeriod = function(index, data) {
            if (index && index < self.coolingDataArray().length - 1) {
                self.coolingDataArray()[index + 1].startDuration.days(self.coolingDataArray()[index - 1].endDuration.days());
                self.coolingDataArray()[index + 1].startDuration.hours(self.coolingDataArray()[index - 1].endDuration.hours());
                self.coolingDataArray()[index + 1].startDuration.minutes(self.coolingDataArray()[index - 1].endDuration.minutes());
            }

            self.coolingPeriodLimitModelInstance().durationLimitSlots().splice(index,1);

            self.coolingDataArray.remove(function(data2) {
                return data2.id === data.id && data2.amount.amount === data.amount.amount;
            });

            self.coolingDatasource(new oj.ArrayTableDataSource(self.coolingDataArray, {
                idAttribute: "id"
            }));

            self.coolingPeriodLimitSection(true);
            self.addTimeButton(false);
            self.chekValidation(false);
            self.showCoolingAmount(false);
            self.showCoolingAmount(true);
        };

        self.addTimePeriod = function() {
            if (self.chekValidation() || self.addTimeButton()) {
                rootParams.baseModel.showMessages(null, [self.nls.common.invalidEntryMsg], "ERROR");

                return;
            }

            const obj1 = getNewKoModel().DurationLimitModel.durationLimitSlots()[0];

            obj1.startDuration.days(self.coolingPeriodLimitModelInstance().durationLimitSlots()[self.coolingPeriodLimitModelInstance().durationLimitSlots().length - 1].endDuration.days());
            obj1.startDuration.hours(self.coolingPeriodLimitModelInstance().durationLimitSlots()[self.coolingPeriodLimitModelInstance().durationLimitSlots().length - 1].endDuration.hours());
            obj1.startDuration.minutes(self.coolingPeriodLimitModelInstance().durationLimitSlots()[self.coolingPeriodLimitModelInstance().durationLimitSlots().length - 1].endDuration.minutes());
            self.coolingPeriodLimitModelInstance().durationLimitSlots.push(obj1);

            const coolingPeriodData = $.map(self.coolingPeriodLimitModelInstance().durationLimitSlots(), function(coolingDataLocal) {
                coolingDataLocal.id = coolingDataLocal.startDuration.days() + coolingDataLocal.startDuration.hours() + coolingDataLocal.startDuration.minutes();

                return coolingDataLocal;
            });

            self.coolingDataArray(coolingPeriodData);

            self.coolingDatasource(new oj.ArrayTableDataSource(self.coolingDataArray, {
                idAttribute: "id"
            }));

            self.showCoolingAmount(false);
            self.showCoolingAmount(true);
            self.addTimeButton(true);
        };

        self.verifyStartTime = function(index, data) {
            if(data.endDuration.days() === "{{$index()}}")
            {
                data.endDuration.days("0");
            }

            if(data.endDuration.hours() === "{{$index()}}")
            {
                data.endDuration.hours("0");
            }

            if(data.endDuration.minutes() === "{{$index()}}")
            {
                data.endDuration.minutes("0");
            }

            self.verifyTimestamp(index, data);
            self.coolingPeriodLimitModelInstance().durationLimitSlots()[index].endDuration.days(data.endDuration.days());
            self.coolingPeriodLimitModelInstance().durationLimitSlots()[index].endDuration.hours(data.endDuration.hours());
            self.coolingPeriodLimitModelInstance().durationLimitSlots()[index].endDuration.minutes(data.endDuration.minutes());
            self.coolingPeriodLimitModelInstance().durationLimitSlots()[index].amount.amount(data.amount.amount());

            if (self.coolingDataArray().length - 1 > index) {
                self.coolingDataArray()[index + 1].startDuration.days(self.coolingDataArray()[index].endDuration.days());
                self.coolingDataArray()[index + 1].startDuration.hours(self.coolingDataArray()[index].endDuration.hours());
                self.coolingDataArray()[index + 1].startDuration.minutes(self.coolingDataArray()[index].endDuration.minutes());
            }

            self.showCoolingAmount(false);
            self.showCoolingAmount(true);
        };

        self.verifyTimestamp = function(index) {
            self.chekValidation(false);

            if (self.coolingPeriodLimitModelInstance().durationLimitSlots()[index].endDuration.hours() === "{{$index()}}") {
                self.coolingPeriodLimitModelInstance().durationLimitSlots()[index].endDuration.hours("0");
            }

            if (self.coolingPeriodLimitModelInstance().durationLimitSlots()[index].endDuration.days() === "{{$index()}}") {
                self.coolingPeriodLimitModelInstance().durationLimitSlots()[index].endDuration.days("0");
            }

            if (self.coolingPeriodLimitModelInstance().durationLimitSlots()[index].endDuration.minutes() === "{{$index()}}") {
                self.coolingPeriodLimitModelInstance().durationLimitSlots()[index].endDuration.minutes("0");
            }

            const sday = parseInt(self.coolingPeriodLimitModelInstance().durationLimitSlots()[index].startDuration.days());
            let eday = parseInt(self.coolingPeriodLimitModelInstance().durationLimitSlots()[index].endDuration.days());
            const shour = parseInt(self.coolingPeriodLimitModelInstance().durationLimitSlots()[index].startDuration.hours());
            let ehour = parseInt(self.coolingPeriodLimitModelInstance().durationLimitSlots()[index].endDuration.hours());
            const smin = parseInt(self.coolingPeriodLimitModelInstance().durationLimitSlots()[index].startDuration.minutes());
            let emin = parseInt(self.coolingPeriodLimitModelInstance().durationLimitSlots()[index].endDuration.minutes());

            if (!(eday && ehour && emin) && (eday || ehour || emin)) {
                if (eday && !ehour && !emin) {
                    self.coolingPeriodLimitModelInstance().durationLimitSlots()[index].endDuration.hours("0");
                    self.coolingPeriodLimitModelInstance().durationLimitSlots()[index].endDuration.minutes("0");
                    ehour = 0;
                    emin = 0;
                }

                if (ehour && !eday && !emin) {
                    self.coolingPeriodLimitModelInstance().durationLimitSlots()[index].endDuration.minutes("0");
                    self.coolingPeriodLimitModelInstance().durationLimitSlots()[index].endDuration.days("0");
                    eday = 0;
                    emin = 0;
                }

                if (emin && !eday && !ehour) {
                    self.coolingPeriodLimitModelInstance().durationLimitSlots()[index].endDuration.days("0");
                    self.coolingPeriodLimitModelInstance().durationLimitSlots()[index].endDuration.hours("0");
                    eday = 0;
                    ehour = 0;
                }
            }

            if (eday !== null && eday !== "") {
                if (sday === eday) {
                    if (shour === ehour) {
                        if (smin === emin) {
                            rootParams.baseModel.showMessages(null, [self.nls.common.invalidEntryMsg], "ERROR");
                            self.chekValidation(true);
                        } else if (smin > emin) {
                            rootParams.baseModel.showMessages(null, [self.nls.common.invalidTimeMsg], "ERROR");
                            self.chekValidation(true);
                        }
                    } else if (shour > ehour) {
                        rootParams.baseModel.showMessages(null, [self.nls.common.invalidTimeMsg], "ERROR");
                        self.chekValidation(true);
                    }
                } else if (sday > eday) {
                    self.chekValidation(true);
                    rootParams.baseModel.showMessages(null, [self.nls.common.invalidTimeMsg], "ERROR");
                }
            }

            if (!isNaN(eday) && !isNaN(ehour) && !isNaN(emin)) {
                self.addTimeButton(false);
            } else {
                self.addTimeButton(true);
            }
        };

        self.noDecimalInput = function(data, event) {
            return event.charCode >= 48 && event.charCode <= 57;
        };

        CreateLimitModel.fetchCurrencies().done(function(data) {
            for (let i = 0; i < data.currencyList.length; i++) {
                self.currencyList().push({
                    code: data.currencyList[i].code,
                    description: data.currencyList[i].description
                });
            }

            self.currencyLoaded(true);

            if (self.params.data && !ko.isObservable(paramsData.limitType)) {
                paramsData.limitType = ko.observable(paramsData.limitType);
            }

            if (self.params.data && !ko.isObservable(paramsData.durationLimitSlots)) {
                paramsData.durationLimitSlots = ko.observable(paramsData.durationLimitSlots);
            }

            if (self.params.data && paramsData.limitType() === "DUR") {
                self.coolingDataArray(paramsData.durationLimitSlots());

                self.coolingDatasource(new oj.ArrayTableDataSource(self.coolingDataArray, {
                    idAttribute: "id"
                }));

                self.showCoolingAmount(false);
                self.showCoolingAmount(true);
                self.coolingDataLoaded(true);
            }
        });

        self.currencyOptionChangeHandler = function(event) {
            self.currency(event.detail.value.toString());

            if (self.transactionLimitSection()) {
                self.showTransactionAmount(true);
            }

            if (self.cummulativeLimitSection()) {
                self.showCummulativeAmount(true);
            }

            if (self.coolingPeriodLimitSection()) {
                const coolingPeriodData = $.map(self.coolingPeriodLimitModelInstance().durationLimitSlots(), function(coolingDataLocal) {
                    coolingDataLocal.id = coolingDataLocal.startDuration.days() + coolingDataLocal.startDuration.hours() + coolingDataLocal.startDuration.minutes();

                    return coolingDataLocal;
                });

                self.coolingDataArray(coolingPeriodData);

                self.coolingDatasource(new oj.ArrayTableDataSource(self.coolingDataArray, {
                    idAttribute: "id"
                }));

                self.showCoolingAmount(false);
                self.showCoolingAmount(true);
                self.coolingDataLoaded(true);
            }
        };
    };
});