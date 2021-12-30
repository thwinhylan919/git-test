define([
    "ojs/ojcore",
    "knockout",
    "./model",
    "ojL10n!resources/nls/reports",
    "ojs/ojlistview",
    "ojs/ojarraytabledatasource"
], function(oj, ko, ReportsModel, resourceBundle) {
    "use strict";

    return function(rootParams) {
        const self = this;

        self.nls = resourceBundle;
        self.reportDetails = ko.observableArray();
        self.datasource = ko.observable();
        self.dataSourceLoaded = ko.observable(false);
        rootParams.baseModel.registerComponent("report-list", "reports");

        const user = {
                CORP: "U",
                ADMIN: "A",
                CORPADMIN: "C",
                RETAIL: "U"
            },
            userType = user[rootParams.dashboard.appData.segment];

        if (rootParams.staticData) {
            self.dataSourceLoaded(false);
        } else {
            ReportsModel.listReportHistory(userType).then(function(data) {
                self.reportDetails.removeAll();
                self.dataSourceLoaded(false);
                ko.tasks.runEarly();

                if (data.listResponseDTO && data.listResponseDTO.length > 0) {
                    for (let i = 0; i < data.listResponseDTO.length; i++) {
                        const reportData = data.listResponseDTO[i];

                        reportData.description = self.nls.reportsDetails.reportDescription[reportData.description];

                        if (!reportData.executionDate) {
                            reportData.executionDate = "-";
                        }

                        self.reportDetails.push(reportData);
                    }

                    self.dataSource = new oj.ArrayTableDataSource(self.reportDetails(), {
                        idAttribute: "reportRequestId"
                    });

                    self.dataSourceLoaded(true);
                    ko.tasks.runEarly();
                } else {
                    self.dataSourceLoaded(false);
                }
            });
        }

        self.downloadReport = function(data) {
            ReportsModel.downloadReport(data.reportRequestId);
        };
    };
});