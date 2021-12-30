define([
    "knockout",
    "./model",
    "ojL10n!resources/nls/entity-switch",
    "framework/js/constants/constants",
    "ojs/ojselectcombobox",
    "ojs/ojtoolbar"
], function (ko, Model, resourceBundle, Constants) {
    "use strict";

    return function (params) {
        const self = this;

        self.nls = resourceBundle;
        self.entityList = ko.observableArray();
        self.entityListLoaded = ko.observable(false);
        self.currentEntity = ko.observable();
        self.currentLanguage = ko.observable();
        self.availableViews = ko.observableArray();
        self.currentView = ko.observable();
        self.resetView = ko.observable(true);

        let userProfile = null;
        const alreadyAddedRoles = [];

        self.languageOptions = ko.observableArray();

        function setEntity() {
            self.currentEntity(self.entityList().find(function (item) {
                return item.value === Constants.currentEntity;
            }).text);

            self.entityListLoaded(true);
        }

        params.rootModel.userInfoPromise.then(function (userInfoData) {
            userProfile = userInfoData.userData.userProfile;

            if (userProfile && userProfile.accessibleEntityDTOs && userProfile.accessibleEntityDTOs.length) {
                if (userProfile.accessibleEntityDTOs.length > 1) {
                    for (let i = 0; i < userProfile.accessibleEntityDTOs.length; i++) {
                        self.entityList.push({
                            text: userProfile.accessibleEntityDTOs[i].entityName,
                            value: userProfile.accessibleEntityDTOs[i].entityId
                        });
                    }

                    setEntity();
                }
            } else {
                Model.fetchEntities().then(function (data) {
                    if (!Constants.currentEntity) {
                        Constants.currentEntity = data.businessUnitDTOs[0].businessUnitCode;
                    }

                    ko.utils.arrayPushAll(self.entityList, data.businessUnitDTOs.map(function (element) {
                        return {
                            text: element.businessUnitName,
                            value: element.businessUnitCode
                        };
                    }));

                    setEntity();
                });
            }

            if (userInfoData.dashboards.length > 1) {
                self.availableViews(userInfoData.dashboards.filter(function (item) {
                    if (item.dashboardClass === "APPLICATION_ROLE" && alreadyAddedRoles.includes(item.dashboardClassValue.toLowerCase())) {
                        return false;
                    }

                    alreadyAddedRoles.push(item.dashboardClassValue.toLowerCase());

                    return item.dashboardClass === "APPLICATION_ROLE" || item.dashboardClass === "CUSTOM";
                }));

                self.currentView(resourceBundle.roles[self.availableViews()[0].dashboardClassValue.toLowerCase()] || self.availableViews()[0].dashboardClassValue);
            }
        });

        Model.fetchAvailableLocale().then(function (data) {
            self.languageOptions(data.enumRepresentations[0].data);

            self.currentLanguage(
                data.enumRepresentations[0].data.find(function (item) {
                    return item.code === params.baseModel.getLocale();
                }).description);
        });

        self.menuItemAction = function (event) {
            if (event.target.value !== Constants.currentEntity) {

                params.changeMenuState("close").then(function () {
                    params.rootModel.resetLayout(event.target.value);
                });
            }
        };

        self.switchLanguage = function (event) {

            if (params.baseModel.getLocale() !== event.target.value) {
                // eslint-disable-next-line no-storage/no-browser-storage
                sessionStorage.setItem("user-locale", event.target.value);
                window.location.reload();
            }
        };

        self.openATMBranch = function () {
            params.dashboard.loadComponent("locator", {});
        };

        self.changeView = function (event) {
            if (params.rootModel.isUserDataSet() && event.target.value) {
                self.resetView(false);
                ko.tasks.runEarly();

                const computedRole = event.target.value,
                    evaluatedSegment = params.rootModel.getRoleBasedSegment(event.target.value);

                if (evaluatedSegment && Constants.userSegment !== evaluatedSegment) {
                    params.rootModel.changeSegment(evaluatedSegment, params.dashboard.userData.userProfile.roles);
                    params.dashboard.appData.segment = evaluatedSegment;
                    params.baseModel.dispatchCustomEvent(window, "menuChanged");
                }

                self.currentView(resourceBundle.roles[event.target.value.toLowerCase()] || event.target.value);

                params.changeMenuState("close").then(function () {
                    params.dashboard.switchModule(computedRole);
                });

                self.resetView(true);
            }
        };
    };
});