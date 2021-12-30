define([
    "ojs/ojcore",
    "ojL10n!resources/nls/transaction-history",
    "knockout",
    "./model",
    "ojs/ojformlayout",
    "ojs/ojvalidationgroup",
    "ojs/ojselectcombobox",
    "ojs/ojavatar",
    "ojs/ojbutton",
    "ojs/ojcollapsible",
    "ojs/ojaccordion",
    "ojs/ojlabel",
    "ojs/ojdatetimepicker",
    "ojs/ojvalidationgroup"
], function(oj, resourceBundle, ko, Model) {
    "use strict";

    return function(params) {
        const self = this;

        self.nls = resourceBundle;
        params.dashboard.headerName(self.nls.componentHeader);
        self.paymentstransfersupiFundRequestgetVar = ko.observableArray();
        self.paymentstransfersupiFundRequestgetvpaId = ko.observable();
        self.paymentstransfersupiFundRequestgetpendingFundRequestType = ko.observable();
        self.virtualPaymentAddressesgetVar = ko.observable();
        self.paymentstransfersupiFundRequestreferenceNoapprovepostreferenceNo = ko.observable();
        self.paymentstransfersupiFundRequestreferenceNorejectpostreferenceNo = ko.observable();

        const batchRequest = {
            batchDetailRequestList: []
        };

        self.dataloaded = ko.observable(false);
        self.listLoaded = ko.observable(false);
        self.vpaIdArray = ko.observableArray();
        self.sample = ko.observableArray();
        self.accountNumber = ko.observable();
        self.selectedItems = ko.observableArray([]);
        self.vpaArrayMap = {};
        self.filterOptionsLoaded = ko.observable(false);
        self.transactionType = ko.observable("all");
        self.startDate = ko.observable();
        self.endDate = ko.observable();
        self.status = ko.observable("all");

        self.payeeMap = ko.observable({});
        self.contentIdMap = ko.observable({});

        self.statusArray = ko.observableArray();
        self.transactionTypeArray = ko.observableArray();
        self.tomorrow = ko.observable();
        self.currentDate = ko.observable();
        self.previous = ko.observable();
        self.defaultImagePath = "upi/user-segment.svg";

        self.transactionTypeChangeHandler = function(event) {
            if (self.filterOptionsLoaded()) {
                self.transactionType(event.detail.value);
                self.fetchList();
            }
        };

        self.startDate.subscribe(function() {
            if (self.startDate()) {
                const tomorrowDate = new Date(self.startDate()).setDate(new Date(self.startDate()).getDate() + 1);

                self.tomorrow(new Date(tomorrowDate).setHours(0, 0, 0, 0));
            }

            if (self.startDate() && self.endDate() && self.filterOptionsLoaded()) {
                self.fetchList();
            }

            if (self.startDate() && !self.endDate() && self.filterOptionsLoaded()) { params.baseModel.showMessages(null, [self.nls.PendingRequests.selectDateError], "ERROR"); }
        });

        self.endDate.subscribe(function() {
            if (self.endDate()) {
                const previousDate = new Date(self.endDate()).setDate(new Date(self.endDate()).getDate() - 1);

                self.previous(new Date(previousDate).setHours(0, 0, 0, 0));
            }

            if (self.startDate() && self.endDate() && self.filterOptionsLoaded()) {
                self.fetchList();
            }

            if (!self.startDate() && self.endDate() && self.filterOptionsLoaded()) { params.baseModel.showMessages(null, [self.nls.PendingRequests.selectDateError], "ERROR"); }
        });

        self.statusChangeHandler = function(event) {
            if (self.filterOptionsLoaded()) {
                self.status(event.detail.value);
                self.fetchList();
            }
        };

        self.openFilterOption = function() {
            if (self.filterOptionsLoaded()) {
                self.filterOptionsLoaded(false);
                self.transactionType("all");
                self.startDate(null);
                self.endDate(null);
                self.status("all");
                self.fetchList();

            } else {
                self.filterOptionsLoaded(true);
                self.transactionType("all");
                self.status("all");

            }
        };

        self.loadBatchImages = function() {
            Model.fireBatch(batchRequest).then(function(batchData) {
                for (let i = 0; i < batchData.batchDetailResponseDTOList.length; i++) {
                    const responseDTO = batchData.batchDetailResponseDTOList[i].responseObj;

                    self.contentIdMap()[responseDTO.contentDTOList[0].contentId.value].content("data:image/gif;base64," + responseDTO.contentDTOList[0].content);
                }

                Object.keys(self.contentIdMap()).forEach(function(key) {
                    self.payeeMap()[self.contentIdMap()[key].vpaId].preview(self.contentIdMap()[key].content());
                });
            });
        };

        self.loadBatchRequest = function(id) {
            batchRequest.batchDetailRequestList.push({
                methodType: "GET",
                uri: {
                    value: "/contents/{id}",
                    params: {
                        id: id
                    }
                },
                headers: {
                    "Content-Id": batchRequest.batchDetailRequestList.length + 1,
                    "Content-Type": "application/json"
                }
            });
        };

        self.fetchList = function() {
            self.listLoaded(false);
            ko.tasks.runEarly();

            Promise.all([Model.getTransactionHistory(self.paymentstransfersupiFundRequestgetvpaId(), self.startDate(), self.endDate(), self.status(), self.transactionType()), Model.fetchPayeeList(), Model.mepartyget()]).then(function(response) {
                const data = response[0].response;
                let totalAmount;

                self.paymentstransfersupiFundRequestgetVar.removeAll();
                ko.tasks.runEarly();

                if (Object.keys(self.payeeMap()).length !== 0) {
                    self.payeeMap({});
                    self.contentIdMap({});
                    batchRequest.batchDetailRequestList = [];
                }

                for (let i = 0; i < data.length; i++) {
                    self.paymentstransfersupiFundRequestgetVar().push(data[i]);

                    if (data[i].payerDetails) {
                        totalAmount = 0;

                        for (let j = 0; j < data[i].payerDetails.length; j++) {
                            totalAmount = totalAmount + data[i].payerDetails[j].amount.amount;

                            self.payeeMap()[data[i].payerDetails[j].debitVPAId] = {
                                initials: data[i].payerDetails[j].payerName!=="" ?
                                    oj.IntlConverterUtils.getInitials(data[i].payerDetails[j].payerName.split(/\s+/)[0], data[i].payerDetails[j].payerName.split(/\s+/)[1]) : oj.IntlConverterUtils.getInitials(data[i].payerDetails[j].debitVPAId.split(/[\.\_\-]/)[0], data[i].payerDetails[j].debitVPAId.split(/[\.\_\-]/)[1]),
                                preview: ko.observable()
                            };

                        }

                        data[i].payerDetails.unshift({
                            amount: {
                                amount: data[i].amount.amount - totalAmount,
                                currency: data[i].amount.currency
                            },
                            payerName: [response[2].party.personalDetails.firstName, response[2].party.personalDetails.lastName],
                            userInitials: oj.IntlConverterUtils.getInitials(response[2].party.personalDetails.firstName.split(/\s+/)[0], response[2].party.personalDetails.lastName.split(/\s+/)[0]),
                            debitVPAId: null,
                            status: null
                        });
                    } else if (data[i].requestType === "Request Money") {
                        self.payeeMap()[data[i].debitVPAId] = {
                            initials: oj.IntlConverterUtils.getInitials(data[i].receiverName.split(/\s+/)[0], data[i].receiverName.split(/\s+/)[1]),
                            preview: ko.observable()
                        };
                    } else if (data[i].requestType === "Transfer Money") {
                        self.payeeMap()[data[i].creditVPAId] = {
                            initials: oj.IntlConverterUtils.getInitials(data[i].receiverName.split(/\s+/)[0], data[i].receiverName.split(/\s+/)[1]),
                            preview: ko.observable()
                        };
                    }
                }

                const payeeList = response[1].payeeGroups;

                for (let i = 0; i < payeeList.length; i++) {
                    for (let m = 0; m < payeeList[i].listPayees.length; m++) {
                        if (self.payeeMap()[payeeList[i].listPayees[m].vpaId]) {
                            if (payeeList[i].listPayees[m].contentId || payeeList[i].contentId) {
                                self.contentIdMap()[payeeList[i].listPayees[m].contentId ? payeeList[i].listPayees[m].contentId.value : payeeList[i].contentId.value] = {
                                    content: ko.observable(),
                                    vpaId: payeeList[i].listPayees[m].vpaId
                                };

                                self.loadBatchRequest(payeeList[i].listPayees[m].contentId ? payeeList[i].listPayees[m].contentId.value : payeeList[i].contentId.value);
                            }
                        }
                    }
                }

                if (batchRequest.batchDetailRequestList.length) {
                    self.loadBatchImages();
                }

                ko.tasks.runEarly();
                self.listLoaded(true);
            });
        };

        Promise.all([Model.getHostDate(), Model.virtualPaymentAddressesget(), Model.getTransferStatus(), Model.getTransferType()]).then(function(response) {
            self.currentDate(new Date(response[0].currentDate.valueDate).setHours(0, 0, 0, 0));

            const previousDate = new Date(self.currentDate()).setDate(new Date(self.currentDate()).getDate() - 1);

            self.previous(new Date(previousDate).setHours(0, 0, 0, 0));

            self.transactionTypeArray().push({
                id: "all",
                value: self.nls.all
            });

            self.statusArray().push({
                id: "all",
                value: self.nls.all
            });

            for (let i = 0; i < response[2].enumRepresentations[0].data.length; i++) {

                self.transactionTypeArray.push({
                    value: response[2].enumRepresentations[0].data[i].description,
                    id: response[2].enumRepresentations[0].data[i].code
                });
            }

            for (let i = 0; i < response[3].enumRepresentations[0].data.length; i++) {

                self.statusArray.push({
                    value: response[3].enumRepresentations[0].data[i].description,
                    id: response[3].enumRepresentations[0].data[i].code
                });
            }

            if (response[1].virtualPaymentAddressDTOs.length) {
                self.vpaIdArray().push({
                    id: "all",
                    value: self.nls.all
                });

                for (let i = 0; i < response[1].virtualPaymentAddressDTOs.length; i++) {
                    response[1].virtualPaymentAddressDTOs[i].value = response[1].virtualPaymentAddressDTOs[i].id;
                    self.vpaIdArray().push(response[1].virtualPaymentAddressDTOs[i]);

                    self.vpaArrayMap[response[1].virtualPaymentAddressDTOs[i].id] = {
                        account: response[1].virtualPaymentAddressDTOs[i].accountId
                    };
                }

                self.listLoaded(false);
                ko.tasks.runEarly();
                self.paymentstransfersupiFundRequestgetvpaId("all");
                self.fetchList();
            } else {
                params.baseModel.showMessages(null, [self.nls.errorMessageNoVpaId], "ERROR");
            }

            self.dataloaded(true);

        });

        self.vpaChangeHandler = function() {
            self.fetchList();
        };

    };
});