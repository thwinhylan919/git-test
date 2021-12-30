define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/file-view",
    "ojs/ojknockout-validation",
    "ojs/ojinputtext",
    "ojs/ojselectcombobox",
    "ojs/ojdatetimepicker",
    "ojs/ojlistview",
    "ojs/ojmodel",
    "ojs/ojtable",
    "ojs/ojarraytabledatasource",
    "ojs/ojcollectiontabledatasource",
    "ojs/ojpagingcontrol",
    "ojs/ojpagingtabledatasource"
], function (oj, ko, $, fileViewModel, resourceBundle) {
    "use strict";

    return function (rootParams) {
        const self = this;

        self.currentSearchData = {};
        ko.utils.extend(self, rootParams.rootModel.params);
        self.Nls = resourceBundle.fileView;
        rootParams.dashboard.headerName(self.Nls.uploadedFiles);
        rootParams.baseModel.registerComponent("file-history", "file-upload");
        rootParams.baseModel.registerComponent("record-listing", "file-upload");
        rootParams.baseModel.registerElement("row");
        rootParams.baseModel.registerElement("page-section");
        rootParams.baseModel.registerElement("action-header");
        rootParams.baseModel.registerElement("action-widget");
        rootParams.baseModel.registerElement("date-time");
        rootParams.baseModel.registerElement("modal-window");
        rootParams.baseModel.registerElement("confirm-screen");
        self.selectedBtId = ko.observable();
        self.selectedStatus = ko.observable();
        self.selected = ko.observable(false);
        self.paymentTypeList = ko.observableArray();
        self.isPaymentTypeListLoaded = ko.observable(false);
        self.selectedPaymentType = ko.observable();
        self.searchEnabled = ko.observable(false);
        self.status = ko.observable();
        self.btIdList = ko.observableArray();
        self.sensitiveCheckMap = self.sensitiveCheckMap || {};
        self.isBTIDListLoaded = ko.observable(false);
        self.btIdMap = self.btIdMap || {};
        self.statusList = ko.observableArray();
        self.statusListMap = {};
        self.isStatusListLoaded = ko.observable(false);
        self.fromDate = ko.observable();
        self.toDate = ko.observable();
        self.pageNumber = ko.observable(1);
        self.viewing = self.viewing || ko.observable();
        self.fileDetails = ko.observableArray();
        self.fileDetailsArray = ko.observableArray();
        self.selectedFile = ko.observable();

        let clause = true;

        if (self.pagingdatasource) {
            clause = false;
        }

        if (clause) {
            self.pagingdatasource = ko.observable();
        }

        self.fileDetailsMap = self.fileDetailsMap || {};
        self.totalCount = ko.observable();
        self.today = oj.IntlConverterUtils.dateToLocalIso(rootParams.baseModel.getDate());
        self.transactionTypesMap = {};
        self.fileRefId = ko.observable();
        self.isDefault = ko.observable(true);
        self.fileViewFlag = ko.observable(true);

        self.searchedData = self.searchedData || {
            fileId: "",
            btid: "",
            fileStatus: "",
            fileName: "",
            uploadDateEndRange: "",
            uploadDateStartRange: "",
            paymentType: ""
        };

        if (self.response) {
            self.isDefault = ko.observable(false);
            self.searchedData.fileId = self.response().key.id;
            self.currentSearchData = self.searchedData;
        }

        self.searchedData = ko.mapping.fromJS(self.searchedData);

        self.searchEnable = function () {
            $("#search").slideToggle(function () {
                if ($("#search:hidden").length === 0) {
                    self.searchEnabled(true);
                } else {
                    self.searchEnabled(false);
                }
            });
        };

        self.searchEnable();

        self.closeSearch = function () {
            $("#search").slideToggle();
            self.searchEnabled(false);
        };

        self.refreshSearch = function () {
            self.searchedData.fileId("reset");
            self.searchedData.fileId("");
            self.searchedData.btid([]);
            self.searchedData.fileStatus([]);
            self.searchedData.fileName("");
            self.searchedData.uploadDateEndRange("");
            self.searchedData.uploadDateStartRange("");
            self.searchedData.paymentType([]);
        };

        self.valueChangeHandler = function (event) {
            if (event.detail.value) {
                self.selectedBtId(self.btIdMap[self.searchedData.btid()]);
                self.selected(true);
            }
        };

        self.paymentTypeValueChangeHandler = function (event) {
            self.selected(false);

            if (event.detail.value) {
                self.selectedPaymentType(self.searchedData.paymentType());
                self.selected(true);
            }
        };

        self.statusValueChangeHandler = function (event) {
            self.selected(false);

            if (event.detail.value) {
                self.selectedStatus(self.statusListMap[self.status()]);
                self.selected(true);
            }
        };

        self.fromDateChanged = function (event) {
            if (event.detail.value) {
                self.fromDate = new Date(event.detail.value);
                self.fromDate.setHours(0);
                self.fromDate.setMinutes(0);
                self.toDate = new Date(event.detail.value);
                self.toDate.setHours(23);
                self.toDate.setMinutes(59);
                self.toDate.setDate(self.fromDate.getDate() + 10);

                if (self.toDate > new Date(self.today)) { self.toDate = new Date(self.today); }

                self.fromDate = oj.IntlConverterUtils.dateToLocalIso(self.fromDate);
                self.toDate = oj.IntlConverterUtils.dateToLocalIso(self.toDate);

                if (self.searchedData.uploadDateEndRange() !== "" && (new Date(self.searchedData.uploadDateEndRange()) < new Date(self.searchedData.uploadDateStartRange()) || new Date(self.searchedData.uploadDateEndRange()) > self.toDate)) {
                    self.searchedData.uploadDateEndRange("");
                }
            }
        };

        fileViewModel.listFileIdentifiers().done(function (data) {
            self.btIdList.removeAll();

            for (let i = 0; i < data.userTemplateRelationships.length; i++) {
                self.btIdList.push(data.userTemplateRelationships[i].fileIdentifierRegistrationDTO);
                self.btIdMap[data.userTemplateRelationships[i].fileIdentifierRegistrationDTO.fileIdentifier] = data.userTemplateRelationships[i].fileIdentifierRegistrationDTO;
                self.sensitiveCheckMap[data.userTemplateRelationships[i].fileIdentifierRegistrationDTO.fileIdentifier] = data.userTemplateRelationships[i].sensitiveCheck;
            }

            self.isBTIDListLoaded(true);
        });

        fileViewModel.getFileStatus().done(function (data) {
            self.statusList(data.enumRepresentations[0].data);

            for (let i = 0; i < self.statusList().length; i++) {
                self.statusListMap[self.statusList()[i].code] = self.statusList()[i].description;
            }

            self.isStatusListLoaded(true);
        });

        self.generateURL = function () {
            self.viewing("");

            if (!self.isDefault()) {
                if (!self.currentSearchData.fileId) {
                    const params = (self.currentSearchData.btid ? "&fi=" + encodeURIComponent(self.currentSearchData.btid) : "") + (self.currentSearchData.fileStatus ? "&fileStatus=" + self.currentSearchData.fileStatus : "") + (self.currentSearchData.fileName ? "&fileName=" + encodeURIComponent(self.currentSearchData.fileName) : "") + (self.currentSearchData.paymentType ? "&transactionType=" + self.currentSearchData.paymentType : "") + (self.currentSearchData.uploadDateStartRange ? "&uploadDateStartRange=" + self.currentSearchData.uploadDateStartRange : "") + (self.currentSearchData.uploadDateEndRange ? "&uploadDateEndRange=" + self.currentSearchData.uploadDateEndRange : "");

                    self.viewing(self.Nls.searchResults);

                    return "fileUploads/files?pageSize=10&pageNumber=" + self.pageNumber() + params;
                }

                self.viewing(rootParams.baseModel.format(self.Nls.fileRefId, {
                    fileRefId: self.currentSearchData.fileId
                }));

                return "fileUploads/files?pageSize=10&pageNumber=" + self.pageNumber() + "&fileId=" + self.currentSearchData.fileId;
            }

            self.viewing(self.Nls.todayFile);
            self.searchedData.uploadDateStartRange(self.today);
            self.searchedData.uploadDateEndRange(self.today);

            return "fileUploads/files?pageSize=10&pageNumber=" + self.pageNumber() + (self.today ? "&uploadDateStartRange=" + self.today : "") + (self.today ? "&uploadDateEndRange=" + self.today : "");
        };

        self.searchFile = function () {
            let searchParametersCount = 0;

            self.searchedData.btid(self.searchedData.btid() + "");
            self.searchedData.fileStatus(self.searchedData.fileStatus() + "");
            self.searchedData.paymentType(self.searchedData.paymentType() + "");

            if (!self.searchedData.fileId()) {
                if ((self.searchedData.uploadDateStartRange() && !self.searchedData.uploadDateEndRange()) || (!self.searchedData.uploadDateStartRange() && self.searchedData.uploadDateEndRange())) {
                    rootParams.baseModel.showMessages(null, [self.Nls.dateSelectErrorMsg], "INFO");

                    return;
                }

                if (self.searchedData.btid()) {
                    searchParametersCount += 1;
                }

                if (self.searchedData.fileStatus()) {
                    searchParametersCount += 1;
                }

                if (self.searchedData.fileName()) {
                    searchParametersCount += 1;
                }

                if (self.searchedData.uploadDateStartRange()) {
                    searchParametersCount += 1;
                }

                if (self.searchedData.paymentType()) {
                    searchParametersCount += 1;
                }

                if (searchParametersCount < 2) {
                    rootParams.baseModel.showMessages(null, [self.Nls.fileViewErrorMsg], "INFO");
                } else {
                    self.isDefault(false);
                    self.pageNumber(1);
                    ko.utils.extend(self.currentSearchData, ko.mapping.toJS(self.searchedData));
                    self.createTableSource();
                }
            } else {
                self.isDefault(false);
                self.pageNumber(1);
                ko.utils.extend(self.currentSearchData, ko.mapping.toJS(self.searchedData));
                self.createTableSource();
            }
        };

        self.createTableSource = function () {
            self.fileDetailsCol = ko.observable();

            self.fileDetail = oj.Model.extend({
                idAttribute: "fileId",
                sync: self.myFetch
            });

            self.myFileDetail = new self.fileDetail();

            self.fileDetailsCollection = oj.Collection.extend({
                model: self.myFileDetail,
                sync: self.myFetch,
                fetchSize: 10,
                hasMore: true
            });

            self.fileDetailsCol(new self.fileDetailsCollection());

            self.pagingdatasource(new oj.PagingTableDataSource(new oj.CollectionTableDataSource(self.fileDetailsCol(), {
                idAttribute: "fileId"
            })));
        };

        self.myFetch = function (method, model, options) {
            if (method === "read" && model instanceof oj.Collection) {
                self.listFiles(options, model);
            }
        };

        self.listFiles = function (options, model) {
            self.pageNumber(Math.floor(options.startIndex / 10) + 1);

            fileViewModel.listFiles(self.generateURL()).done(function (data) {
                if (self.fileDetails()) {
                    self.fileDetails.removeAll();
                    self.fileDetailsArray.removeAll();
                    self.totalCount(data.totalCount);

                    if (data.fileDetails) {
                        for (let i = 0; i < data.fileDetails.length; i++) {
                            const fileData = data.fileDetails[i].fileUpload;

                            fileData.fileStatusDesc = self.statusListMap[fileData.fileStatus];
                            fileData.fileStatusLower = fileData.fileStatus.toLowerCase();
                            fileData.fileId = fileData.key.id;
                            fileData.description = fileData.fileIdentifier + "-" + fileData.fileIdentifierDescription;

                            if (self.btIdMap[fileData.fileIdentifier]) {
                                fileData.financial = self.btIdMap[fileData.fileIdentifier].fileTemplateDTO.financial;
                                fileData.accountingType = self.btIdMap[fileData.fileIdentifier].fileTemplateDTO.accountingType;
                                fileData.readOnly = false;
                            } else {
                                fileData.readOnly = true;
                            }

                            fileData.paymentType = self.transactionTypesMap[fileData.transaction];
                            self.fileDetailsMap[fileData.fileId] = fileData;
                            self.fileDetails.push(fileData);
                        }
                    }

                    for (let m = 0; m < self.fileDetails().length; m++) {
                        const obj = ko.utils.arrayFirst(self.fileDetailsArray(), function (element) {
                            return element.fileId === self.fileDetails()[m].fileId;
                        });

                        if (!obj) {
                            self.fileDetailsArray.push(self.fileDetails()[m]);
                        }
                    }

                    options.success(self.fileDetailsArray());
                    model.totalResults = self.totalCount();
                }
            });
        };

        self.onFileSelectedInTable = function (event) {
            if (event.detail.value) {
                if (event.detail.value.startKey.row) {
                    self.selectedFile(self.fileDetailsMap[event.detail.value.startKey.row]);

                    rootParams.dashboard.loadComponent("record-listing", [
                        self.selectedFile(),
                        self.statusList(),
                        self.sensitiveCheckMap,
                        self.fileViewFlag()
                    ], self);
                }
            }
        };

        self.onFileSelected = function () {
            self.selectedFile(self.fileDetailsMap[this]);

            rootParams.dashboard.loadComponent("record-listing", [
                self.selectedFile(),
                self.statusList(),
                self.sensitiveCheckMap,
                self.fileViewFlag()
            ], self);
        };

        fileViewModel.getPaymentTypes().done(function (result) {
            self.paymentTypeList(result.enumRepresentations[0].data);

            for (let i = 0; i < self.paymentTypeList().length; i++) {
                self.transactionTypesMap[self.paymentTypeList()[i].code] = self.paymentTypeList()[i].description;
            }

            self.isPaymentTypeListLoaded(true);

            if (clause) {
                self.createTableSource();
            }
        });

        self.parseDate = function (localeDate) {
            const date = new Date(localeDate),
                year = date.getFullYear(),
                month = date.getMonth() + 1,
                day = date.getDate();

            return year + "-" + (month < 10 ? "0" + month : month) + "-" + (day < 10 ? "0" + day : day);
        };

        self.deleteFile = function () {
            $("#confirm-dialog").trigger("openModal");
            self.fileRefId(this.fileId);
        };

        self.yes = function () {
            $("#confirm-dialog").hide();

            fileViewModel.deleteFile(self.fileRefId()).done(function (data, status, jqXhr) {
                rootParams.dashboard.loadComponent("confirm-screen", {
                    jqXHR: jqXhr,
                    transactionName: self.Nls.transactionName
                }, self);
            });
        };

        self.no = function () {
            $("#confirm-dialog").hide();
        };
    };
});