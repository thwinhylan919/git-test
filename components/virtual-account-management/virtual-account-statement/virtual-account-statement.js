define([
  "ojs/ojcore",
  "knockout",
  "./model",
  "ojL10n!resources/nls/virtual-account-statement",
  "ojs/ojinputtext",
  "ojs/ojarraydataprovider",
  "ojs/ojtable",
  "ojs/ojdatetimepicker",
  "ojs/ojvalidationgroup",
  "ojs/ojpagingcontrol",
  "ojs/ojpagingtabledatasource",
  "ojs/ojarraytabledatasource",
  "ojs/ojbutton",
  "ojs/ojmenu",
  "ojs/ojselectcombobox",
  "ojs/ojvalidationgroup",
  "ojs/ojoption"

], function (oj, ko, VirtualAccountStatementModel, resourceBundle) {
  "use strict";

  return function (params) {
    const self = this;
    let tempDTO = [];

    ko.utils.extend(self, params.rootModel);
    self.resource = resourceBundle;
    params.dashboard.headerName(self.resource.title);
    self.selectedAccount = ko.observable();
    self.referenceNumber = ko.observable();
    self.virtualAccounts = ko.observable([]);
    self.virtualAccountLoaded = ko.observable(true);
    self.selectedTransaction = ko.observableArray();
    self.transactionTypeValue = ko.observableArray();
    self.menuItems = ko.observableArray();
    self.mediatypeLoaded = ko.observable(false);
    self.mediaFormat = ko.observable();
    self.fromDate = ko.observable();
    self.toDate = ko.observable();
    self.mediaTypeSelected = ko.observable();
    self.realCustomerName = params.dashboard.userData.userProfile.accessibleEntityDTOs[0].partyName;
    self.taskCode = "VAMA_I_VST";
    self.realCustomerNo = params.dashboard.userData.userProfile.partyId.value;
    self.dataSource = ko.observableArray();
    self.viewTable = ko.observable(false);
    self.isdownLoad = ko.observable(false);
    self.media = ko.observable();
    self.taxonomyDefinition = params.dashboard.getTaxonomyDefinition("com.ofss.digx.app.vam.dto.statement.VirtualAccountStatementListRequestDTO");

    self.headerText = ko.observableArray([{
        headerText: self.resource.date,
        renderer: oj.KnockoutTemplateUtils.getRenderer("dateFromIdentifier", true),
        field: "date"
      },
      {
        headerText: self.resource.description,
        field: "description",
        sortable: "none"
      },
      {
        headerText: self.resource.referenceNumber,
        field: "referenceNumber",
        sortable: "none"
      },
      {
        headerText: self.resource.amount,
        field: "amount",
        renderer: oj.KnockoutTemplateUtils.getRenderer("amount", true)
      }
    ]);

    self.transactionTypeDTO = function () {

      const transactionType = [{
          id: "A",
          description: self.resource.all

        },
        {
          id: "D",
          description: self.resource.debit

        },
        {
          id: "C",
          description: self.resource.credit

        }
      ];

      for (let i = 0; i < transactionType.length; i++) {
        self.transactionTypeValue.push({
          id: transactionType[i].id,
          description: transactionType[i].description
        });
      }
    };

    self.menuItemDTO = function () {
      self.menuItems([]);

      const menuItem = [{
          id: "P",
          description: self.resource.pdf

        },
        {
          id: "C",
          description: self.resource.csv

        }
      ];

      for (let i = 0; i < menuItem.length; i++) {
        self.menuItems.push({
          id: menuItem[i].id,
          description: menuItem[i].description
        });
      }

      self.mediatypeLoaded(true);
    };

    self.menuItemDTO();
    self.transactionTypeDTO();

    const showBlankTable = function () {
        self.viewTable(false);
        self.dataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource([], {})));
        self.viewTable(true);
      },
      getQueryAsString = function () {
        const qQuery = {
          criteria: []
        };

        if (self.referenceNumber()) {
          qQuery.criteria.push({
            operand: "key.txnReferenceNumber",
            operator: "EQUALS",
            value: [self.referenceNumber()]
          });
        }

        if (self.fromDate() && self.toDate()) {
          qQuery.criteria.push({
            operand: "trnDate",
            operator: "BETWEEN",
            value: [self.fromDate(), self.toDate()]
          });
        }

        if (self.selectedTransaction() && self.selectedTransaction() !== "A") {
          qQuery.criteria.push({
            operand: "drCr",
            operator: "EQUALS",
            value: [self.selectedTransaction()]
          });
        }

        return qQuery.criteria.length === 0 ? undefined : JSON.stringify(qQuery);
      },
      createStatementTable = function (data) {
        let newArr = [];

        self.viewTable(false);

        if (data && data.items.length > 0) {
          newArr = data.items;
          self.tableFieldsDTO(data.items);

          if (newArr.length) {
            self.dataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(tempDTO, {
              idAttribute: "referenceNumber"
            })));

            self.viewTable(true);
          }
        } else {
          showBlankTable();
        }
      };

    self.searchResult = function () {
      const tracker = document.getElementById("tracker");

      if (tracker.valid === "valid") {

        if (!self.isdownLoad()) {
          VirtualAccountStatementModel.fetchTransactionList(self.selectedAccount(), getQueryAsString(), self.media(), self.mediaFormat(), self.isdownLoad()).then(
            function (data) {
              createStatementTable(data);
            }).catch(function () {
            showBlankTable();
          });
        } else {
          VirtualAccountStatementModel.fetchTransactionList(self.selectedAccount(), getQueryAsString(), self.media(), self.mediaFormat(), self.isdownLoad());
        }
      } else {
        tracker.showMessages();
        tracker.focusOn("@firstInvalidShown");
      }

      self.isdownLoad(false);

    };

    self.tableFieldsDTO = function (data) {
      tempDTO = data.map(function (v) {
        return {
          date: v.trnDate,
          description: v.msgText,
          referenceNumber: v.txnReferenceNumber,
          amount: v.transactionAmount.amount,
          currency: v.transactionAmount.currency,
          transactionType: v.drcr
        };
      });
    };

    self.downloadStatement = function (event) {
      if (event.target.value) {
        self.mediaFormat(event.target.innerText);

        if (event.target.innerText === "PDF") {
          self.media("application/pdf");
          self.mediaFormat("pdf");
        } else {
          self.media("text/csv");
          self.mediaFormat("csv");

        }

        self.isdownLoad(true);
        self.searchResult();

      }
    };

    VirtualAccountStatementModel.fetchVirtualAccount(self.taskCode).then(
      function (data) {
        if (data && data.accounts) {
          for (let i = 0; i < data.accounts.length; i++) {
            self.virtualAccounts().push({
              virtualAccountNo: data.accounts[i].id.value,
              virtualAccountDisplay: data.accounts[i].id.displayValue
            });
          }

          self.virtualAccountLoaded(false);
          ko.tasks.runEarly();
          self.virtualAccountLoaded(true);
        }
      }).then(function () {
      if (params.rootModel.params.fromVirtualAccountView) {
        self.selectedAccount(params.rootModel.params.virtualAccountNo);
        self.fromDate(params.rootModel.params.statementData.fromDate);
        self.toDate(params.rootModel.params.statementData.toDate);
        createStatementTable(params.rootModel.params.statementData);
      }
    }).catch(function () {
      self.virtualAccountLoaded(true);
    });

    self.reset = function () {
      if (self.virtualAccountLoaded() && self.virtualAccounts().length !== 0) {
        self.selectedAccount(null);
      }

      self.referenceNumber("");
      self.selectedTransaction(self.transactionTypeValue()[0].id);
      self.fromDate("");
      self.toDate("");
      self.viewTable(false);

    };
  };
});