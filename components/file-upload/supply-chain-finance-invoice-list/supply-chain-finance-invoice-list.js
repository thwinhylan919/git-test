define([

    "knockout",
    "ojL10n!resources/nls/supply-chain-finance-invoice-list",
    "./model",
    "ojs/ojcore",
    "ojs/ojformlayout",
    "ojs/ojvalidationgroup",
    "ojs/ojtable",
    "ojs/ojarraytabledatasource",
    "ojs/ojpagingtabledatasource"
], function (ko, resourceBundle, Model, oj) {
    "use strict";

    return function (rootParams) {
        const self = this;

        ko.utils.extend(self, rootParams.rootModel);
        self.nls = resourceBundle;
        rootParams.dashboard.headerName(self.nls.componentHeader);
        self.fileUploadsfilesfileRefIdrecordsgetVar = ko.observable();
        self.fileUploadsfilesfileRefIdrecordsgetfileRefId = ko.observable();
        self.fileUploadsfilesfileRefIdrecordsgettransactionType = ko.observable();
        self.fileUploadsfilesfileRefIdrecordsrecordRefIdgetfileRefId = ko.observable();
        self.fileUploadsfilesfileRefIdrecordsgetpageSize = ko.observable();
        self.fileUploadsfilesfileRefIdrecordsgetpageNumber = ko.observable(1);
        self.fileUploadsfilesfileRefIdrecordsgetfromAmount = ko.observable();
        self.fileUploadsfilesfileRefIdrecordsgettoAmount = ko.observable();
        self.fileUploadsfilesfileRefIdrecordsgetcurrency = ko.observable();
        self.fileUploadsfilesfileRefIdrecordsgetvalueDateStart = ko.observable();
        self.fileUploadsfilesfileRefIdrecordsgetvalueDateEnd = ko.observable();
        self.fileUploadsfilesfileRefIdrecordsgetrecordStatus = ko.observable();
        self.fileUploadsfilesfileRefIdrecordsgetbeneName = ko.observable();
        self.fileUploadsfilesfileRefIdrecordsgetcreditAccount = ko.observable();
        self.fileUploadsfilesfileRefIdrecordsgetdebitAccount = ko.observable();
        self.fileUploadsfilesfileRefIdrecordsgetpayeeType = ko.observable();
        self.fileUploadsfilesfileRefIdrecordsgetaccountType = ko.observable();
        self.fileUploadsfilesfileRefIdrecordsrecordRefIdgetVar = ko.observable();
        self.fileUploadsfilesfileRefIdrecordsrecordRefIdgetrecordRefId = ko.observable();
        self.dataSource72 = ko.observable();

        self.recordDataSource = ko.observableArray();
        self.transactionType = ko.observable();
        self.response = ko.observable(false);
        self.selectedRecord = ko.observable();
        self.recordDetails = ko.observable();
        self.showBackButton = ko.observable(true);
        self.fromFileUpload = ko.observable(true);

        rootParams.baseModel.registerComponent("record-view", "file-upload");
        rootParams.baseModel.registerComponent("view-invoice-details", "supply-chain-finance");

        self.fileUploadsfilesfileRefIdrecordsgetfileRefId(rootParams.data[0]().fileId);
        self.fileUploadsfilesfileRefIdrecordsrecordRefIdgetfileRefId(rootParams.data[0]().fileId);
        self.fileUploadsfilesfileRefIdrecordsgettransactionType(rootParams.data[0]().transaction);
        self.transactionType(rootParams.data[0]().transaction);
        self.selectedFile = rootParams.data[0];

        self.onRecordSelected = function (data) {

            if (data.status === "COMPLETED") {
                Model.readRecord(self.fileUploadsfilesfileRefIdrecordsgetfileRefId(), data.recRefId).then(function (response) {
                    rootParams.dashboard.loadComponent("view-invoice-details", {
                        invoiceNo: response.recordDetails.externalReferenceId,
                        role: "S"
                    });
                });
            } else {
                self.selectedRecord(data);

                Model.readRecord(self.fileUploadsfilesfileRefIdrecordsgetfileRefId(), data.recRefId).then(function (response) {
                    self.recordDetails(response.recordDetails);

                    const params = {
                        selectedFile: self.selectedFile,
                        selectedRecord: self.selectedRecord,
                        recordDetails: self.recordDetails,
                        showBackButton: self.showBackButton,
                        invoiceNls: self.nls
                    };

                    rootParams.dashboard.loadComponent("record-view", params);
                });
            }

        };

        Model.getRecords(self.fileUploadsfilesfileRefIdrecordsgetfileRefId(), self.fileUploadsfilesfileRefIdrecordsgetpageSize(), self.fileUploadsfilesfileRefIdrecordsgetpageNumber(), self.fileUploadsfilesfileRefIdrecordsgetfromAmount(), self.fileUploadsfilesfileRefIdrecordsgettoAmount(), self.fileUploadsfilesfileRefIdrecordsgetcurrency(), self.fileUploadsfilesfileRefIdrecordsgetvalueDateStart(), self.fileUploadsfilesfileRefIdrecordsgetvalueDateEnd(), self.fileUploadsfilesfileRefIdrecordsgetrecordStatus(), self.fileUploadsfilesfileRefIdrecordsgetbeneName(), self.fileUploadsfilesfileRefIdrecordsgetcreditAccount(), self.fileUploadsfilesfileRefIdrecordsgetdebitAccount(), self.fileUploadsfilesfileRefIdrecordsgettransactionType(), self.fileUploadsfilesfileRefIdrecordsgetpayeeType(), self.fileUploadsfilesfileRefIdrecordsgetaccountType()).then(function (response) {

            Model.getRecordStatus().then(function (status) {

                if(response.recordDetails){
                    for(let i = 0; i< response.recordDetails.length > 0 ; i++){
                        if(status.enumRepresentations && status.enumRepresentations.length > 0 && status.enumRepresentations[0].data && status.enumRepresentations[0].data.length > 0){
                            for(let j = 0;j< status.enumRepresentations[0].data.length; j++){
                                if(response.recordDetails[i].status === status.enumRepresentations[0].data[j].code){
                                    response.recordDetails[i].statusDescription = status.enumRepresentations[0].data[j].description;
                                    break;
                                }
                            }

                            if(!response.recordDetails[i].statusDescription){
                                response.recordDetails[i].statusDescription = "-";
                            }
                        } else {
                            response.recordDetails[i].statusDescription = "-";
                        }
                    }

                    self.recordDataSource(response.recordDetails);
                }

            });

            self.dataSource72(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.recordDataSource, {
                idAttribute: "recRefId"
            })));

            self.response(true);
        });
    };
});