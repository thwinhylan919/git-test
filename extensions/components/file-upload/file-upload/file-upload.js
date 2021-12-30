define([
    "knockout",
    "jquery",
    "./model",
    "ojL10n!extensions/resources/nls/upload-file",
    "ojs/ojknockout-validation",
    "ojs/ojinputtext",
    "ojs/ojselectcombobox",
    "ojs/ojlistview"
], function(ko, $, fileUploadViewModel, resourceBundle) {
    "use strict";

    return function(rootParams) {
        const self = this;

        ko.utils.extend(self, rootParams.rootModel);
        rootParams.baseModel.registerElement("page-section");
        rootParams.baseModel.registerElement("row");
        rootParams.baseModel.registerElement("confirm-screen");
        rootParams.baseModel.registerComponent("file-input", "file-upload");
        self.Nls = resourceBundle.fileUpload;
        rootParams.dashboard.headerName(self.Nls.fileUpload);
        self.selectedBtId = ko.observable();
        self.selected = ko.observable(false);
        self.btid = ko.observable();
        self.btIdList = ko.observableArray();
        self.isBTIDListLoaded = ko.observable(false);
        self.btIdMap = {};
        self.transactionTypesMap = {};
        self.closedEnumsMap = {};
        self.stage1 = ko.observable(true);
        self.stage2 = ko.observable(false);
        self.response = ko.observable();
        self.validationTracker = ko.observable();

        self.valueChangeHandler = function(event) {
            if (event.detail.value) {
                self.selectedBtId(self.btIdMap[event.detail.value]);
                self.selected(true);
                $(".fileid-info").hide().slideDown();
            }
        };

        fileUploadViewModel.listBTId().done(function(data) {
            for (let i = 0; i < data.userTemplateRelationships.length; i++) {
                self.btIdList.push(data.userTemplateRelationships[i].fileIdentifierRegistrationDTO);
                self.btIdMap[data.userTemplateRelationships[i].fileIdentifierRegistrationDTO.fileIdentifier] = data.userTemplateRelationships[i].fileIdentifierRegistrationDTO;
            }

            self.isBTIDListLoaded(true);
        });

        fileUploadViewModel.getTransactionTypes().done(function(data) {
            for (let i = 0; i < data.enumRepresentations[0].data.length; i++) {
                self.transactionTypesMap[data.enumRepresentations[0].data[i].code] = data.enumRepresentations[0].data[i].description;
            }
        });

        fileUploadViewModel.getApprovalTypes().done(function(data) {
            for (let i = 0; i < data.enumRepresentations[0].data.length; i++) {
                self.closedEnumsMap[data.enumRepresentations[0].data[i].code] = data.enumRepresentations[0].data[i].description;
            }
        });

        fileUploadViewModel.getFileFormatTypes().done(function(data) {
            for (let i = 0; i < data.enumRepresentations[0].data.length; i++) {
                self.closedEnumsMap[data.enumRepresentations[0].data[i].code] = data.enumRepresentations[0].data[i].description;
            }
        });

        fileUploadViewModel.getAccountingTypes().done(function(data) {
            for (let i = 0; i < data.enumRepresentations[0].data.length; i++) {
                self.closedEnumsMap[data.enumRepresentations[0].data[i].code] = data.enumRepresentations[0].data[i].description;
            }
        });

        self.showFile = function() {
            rootParams.baseModel.registerComponent("file-view", "file-upload");

            const params = {
                btIdList: self.btIdList,
                btIdMap: self.btIdMap,
                btid: self.btid,
                closedEnumsMap: self.closedEnumsMap,
                isBTIDListLoaded: self.isBTIDListLoaded,
                response: self.response,
                selected: self.selected,
                selectedBtId: self.selectedBtId,
                stage1: self.stage1,
                stage2: self.stage2,
                transactionTypesMap: self.transactionTypesMap,
                validationTracker: self.validationTracker
            };

            rootParams.dashboard.loadComponent("file-view", params);
        };

        self.uploadDocument = function() {
            if (!rootParams.baseModel.showComponentValidationErrors(self.validationTracker())) {
                return;
            }

            if (document.getElementById("input").files.length === 0) {
                rootParams.baseModel.showMessages(null, [self.Nls.noFileFoundErrorMessage], "INFO");

                return;
            }

            const file = document.getElementById("input").files[0];

            if (file.size <= 0) {
                rootParams.baseModel.showMessages(null, [self.Nls.emptyFileErrorMsg], "INFO");

                return;
            } else if (file.size > 5242880) {
                rootParams.baseModel.showMessages(null, [self.Nls.fileSizeErrorMsg], "INFO");

                return;
            }

            fileUploadViewModel.uploadDocument(self.btid(), file).done(function(data, status, jqXHR) {
                self.response(data.fileUpload);
                self.stage1(false);

                const params = {
                    showFile: self.showFile,
                    jqXHR: jqXHR,
                    transactionName: self.Nls.transactionName,
                    template: "file-upload/file-upload-confirm-screen"
                };

                rootParams.dashboard.loadComponent("confirm-screen", params, self);
            });
        };

        self.back = function() {
            history.go(-1);
        };
    };
});