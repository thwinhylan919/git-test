define([
    "ojs/ojcore",
    "knockout",

    "./model",

    "ojL10n!resources/nls/user-group",
    "ojs/ojinputtext",
    "ojs/ojknockout",
    "ojs/ojknockout-validation",
    "ojs/ojlistview",
    "ojs/ojarraytabledatasource",
    "ojs/ojselectcombobox",
    "ojs/ojvalidationgroup"
], function(oj, ko, PaneViewModel, resourceBundle) {
    "use strict";

    return function(rootParams) {
        const self = this;

        self.nls = resourceBundle;
        ko.utils.extend(self, rootParams.rootModel);
        rootParams.baseModel.registerElement("modal-window");
        rootParams.baseModel.registerElement("confirm-screen");
        rootParams.baseModel.registerComponent("user-group-list", "approvals");
        self.koUserGroupUserModel = ko.observableArray();
        self.datasource = ko.observable(new oj.ArrayTableDataSource([]));
        self.userID = ko.observable("");

        rootParams.dashboard.headerName(self.nls.userGroup.userGroupDetails);
        self.actionHeaderheading = ko.observable();
        self.statusMessage = ko.observable();
        self.httpStatus = ko.observable();
        self.partyId = {};
        self.backLabel = self.nls.common.back;
        self.reviewTransactionName = [];
        self.reviewTransactionName.header = self.nls.headers.APPROVALREVIEW;
        self.reviewTransactionName.reviewHeader = self.nls.userGroup.confirmScreenheader;
        self.mode = ko.observable(rootParams.rootModel.params.mode);
        self.partyDetails = rootParams.rootModel.params.data.partyDetails;

        let currentUserSelection = null;

        if (self.params.data.users && self.params.data.users.length > 0) {
            ko.utils.arrayForEach(self.params.data.users, function(user) {
                const usermodel = PaneViewModel.getUserModel();

                usermodel.userID = user.userId;
                usermodel.userName = ko.observable();
                usermodel.mobileNumber = ko.observable();
                usermodel.showUserName = ko.observable(false);
                self.koUserGroupUserModel.push(usermodel);

                self.datasource(new oj.ArrayTableDataSource(self.koUserGroupUserModel(), {
                    idAttribute: "userID"
                }));

            });
        }

        self.showUserName = function(event) {
            if (!event.showUserName()) {

                if (currentUserSelection) {
                    currentUserSelection(false);
                }

                if (!(event.userName() && event.mobileNumber())) {
                    PaneViewModel.validateUser(event.userID).then(function(data) {
                        event.userName(rootParams.baseModel.format(self.nls.common.name, {
                            firstName: data.userDTO.firstName,
                            lastName: data.userDTO.lastName
                        }));

                        event.mobileNumber(data.userDTO.mobileNumber);
                        event.showUserName(true);
                        currentUserSelection = event.showUserName;
                    });
                } else {
                    event.showUserName(true);
                    currentUserSelection = event.showUserName;
                }
            } else {
                event.showUserName(false);
            }
        };

        self.modeSelection = function() {
            if (self.mode() === "CREATE") {
                self.actionHeaderheading(self.nls.common[self.mode().toLowerCase()]);
                rootParams.dashboard.headerName(self.nls.userGroup.userGroupDetails);
            } else if (self.mode() === "VIEW") {
                self.viewDetails();
                self.actionHeaderheading(self.nls.headers[self.mode()]);
                rootParams.dashboard.headerName(self.nls.userGroup.userGroupDetails);
            } else if (self.mode() === "EDIT") {
                self.actionHeaderheading(self.nls.common[self.mode().toLowerCase()]);
                rootParams.dashboard.headerName(self.nls.userGroup.userGroupDetails);
            }

            if (self.mode() === "REVIEW") {
                self.mode("REVIEW");
                self.actionHeaderheading(self.nls.headers[self.mode()]);
                rootParams.dashboard.headerName(self.nls.userGroup.userGroupDetails);
            }
        };

        const modeSubscribtions = self.mode.subscribe(function(newValue) {
            if (newValue) {
                self.modeSelection();
            }
        });

        self.dispose = function() {
            modeSubscribtions.dispose();
        };

        self.viewDetails = function() {
            PaneViewModel.fetchUserGroup(self.params.data.id).then(function(dataResponse) {
                ko.utils.extend(self, dataResponse.userGroup);
                self.version = dataResponse.userGroup.version;
                self.groupCode(self.params.data.name);
                self.version = self.params.data.version;
                self.groupDescription(self.params.data.description);
            });
        };

        self.partyName = self.params.data.partyDetails.partyName;
        self.partyId.value = self.params.data.partyDetails.party.value;
        self.partyId.displayValue = self.params.data.partyDetails.party.displayValue;

        if (self.mode() === "APPROVALREVIEW") {
            if (self.partyId.value) {
                PaneViewModel.fetchPartyDetails(self.partyId.value()).then(function(data) {
                    self.partyName = data.party.personalDetails.fullName;
                });
            }

            self.actionHeaderheading(self.nls.headers[self.mode()]);
        } else if (self.mode() !== "CREATE") {
            self.mode(self.params.mode);
        }

        self.groupCode = ko.observable(self.params.data.name);
        self.groupDescription = ko.observable(self.params.data.description);
        self.prevMode = ko.observable();
        self.userList = ko.observableArray();
        self.userListLoaded = ko.observable(false);
        self.buttonToDropDown = ko.observable(false);
        self.selectedUser = ko.observable();
        self.userListNull = ko.observable(false);
        self.validationTracker = ko.observable();
        self.transactionStatus = ko.observable();
        self.version = null;
        self.transactionName = ko.observable();

        self.editReview = function() {
            self.mode(self.prevMode());
        };

        self.back = function() {
            if (self.mode() === "VIEW" || self.mode() === "CREATE") {
                history.back();
            } else {
                history.back();
            }
        };

        const getNewKoModel = function() {
            const KoModel = PaneViewModel.getNewModel();

            return ko.mapping.fromJS(KoModel);
        };

        self.rootModelInstance = ko.observable(getNewKoModel());

        self.confirm = function() {
            if (self.prevMode() === "EDIT") {
                self.transactionName(self.nls.userGroup.modifyUserGroup);
                self.rootModelInstance().UserGroup.id = self.params.data.id;
                self.rootModelInstance().UserGroup.name = self.groupCode();
                self.rootModelInstance().UserGroup.type = self.params.data.partyDetails.userType;
                self.rootModelInstance().UserGroup.description = self.groupDescription();
                self.rootModelInstance().UserGroup.partyId = self.partyId.value;
                self.rootModelInstance().UserGroup.unary = self.params.data.unary;
                self.rootModelInstance().UserGroup.version = self.params.data.version;
                self.rootModelInstance().UserGroup.users.removeAll();

                ko.utils.arrayForEach(self.koUserGroupUserModel(), function(users) {
                    self.rootModelInstance().UserGroup.users.push({
                        userId: users.userID
                    });
                });

                PaneViewModel.saveModel(ko.toJSON(self.rootModelInstance().UserGroup), self.rootModelInstance().UserGroup.id).then(function(data) {
                    rootParams.dashboard.loadComponent("confirm-screen", {
                        transactionResponse: data,
                        transactionName: self.nls.userGroup.modifyUserGroup
                    });
                });
            } else if (self.prevMode() === "CREATE") {
                self.transactionName(self.nls.userGroup.createUserGroup);
                self.rootModelInstance().UserGroup.name = self.groupCode();
                self.rootModelInstance().UserGroup.type = "CUSTOMER";
                self.rootModelInstance().UserGroup.partyId = self.partyId.value;
                self.rootModelInstance().UserGroup.description = self.groupDescription();
                self.rootModelInstance().UserGroup.unary = false;
                self.rootModelInstance().UserGroup.users.removeAll();

                ko.utils.arrayForEach(self.koUserGroupUserModel(), function(users) {
                    self.rootModelInstance().UserGroup.users.push({
                        userId: users.userID
                    });
                });

                PaneViewModel.createUserGroup(ko.toJSON(self.rootModelInstance().UserGroup)).then(function(data) {
                    rootParams.dashboard.loadComponent("confirm-screen", {
                        transactionResponse: data,
                        transactionName: self.nls.userGroup.createUserGroup
                    });
                });
            }
        };

        self.save = function() {
            if (!rootParams.baseModel.showComponentValidationErrors(document.getElementById("tracker"))) {
                return;
            }

            if (self.koUserGroupUserModel().length === 0) {
                self.userListNull(true);
                rootParams.baseModel.showMessages(null, [self.nls.userGroup.userListNull], "ERROR");
            } else {
                self.prevMode(self.mode());
                self.mode("REVIEW");
                self.actionHeaderheading(self.nls.headers[self.mode()]);
            }
        };

        self.deleteUserFromGroup = function(userID) {
            ko.utils.arrayForEach(self.koUserGroupUserModel(), function(usersAdded) {
                if (usersAdded && usersAdded.userID === userID) {
                    self.koUserGroupUserModel.remove(usersAdded);

                    self.datasource(new oj.ArrayTableDataSource(self.koUserGroupUserModel(), {
                        idAttribute: "userID"
                    }));

                    self.selectedUser();
                    self.userID("");
                }
            });

        };

        self.deleteUserGroup = function(userDTO) {
            PaneViewModel.deleteUserGroup(userDTO.id).then(function() {
                self.ruleSearch(false);
                self.ruleSearch(true);
            });
        };

        self.editUserGroup = function() {
            self.mode("EDIT");
            self.actionHeaderheading(self.nls.common[self.mode().toLowerCase()]);
        };

        self.addNew = function() {
            PaneViewModel.fetchUserList(self.partyId.value).then(function(data) {
                self.userListLoaded(false);

                self.usersFilter = ko.computed(function() {
                    self.userList.removeAll();

                    let temp;

                    return ko.utils.arrayFilter(data.userDTOList, function(dataItem) {
                        temp = true;

                        ko.utils.arrayForEach(self.koUserGroupUserModel(), function(usersAdded) {
                            if (dataItem.username === usersAdded.userID) {
                                temp = false;
                            }
                        });

                        if (temp) {
                            self.userList.push(dataItem);
                        }
                    });
                }, this);

                self.dispose = function() {
                    self.usersFilter.dispose();
                };

                self.userListLoaded(true);
            });

            self.buttonToDropDown(true);
        };

        self.showUserId = ko.computed(function() {
            if (self.selectedUser()) {
                return self.userID(self.selectedUser().split("~")[2]);
            }
        }, this);

        self.dispose = function() {
            self.showUserId.dispose();
        };

        self.addRow = function() {

            const usermodel = PaneViewModel.getUserModel();

            usermodel.userID = self.selectedUser().split("~")[2];
            self.userID(self.selectedUser().split("~")[2]);

            usermodel.userName = ko.observable(rootParams.baseModel.format(self.nls.common.name, {
                firstName: self.selectedUser().split("~")[0],
                lastName: self.selectedUser().split("~")[1]
            }));

            usermodel.showUserName = ko.observable(false);
            usermodel.mobileNumber = ko.observable();
            self.koUserGroupUserModel.push(usermodel);

            self.datasource(new oj.ArrayTableDataSource(self.koUserGroupUserModel(), {
                idAttribute: "userID"
            }));

            self.selectedUser(null);
            self.userID("");
            self.userListLoaded(false);
            self.buttonToDropDown(false);

        };

        self.cancelConfirmation = function() {
            rootParams.dashboard.switchModule(true);
        };
    };
});