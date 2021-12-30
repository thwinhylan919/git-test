define([
        "ojL10n!resources/nls/user-list-resource-access",
        "./model",
        "knockout",
        "ojs/ojcore",
        "ojs/ojformlayout",
        "ojs/ojvalidationgroup",
        "ojs/ojtable",
        "ojs/ojavatar",
        "ojs/ojarraytabledatasource",
        "ojs/ojpagingtabledatasource"
    ],
    function (resourceBundle, Model, ko, oj) {
        "use strict";

        return function (params) {
            const self = this;

            self.nls = resourceBundle;
            self.usersgetVar = ko.observable();
            self.usersgetusername = ko.observable();
            self.usersgetpartyId = ko.observable();
            self.usersgetfirstName = ko.observable();
            self.usersgetlastName = ko.observable();
            self.usersgetmobileNumber = ko.observable();
            self.usersgetemailId = ko.observable();
            self.usersgetisAccessSetupCheckRequired = ko.observable();
            self.usersgetuserGroup = ko.observable();
            self.usersgetuserType = ko.observable();
            self.usersgetpasswordGenerationType = ko.observable();
            self.usersgetpasswordGenerationFromDate = ko.observable();
            self.usersgetpswdGenerationToDate = ko.observable();
            self.usersgetisUserPasswordPrint = ko.observable();
            params.baseModel.registerComponent("module-search", "corporate-resource-access");
            self.userDTOs = ko.observableArray([]);
            self.partyDetails = params.partyDetails;
            self.selectedModule = params.selectedModule;
            self.userData = params.userData;
            self.isModuleSelected = params.isModuleSelected;

            self.columnArray = [{
                    headerText: "Initials",
                    field: "initials",
                    style: "width:10%"
                },
                {
                    headerText: "User Name",
                    field: "userName",
                    style: "width:20%"
                },
                {
                    headerText: "Full Name",
                    field: "fullName",
                    style: "width:70%"
                }
            ];

            self.isUsersFetched = params.isUsersFetched;
            self.isUserSelected = params.isUserSelected;

            Model.usersgetCall("", params.data.partyDetails.party.value()).then(function (response) {
                self.usersgetVar(response);
                self.userDTOs(response.userDTOList);
                self.isUsersFetched(true);
            });

            self.placeInitials = function (firstName, lastName) {
                const initial = firstName.charAt(0) + lastName.charAt(0);

                return initial.toUpperCase();
            };

            self.onClickUserName8 = function (event) {
                if (event) {
                    const datauser = {
                        userid: event.username,
                        username: params.baseModel.format("{firstName} {lastName}", {
                            firstName: event.firstName,
                            lastName: event.lastName
                        })
                    };

                    self.userData(datauser);
                    self.isUserSelected(true);
                    self.isModuleSelected(false);
                    self.selectedModule(null);
                }
            };

            self.dataSource18 = new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.userDTOs, {
                idAttribute: "username"
            }));
        };
    });