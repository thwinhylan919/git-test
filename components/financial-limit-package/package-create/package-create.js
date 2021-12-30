define([
    "knockout",
    "ojL10n!resources/nls/limit-package-create",
    "ojs/ojinputtext",
    "ojs/ojradioset",
    "ojs/ojselectcombobox",
    "ojs/ojnavigationlist"
], function (ko, resourceBundle) {
    "use strict";

    return function (rootParams) {
        const self = this;

        ko.utils.extend(self, rootParams.rootModel);
        self.nls = resourceBundle;
        rootParams.dashboard.headerName(self.nls.pageHeader);
        self.packageAction = ko.observable(self.nls.package_create.create);
        rootParams.baseModel.registerElement("action-header");
        rootParams.baseModel.registerElement("page-section");
        self.selectedRoleValues = ko.observableArray();
        self.groupValid = ko.observable();
        self.isCorpAdmin = ko.observable();

        self.validationInstance = rootParams.baseModel.getTaxonomyValidator(self.taxonomy, "accessPointValue");

        if (self.params.action === "editAfterSave") {
            self.packageAction(self.nls.package_create.create);
        } else if (self.params.action === "cloneAfterEdit") {
            self.packageAction(self.nls.package_create.create);
        } else if (self.params.action === "CREATE") {
            self.packageAction(self.nls.package_create.create);
        } else {
            self.packageAction(self.nls.package_create.edit);
        }

        const partyId = {};

        partyId.value = rootParams.dashboard.userData.userProfile.partyId.value;
        partyId.displayValue = rootParams.dashboard.userData.userProfile.partyId.displayValue;

        if (partyId.value) {
            self.isCorpAdmin = true;
        } else {
            self.isCorpAdmin = false;
        }

        if (self.createPackageData().assignableToList().length !== 0) {
            self.createPackageData().assignableToList().forEach(function (v) {
                if (ko.isObservable(v.key.value)) {
                    if (v.key.value() !== null) {
                        self.selectedRoleValues.push(v.key.value());
                    }
                } else if (v.key.value !== null) {
                        self.selectedRoleValues.push(v.key.value);
                    }
            });
        }

        self.selectedRoleValues.subscribe(function (data) {
            self.createPackageData().assignableToList.removeAll();

            data.forEach(function (v) {
                const assign = {
                    key: {
                        type: "ROLE",
                        value: v
                    }
                };

                self.createPackageData().assignableToList.push(ko.mapping.fromJS(assign));
            });
        });
    };
});