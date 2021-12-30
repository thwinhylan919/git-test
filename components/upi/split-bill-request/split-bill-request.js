define([
    "ojs/ojcore",
    "knockout",
    "ojL10n!resources/nls/split-bill-request",
    "./model",
    "ojs/ojformlayout",
    "ojs/ojknockout-validation",
    "ojs/ojvalidationgroup",
    "ojs/ojselectcombobox",
    "ojs/ojdatetimepicker",
    "ojs/ojavatar",
    "ojs/ojbutton"
], function(oj, ko, resourceBundle, Model) {
    "use strict";

    return function(params) {
        const self = this;

        self.nls = resourceBundle;
        params.dashboard.headerName(self.nls.componentHeader);
        params.baseModel.registerElement("amount-input");
        params.baseModel.registerComponent("review-split-bill-request", "upi");

        params.baseModel.registerElement([
            "comment-box",
            "amount-input"
        ]);

        self.contributorsLoaded = ko.observable(false);
        self.myAmount = ko.observable();
        self.validationTracker = ko.observable();
        self.myAmount = ko.observable();
        self.vpaIdArray = ko.observableArray();
        self.userName = ko.observable();
        self.userInitials = ko.observable();
        self.currentDate = ko.observable();
        self.validityInDays = ko.observable();
        self.maxDate = ko.observable();
        self.avatarList = ko.observableArray();

        let count,maxPayer,dataObj;

        ko.utils.extend(self, params.rootModel.previousState ? ko.mapping.fromJS(params.rootModel.previousState) : params.rootModel);

        /**
         * This function is used split amount.
         *
         * @memberOf split-bill-request
         * @function splitAmount
         * @returns {void}
         */
        function splitAmount() {
            if (self.modelInstance.totalAmount.amount() && count === 0) {
                let splitAmount;

                for (let i = 0; i < self.modelInstance.upFundRequestDTOs().length; i++) {
                    splitAmount = i === 0 ? self.modelInstance.totalAmount.amount() : (splitAmount - self.modelInstance.upFundRequestDTOs()[i-1].amount.amount()).toFixed(2);
                    self.modelInstance.upFundRequestDTOs()[i].amount.amount(parseFloat((splitAmount / ((self.modelInstance.upFundRequestDTOs().length+1) - i)).toFixed(2)));
                }

                self.myAmount(parseFloat(splitAmount - self.modelInstance.upFundRequestDTOs()[self.modelInstance.upFundRequestDTOs().length-1].amount.amount().toFixed(2)));
                count = count + 1;

            }

        }

        if (params.rootModel.previousState) {
            self.contributorsList = ko.observable(params.rootModel.previousState.contributorsList);
            self.modelInstance = ko.mapping.fromJS(params.rootModel.previousState.modelInstance);
            count = 1;
            maxPayer = params.rootModel.previousState.maxPayer;
            self.vpaArrayMap = params.rootModel.previousState.vpaArrayMap;
            self.payeeMap = params.rootModel.previousState.payeeMap;
            dataObj = params.rootModel.previousState.dataObj;
        } else {
            self.contributorsList = ko.observable(self.params.contributorsList);
            self.modelInstance = ko.mapping.fromJS(params.rootModel.params.modelInstance);
            self.avatarList(params.rootModel.params.avatarList);
            maxPayer = params.rootModel.params.maxPayer;
            count = 0;

            if (params.rootModel.params && params.rootModel.params.fromBack) {
                self.contributorsLoaded(false);
                self.currentDate(self.params.currentDate);
                self.validityInDays(self.params.validityInDays);
                self.maxDate(self.params.maxDate);
                self.contributorsLoaded(self.params.contributorsLoaded);
                self.myAmount(self.params.myAmount);
                self.payeeMap = {};
                self.vpaIdArray(self.params.vpaIdArray);
                self.vpaArrayMap = self.params.vpaArrayMap;
                self.userName(self.params.userName);
                self.userInitials(self.params.userInitials);
                dataObj = self.params.dataObj;
                self.modelInstance.upFundRequestDTOs.removeAll();

                for (let i = 0; i < self.avatarList().length; i++) {
                    const data = ko.mapping.toJS(dataObj);

                    self.payeeMap[self.avatarList()[i].vpaId] = {
                        name: self.avatarList()[i].name ? self.avatarList()[i].name : null,
                        initials: self.avatarList()[i].initial,
                        contentId: self.avatarList()[i].contentId
                    };

                    data.debitVPAId = self.avatarList()[i].vpaId;
                    data.amount.currency = self.modelInstance.totalAmount.currency();
                    data.amount.amount = null;
                    self.modelInstance.upFundRequestDTOs.push(ko.mapping.fromJS(data));
                }

                splitAmount();
                self.contributorsLoaded(true);

            } else {
                count = 0;
                self.vpaArrayMap = {};
                self.payeeMap = {};

                Promise.all([Model.mepartyget(), Model.getPayeeMaintenance(), Model.getHostDate(), Model.bankConfigurationget(), Model.virtualPaymentAddressesget()]).then(function(response) {
                    self.userName([response[0].party.personalDetails.firstName, response[0].party.personalDetails.lastName]);
                    self.userInitials(oj.IntlConverterUtils.getInitials(response[0].party.personalDetails.firstName.split(/\s+/)[0], response[0].party.personalDetails.lastName.split(/\s+/)[0]));

                    const configurationDetails = {};

                    for (let k = 0; k < response[1].configurationDetails.length; k++) {
                        configurationDetails[response[1].configurationDetails[k].propertyId] = response[1].configurationDetails[k].propertyValue;
                    }

                    self.validityInDays(configurationDetails.UPI_FUND_REQUEST_MAX_VALIDITY_DAYS);

                    const today = new Date(response[2].currentDate.valueDate);

                    self.currentDate(today);

                    const formattedDate = new Date(response[2].currentDate.valueDate);

                    formattedDate.setDate((today.getDate() + parseInt(self.validityInDays()))-1);
                    self.maxDate(formattedDate.setHours(0, 0, 0, 0));
                    self.contributorsLoaded(false);
                    self.modelInstance.totalAmount.currency(response[3].bankConfigurationDTO.localCurrency);

                    dataObj = ko.mapping.toJS(self.modelInstance.upFundRequestDTOs()[0]);

                    self.modelInstance.upFundRequestDTOs.removeAll();

                    for (let i = 0; i < self.avatarList().length; i++) {
                        const data = dataObj;

                        self.payeeMap[self.avatarList()[i].vpaId] = {
                            name: self.avatarList()[i].name ? self.avatarList()[i].name : null,
                            initials: self.avatarList()[i].initial,
                            contentId: self.avatarList()[i].contentId
                        };

                        data.debitVPAId = self.avatarList()[i].vpaId;
                        data.amount.currency = response[3].bankConfigurationDTO.localCurrency;
                        data.amount.amount = null;
                        self.modelInstance.upFundRequestDTOs.push(ko.mapping.fromJS(data));
                    }

                    if (response[4].virtualPaymentAddressDTOs.length) {
                        for (let i = 0; i < response[4].virtualPaymentAddressDTOs.length; i++) {
                            response[4].virtualPaymentAddressDTOs[i].value = response[4].virtualPaymentAddressDTOs[i].id;
                            self.vpaIdArray().push(response[4].virtualPaymentAddressDTOs[i]);
                            self.vpaArrayMap[response[4].virtualPaymentAddressDTOs[i].id] = { account: response[4].virtualPaymentAddressDTOs[i].accountId };
                        }
                    }

                    self.contributorsLoaded(true);
                });
            }
        }

        self.modelInstance.totalAmount.amount.subscribe(function() {
            splitAmount();
        });

        self.onClickDeleteContributor60 = function(data, event) {
            self.contributorsLoaded(false);

            const contributor = ko.utils.arrayFirst(self.avatarList(), function(element) {
                return element.vpaId === data.debitVPAId();
            });

            self.avatarList.remove(contributor);

            for (let i = 0; i < self.modelInstance.upFundRequestDTOs().length; i++) {
                if (self.modelInstance.upFundRequestDTOs()[i].debitVPAId() === data.debitVPAId()) {
                    self.modelInstance.upFundRequestDTOs.splice(i, 1);
                    break;
                }
            }

            for (let j = 0; j < self.contributorsList().length; j++) {
                if (self.contributorsList()[j].vpaId === data.debitVPAId()) {
                    self.contributorsList()[j].isSelected = [];
                    break;
                }
            }

            count = 0;
            splitAmount();
            self.contributorsLoaded(true);
        };

        self.back = function() {

            params.dashboard.loadComponent("split-money-list", ko.mapping.toJS({
                currentDate: self.currentDate,
                validityInDays: self.validityInDays,
                maxDate: self.maxDate,
                modelInstance: self.modelInstance,
                avatarList: self.avatarList,
                contributorsLoaded: self.contributorsLoaded,
                myAmount: self.myAmount,
                payeeMap: self.payeeMap,
                vpaIdArray: self.vpaIdArray,
                vpaArrayMap: self.vpaArrayMap,
                userName: self.userName,
                userInitials: self.userInitials,
                dataLoaded: params.rootModel.previousState ? params.rootModel.previousState.dataLoaded : self.params.dataLoaded,
                contributorsList: params.rootModel.previousState ? params.rootModel.previousState.contributorsList : self.params.contributorsList,
                maxPayer: params.rootModel.previousState ? params.rootModel.previousState.maxPayer : self.params.maxPayer,
                dataObj  : dataObj,
                fromBack: true
            }));

        };

        self.onClickProceed57 = function() {
            if (params.baseModel.showComponentValidationErrors(document.getElementById("splitBillTracker"))) {
                let totalAmount = self.myAmount();

                for (let i = 0; i < self.modelInstance.upFundRequestDTOs().length; i++) {
                    totalAmount = totalAmount + self.modelInstance.upFundRequestDTOs()[i].amount.amount();
                }

                if (self.modelInstance.totalAmount.amount().toFixed(2) !== totalAmount.toFixed(2)) {
                    params.baseModel.showMessages(null, [self.nls.SplitMoney.amountValidation], "ERROR");
                } else if (maxPayer <= self.modelInstance.upFundRequestDTOs().length) {
                    params.baseModel.showMessages(null, [self.nls.SplitMoney.maxPayeeLimit], "ERROR");
                } else if (self.modelInstance.upFundRequestDTOs().length === 0) {
                    params.baseModel.showMessages(null, [self.nls.SplitMoney.minPayeeLimit], "ERROR");
                } else {
                    Model.paymentstransfersupiFundRequestsplitBillpost(ko.mapping.toJSON(self.modelInstance)).then(function(response) {
                        params.dashboard.loadComponent("review-split-bill-request", ko.mapping.toJS({
                            response: response,
                            currentDate: self.currentDate,
                            validityInDays: self.validityInDays,
                            maxDate: self.maxDate,
                            modelInstance: self.modelInstance,
                            avatarList: self.avatarList,
                            contributorsLoaded: self.contributorsLoaded,
                            myAmount: self.myAmount,
                            payeeMap: self.payeeMap,
                            vpaIdArray: self.vpaIdArray,
                            vpaArrayMap: self.vpaArrayMap,
                            userName: self.userName,
                            userInitials: self.userInitials,
                            dataLoaded: params.rootModel.previousState ? params.rootModel.previousState.dataLoaded : self.params.dataLoaded,
                            contributorsList: params.rootModel.previousState ? params.rootModel.previousState.contributorsList : self.params.contributorsList,
                            maxPayer: params.rootModel.previousState ? params.rootModel.previousState.maxPayer : self.params.maxPayer,
                            dataObj  : dataObj,
                            fromBack: true
                        }));
                    });
                }
            }
        };
    };
});
