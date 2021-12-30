define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/scheduled-reports",
    "ojs/ojknockout-validation",
    "ojs/ojinputtext",
    "ojs/ojselectcombobox",
    "ojs/ojdatetimepicker",
    "ojs/ojlistview",
    "ojs/ojtable",
    "ojs/ojarraytabledatasource",
    "ojs/ojpagingcontrol",
    "ojs/ojcollectiontabledatasource"
], function (oj, ko, $, scheduledReportsModel, resourceBundle) {
    "use strict";

    return function (rootParams) {
        const self = this;

        ko.utils.extend(rootParams.rootModel);
        self.Nls = resourceBundle.reportList;
        rootParams.dashboard.headerName(self.Nls.scheduledReports);
        rootParams.baseModel.registerElement("row");
        rootParams.baseModel.registerElement("page-section");
        rootParams.baseModel.registerElement("action-header");
        rootParams.baseModel.registerElement("action-widget");
        rootParams.baseModel.registerElement("date-time");
        rootParams.baseModel.registerComponent("scheduled-report-details", "reports");
        self.reportType = ko.observable();
        self.scheduledReportTypesList = ko.observableArray();
        self.reportTypeListMap = {};
        self.selectedreportType = ko.observable();
        self.searchEnabled = ko.observable(false);
        self.reportTypeList = ko.observableArray();
        self.isReportTypeListLoaded = ko.observable(false);
        self.dataLoaded = ko.observable(false);
        self.allDataLoaded = ko.observable(false);

        const userType = rootParams.dashboard.appData.segment;

        scheduledReportsModel.getAllListData(userType).then(function (data) {
            scheduledReportsModel.getReportTypes(userType).then(function (dataReportType) {
                for (let i = 0; i < dataReportType.listResponseDTO.length; i++) {
                    self.reportTypeList.push(dataReportType.listResponseDTO[i]);
                    self.reportTypeListMap[self.reportTypeList()[i].reportId] = self.reportTypeList()[i];
                }

                self.isReportTypeListLoaded(true);

                for (let j = 0; j < self.reportTypeList().length; j++) {
                    if (self.reportTypeList()[j].allowedReportFrequency === "SCHEDULED" || self.reportTypeList()[j].allowedReportFrequency === "BOTH") {
                        self.scheduledReportTypesList.push(self.reportTypeList()[j]);
                    }
                }

                let tempData = null;

                tempData = $.map(data.listResponseDTO, function (v) {
                    const newObj = {};

                    newObj.reportId = v.reportIdentifier;
                    newObj.reportName = v.reportIdentifier ? self.reportTypeListMap[v.reportIdentifier].description : "-";
                    newObj.reportRequestIdentifier = v.reportRequestIdentifier || "-";
                    newObj.reportSchFreq = v.reportSchFreq || "-";
                    newObj.startTime = v.startTime ? v.startTime : "-";
                    newObj.startTimeISO = v.startTime;
                    newObj.endTime = v.endTime ? v.endTime : "-";
                    newObj.endTimeISO = v.endTime;

                    return newObj;
                });

                self.datasource = new oj.PagingTableDataSource(new oj.ArrayTableDataSource(tempData, {
                    idAttribute: "reportRequestIdentifier"
                }));

                self.allDataLoaded(true);
            });
        });

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

        self.cancelSearch = function () {
            $("#search").slideToggle();
            self.searchEnabled(false);
        };

        self.clearSearch = function () {
            self.selectedreportType([]);
        };

        self.searchReport = function () {
            self.dataLoaded(false);
            self.allDataLoaded(false);

            scheduledReportsModel.getListData(self.selectedreportType(), userType).then(function (data) {
                let tempData = null;

                tempData = $.map(data.listResponseDTO, function (v) {
                    const newObj = {};

                    newObj.reportId = v.reportIdentifier;
                    newObj.reportName = v.reportIdentifier ? self.reportTypeListMap[v.reportIdentifier].description : "-";
                    newObj.reportRequestIdentifier = v.reportRequestIdentifier || "-";
                    newObj.reportSchFreq = v.reportSchFreq || "-";
                    newObj.startTime = v.startTime ? v.startTime : "-";
                    newObj.startTimeISO = v.startTime;
                    newObj.endTime = v.endTime ? v.endTime : "-";
                    newObj.endTimeISO = v.endTime;

                    return newObj;
                });

                self.datasource = new oj.PagingTableDataSource(new oj.ArrayTableDataSource(tempData, {
                    idAttribute: "reportRequestIdentifier"
                }));

                self.dataLoaded(true);
            });
        };

        self.viewReportDetails = function (data) {
            rootParams.dashboard.loadComponent("scheduled-report-details", {
                reportData: data,
                data: rootParams.rootModel.params.data,
                formatMap: rootParams.rootModel.params.formatMap,
                todayDate: rootParams.rootModel.params.todayDate
            });
        };
    };
});