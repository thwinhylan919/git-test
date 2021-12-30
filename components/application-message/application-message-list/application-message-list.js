define([
    "ojs/ojcore",
    "ojL10n!resources/nls/application-message-list",
    "./model",
    "jquery",
    "knockout",
    "ojs/ojformlayout",
    "ojs/ojvalidationgroup",
    "ojs/ojinputtext",
    "ojs/ojselectcombobox",
    "ojs/ojbutton",
    "ojs/ojtable",
    "ojs/ojarraytabledatasource",
    "ojs/ojlabel",
    "ojs/ojpagingtabledatasource",
    "ojs/ojpagingcontrol"
], function (oj, resourceBundle, Model, $, ko) {
    "use strict";

    return function (params) {
        const self = this;

        self.nls = resourceBundle;
        self.resourceBundle = resourceBundle;
        params.dashboard.headerName(self.nls.componentHeader);
        self.applicationMessagesgetVar = ko.observable();
        self.applicationMessagesgetlocale = ko.observable();
        self.applicationMessagesgetcode = ko.observable();
        self.enumerationslocalegetVar = ko.observable();
        self.showLocale = ko.observable(false);
        self.listLoaded = ko.observable(false);
        self.dataSource16 = ko.observableArray([]);
        self.localeDescription = null;
        self.taxonomyDefinition = params.dashboard.getTaxonomyDefinition("com.ofss.digx.app.common.dto.message.ApplicationMessageDTO");
        params.baseModel.registerElement("help");
        params.baseModel.registerComponent("application-message-view", "application-message");
        params.baseModel.registerTransaction("application-message-create", "application-message");

        if (params.rootModel.params.context) {
            self.dataSource16(params.rootModel.params.context.dataSource16);
            self.listLoaded(true);
        }

        Model.enumerationslocaleget().then(function (response) {
            self.enumerationslocalegetVar(response);
            self.showLocale(true);
        });

        self.onClickCode72 = function (data) {
            params.dashboard.loadComponent("application-message-view", {
                code: data.code,
                locale: data.locale,
                localeDescription: self.localeDescription
            });
        };

        self.onClickSearch21 = function onClickSearch21() {
            if (!params.baseModel.showComponentValidationErrors(document.getElementById("tracker"))) {
                return;
            }

            for (let i = 0; i < self.enumerationslocalegetVar().enumRepresentations[0].data.length; i++) {
                if (self.applicationMessagesgetlocale() === self.enumerationslocalegetVar().enumRepresentations[0].data[i].code) {
                    self.localeDescription = self.enumerationslocalegetVar().enumRepresentations[0].data[i].description;
                }
            }

            Model.applicationMessagesget(self.applicationMessagesgetlocale(), self.applicationMessagesgetcode()).then(function (response) {
                if (response.applicationmessagedtos.length === 0) {
                    params.baseModel.showMessages(null, [self.nls.info.noRecordFound], "ERROR");
                } else {
                    const tempData = $.map(response.applicationmessagedtos, function (v) {
                        const newObj = {};

                        newObj.code = v.code;
                        newObj.message = v.message;
                        newObj.locale = v.locale;
                        newObj.localeDescription = self.localeDescription;

                        return newObj;
                    });

                    self.dataSource16(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(tempData, {
                        idAttribute: "code"
                    })));

                    self.listLoaded(true);
                }
            });
        };

        self.onClickCancel29 = function () {
            params.dashboard.switchModule();
        };

        self.onClickReset13 = function () {
            self.applicationMessagesgetcode("");
            self.applicationMessagesgetlocale("");
            self.listLoaded(false);
        };
    };
});