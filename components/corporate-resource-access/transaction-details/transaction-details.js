define([
        "ojL10n!resources/nls/transaction-details",
        "knockout",
        "ojs/ojformlayout",
        "ojs/ojvalidationgroup",
        "ojs/ojbutton"
    ],
    function (resourceBundle, ko) {
        "use strict";

        return function (params) {
            const self = this;

            self.nls = resourceBundle;

            const rootParams = params.rootModel.previousState ? params.rootModel.previousState : params.rootModel.params;

            params.baseModel.registerComponent("entity-details", "corporate-resource-access");
            params.baseModel.registerComponent("mapping-train", "corporate-resource-access");
            params.baseModel.registerComponent("attribute-transaction-mapping", "corporate-resource-access");
            params.baseModel.registerComponent("attribute-details", "corporate-resource-access");
            self.dataSource = rootParams.dataSource ? rootParams.dataSource : [];
            self.attributeData = rootParams.attributeData;
            self.accessData = rootParams.accessData;
            self.partyId = rootParams.partyId;
            self.partyName = rootParams.partyName;
            self.moduleName = rootParams.moduleName;
            self.userData = rootParams.userData;
            self.isSavePressed = ko.observable(false);
            self.stepArray = ko.observableArray(rootParams.stepArray);
            self.selectedStepValue = ko.mapping.fromJS(rootParams.selectedStepValue);
            self.selectedStepLabel = ko.mapping.fromJS(rootParams.selectedStepLabel);
            self.nextPressed = ko.mapping.fromJS(rootParams.nextPressed);
            self.editPressed = ko.mapping.fromJS(rootParams.editPressed);
            self.attributeName = rootParams.attributeName;
            self.isUserSelected = params.rootModel.params.isUserSelected;
            self.disableTree = ko.observable(false);

            if (!self.editPressed()) {
                self.disableTree(true);
            }

            if (self.isUserSelected) {
                params.dashboard.headerName(self.nls.componentHeaderUser);
            } else {
                params.dashboard.headerName(self.nls.componentHeaderParty);
            }

            self.onClickEdit = function (event) {
                if (event) {
                    self.editPressed(true);
                    self.disableTree(false);
                }

            };

            self.onClickCancel20 = function () {

                params.dashboard.switchModule();
            };

            self.onClickSave = function () {
                const dataPassed = ko.mapping.toJS({

                    accessData: self.accessData,
                    attributeData: self.attributeData,
                    partyId: self.partyId,
                    partyName: self.partyName,
                    moduleName: self.moduleName,
                    userData: self.userData,
                    dataSource: self.dataSource,
                    attributeName: self.attributeName,
                    nextPressed: self.nextPressed,
                    editPressed: self.editPressed,
                    isUserSelected: self.isUserSelected,
                    selectedStepValue: self.selectedStepValue,
                    selectedStepLabel: self.selectedStepLabel,
                    stepArray: self.stepArray,
                    accessLevel: params.rootModel.params.accessLevel,
                    selectedModule: params.rootModel.params.selectedModule,
                    value: params.rootModel.params.value,
                    disableTree: true
                });

                if (params.rootModel.params.accessLevel === "PARTY") {
                    params.dashboard.loadComponent("review-party-base", dataPassed);
                } else if (params.rootModel.params.accessLevel === "USER") {
                    params.dashboard.loadComponent("review-user-base", dataPassed);
                }
            };

            self.onClickBack = function () {
                self.selectedStepLabel(self.stepArray()[0].label);
                self.selectedStepValue(self.stepArray()[0].id);
                self.stepArray()[1].visited = false;

                if (event) {
                    const dataPassed = ko.mapping.toJS({
                        partyId: self.partyId,
                        value: params.rootModel.params.value,
                        partyName: self.partyName,
                        selectedModule: params.rootModel.params.selectedModule,
                        editPressed: self.editPressed,
                        accessData: self.accessData,
                        attributeData: self.attributeData,
                        userData: self.userData,
                        isUserSelected: self.isUserSelected,
                        accessLevel: params.rootModel.params.accessLevel,
                        attributeName: self.attributeName,
                        partyLevelChangesAuto: params.rootModel.params.partyLevelChangesAuto
                    });

                    params.dashboard.loadComponent("attribute-details", dataPassed);
                }
            };

        };
    });