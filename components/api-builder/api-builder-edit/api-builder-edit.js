define([

    "knockout",

    "./model",
    "ojL10n!resources/nls/api-builder-edit",
    "ojs/ojselectcombobox",
    "ojs/ojvalidationgroup",
    "ojs/ojbutton",
    "ojs/ojknockout-validation",
    "ojs/ojradioset"
], function(ko, APIBuilderEditModel, resourceBundle) {
    "use strict";

    return function(rootParams) {
        const self = this,
            getNewKoModel = function() {
                const KoModel = ko.mapping.fromJS(APIBuilderEditModel.getNewModel());

                return KoModel;
            };

        ko.utils.extend(self, rootParams.rootModel);
        self.resource = resourceBundle;
        rootParams.dashboard.headerName(self.resource.headerName);
        rootParams.baseModel.registerComponent("api-builder-search", "api-builder");
        rootParams.baseModel.registerComponent("api-builder-review", "api-builder");
        self.mode = ko.observable("EDIT");
        self.selectedGroup = ko.observable();
        self.serviceURL = ko.observable();
        self.serviceID = ko.observable();
        self.serviceName = ko.observable();
        self.selectedMethod = ko.observable();
        self.selectedTransaction = ko.observable();
        self.selectedRedaction = ko.observable();
        self.taskCode = ko.observable();
        self.dynamicBussPolicy = ko.observable();
        self.taskAspect = ko.observable();
        self.key = ko.observable();
        self.val = ko.observable();
        self.selectedItem = ko.observable();
        self.selectedModule = ko.observable();
        self.selectedCategory = ko.observable();
        self.selectedActionTypes = ko.observableArray();
        self.alertsRequired = ko.observable();
        self.partyId = ko.observable();
        self.accNo = ko.observable();
        self.currency = ko.observable();
        self.amount = ko.observable();
        self.errorCode = ko.observable();
        self.errorDesc = ko.observable();
        self.inputJson = ko.observable();
        self.resultPartyId = ko.observable();
        self.resultAmount = ko.observable();
        self.resultAccNo = ko.observable();
        self.resultCurrency = ko.observable();
        self.uploadGroovyClass = ko.observable(false);
        self.uploadGroovyFile = ko.observable(false);
        self.isAlert = ko.observable(false);
        self.newModules = ko.observable(false);
        self.module = ko.observable();
        self.newCategories = ko.observable(false);
        self.category = ko.observable();
        self.moduleName = ko.observableArray();
        self.isModuleFetched = ko.observable(false);
        self.isCategoryFetched = ko.observable(true);
        self.isTransactionFetched = ko.observable(false);
        self.categoryName = ko.observableArray();
        self.transactionType = ko.observableArray();
        self.taskAspect = ko.observableArray();
        self.selectedTaskAspect = ko.observableArray();
        self.isTaskAspectFetched = ko.observable(false);
        self.groupName = ko.observableArray();
        self.apiGroupsLoaded = ko.observable(false);
        self.isActionFetched = ko.observable(false);
        self.actionType = ko.observableArray();
        self.redactionType = ko.observableArray();
        self.isRedactionTypeFetched = ko.observable(false);
        self.header = ko.observableArray();

        self.headerValues = {
            key: ko.observable(""),
            value: ko.observable()
        };

        self.uiOptions = {
            menuFloat: "left",
            fullWidth: false,
            defaultOption: self.selectedItem
        };

        if (!rootParams.rootModel.params.apiServiceDTO) {
            if (self.header().length === 0) {
                self.header.push(self.headerValues);
            }
        }

        if (rootParams.rootModel.params.apiServiceDTO) {
            self.selectedItem(rootParams.rootModel.params.selectedItem());

            const details = rootParams.rootModel.params.apiServiceDTO();

            if (details.apiGroupName) {
                self.selectedGroup(details.apiGroupName);
            }

            if (details.serviceURL) {
                self.serviceURL(details.serviceURL);
            }

            if (details.serviceId) {
                self.serviceID(details.serviceId);
            }

            if (details.serviceName) {
                self.serviceName(details.serviceName);
            }

            if (details.methodType) {
                self.selectedMethod(details.methodType);
            }

            if (details.transactionType) {
                self.selectedTransaction(details.transactionType);
            }

            if (details.redactionType) {
                self.selectedRedaction(details.redactionType);
            }

            if (rootParams.rootModel.params.header().length > 0) {
                ko.utils.arrayForEach(rootParams.rootModel.params.header(), function(item) {
                    self.header().push(item);
                });
            }

            if (details.taskCode) {
                self.taskCode(details.taskCode);
            }

            if (details.refBusinessPolicy) {
                self.dynamicBussPolicy(self.resource.yes);
            } else {
                self.dynamicBussPolicy(self.resource.no);
            }

            if (details.taskAspects) {
                if (rootParams.rootModel.params.params.mode) {
                    ko.utils.arrayForEach(details.taskAspects(), function(item) {
                        self.selectedTaskAspect().push(item);
                    });
                } else {
                    ko.utils.arrayForEach(details.taskAspects, function(item) {
                        self.selectedTaskAspect().push(item);
                    });
                }
            }

            if (details.jsonPathAcc) {
                self.accNo(details.jsonPathAcc);
            }

            if (details.jsonPathAmount) {
                self.amount(details.jsonPathAmount);
            }

            if (details.jsonPathCurrency) {
                self.currency(details.jsonPathCurrency);
            }

            if (details.jsonPathParty) {
                self.partyId(details.jsonPathParty);
            }

            if (details.moduleName) {
                self.selectedModule(details.moduleName);

                APIBuilderEditModel.fetchCategoryName(self.selectedModule()).done(function(data) {
                    self.categoryName([]);

                    if (data.enumRepresentations) {
                        for (let i = 0; i < data.enumRepresentations[0].data.length; i++) {
                            self.categoryName().push({
                                text: data.enumRepresentations[0].data[i].description,
                                value: data.enumRepresentations[0].data[i].code
                            });
                        }

                        self.isCategoryFetched(true);
                    }

                    self.selectedCategory(details.categoryName);
                });
            }

            if (details.actionTypes) {
                if (rootParams.rootModel.params.params.mode) {
                    ko.utils.arrayForEach(details.actionTypes(), function(item) {
                        self.selectedActionTypes().push(item);
                    });
                } else {
                    ko.utils.arrayForEach(details.actionTypes, function(item) {
                        self.selectedActionTypes().push(item);
                    });
                }
            }

            if (details.alertRequired) {
                self.alertsRequired(self.resource.yes);
            } else {
                self.alertsRequired(self.resource.no);
            }

            if (details.jsonPathErrorCode) {
                self.errorCode(details.jsonPathErrorCode);
            }
        }

        self.listItem = ko.observable([{
                id: self.resource.serviceDetails,
                label: self.resource.serviceDetails
            },
            {
                id: self.resource.entDetails,
                label: self.resource.entDetails
            },
            {
                id: self.resource.jsonPath,
                label: self.resource.jsonPath
            },
            {
                id: self.resource.alerts,
                label: self.resource.alerts
            }
        ]);

        self.methodType = ko.observable([{
            text: self.resource.getMethod,
            value: self.resource.getMethod
        }, {
            text: self.resource.post,
            value: self.resource.post
        }, {
            text: self.resource.put,
            value: self.resource.put
        }, {
            text: self.resource.delete,
            value: self.resource.delete
        }, {
            text: self.resource.patch,
            value: self.resource.patch
        }]);

        self.bussPolicy = ko.observable([{
            text: self.resource.yes,
            value: self.resource.yes
        }, {
            text: self.resource.no,
            value: self.resource.no
        }]);

        self.isdynamicBussPolicy = function() {
            if (self.dynamicBussPolicy().toUpperCase() === "YES") {
                self.uploadGroovyClass(true);
            } else {
                self.uploadGroovyClass(false);
            }
        };

        self.isRedactionGroovy = function() {
            if (self.selectedRedaction().toUpperCase() === "JAVA") {
                self.uploadGroovyFile(true);
            } else {
                self.uploadGroovyFile(false);
            }
        };

        self.alertsRequiredArray = ko.observable([{
            description: self.resource.yes,
            code: self.resource.yes
        }, {
            description: self.resource.no,
            code: self.resource.no
        }]);

        self.areAlertsRequired = function() {
            if (self.alertsRequired().toUpperCase() === "YES") {
                self.isAlert(true);
            } else {
                self.isAlert(false);
            }
        };

        self.clearArea = function() {
            self.inputJson("");
        };

        self.evaluate = function() {
            if (!self.inputJson()) {
                rootParams.baseModel.showMessages(null, [self.resource.noJson], "ERROR");
            } else if (!self.partyId() || !self.accNo() || !self.currency() || !self.amount()) {
                rootParams.baseModel.showMessages(null, [self.resource.noData], "ERROR");
            } else {
                self.resultPartyId(self.jsonPathEvaluator(self.inputJson(), self.partyId()));
                self.resultAccNo(self.jsonPathEvaluator(self.inputJson(), self.accNo()));
                self.resultAmount(self.jsonPathEvaluator(self.inputJson(), self.amount()));
                self.resultCurrency(self.jsonPathEvaluator(self.inputJson(), self.currency()));

                if (!self.resultPartyId() || !self.resultCurrency() || !self.resultAmount() || !self.resultAccNo()) {
                    rootParams.baseModel.showMessages(null, [self.resource.wrongPath], "ERROR");
                }
            }
        };

        self.jsonPathEvaluator = function(obj, item) {
            const array = item.split(".");

            obj = JSON.parse(obj);

            let a;

            if (array.length < 2) {
                a = obj[array];

                return a;
            }

            a = obj[array[0]];

            for (let m = 1; m < array.length; m++) {
                a = a[array[m]];
            }

            return a;

        };

        APIBuilderEditModel.getApiGroups().then(function(data) {
            ko.utils.arrayForEach(data.apiGroupList, function(item) {
                self.groupName().push({
                    text: item.groupDescription,
                    value: item.groupCode
                });
            });

            self.apiGroupsLoaded(true);
            ko.tasks.runEarly();
        });

        APIBuilderEditModel.fetchModuleName().done(function(data) {
            if (data.enumRepresentations) {
                for (let i = 0; i < data.enumRepresentations[0].data.length; i++) {
                    self.moduleName().push({
                        text: data.enumRepresentations[0].data[i].description,
                        value: data.enumRepresentations[0].data[i].code
                    });
                }

                self.isModuleFetched(true);
            }
        });

        APIBuilderEditModel.fetchTransactionType().done(function(data) {
            if (data.enumRepresentations) {
                for (let i = 0; i < data.enumRepresentations[0].data.length; i++) {
                    self.transactionType().push({
                        text: data.enumRepresentations[0].data[i].description,
                        value: data.enumRepresentations[0].data[i].code
                    });
                }

                self.isTransactionFetched(true);
            }
        });

        APIBuilderEditModel.fetchActionType().done(function(data) {
            if (data.enumRepresentations) {
                for (let i = 0; i < data.enumRepresentations[0].data.length; i++) {
                    self.actionType().push({
                        text: data.enumRepresentations[0].data[i].description,
                        value: data.enumRepresentations[0].data[i].code
                    });
                }

                self.isActionFetched(true);
            }
        });

        APIBuilderEditModel.fetchTaskAspect().done(function(data) {
            if (data.enumRepresentations) {
                for (let i = 0; i < data.enumRepresentations[0].data.length; i++) {
                    self.taskAspect().push({
                        text: data.enumRepresentations[0].data[i].description,
                        value: data.enumRepresentations[0].data[i].code
                    });
                }

                self.isTaskAspectFetched(true);
            }
        });

        APIBuilderEditModel.fetchRedactionType().done(function(data) {
            if (data.enumRepresentations) {
                for (let i = 0; i < data.enumRepresentations[0].data.length; i++) {
                    self.redactionType().push({
                        text: data.enumRepresentations[0].data[i].description,
                        value: data.enumRepresentations[0].data[i].code
                    });
                }

                self.isRedactionTypeFetched(true);
            }
        });

        self.moduleChangeHandler = function(event) {
            self.isCategoryFetched(false);

            APIBuilderEditModel.fetchCategoryName(event.detail.value).done(function(data) {
                self.categoryName([]);

                if (data.enumRepresentations) {
                    for (let i = 0; i < data.enumRepresentations[0].data.length; i++) {
                        self.categoryName().push({
                            text: data.enumRepresentations[0].data[i].description,
                            value: data.enumRepresentations[0].data[i].code
                        });
                    }

                    self.isCategoryFetched(true);
                }
            });
        };

        self.addMoreHeaders = function() {
            self.headerValues = {
                key: ko.observable(""),
                value: ko.observable()
            };

            if (self.header().length === 0) {
                self.header.push(self.headerValues);
            } else {
                for (let i = self.header().length - 1; i < self.header().length; i++) {
                    self.header()[i] = ko.mapping.toJS(self.header()[i]);
                }

                self.header.push(self.headerValues);
                ko.tasks.runEarly();
            }
        };

        self.onClickCancel = function() {
            rootParams.dashboard.switchModule();
        };

        self.onClickBack = function() {
            if (self.selectedItem().toUpperCase() === "SERVICE DETAILS") {
                rootParams.dashboard.loadComponent("api-builder-search");
            } else if (self.selectedItem().toUpperCase() === "ENTITLEMENT DETAILS") {
                self.selectedItem(self.resource.serviceDetails);
            } else if (self.selectedItem().toUpperCase() === "JSON PATH") {
                self.selectedItem(self.resource.entDetails);
            } else {
                self.selectedItem(self.resource.jsonPath);
            }
        };

        self.next = function() {
            if (self.selectedItem().toUpperCase() === "SERVICE DETAILS") {
                self.selectedItem(self.resource.entDetails);
            } else if (self.selectedItem().toUpperCase() === "ENTITLEMENT DETAILS") {
                self.selectedItem(self.resource.jsonPath);
            } else {
                self.selectedItem(self.resource.alerts);
            }
        };

        self.save = function() {
            self.apiServiceDTO = getNewKoModel().apiServiceDTO;
            self.apiServiceDTO.apiGroupName(self.selectedGroup());
            self.apiServiceDTO.serviceURL = self.serviceURL();
            self.apiServiceDTO.serviceId = self.serviceID();
            self.apiServiceDTO.serviceName = self.serviceName();
            self.apiServiceDTO.methodType(self.selectedMethod());
            self.apiServiceDTO.transactionType(self.selectedTransaction());
            self.apiServiceDTO.redactionType(self.selectedRedaction());
            self.apiServiceDTO.taskCode = self.taskCode();

            ko.utils.arrayForEach(self.selectedTaskAspect(), function(item) {
                self.apiServiceDTO.taskAspects().push(item);
            });

            const obj = {};

            for (let m = 0; m < self.header().length; m++) {
                const itemObj = ko.mapping.toJS(self.header()[m]),
                    key = itemObj.key;

                obj[key.toString()] = itemObj.value;
            }

            self.apiServiceDTO.headers(obj);
            self.apiServiceDTO.moduleName(self.selectedModule());
            self.apiServiceDTO.categoryName(self.selectedCategory());

            ko.utils.arrayForEach(self.selectedActionTypes(), function(item) {
                self.apiServiceDTO.actionTypes().push(item);
            });

            self.apiServiceDTO.jsonPathParty = self.partyId();
            self.apiServiceDTO.jsonPathAcc = self.accNo();
            self.apiServiceDTO.jsonPathCurrency = self.currency();
            self.apiServiceDTO.jsonPathAmount = self.amount();
            self.apiServiceDTO.jsonPathErrorCode = self.errorCode();
            self.apiServiceDTO.alertRequired(self.isAlert());
            rootParams.dashboard.loadComponent("api-builder-review", self);
        };
    };
});