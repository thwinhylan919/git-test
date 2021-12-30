define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/report-user-map",
    "ojs/ojinputtext",
    "ojs/ojselectcombobox",
    "ojs/ojpagingcontrol",
    "ojs/ojradioset",
    "ojs/ojtable",
    "ojs/ojarraytabledatasource"
], function (oj, ko, $, ReportUserMapModel, resourceBundle) {
    "use strict";

    return function (rootParams) {
        const self = this;

        ko.utils.extend(rootParams.rootModel);
        self.Nls = resourceBundle.reportUserMap;
        self.parameters = ko.mapping.toJS(rootParams.rootModel.params.data);
        rootParams.baseModel.registerElement("action-header");
        rootParams.dashboard.headerName(self.Nls.reportUserMap);
        self.reportList = ko.observableArray();
        self.datasource = ko.observable();
        self.userType = ko.observable();
        self.isUserTypeFetched = ko.observable(false);
        self.userDetails = ko.observableArray();
        self.isReportListLoaded = ko.observable(false);
        self.isAdmin = ko.observable(rootParams.rootModel.params.isAdmin);
        self.selectedUser = rootParams.rootModel.params.selectedUser;
        self.confirm = rootParams.rootModel.params.confirm;
        self.mode = rootParams.rootModel.params.mode;
        self.ReportUserMapModel = rootParams.rootModel.params.data;

        const user = {
                corporateuser: "U",
                Administrator: "A",
                CorporateAdmin: "C"
            },
            mappedReports = self.parameters.reportIdentifers;

        self.getAllReports = function (userType) {
            const url = "reports/reportDefinition/reportType/" + user[userType] + "/definitions";

            ReportUserMapModel.listAllReports(url).done(function (data) {
                self.reportList(data.listResponseDTO);

                for (let i = 0; i < self.reportList().length; i++) {
                    const reportData = self.reportList()[i];

                    reportData.isMapped = ko.observable(false);

                    for (let j = 0; j < mappedReports.length; j++) {
                        if (mappedReports[j] === reportData.reportId) {
                            reportData.isMapped = ko.observable(true);
                            break;
                        } else {
                            reportData.isMapped = ko.observable(false);
                        }
                    }

                    self.reportList[i] = reportData;
                }

                self.isReportListLoaded(true);
            });
        };

        ReportUserMapModel.fetchUserDetails(self.parameters.userId).done(function (data) {
            self.userDetails(data.userDTO);
            self.userType(data.userDTO.userType);
            self.isUserTypeFetched(true);
            rootParams.rootModel.params.getMappedReports(rootParams.rootModel.params.selectedUser.username);

            let userType;

            if (rootParams.rootModel.params.selectedUser.userGroups[0] === "corporateuser") {
                if (rootParams.rootModel.params.selectedUser.applicationRoles.indexOf("CorporateAdminMaker") !== -1 || rootParams.rootModel.params.selectedUser.applicationRoles.indexOf("CorporateAdminChecker") !== -1) {
                    userType = "CorporateAdmin";
                } else {
                    userType = "corporateuser";
                }
            } else if (rootParams.rootModel.params.selectedUser.userGroups[0] === "administrator") {
                userType = "Administrator";
            }

            self.getAllReports(userType);
        });

        self.datasource(new oj.ArrayTableDataSource(self.reportList, {
            idAttribute: "reportId"
        }));

        self.back = function () {
            history.go(-1);
        };

        self.renderCheckBox = function (context) {
            const checkBoxRv = $(document.createElement("input")),
                labelRv = $(document.createElement("label"));

            checkBoxRv.attr("type", "checkbox");
            checkBoxRv.attr("value", context.row.reportId);
            checkBoxRv.attr("name", "selectionRv");
            labelRv.attr("class", "oj-checkbox-label hide-label");
            checkBoxRv.attr("id", context.row.reportId + "_labelIDRv");
            labelRv.attr("for", context.row.reportId + "_labelIDRv");
            labelRv.text(self.Nls.childCheckBox);
            checkBoxRv.prop("disabled", true);

            if (context.row.isMapped()) {
                checkBoxRv.prop("checked", true);
            }

            $(context.cellContext.parentElement).append(checkBoxRv);
            $(context.cellContext.parentElement).append(labelRv);
        };

        self.renderHeaderCheckBox = function (context) {
            const checkBoxRv = $(document.createElement("input")),
                labelRv = $(document.createElement("label"));

            checkBoxRv.attr("type", "checkbox");
            checkBoxRv.attr("value", "selectAllRv");
            checkBoxRv.attr("name", "selectionParentRv");
            checkBoxRv.attr("id", "headerbox_labelIDRv");
            labelRv.attr("class", "oj-checkbox-label hide-label");
            labelRv.attr("for", "headerbox_labelIDRv");
            labelRv.text(self.Nls.headerCheckBox);
            checkBoxRv.prop("disabled", true);
            $(context.headerContext.parentElement.firstElementChild.firstChild).append(checkBoxRv);
            $(context.headerContext.parentElement.firstElementChild.firstChild).append(labelRv);
        };

        $(document).on("ojready", function () {
            $("input[name=selectionParentRv]").prop("checked", $("input[name=selectionRv]:checked").length === $("input[name=selectionRv]").length);
        });
    };
});