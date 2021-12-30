define([
    "./model",
    "knockout"
], function (Model, ko) {
    "use strict";

    return function () {
        let self,
         params;

                function fileUploadsfilesfileRefIdrecordsgetCall(fileRefId, pageSize, pageNumber, fromAmount, toAmount, currency, valueDateStart, valueDateEnd, recordStatus, beneName, creditAccount, debitAccount, transactionType, payeeType, accountType, payload, config) {
            return Model.fileUploadsfilesfileRefIdrecordsget(fileRefId, pageSize, pageNumber, fromAmount, toAmount, currency, valueDateStart, valueDateEnd, recordStatus, beneName, creditAccount, debitAccount, transactionType, payeeType, accountType, payload, config);
        }

                function fileUploadsfilesfileRefIdrecordsrecordRefIdgetCall(fileRefId, recordRefId, payload, config) {
            return Model.fileUploadsfilesfileRefIdrecordsrecordRefIdget(fileRefId, recordRefId, payload, config);
        }

                function onClickRecordDetails81(event) {
            fileUploadsfilesfileRefIdrecordsrecordRefIdgetCall(self.fileUploadsfilesfileRefIdrecordsrecordRefIdgetfileRefId(), event.recRefId).then(function (response) {
                self.selectedRecord(response.recordDetails);
                params.dashboard.loadComponent("virtual-account-view", self.selectedRecord());
                self.fileUploadsfilesfileRefIdrecordsrecordRefIdgetVar(response);
            });
        }

                function onClickRecordReferenceNumber49(event) {
            fileUploadsfilesfileRefIdrecordsrecordRefIdgetCall(self.fileUploadsfilesfileRefIdrecordsrecordRefIdgetfileRefId(), event.recRefId).then(function (response) {
                self.selectedRecord(response.recordDetails);
                params.dashboard.loadComponent("virtual-account-view", self.selectedRecord());
                self.fileUploadsfilesfileRefIdrecordsrecordRefIdgetVar(response);
            });
        }

        function init(bindingContext, rootParams) {
            self = bindingContext;
            params = rootParams;
            self.recordDataSource = ko.observableArray();
            self.transactionType = ko.observable(rootParams.data[0]().transaction);
            rootParams.baseModel.registerComponent("virtual-account-view", "virtual-account-management");
            self.response = ko.observable(false);
            self.selectedRecord = ko.observable();

            fileUploadsfilesfileRefIdrecordsgetCall(self.fileUploadsfilesfileRefIdrecordsgetfileRefId(), self.fileUploadsfilesfileRefIdrecordsgetpageSize(), self.fileUploadsfilesfileRefIdrecordsgetpageNumber(), self.fileUploadsfilesfileRefIdrecordsgetfromAmount(), self.fileUploadsfilesfileRefIdrecordsgettoAmount(), self.fileUploadsfilesfileRefIdrecordsgetcurrency(), self.fileUploadsfilesfileRefIdrecordsgetvalueDateStart(), self.fileUploadsfilesfileRefIdrecordsgetvalueDateEnd(), self.fileUploadsfilesfileRefIdrecordsgetrecordStatus(), self.fileUploadsfilesfileRefIdrecordsgetbeneName(), self.fileUploadsfilesfileRefIdrecordsgetcreditAccount(), self.fileUploadsfilesfileRefIdrecordsgetdebitAccount(), self.fileUploadsfilesfileRefIdrecordsgettransactionType(), self.fileUploadsfilesfileRefIdrecordsgetpayeeType(), self.fileUploadsfilesfileRefIdrecordsgetaccountType()).then(function (response) {
                if (self.transactionType() === "VAS") {
                    response.recordDetails.forEach(function (item) {
                        if (item.realAccNo) {
                            item.accountNumber = item.realAccNo;
                        } else {
                            item.accountNumber = item.accGroupId;
                        }
                    });
                }

                self.recordDataSource(response.recordDetails);
                self.response(true);
            });

            return true;
        }

        return {
            fileUploadsfilesfileRefIdrecordsgetCall: fileUploadsfilesfileRefIdrecordsgetCall,
            fileUploadsfilesfileRefIdrecordsrecordRefIdgetCall: fileUploadsfilesfileRefIdrecordsrecordRefIdgetCall,
            onClickRecordDetails81: onClickRecordDetails81,
            onClickRecordReferenceNumber49: onClickRecordReferenceNumber49,
            init: init
        };
    };
});