define([
    "ojs/ojcore",
    "knockout",
    "jquery",

    "./model",
    "ojL10n!resources/nls/sms-banking",
    "ojs/ojselectcombobox",
    "ojs/ojvalidation",
    "ojs/ojbutton",
    "ojs/ojknockout-validation",
    "ojs/ojtable",
    "ojs/ojarraytabledatasource",
    "ojs/ojpagingcontrol",
    "ojs/ojpagingtabledatasource",
    "ojs/ojlistview",
    "ojs/ojswitch"
], function (oj, ko, $, SMSBankingViewModel, resourceBundle) {
    "use strict";

    return function (Params) {
        const self = this;

        self.nls = resourceBundle;
        self.payload = ko.observable();
        self.menuSelection = ko.observable();
        self.menuSelected = ko.observable();
        self.menuOptions = ko.observableArray();
        self.disabledState = ko.observable(true);
        self.eventTemplateMap = ko.observableArray();
        self.smsSelected = ko.observable(false);
        self.missedCallSelected = ko.observable(false);
        self.isEventTemplateMapLoaded = ko.observable(false);
        self.resDataAttr = ko.observableArray();
        self.datasource = new oj.ArrayTableDataSource([]);
        Params.baseModel.registerElement("action-widget");
        Params.baseModel.registerComponent("sms-banking-search", "sms-banking");
        Params.baseModel.registerComponent("sms-banking-edit", "sms-banking");
        Params.dashboard.headerName(self.nls.events.labels.smsHeading);

        SMSBankingViewModel.fetcheventTemplateMappings(Params.rootModel.params.id, Params.rootModel.params.locale, Params.rootModel.params.menuSelected).then(function (data) {
            self.eventTemplateMap(data.eventTemplateDTO);
            self.isEventTemplateMapLoaded(true);
            self.resDataAttr(data.eventTemplateDTO.responseTemplate.responseDataAttributes);
            self.setDatasource();
        });

        self.menuOptions([{
            id: "S",
            label: self.nls.events.labels.smsTabHeading,
            disabled: false
        }, {
            id: "M",
            label: self.nls.events.labels.missedCallHeading,
            disabled: false
        }]);

        self.uiOptions = {
            menuFloat: "left",
            fullWidth: false,
            defaultOption: self.menuSelection
        };

        self.menuSelection.subscribe(function (newValue) {
            ko.utils.extend(Params.rootModel.params, {
                defaultTab: newValue
            });

            if (newValue === "S") {
                self.menuSelected(newValue);
                self.smsSelected(true);
                self.missedCallSelected(false);
                Params.dashboard.headerName(self.nls.events.labels.smsHeading);

                SMSBankingViewModel.fetcheventTemplateMappings(Params.rootModel.params.id, Params.rootModel.params.locale, Params.rootModel.menuSelected()).then(function (data) {
                    self.eventTemplateMap(data.eventTemplateDTO);
                    self.isEventTemplateMapLoaded(true);
                });
            }

            let eventMap;

            self.setDatasource = function () {
                eventMap = $.map(self.resDataAttr(), function (eventMap) {
                    const obj = {
                        responseDataAttributes: eventMap.attribute.attributeID
                    };

                    return obj;
                });

                self.datasource.reset(eventMap, {
                    idAttribute: "responseDataAttributes"
                });
            };

            if (newValue === "M") {
                self.menuSelected(newValue);
                self.smsSelected(false);
                self.missedCallSelected(true);
                Params.dashboard.headerName(self.nls.events.labels.missedCallHeading);

                SMSBankingViewModel.fetcheventTemplateMappings(Params.rootModel.params.id, Params.rootModel.params.locale, Params.rootModel.menuSelected()).then(function (data) {
                    self.eventTemplateMap(data.eventTemplateDTO);
                    self.isEventTemplateMapLoaded(true);
                });
            }
        });

        self.menuSelection(Params.rootModel.params.menuSelected);

        self.edit = function () {
            const context = {},
                parameters = {
                    eventTemplateMap: self.eventTemplateMap(),
                    menuSelected: self.menuSelected()
                };

            context.mode = "EDIT";
            Params.dashboard.loadComponent("sms-banking-edit", parameters);
        };

        self.cancel = function () {
            Params.dashboard.switchModule();
        };

        self.back = function () {
            Params.dashboard.loadComponent("sms-banking-search", "sms-banking");
        };
    };
});