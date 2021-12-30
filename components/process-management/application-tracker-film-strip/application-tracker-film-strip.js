define([

    "knockout",
    "text!./application-tracker-film-strip.json",
    "ojL10n!resources/nls/application-tracker-film-strip",
    "ojs/ojknockout",
    "ojs/ojfilmstrip",
    "ojs/ojavatar"
], function(ko, ModuleMap, resourceBundle) {
    "use strict";

    return function(rootParams) {
        const self = this;

        self.moduleMap = JSON.parse(ModuleMap).modules;
        self.nls = resourceBundle;
        rootParams.dashboard.headerName(self.nls.header);
        self.moduleData = ko.observableArray([]);
        self.isModuleDataLoaded = ko.observable(false);
        rootParams.baseModel.registerComponent("hover-text-image","process-management");

        let key;

        for (key in self.moduleMap) {
            if (key) {
                const currData = {
                    moduleCode: key,
                    moduleDescription: self.moduleMap[key].description,
                    moduleImg: self.moduleMap[key].img,
                    moduleComponent: self.moduleMap[key].loadComponent,
                    moduleName:self.moduleMap[key].moduleName
                };

                rootParams.baseModel.registerComponent(self.moduleMap[key].loadComponent, self.moduleMap[key].moduleName);
                self.moduleData.push(currData);
            }
        }

        self.isModuleDataLoaded = ko.observable(true);

        self.selectModule = function(event) {
            const parameters = {
                selectedModuleDetails: event.$data
            };

            rootParams.dashboard.loadComponent(event.$data.moduleComponent, parameters);
        };
    };
});