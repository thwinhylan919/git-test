define([
    "knockout",
    "./model",
    "ojL10n!resources/nls/user-group-subject-map-create",
    "ojs/ojinputtext",
    "ojs/ojvalidationgroup",
    "ojs/ojpopup"
], function(ko, UserGroupSubjectMapCreateModel, resourceBundle) {
    "use strict";

    return function viewModel(rootParams) {
        const self = this;

        ko.utils.extend(self, rootParams.rootModel.params);
        self.nls = resourceBundle;
        rootParams.baseModel.registerElement("action-header");
        self.validationTracker = ko.observable();
        self.mappingCode = ko.observable();
        self.mappingDesc = ko.observable();
        rootParams.baseModel.registerComponent("list-mail-categories", "usergroup-subject-map");
        rootParams.baseModel.registerComponent("review-mapping-create", "usergroup-subject-map");
        rootParams.baseModel.registerElement("confirm-screen");
        self.categoryOptionValue = ko.observable();
        self.categoryOptionList = ko.observableArray();
        self.categoryOptionValueName = ko.observable();
        self.mailCategoriesListLoaded = ko.observable(false);
        self.areAllOptionsSelected = ko.observable(false);
        self.selectedSubjectIds = ko.observableArray();
        self.nestedSubjectObjectsList = ko.observableArray();
        self.loadReviewComponent = ko.observable(false);
        self.showConfirmation = ko.observable(false);
        self.disableState = ko.observable(false);
        self.createMode = ko.observable(true);
        self.transactionStatus = ko.observable();
        self.selectedUserGroupName = ko.observable();
        self.isSelected = ko.observable(false);
        self.transactionName = ko.observable(self.nls.headers.transactionName);
        rootParams.dashboard.headerName(self.nls.pageTitle.userGroupSubjectMap);

        self.reviewMapping = function() {
            if (!rootParams.baseModel.showComponentValidationErrors(document.getElementById("tracker"))) {
                return;
            }

            self.loadReviewComponent(true);
            self.disableState(true);
            self.createMode(false);
        };

        self.createMapping = function() {

            self.createPayload();

            const actualPayload = {
                mappingCode: self.mappingCode(),
                mappingDescription: self.mappingDesc(),
                userGroupId: self.selectedUserGroupId(),
                subjects: self.nestedSubjectObjectsList()
            };

            ko.utils.arrayForEach(self.nestedSubjectObjectsList(), function(subject) {

                if (subject.selectionStatus) {
                    self.isSelected(true);

                    return true;
                }
            });

              if(!self.isSelected())
              {
                rootParams.baseModel.showMessages(null, [self.nls.error.subjectMap], "ERROR");

              }
              else
              {

            UserGroupSubjectMapCreateModel.createMappings(ko.toJSON(actualPayload)).done(function(data, status, jqXhr) {
                self.transactionStatus(data.status);
                self.showConfirmation(true);

                rootParams.dashboard.loadComponent("confirm-screen", {
                    jqXHR: jqXhr,
                    transactionName: self.transactionName()
                });
            });
              }
        };

        self.groupCodeCreateChangeHandler = function() {
            if (self.selectedUserGroupId()) {
            ko.utils.arrayForEach(self.groupCodeEnums(), function(item) {
                if (self.selectedUserGroupId()) {
                    if (self.selectedUserGroupId() === item.groupCodeId) { self.selectedUserGroupName(item.groupCodeName); }
                }
            });
        }
        };

        self.createPayload = function() {
            self.nestedSubjectObjectsList([]);

            ko.utils.arrayForEach(self.categoryOptionList(), function(item) {
                ko.utils.arrayForEach(item.children, function(childItem) {
                    let subjectObject;

                    if (!(self.selectedSubjectIds().filter(function(e) {
                            return e === childItem.value;
                        }).length > 0)) {
                        subjectObject = {
                            selectionStatus: false,
                            userGroupSubjectMapDTOObject: null,
                            subjectDTO: {
                                subjectId: childItem.value,
                                subject: childItem.name,
                                mailCategoryDTO: {
                                    name: item.name,
                                    categoryId: item.categoryId
                                }
                            }
                        };

                        self.nestedSubjectObjectsList().push(subjectObject);
                    } else {
                        subjectObject = {
                            selectionStatus: true,
                            userGroupSubjectMapDTOObject: null,
                            subjectDTO: {
                                subjectId: childItem.value,
                                subject: childItem.name,
                                mailCategoryDTO: {
                                    name: item.name,
                                    categoryId: item.categoryId
                                }
                            }
                        };

                        self.nestedSubjectObjectsList().push(subjectObject);
                    }
                });
            });
        };

        self.cancel = function() {
            rootParams.dashboard.switchModule(true);
        };

        self.back = function() {
            rootParams.dashboard.hideDetails();
        };

        self.edit = function() {
            self.loadReviewComponent(false);
            self.disableState(false);
            self.createMode(false);
        };
    };
});