define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "ojL10n!resources/nls/mutual-funds-reports",
  "./model",
  "jqueryui-amd/widgets/sortable",
  "ojs/ojinputnumber",
  "ojs/ojinputtext",
  "ojs/ojselectcombobox",
  "ojs/ojtable",
  "ojs/ojarraytabledatasource",
  "ojs/ojpagingcontrol",
  "ojs/ojpagingtabledatasource",
  "ojs/ojlistview",
  "ojs/ojcollectiontabledatasource",
  "ojs/ojdatetimepicker",
  "ojs/ojtoolbar",
  "ojs/ojswitch"
], function (oj, ko, $, ResourceBundle, OrderStatusModel) {
  "use strict";

  return function (Params) {
    const self = this;

    ko.utils.extend(self, Params.rootModel);
    self.validationTracker = Params.validator;
    self.resource = ResourceBundle;
    Params.dashboard.headerName(self.resource.orderStatusHeader);
    Params.baseModel.registerElement("date-box");
    self.refreshData = ko.observable(true);
    self.dataSource = ko.observable();
    self.fromDate = ko.observable();
    self.toDate = ko.observable();
    self.minFromDate = ko.observable();
    self.currentDate = ko.observable();
    self.maxFromDate = ko.observable();
    self.minToDate = ko.observable();
    self.maxToDate = ko.observable();
    self.action = ko.observable();
    self.editOrderArray = ko.observableArray();
    self.transactionTypeCode = ko.observable();
    self.schemeCode = ko.observable();
    self.investmentAccount = ko.observable();
    self.investmentAccountData = ko.observableArray();
    self.deleteOrderArray = ko.observable();
    self.fundHouseData = ko.observableArray();
    self.fundHouseDTOData = ko.observableArray();
    self.fundHouseCode = ko.observable();
    self.accountNumber = ko.observableArray();
    self.referenceNo = ko.observable();
    self.instructionId = ko.observable();
    self.transactionType = ko.observable();
    self.schemesData = ko.observableArray();
    self.orderTypesData = ko.observableArray();
    self.orderType = ko.observable();
    self.investmentAccountsLoaded = ko.observable(false);
    self.fundHouseDetailsLoaded = ko.observable(false);
    self.schemesDataLoaded = ko.observable(true);
    self.orderTypesLoaded = ko.observable(false);
    self.searchResults = ko.observable(false);
    self.refresh = ko.observable(true);
    self.clearResults = ko.observable(false);
    self.fundHouseDTODetailsLoaded = ko.observable(false);
    self.showDownload = ko.observable(true);
    self.updateMessage = ko.observable(self.resource.orderStatusHeader);

    let i,

      sortAscending = true;

    /**
     *
     * @param {Object} a - First object.
     * @param {Object} b - Second object.
     * @returns {void}
     */
    function sortTxnByDate(a, b) {
      if (a.txnDate < b.txnDate) {
        return sortAscending ? -1 : 1;
      } else if (a.txnDate > b.txnDate) {
        return sortAscending ? 1 : -1;
      }

      return 0;
    }

    self.investmentAccountYes = ko.observable(false);

    OrderStatusModel.fetchInvestmentAccounts().done(function (data) {
      if (data.investmentAccounts.length) {
        self.investmentAccountYes(true);

        self.headerText = ko.observableArray([{
            headerText: self.resource.datePlaceHolder,
            field: "txnDate",
            sortProperty: "txnDate"
          },
          {
            headerText: self.resource.schemeName,
            field: "schemeName"
          },
          {
            headerText: self.resource.orderType,
            field: "orderType"
          },
          {
            headerText: self.resource.orderAmount,
            field: "orderAmount",
            headerClassName: "right"
          },
          {
            headerText: self.resource.orderStatus,
            field: "orderStatus"
          }
        ]);

        Params.baseModel.registerElement(["confirm-screen", "modal-window"]);
        Params.baseModel.registerComponent("order-status-review", "mutual-funds");
        Params.baseModel.registerComponent("purchase-mutual-fund-train", "mutual-funds");
        Params.baseModel.registerComponent("redeem-funds-global", "mutual-funds");
        Params.baseModel.registerComponent("switch-funds-global", "mutual-funds");
        Params.baseModel.registerElement("confirm-screen");

        const currentDate = Params.baseModel.getDate();

        self.currentDate(oj.IntlConverterUtils.dateToLocalIso(currentDate));
        self.toDate(oj.IntlConverterUtils.dateToLocalIso(currentDate));
        self.fromDate(oj.IntlConverterUtils.dateToLocalIso(currentDate));
        self.maxToDate(oj.IntlConverterUtils.dateToLocalIso(currentDate));

        self.investmentAccount = ko.observable({
          value: ko.observable(),
          displayValue: ko.observable(),
          name: ko.observable(),
          pattern: ko.observable()
        });

        self.valueChange = function () {
          let j;

          for (j = 0; j < self.accountNumber().length; j++) {
            if (self.accountNumber()[j].value === self.investmentAccount().value()) {
              self.investmentAccount().displayValue = self.accountNumber()[j].text;
              break;
            }
          }

          OrderStatusModel.fetchFundHouse(self.investmentAccount().value()).done(function (data) {
            self.schemesDataLoaded(false);
            self.fundHouseData().splice(0, self.fundHouseData().length);

            for (i = 0; i < data.accountHoldings.length; i++) {
              self.fundHouseData().push({
                code: data.accountHoldings[i].fundHouseCode,
                label: null
              });

              self.schemesData().push({
                label: data.accountHoldings[i].scheme.schemeName,
                code: data.accountHoldings[i].scheme.schemeCode
              });
            }

            OrderStatusModel.fetchAllFundHouse().done(function (data) {
              self.fundHouseDTOData().splice(0, self.fundHouseDTOData().length);

              for (i = 0; i < data.fundhousedtos.length; i++) {

                self.fundHouseDTOData().push({
                  label: data.fundhousedtos[i].fundHouseName,
                  code: data.fundhousedtos[i].fundHouseCode
                });
              }

              for (i = 0; i < self.fundHouseDTOData().length; i++) {
                for (j = 0; j < self.fundHouseData().length; j++) {
                  if (self.fundHouseDTOData()[i].code === self.fundHouseData()[j].code) {
                    self.fundHouseData()[j].label = self.fundHouseDTOData()[i].label;
                  }
                }
              }

              ko.tasks.runEarly();
              self.fundHouseDTODetailsLoaded(true);
              self.schemesDataLoaded(true);
              self.fundHouseDetailsLoaded(true);
            });

          });

        };

        for (let i = 0; i < data.investmentAccounts.length; i++) {
          self.investmentAccountData.push({
            text: data.investmentAccounts[i].accountId.displayValue,
            value: data.investmentAccounts[i].accountId.value,
            name: data.investmentAccounts[i].primaryHolderName,
            pattern: data.investmentAccounts[i].holdingPattern
          });
        }

        self.investmentAccountsLoaded(true);

        self.fundHouseChange = function (event) {
          self.schemesData().splice(0, self.schemesData().length);

          OrderStatusModel.fetchSchemeName(self.investmentAccount().value(), event.detail.value).done(function (data) {
            self.schemesDataLoaded(false);

            for (i = 0; i < data.accountHoldings.length; i++) {
              self.schemesData().push({
                label: data.accountHoldings[i].scheme.schemeName,
                code: data.accountHoldings[i].scheme.schemeCode
              });

            }

            ko.tasks.runEarly();
            self.schemesDataLoaded(true);

          });

          for (i = 0; i < self.fundHouseData().length; i++) {
            if (event.detail.value === self.fundHouseData()[i].code) {
              self.fundHouseCode(self.fundHouseData()[i].code);
              break;
            }
          }
        };

        OrderStatusModel.fetchMFOrderTypes().done(function (data) {
          for (i = 0; i < data.enumRepresentations[0].data.length; i++) {
            self.orderTypesData().push({
              label: data.enumRepresentations[0].data[i].description,
              code: data.enumRepresentations[0].data[i].code
            });
          }

          ko.tasks.runEarly();
          self.orderTypesLoaded(true);
        });

        self.clearResults = function () {
          self.refresh(false);
          self.fundHouseCode("");
          self.schemeCode("");
          self.orderType("");
          self.fromDate(self.currentDate());
          self.toDate(self.currentDate());
          self.dataSource();
          self.referenceNo("");
          self.searchResults(false);
          ko.tasks.runEarly();
          self.refresh(true);
        };

        self.deleteOrder = function (data) {
          self.instructionId(data.instructionId);
          self.transactionType(data.transactionType);
          $("#delete-order").trigger("openModal");
        };

        self.closeDeleteOrderModal = function () {
          $("#delete-order").trigger("closeModal");
        };

        self.confirmDeleteOrder = function () {
          $("#delete-order").trigger("closeModal");

          OrderStatusModel.fetchOrder(self.investmentAccount().value(), self.instructionId()).done(function (data) {
            if (self.transactionType() === "PURCHASE") {
              self.deleteOrderArray(data.orderInstructionDTO.accountHoldingPurchaseDTO);
              self.action("delete-purchase");

              Params.dashboard.loadComponent("order-status-review", {
                action: self.action(),
                deleteOrderArray: self.deleteOrderArray(),
                instructionId: self.instructionId(),
                investmentAccount: self.investmentAccount()
              });
            } else if (self.transactionType() === "REDEEM") {
              self.deleteOrderArray(data.orderInstructionDTO.accountHoldingRedeemDTO);
              self.action("delete-redeem");

              Params.dashboard.loadComponent("order-status-review", {
                action: self.action(),
                deleteOrderArray: self.deleteOrderArray(),
                instructionId: self.instructionId(),
                investmentAccount: self.investmentAccount()
              });
            } else if (self.transactionType() === "SWITCH") {
              self.deleteOrderArray(data.orderInstructionDTO.switchResponseDTO);
              self.action("delete-switch");

              Params.dashboard.loadComponent("order-status-review", {
                action: self.action(),
                deleteOrderArray: self.deleteOrderArray(),
                instructionId: self.instructionId(),
                investmentAccount: self.investmentAccount()
              });
            }
          });
        };

        self.editOrder = function (data) {
          self.instructionId(data.instructionId);
          self.transactionType(data.transactionType);

          OrderStatusModel.fetchOrder(self.investmentAccount().value(), self.instructionId()).done(function (data) {

            if (self.transactionType() === "PURCHASE") {
              self.editOrderArray(data.orderInstructionDTO.accountHoldingPurchaseDTO);
              self.action("edit-purchase");
              Params.dashboard.loadComponent("purchase-mutual-fund-train", {});
            } else if (self.transactionType() === "REDEEM") {
              self.editOrderArray(data.orderInstructionDTO.accountHoldingRedeemDTO);
              self.action("edit-redeem");
              Params.dashboard.loadComponent("redeem-funds-global", {});
            } else if (self.transactionType() === "SWITCH") {
              self.editOrderArray(data.orderInstructionDTO.switchResponseDTO);
              self.action("edit-switch");
              Params.dashboard.loadComponent("switch-funds-global", {});
            }
          });
        };

        let tempData = null;

        self.sortcallback = function (event, ui) {
          sortAscending = ui.direction === "ascending";

          if (ui.header === "txnDate") {
            tempData.sort(sortTxnByDate);
            self.dataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(tempData)));
          }
        };

        self.searchReports = function () {
          if (self.investmentAccountData() || self.fromDate() || self.toDate() || self.orderTypesData() || self.fundHouseData() || self.schemesData()) {
            OrderStatusModel.fetchOrderStatusReport(self.investmentAccount().value(), self.fundHouseCode(), self.schemeCode(), self.orderType(), self.referenceNo(), self.fromDate(), self.toDate()).done(function (data) {
              tempData = null;

              tempData = $.map(data.orderinstructiondtos, function (v) {
                const newObj = {};

                newObj.txnDate = v.date;
                newObj.schemeName = v.schemeName;
                newObj.fundHouse = v.fundHouseCode;
                newObj.orderStatus = v.status;
                newObj.orderType = v.orderType;
                newObj.referenceNumber = v.referenceNumber;
                newObj.orderAmount = v.amount.amount;
                newObj.currency = v.amount.currency;
                newObj.startSeqNumber = v.startSeqNumber;
                newObj.moreIndicator = v.moreIndicator;
                newObj.recordNumber = v.recordNumber;
                newObj.instructionId = v.instructionRefId;
                newObj.txnRefId = v.txnRefId;
                newObj.cancellationAllowed = v.cancellationAllowed;
                newObj.transactionType = v.transactionTypeCode;

                return newObj;
              });

              sortAscending = false;
              tempData.sort(sortTxnByDate);

              self.dataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(tempData, {
                idAttribute: "txnRefId"
              })));

              self.searchResults(true);
            });
          }
        };

        self.download = function () {
          $("#passwordDialog").trigger("openModal");

          if (self.investmentAccountData() || self.fromDate() || self.toDate() || self.fundHouseData() || self.schemesData()) {
            OrderStatusModel.fetchPDF(self.investmentAccount().value(), self.fundHouseCode(), self.schemeCode(), self.orderType(), self.referenceNo(), self.fromDate(), self.toDate());
          }
        };

        self.ok = function () {
          $("#passwordDialog").trigger("closeModal");
        };
      } else {
        Params.baseModel.registerComponent("open-investment-account-landing", "mutual-funds");
        Params.dashboard.loadComponent("open-investment-account-landing", {});
      }
    });
  };
});