define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/alerts",
    "ojs/ojselectcombobox",
    "ojs/ojvalidation",
    "ojs/ojbutton",
    "ojs/ojknockout-validation",
    "ojs/ojtable",
    "ojs/ojarraytabledatasource",
    "ojs/ojpagingcontrol",
    "ojs/ojpagingtabledatasource",
    "ojs/ojlistview"
], function (oj, ko, $, AlertsMaintenanceSearchModel, resourceBundle) {
    "use strict";

    return function (Params) {
        const self = this;

        self.moduleTypeList = ko.observableArray();
        self.eventActivityList = ko.observableArray();
        self.showDropDown = ko.observable(false);
        self.moduleTypeLoaded = ko.observable(false);
        self.activityEventsAvailableModules = {};
        ko.utils.extend(self, Params.rootModel);
        Params.baseModel.registerComponent("alerts-maintenance", "alerts");
        self.nls = resourceBundle;
        self.payload = ko.observable();
        self.actionAndEventId = self.actionAndEventId || ko.observable();
        self.dataPassing = {};
        self.fetchedAlerts = self.fetchedAlerts || ko.observableArray();
        self.datasource = self.datasource || {};
        Params.baseModel.registerElement("action-widget");
        self.moduleType = self.moduleType || ko.observable();
        self.filterList = ko.observableArray();
        self.alertsFetched = self.alertsFetched || ko.observable(false);
        Params.dashboard.headerName(self.nls.alerts.labels.heading);

        let alertData;

        Promise.all([AlertsMaintenanceSearchModel.fetchEventDescriptionList(self.moduleType()), AlertsMaintenanceSearchModel.fetchModuleTypeList()]).then(function (response) {
            self.eventActivityList(response[0].activityEvents);
            self.moduleTypeLoaded(false);

            ko.utils.arrayForEach(response[0].activityEvents, function (item) {
                self.activityEventsAvailableModules[item.moduleType] = item.moduleType;
            });

            for (let i = 0; i < response[1].enumRepresentations.length; i++) {
                for (let j = 0; j < response[1].enumRepresentations[i].data.length; j++) {
                    if (self.activityEventsAvailableModules[response[1].enumRepresentations[i].data[j].code]) {
                        self.moduleTypeList.push({
                            description: response[1].enumRepresentations[i].data[j].description,
                            code: response[1].enumRepresentations[i].data[j].code
                        });

                        self.activityEventsAvailableModules[response[1].enumRepresentations[i].data[j].code] = response[1].enumRepresentations[i].data[j].description;
                    }
                }
            }

            self.showDropDown(true);
            self.moduleTypeLoaded(true);
        });

        self.resetForm = function () {
            self.alertsFetched(false);
            self.actionAndEventId("");
            self.moduleType("");
            self.fetchedAlerts.removeAll();
            $(".random").ojSelect("reset");
            self.dataPassing.eventId = null;
            self.dataPassing.activityId = null;
        };

        self.createNew = function () {
            const context = {};

            context.mode = "CREATE";
            context.moduleTypeLoaded = self.moduleTypeLoaded;
            context.moduleTypeList = self.moduleTypeList;
            context.activityEventsAvailableModules = self.activityEventsAvailableModules;
            Params.dashboard.loadComponent("alerts-maintenance", context);
        };

        self.cancelConfirmation = function () {
            Params.dashboard.switchModule(true);
        };

        self.closeDialogBox = function () {
            $("#cancelDialog").hide();
        };

        self.setDatasource = function () {
            const searchedAlertsMap = $.map(alertData, function (alert) {
                alert.mode = "VIEW";
                alert.id = alert.alertDTO.alertName;

                return alert;
            });

            self.datasource = new oj.ArrayTableDataSource(searchedAlertsMap, {
                idAttribute: "id"
            });

            self.paginationDataSource = new oj.PagingTableDataSource(self.datasource);
            self.alertsFetched(true);
        };

        const moduleTypeDispose = self.moduleType.subscribe(function (newValue) {
            self.showDropDown(false);

            AlertsMaintenanceSearchModel.fetchEventDescriptionList(newValue).done(function (data) {
                self.eventActivityList(data.activityEvents);
                self.showDropDown(true);
                self.dataPassing.eventId = null;
                self.dataPassing.activityId = null;
                self.actionAndEventId("");
                $(".random").ojSelect("reset");
            });
        });

        self.eventOptionChangeHandler = function (event) {
            self.filterList = ko.computed(function () {
                return ko.utils.arrayFilter(self.eventActivityList(), function (events) {
                    return events.activityEventDescription === event.detail.value;
                });
            });

            if (self.filterList()[0]) {
                self.selectedData = self.filterList()[0];
                self.actionAndEventId(self.selectedData.activityEventDescription);
                self.dataPassing.eventId = self.selectedData.eventId;
                self.dataPassing.activityId = self.selectedData.activityId;
            } else {
                self.dataPassing.eventId = null;
                self.dataPassing.activityId = null;
            }

            self.dispose = function () {
                self.filterList.dispose();
            };
        };

        self.fetchSearchAlerts = function () {
            self.alertsFetched(false);

            AlertsMaintenanceSearchModel.fetchAlerts(self.dataPassing.activityId, self.dataPassing.eventId, self.moduleType()).done(function (data) {
                self.fetchedAlerts(data.alertResponseDTO);

                alertData = $.map(self.fetchedAlerts(), function (alertData) {
                    alertData.mode = "";

                    return alertData;
                });

                self.setDatasource();
            });
        };

        self.onAlertSelected = function (data) {
            if (Params.baseModel.small()) {
                data.mode = "VIEW";
                data.dataPassing = self.dataPassing;
                Params.dashboard.loadComponent("alerts-maintenance", data, self);
            } else {
                let context = {
                    party: {}
                };

                context = data;
                context.mode = "VIEW";
                context.dataPassing = self.dataPassing;
                Params.dashboard.loadComponent("alerts-maintenance", context, self);
            }
        };

        self.dispose = function () {
            moduleTypeDispose.dispose();
        };
    };
});