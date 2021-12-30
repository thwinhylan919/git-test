define([
    "ojs/ojcore",
    "knockout",
    "./model",
    "jquery",
    "ojL10n!resources/nls/manage-vpa",
    "ojs/ojinputtext",
    "ojs/ojlistview",
    "ojs/ojarraytabledatasource",
    "ojs/ojpagingtabledatasource",
    "ojs/ojpagingcontrol",
    "ojs/ojvalidation",
    "ojs/ojknockout-validation",
    "ojs/ojknockout",
    "ojs/ojvalidationgroup"
], function(oj, ko, manageVpaModel, $, ResourceBundle) {
    "use strict";

    /** New VPA Creation.
     *
     * @param {Object} rootParams  - An object which contains contect of dashboard and param values.
     * @return {Function} Function.
     * @return {Object} GetNewKoModel.
     *
     */
    return function(rootParams) {
        const self = this;

        self.vpaId = ko.observable();
        ko.utils.extend(self, rootParams.rootModel.previousState || rootParams.rootModel);
        self.resource = ResourceBundle;
        self.groupValid = ko.observable();
        self.additionalDetails = ko.observable();
        self.vpaAvailable = ko.observable(false);
        self.checkAvailabilityLink = ko.observable(true);
        self.vpaListDataSource = new oj.ArrayTableDataSource([]);
        self.vpaList = ko.observableArray();
        self.editFlag = ko.observable(false);
        rootParams.baseModel.registerComponent("create-vpa", "upi");
        rootParams.dashboard.headerName(self.resource.manageVpa.header);

        rootParams.baseModel.registerElement([
            "modal-window",
            "confirm-screen",
            "row",
            "account-input"
        ]);

        const accountsData = [],
         vpaListMap = {};

        self.fetchList = function() {
            Promise.all([manageVpaModel.fetchList(), manageVpaModel.fetchAccountData()]).then(function(response) {
                for (let i = 0; i < response[0].virtualPaymentAddressDTOs.length; i++) {
                    self.vpaList.push(response[0].virtualPaymentAddressDTOs[i]);
                    vpaListMap[response[0].virtualPaymentAddressDTOs[i].accountId.value] = response[0].virtualPaymentAddressDTOs[i];
                }

                for (let i = 0; i < response[1].accounts.length; i++) {
                    accountsData[i] = response[1].accounts[i].id;
                }

                if ((accountsData.length - self.vpaList().length) > 1) {
                    self.editFlag(true);
                }

                if (self.vpaList().length) {
                    self.vpaListDataSource.reset(self.vpaList(), {
                        idAttribute: "id"
                    });
                }
            });
        };

        self.fetchList();

        self.editVpa = function(data) {
            rootParams.dashboard.loadComponent("create-vpa", {
                vpaId: data.id,
                accountId: data.accountId.value,
                isEdit: true,
                vpaListMap: vpaListMap
            });
        };

        let rowContext = {};

        self.deleteVpa = function(data) {
            rowContext = data;
            $("#delete-vpa").trigger("openModal");
        };

        self.closeModal = function() {
            $("#delete-vpa").hide();
        };

        self.confirmDelete = function() {
            manageVpaModel.deleteVpa(rowContext.id).then(function() {
                self.vpaList.remove(function(item) {
                    return item.id === rowContext.id;
                });

                if (self.vpaList().length < accountsData.length) { self.editFlag(true); }

                if (self.vpaList().length) {
                    self.vpaListDataSource.reset(self.vpaList(), {
                        idAttribute: "id"
                    });
                }

                $("#delete-vpa").hide();
            });
        };
    };
});