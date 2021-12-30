define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/biller-list",
    "ojs/ojtable",
    "ojs/ojpagingcontrol",
    "ojs/ojarraytabledatasource",
    "ojs/ojpagingtabledatasource",
    "ojs/ojlistview",
    "ojs/ojaccordion",
    "ojs/ojknockout-validation"
], function(oj, ko, $, billerListModel, ResourceBundle) {
    "use strict";

    return function(rootParams) {
        const self = this;

        ko.utils.extend(self, rootParams.rootModel);

        self.resource = ResourceBundle.billers;
        self.showBillerList = ko.observable(true);
        self.isBillersLoaded = ko.observable(false);
        self.showActivitySuccessMsg = ko.observable(false);
        self.billers = ko.observableArray();
        rootParams.dashboard.headerName(self.resource.manageBillers);
        self.categories = ko.observableArray();
        self.billerinfo = ko.observableArray();
        self.billerList = ko.observableArray();
        self.billerMap = {};
        self.billerListDataSource = null;
        self.newId = ko.observable();
        self.confirmScreenDetails = ko.observable();
        self.expandedAccordians = ko.observableArray([]);
        rootParams.baseModel.registerComponent("payee-data-card", "payee");
        rootParams.baseModel.registerComponent("biller-details-edit", "payments");
        rootParams.baseModel.registerComponent("add-biller-main", "payments");
        rootParams.baseModel.registerComponent("biller-details-edit", "payments");
        rootParams.baseModel.registerComponent("biller-details", "payments");
        rootParams.baseModel.registerComponent("bill-payments", "payments");
        rootParams.baseModel.registerComponent("payee-data-card", "payee");

        rootParams.baseModel.registerElement([
            "search-box",
            "confirm-screen",
            "action-header"
        ]);

        self.groupedBillersInfo = ko.observableArray();

        function groupBillersByCategory() {
            let categorizedObj = {};

            for (let i = 0; i < self.billerinfo().length; i++) {
                if (self.billerinfo()[i].categoryType === categorizedObj.category) {
                    categorizedObj.billerList.push(self.billerinfo()[i]);
                } else {
                    if (i !== 0) {
                        categorizedObj.dataSource = new oj.ArrayTableDataSource(categorizedObj.billerList());
                        self.groupedBillersInfo.push(categorizedObj);
                    }

                    categorizedObj = {
                        category: self.billerinfo()[i].categoryType,
                        billerList: ko.observableArray([self.billerinfo()[i]]),
                        dataSource: null
                    };
                }
            }

            categorizedObj.dataSource = new oj.ArrayTableDataSource(self.billerinfo().length > 0 ? categorizedObj.billerList() : []);
            self.groupedBillersInfo.push(categorizedObj);
        }

        self.isEdit = ko.observable(false);

        self.editBiller = function() {
            self.isEdit(true);
        };

        self.getCategoryNames = function() {
            billerListModel.getCategories().done(function(data) {
                for (let i = 0; i < data.billers.length; i++) {
                    if ($.grep(self.categories(), function(el) {
                            return el.text === data.billers[i].categoryType;
                        }).length === 0) {
                        self.categories.push({
                            text: data.billers[i].categoryType,
                            value: data.billers[i].categoryType
                        });
                    }
                }

                for (let j = 0; j < self.billerinfo().length; j++) {
                    for (let l = 0; l < self.categories().length; l++) {
                        if (self.billerinfo()[j].categoryType === self.categories()[l].value) {
                            self.billerinfo()[j].categoryType = self.categories()[l].text;
                        }
                    }
                }

                self.billerinfo.sort(function(l, r) {
                    return l.categoryType > r.categoryType ? 1 : -1;
                });

                groupBillersByCategory();

                self.billerListDataSource = new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.billerinfo(), {
                    idAttribute: [
                        "billerName",
                        "relationshipNumber"
                    ]
                }));

                self.isBillersLoaded(true);

                if (self.showActivitySuccessMsg()) {
                    setTimeout(function() {
                        self.showActivitySuccessMsg(false);
                    }, 4000);
                }
            });
        };

        self.getBillerNames = function() {
            billerListModel.getBillerNames().done(function(data) {
                self.billerMap = {};

                for (let i = 0; i < data.billers.length; i++) {
                    self.billerMap[data.billers[i].id] = data.billers[i].description;
                }

                self.showBillerDetails();
            });
        };

        self.back = function() {
            history.back();
        };

        function emptyAllArrays() {
            self.groupedBillersInfo.removeAll();
            self.categories.removeAll();
            self.billerinfo.removeAll();
            self.billers.removeAll();
            self.billerList.removeAll();
        }

        self.showBillerDetails = function() {
            billerListModel.getBillerList().done(function(data) {
                let image = null,
                    i;

                emptyAllArrays();

                for (i = 0; i < data.partyBillerDetails.length; i++) {
                    self.billerList.push(data.partyBillerDetails[i]);

                    for (let j = 0; j < self.billerList()[i].length; j++) {
                        self.billers.push(self.billerList()[i][j]);
                    }
                }

                for (i = 0; i < self.billers().length; i++) {
                    if (self.billers()[i].categoryType === "Telecom") {
                        image = "payments/billers-telecom.svg";
                    } else if (self.billers()[i].categoryType === "Electricity") {
                        image = "payments/billers-electricity.svg";
                    } else if (self.billers()[i].categoryType === "Gas") {
                        image = "payments/billers-gas.svg";
                    } else {
                        image = "default";
                    }

                    self.billerinfo.push({
                        newBillerId: self.billers()[i].billerId.replace(/ +/g, ""),
                        billerId: self.billers()[i].billerId,
                        billerName: self.billerMap[self.billers()[i].billerId] || "",
                        relationshipNumber: self.billers()[i].relationshipNumber,
                        consumerNumber: self.billers()[i].consumerNumber || "",
                        image: image,
                        accountRelationshipNumber: self.billers()[i].accountRelationshipNumber || "",
                        categoryType: self.billers()[i].categoryType
                    });
                }

                self.getCategoryNames();
            });
        };

        self.getBillerNames();

        self.payBill = function() {
            self.billerData().autopopulate = true;

            if (!rootParams.baseModel.small()) { rootParams.rootModel.changeView("bill-payments", self.billerData); } else { rootParams.dashboard.loadComponent("bill-payments", self.billerData()); }
        };

        self.menuItems = [{
                id: "pay",
                label: self.resource.menuoptions.pay
            },
            {
                id: "viewedit",
                label: self.resource.menuoptions.viewedit
            },
            {
                id: "delete",
                label: self.resource.menuoptions.delete
            }
        ];

        self.billerData = ko.observable();
        self.successMessage = ko.observable();

        self.closeModal = function(reload, txn) {
            if (!rootParams.baseModel.small()) {
                $("#view-biller").trigger("closeModal");
                $("#delete-biller").trigger("closeModal");
            }

            if (reload) {
                self.successMessage(txn === "edit" ? self.resource.message.editsuccess : self.resource.message.deletesuccess);
                self.showActivitySuccessMsg(true);
                self.isBillersLoaded(false);
                self.getBillerNames();
            }
        };

        self.openMenu = function(data, event) {
            self.newId(data.billerId.replace(/ /g, ""));
            $("#menuLauncher-billerlist-contents-" + self.newId() + data.relationshipNumber).ojMenu("open", event);
        };

        self.confirmDeleteBiller = function() {
            billerListModel.deleteBiller(self.billerData().billerId, self.billerData().relationshipNumber).done(function(data, status, jqXHR) {
                self.httpStatus = jqXHR.status;

                let successMessage, statusMessages;

                if (self.userSegment !== "CORP") {
                  successMessage = self.resource.message.deletesuccess;
                  statusMessages = self.resource.message.successful;
              }

              const confirmScreenDetailsArray = [
                [{
                  label: self.resource.category,
                  value: self.billerData().categoryType
                }, {
                  label: self.resource.billerName,
                  value: self.billerData().billerName
                }],
                [{
                  label: self.resource.relationshipnum,
                  value: self.billerData().relationshipNumber
                }]];

              self.confirmScreenDetails(confirmScreenDetailsArray);

              rootParams.dashboard.loadComponent("confirm-screen", {
                  jqXHR: jqXHR,
                  hostReferenceNumber: data.externalReferenceId,
                  transactionName: self.resource.confirmDelete,
                  confirmScreenExtensions: {
                    successMessage: successMessage,
                    statusMessages: statusMessages,
                    isSet: true,
                    confirmScreenDetails: self.confirmScreenDetails(),
                    template: "confirm-screen/payments-template"
                  }
                }, self);

                self.closeModal(true, "delete");
                  });

            if (!rootParams.baseModel.small()) {
                $("#view-biller").trigger("closeModal");
                $("#delete-biller").trigger("closeModal");
            }
        };

        self.menuItemSelect = function(data, event) {
            self.billerData(data);

            if (event.target.value === "pay") { self.payBill(); } else if (event.target.value === "viewedit") {
                self.isEdit(false);

                if (!rootParams.baseModel.small()) { $("#view-biller").trigger("openModal"); } else { rootParams.dashboard.loadComponent("biller-details", self.billerData()); }
            } else if (event.target.value === "delete") { $("#delete-biller").trigger("openModal"); }
        };
    };
});