define([
    "ojs/ojcore",
    "knockout",
    "./model",
    "ojL10n!resources/nls/admin-user-group",
    "ojs/ojinputtext",
    "ojs/ojknockout",
    "ojs/ojknockout-validation",
    "ojs/ojlistview",
    "ojs/ojarraytabledatasource",
    "ojs/ojtable",
    "ojs/ojselectcombobox",
    "ojs/ojvalidationgroup"
], function(oj, ko, PaneViewModel, resourceBundle) {
    "use strict";

    return function(rootParams) {
        const self = this;

        ko.utils.extend(self, rootParams.rootModel);
        self.nls = resourceBundle;
        rootParams.dashboard.headerName(self.nls.userGroup.adminUserGroupDetails);
        rootParams.baseModel.registerElement("confirm-screen");
        rootParams.baseModel.registerElement("modal-window");
        self.koUserGroupUserModel = ko.observableArray();
        self.transactionName = ko.observable();
        self.datasource = ko.observable(new oj.ArrayTableDataSource([]));
        self.userID = ko.observable("");
        self.actionHeaderheading = ko.observable();
        self.mode = ko.observable(self.params.mode);
        self.groupValid = ko.observable();
        self.updateGroupValid = ko.observable();
        self.reviewTransactionName = [];
        self.reviewTransactionName.header = self.nls.headers.APPROVALREVIEW;
        self.reviewTransactionName.reviewHeader = self.nls.userGroup.confirmScreenheader;

        if (self.mode() === "VIEW") {
            self.actionHeaderheading(self.nls.headers[self.mode()]);
        } else {
            self.actionHeaderheading(self.nls.generic.common[self.mode().toLowerCase()]);
        }

        self.groupCode = self.params.data ? ko.observable(self.params.data.name) : ko.observable();
        self.groupDescription = self.params.data ? ko.observable(self.params.data.description) : ko.observable();
        self.prevMode = ko.observable();
        self.userDTOList = ko.observableArray();
        self.userList = ko.observableArray();
        self.userListLoaded = ko.observable(false);
        self.buttonToDropDown = ko.observable(false);
        self.selectedUser = ko.observable();
        self.validationTracker = ko.observable();
        self.httpStatus = ko.observable();
        self.transactionStatus = ko.observable();
        self.referenceNumber = ko.observable();
        self.userListNull = ko.observable(false);
        self.statusMessage = ko.observable();
        self.version = null;

        let currentUserSelection = null;

        rootParams.baseModel.registerElement("confirm-screen");

        if (self.params.data && self.params.data.users && self.params.data.users.length > 0) {
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

        self.cancel = function() {
            history.back();
        };

        const getNewKoModel = function() {
            const KoModel = PaneViewModel.getNewModel();

            return ko.mapping.fromJS(KoModel);
        };

        self.showUserName = function(event) {
            if (!event.showUserName()) {

                if (currentUserSelection) {
                    currentUserSelection(false);
                }

                if (!(event.userName() && event.mobileNumber())) {
                    PaneViewModel.validateUser(event.userID).then(function(data) {
                        event.userName(rootParams.baseModel.format(self.nls.generic.common.name, {
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

        self.rootModelInstance = ko.observable(getNewKoModel());

        self.confirm = function() {
            if (!self.params.data || self.params.data.id === undefined) {
                self.prevMode("CREATE");
            }

            if (self.prevMode() === "EDIT") {
                self.transactionName(self.nls.userGroup.modifyUserGroup);
                self.rootModelInstance().UserGroup.id = self.params.data.id;
                self.rootModelInstance().UserGroup.name = self.groupCode();
                self.rootModelInstance().UserGroup.type = self.params.data.type;
                self.rootModelInstance().UserGroup.unary = self.params.data.unary;
                self.rootModelInstance().UserGroup.version = self.params.data.version;
                self.rootModelInstance().UserGroup.description = self.groupDescription();

                ko.utils.arrayForEach(self.koUserGroupUserModel(), function(users) {
                    self.rootModelInstance().UserGroup.users.push({
                        userId: users.userID
                    });
                });

                PaneViewModel.saveModel(ko.toJSON(self.rootModelInstance().UserGroup), self.rootModelInstance().UserGroup.id).then(function(data) {
                    self.transactionStatus(data);

                    if (data.status) {
                        self.referenceNumber(data.status.referenceNumber);
                    }

                    self.mode("SUCCESS");
                    self.actionHeaderheading(self.nls.approvals.headers.SUCCESSFUL);

                    rootParams.dashboard.loadComponent("confirm-screen", {
                        transactionResponse: data,
                        transactionName: self.transactionName()
                    });
                });
            } else if (self.prevMode() === "CREATE") {
                self.transactionName(self.nls.userGroup.createUserGroup);
                self.rootModelInstance().UserGroup.name = self.groupCode();
                self.rootModelInstance().UserGroup.type = "ADMIN";
                self.rootModelInstance().UserGroup.description = self.groupDescription();
                self.rootModelInstance().UserGroup.unary = false;

                ko.utils.arrayForEach(self.koUserGroupUserModel(), function(users) {
                    self.rootModelInstance().UserGroup.users.push({
                        userId: users.userID
                    });
                });

                PaneViewModel.createUserGroup(ko.toJSON(self.rootModelInstance().UserGroup)).then(function(data) {
                    self.transactionStatus(data.status);

                    if (data.status) {
                        self.referenceNumber(data.status.referenceNumber);
                    }

                    self.mode("SUCCESS");
                    self.actionHeaderheading(self.nls.headers.SUCCESSFUL);

                    rootParams.dashboard.loadComponent("confirm-screen", {
                        transactionResponse: data,
                        transactionName: self.transactionName()
                    });
                });
            }
        };

        self.save = function() {
            if (!rootParams.baseModel.showComponentValidationErrors(document.getElementById("tracker"))) {
                return;
            }

            self.selectedUser("");

            if (self.koUserGroupUserModel().length === 0) {
                rootParams.baseModel.showMessages(null, [self.nls.info.userGroupDataError], "INFO");
            } else {
                self.prevMode(self.mode());
                self.mode("REVIEW");
                self.actionHeaderheading(self.nls.headers.REVIEW);
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

        self.deleteUserGroup = function() {
            PaneViewModel.deleteUserGroup(self.groupCode()).then(function() {
                self.ruleSearch(false);
                self.ruleSearch(true);
            });
        };

        self.editUserGroup = function() {
            if (self.params.data.id) {
                PaneViewModel.fetchUserGroup(self.params.data.id).then(function(data) {
                    self.version = data.userGroup.version;
                });

                self.loadUserList();
            } else {
                self.mode("CREATE");
                self.actionHeaderheading(self.nls.generic.common[self.mode().toLowerCase()]);
            }
        };

        self.loadUserList = function() {
            PaneViewModel.fetchUserList().then(function(data) {
                self.userDTOList = data.userDTOList;

                if (self.params.data && self.params.data.id) {
                    self.mode("EDIT");
                    self.actionHeaderheading(self.nls.generic.common[self.mode().toLowerCase()]);
                }
            });
        };

        if (self.mode() === "CREATE") {
            self.loadUserList();
        }

        self.addNew = function() {
            self.userListLoaded(false);

            self.usersFilter = ko.computed(function() {
                self.userList.removeAll();

                let temp;

                return ko.utils.arrayFilter(self.userDTOList, function(dataItem) {
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
            }, self);

            self.dispose = function() {
                self.usersFilter.dispose();
            };

            self.userListLoaded(true);
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

            usermodel.userName = ko.observable(rootParams.baseModel.format(self.nls.generic.common.name, {
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

        self.done = function() {
            rootParams.dashboard.switchModule();
        };

        self.cancel = function() {
            rootParams.dashboard.switchModule(true);
        };

        self.viewBack = function() {
            self.groupDetailsFetched = false;
            history.back();
        };

        self.updateBack = function() {
            self.mode("VIEW");
            self.actionHeaderheading(self.nls.headers.VIEW);
        };

        self.createBack = function() {
            history.back();
        };
    };
});