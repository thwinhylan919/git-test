define([

    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/record-view",
    "load!./record-view.json",
    "ojs/ojinputtext",
    "ojs/ojselectcombobox",
    "ojs/ojdatetimepicker",
    "ojs/ojlistview",
    "ojs/ojtable",
    "ojs/ojarraytabledatasource"
], function(ko, $, recordViewModel, resourceBundle, RecordViewJSON) {
    "use strict";

    return function(rootParams) {
        const self = this;

        ko.utils.extend(self, rootParams.rootModel.params);
        self.showBackButton = ko.observable(true);
        self.Nls = resourceBundle.recordView;
        self.rStatusList = ko.observableArray();
        self.loadPartialComponentName = ko.observable();
        rootParams.baseModel.registerElement(["action-header", "page-section"]);
        self.rStatusListMap = {};

        if (rootParams.rootModel.params !== undefined && rootParams.rootModel.params.selectedFile) {
            rootParams.dashboard.headerName(self.Nls.uploadedFiles);
        } else {
            self.selectedRecord = ko.observable(rootParams.data);
            self.showBackButton(false);
        }

        self.recordDetails = ko.observable();
        self.recordDetailsLoaded = ko.observable(false);
        self.recordType = ko.observable();
        self.transactionType = ko.observableArray();
        self.intmdFlag = ko.observable(true);
        self.intmdInternamFlag = ko.observable(false);
        self.transactionType = RecordViewJSON;

        recordViewModel.getRecordStatus().done(function(data) {
            self.rStatusList(data.enumRepresentations[0].data);

            for (let i = 0; i < self.rStatusList().length; i++) {
                self.rStatusListMap[self.rStatusList()[i].code] = self.rStatusList()[i].description;
            }

            self.readRecord();
        });

        self.readRecord = function() {
            recordViewModel.readRecord(self.selectedRecord().fileRefId, self.selectedRecord().recRefId).done(function(data) {
                if (data.recordDetails) {
                    const obj = data.recordDetails;

                    obj.recStatusDesc = self.rStatusListMap[obj.recStatus];
                    self.recordDetails(obj);
                    self.recordType(data.transactionType);

                    const transactionType = self.transactionType[data.transactionType];

                    if (transactionType) {
                        self.loadPartialComponentName(transactionType[0].partialComponentName);
                    }

                    if (obj.intmdCodeType === undefined) {
                        self.intmdFlag(false);
                    } else if (obj.intmdCodeType !== "BIC" && obj.intmdCodeType !== "NCC") {
                        self.intmdInternamFlag(true);
                    }
                }

                if (data.errorDetails) {
                    if (data.errorDetails.length !== 0) {
                        self.recordDetails().errorMessage = data.errorDetails[0].errorMessage;
                    }
                }

                self.recordDetailsLoaded(true);
            });
        };

        self.showModalWindow = function() {
            $("#confirm-dialog").trigger("openModal", "textarea");
        };

        self.deleteRecords = function(fileId, recordId) {
            $("#confirm-dialog").hide().trigger("closeModal");

            recordViewModel.deleteRecords(fileId, recordId).done(function(data, status, jqXhr) {
                rootParams.dashboard.loadComponent("confirm-screen", {
                    jqXHR: jqXhr,
                    transactionName: self.Nls.transactionName
                }, self);
            });
        };

        self.back = function() {
            history.go(-1);
        };
    };
});