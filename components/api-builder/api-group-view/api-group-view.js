define([

    "knockout",

    "./model",
    "ojL10n!resources/nls/api-group-view",
    "ojs/ojselectcombobox",
    "ojs/ojvalidationgroup",
    "ojs/ojbutton",
    "ojs/ojknockout-validation"
], function(ko, APIGroupViewModel, resourceBundle) {
    "use strict";

    return function(rootParams) {
        const self = this;

        ko.utils.extend(self, rootParams.rootModel);
        rootParams.baseModel.registerComponent("api-group-edit", "api-builder");
        rootParams.baseModel.registerComponent("api-group-search", "api-builder");
        self.resource = resourceBundle;
        self.groupName = ko.observable();
        self.isauthorizationRequired = ko.observable(false);
        rootParams.dashboard.headerName(self.resource.headerName);
        self.apiGroupDTO = rootParams.rootModel.params.viewDto;

        if (!self.apiGroupDTO.authorizationType) {
            self.isauthorizationRequired(false);
        } else {
            self.isauthorizationRequired(true);
        }

        APIGroupViewModel.getApiGroups().then(function(data) {
            ko.utils.arrayForEach(data.apiGroupList, function(item) {
                if (rootParams.rootModel.params.viewDto.groupCode === item.groupCode) {
                    self.groupName(item.groupCode);
                }
            });

            self.apiGroupsloaded(true);
        });

        self.onClickCancel = function() {
            rootParams.dashboard.switchModule();
        };

        self.onClickBack = function() {
            rootParams.dashboard.loadComponent("api-group-search", self);
        };

        self.edit = function() {
            rootParams.dashboard.loadComponent("api-group-edit", self);
        };
    };
});