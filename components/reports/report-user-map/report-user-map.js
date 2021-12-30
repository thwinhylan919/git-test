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
        rootParams.baseModel.registerComponent("review-report-user-map", "reports");
        rootParams.dashboard.headerName(self.Nls.reportUserMap);

        const getNewKoModel = function () {
            const KoModel = ReportUserMapModel.getNewModel();

            return ko.mapping.fromJS(KoModel);
        };

        self.ReportUserMapModel = getNewKoModel().ReportUserMapPaylaod;
        self.reportList = ko.observableArray();
        self.reportMap = {};
        self.flagOne = ko.observable(false);
        self.flagTwo = ko.observable(false);
        self.showEdit = ko.observable(false);
        self.isListReady = ko.observable(false);
        self.datasource = ko.observable();
        self.isEnabled = ko.observable(false);
        self.actionType = ko.observable(self.Nls.view);
        self.isAdmin = ko.observable(rootParams.rootModel.params.isAdmin);
        self.selectedUser = rootParams.rootModel.params.selectedUser;

        const user = {
            corporateuser: "U",
            Administrator: "A",
            CorporateAdmin: "C"
        };

        self.getMappedReports = function (userId) {
            ReportUserMapModel.listMappedReports(userId).done(function (data) {
                for (let i = 0; i < data.userTemplateRelationships.length; i++) {
                    self.reportMap[data.userTemplateRelationships[i].reportIdentifer] = data.userTemplateRelationships[i];
                }

                self.flagOne(true);
            });
        };

        self.getAllReports = function (userType) {
            const url = "reports/reportDefinition/reportType/" + user[userType] + "/definitions";

            ReportUserMapModel.listAllReports(url).done(function (data) {
                self.reportList(data.listResponseDTO);

                if (self.reportList().length > 0) {
                    self.showEdit(true);
                }

                self.flagTwo(true);
            });
        };

        self.getMappedReports(rootParams.rootModel.params.selectedUser.username);

        let userType;

        if (rootParams.rootModel.params.selectedUser.userGroups[0] === "corporateuser") {
            if (rootParams.rootModel.params.selectedUser.applicationRoles.indexOf("CorporateAdminMaker") !== -1 || rootParams.rootModel.params.selectedUser.applicationRoles.indexOf("CorporateAdminChecker") !== -1) {
                userType = "CorporateAdmin";
            } else {
                userType = "corporateuser";
            }
        } else if (rootParams.rootModel.params.selectedUser.userGroups[0] === "administrator") {
            userType = "Administrator";
        } else {
            rootParams.baseModel.showMessages(null, [self.Nls.invalidUser], "ERROR");

            return;
        }

        self.getAllReports(userType);

        ko.computed(function () {
            if (self.flagOne() && self.flagTwo()) {
                for (let i = 0; i < self.reportList().length; i++) {
                    const data = self.reportList()[i];

                    if (!self.reportMap[data.reportId]) {
                        data.isMapped = ko.observable(false);
                    } else {
                        data.isMapped = ko.observable(true);
                    }

                    self.reportList[i] = data;
                }

                self.datasource(new oj.ArrayTableDataSource(self.reportList, {
                    idAttribute: "reportId"
                }));

                self.isListReady(true);
            }
        });

        self.edit = function () {
            self.actionType(self.Nls.edit);
            self.isEnabled(true);
        };

        if (!rootParams.rootModel.params.selectedUser.isMapped) {
            self.edit();
        }

        self.initiate = function () {
            if (!rootParams.rootModel.params.selectedUser.isMapped) {
                if ($("input[name=selection]:checked").length === 0) {
                    rootParams.baseModel.showMessages(null, [self.Nls.userMapErrorMsg], "INFO");

                    return;
                }
            }

            self.ReportUserMapModel.reportIdentifers.removeAll();
            self.ReportUserMapModel.userId = rootParams.rootModel.params.selectedUser.username;

            if (self.isAdmin() === false) {
                self.ReportUserMapModel.partyId = rootParams.rootModel.params.selectedUser.partyId.displayValue;
            }

            self.ReportUserMapModel.reportIdentifers($("input[name=selection]:checked").map(function () {
                return this.value;
            }).get());

            self.actionType(self.Nls.review);

            rootParams.dashboard.loadComponent("review-report-user-map", {
                mode: "review",
                data: self.ReportUserMapModel,
                isAdmin: self.isAdmin(),
                selectedUser: rootParams.rootModel.params.selectedUser,
                getMappedReports: self.getMappedReports,
                confirm:self.confirm
            });
        };

        self.confirm = function (reportUserMapModel) {
            const reportMapPayload = ko.toJSON(reportUserMapModel);

            ReportUserMapModel.updateMap(reportMapPayload, rootParams.rootModel.params.selectedUser.username).done(function (data, status, jqXhr) {
                rootParams.dashboard.loadComponent("confirm-screen", {
                    jqXHR: jqXhr,
                    transactionName: self.Nls.transactionName
                }, self);
            });
        };

        self.back = function () {
            history.go(-1);
        };

        self.renderCheckBox = function (context) {
            const checkBox = $(document.createElement("input")),
                label = $(document.createElement("label"));

            checkBox.attr("type", "checkbox");
            checkBox.attr("value", context.row.reportId);
            checkBox.attr("name", "selection");
            label.attr("class", "oj-checkbox-label hide-label");
            checkBox.attr("id", context.row.reportId + "_labelID");
            label.attr("for", context.row.reportId + "_labelID");
            label.text(self.Nls.childCheckBox);

            if (!self.isEnabled()) {
                checkBox.prop("disabled", true);
            } else {
                checkBox.prop("disabled", false);
            }

            if (context.row.isMapped()) {
                checkBox.prop("checked", true);
            }

            $(context.cellContext.parentElement).append(checkBox);
            $(context.cellContext.parentElement).append(label);
        };

        self.renderHeaderCheckBox = function (context) {
            const checkBox = $(document.createElement("input")),
                label = $(document.createElement("label"));

            checkBox.attr("type", "checkbox");
            checkBox.attr("value", "selectAll");
            checkBox.attr("name", "selectionParent");
            checkBox.attr("id", "headerbox_labelID");
            label.attr("class", "oj-checkbox-label hide-label");
            label.attr("for", "headerbox_labelID");
            label.text(self.Nls.headerCheckBox);

            if (!self.isEnabled()) {
                checkBox.prop("disabled", true);
            } else {
                checkBox.prop("disabled", false);
            }

            $(context.headerContext.parentElement.firstElementChild.firstChild).append(checkBox);
            $(context.headerContext.parentElement.firstElementChild.firstChild).append(label);
        };

        self.isEnabled.subscribe(function (data) {
            if (data) {
                $("input[name=selection]").prop("disabled", false);
                $("input[name=selectionParent]").prop("disabled", false);
            } else {
                $("input[name=selectionParent]").prop("disabled", true);
                $("input[name=selection]").prop("disabled", true);
            }
        });

        oj.Context.getContext(document.querySelector("selector")).getBusyContext().whenReady().then(function () {
            $("input[name=selectionParent]").prop("checked", $("input[name=selection]:checked").length === $("input[name=selection]").length);

            $(document).on("change", "input[name=selection]", function () {
                $("input[name=selectionParent]").prop("checked", $("input[name=selection]:checked").length === $("input[name=selection]").length);
            });

            $(document).on("change", "input[name=selectionParent]", function () {
                const isHeaderCheckBoxChecked = $("input[name=selectionParent]").prop("checked");

                $("input[name=selection]").prop("checked", isHeaderCheckBoxChecked);

                if (!isHeaderCheckBoxChecked) {
                    $("input[name=sensitiveCheck]").prop("checked", false);
                    $("input[name=sensitiveCheck]").prop("disabled", true);
                } else {
                    $("input[name=sensitiveCheck]").prop("disabled", false);
                }
            });
        });
    };
});