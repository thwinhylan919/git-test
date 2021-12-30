define([
  "ojs/ojcore",
  "knockout",
  "./model",
  "ojL10n!resources/nls/virtual-account-cash-position",
  "ojs/ojinputtext",
  "ojs/ojbutton",
  "ojs/ojnavigationlist",
  "ojs/ojarraydataprovider",
  "ojs/ojpagingdataproviderview",
  "ojs/ojtable",
  "ojs/ojpagingcontrol"
], function (oj, ko, CashPositionModel, resourceBundle) {
  "use strict";

  return function (params) {
    const self = this;

    let tempDTO = [];

    self.resource = resourceBundle;
    ko.utils.extend(self, params.rootModel);
    self.realCustomerNo = params.dashboard.userData.userProfile.partyId.value;
    self.selectedComponent = ko.observable();
    self.selectedItem = ko.observable();
    self.tabsTemplateLoaded = ko.observable(false);
    self.totalAccounts = ko.observable();
    self.individualBalance = ko.observable(0);
    self.transactionDataSource = ko.observable();
    self.menuOptions = ko.observable();
    self.viewTable = ko.observable(false);
    self.tabDataSource = ko.observable();
    self.orientationValue = ko.observable("horizontal");
    self.selectionValue = ko.observable("single");
    self.balanceTemplateLoaded = ko.observable(false);
    self.groups = ko.observable();
    self.entityId = params.rootModel.selectedEntity;
    self.currency = ko.observable(params.rootModel.selectedCurrency);

    const rangeData = params.rootModel.rangeData;
    let accountsArray = [],
      VAM_STATEMENT_PERIOD = null;

    self.groups(params.rootModel.groups);

    const createMenuOptions = function (groups) {
      const data = [];

      for (let index = 0; index < groups.length; index++) {
        data.push({
          code: index,
          description: groups[groups.length - index - 1]
        });
      }

      return data;
    };

    self.menuOptions(createMenuOptions(params.rootModel.menuOptions));

    self.headerText = ko.observableArray([{
        headerText: self.resource.labels.transactionDate,
        field: "transactionDate",
        sortable: "none"
      },
      {
        headerText: self.resource.labels.amount,
        field: "amount",
        sortable: "none"
      }
    ]);

    const mapTable = function (data) {
        tempDTO = data.map(function (v) {
          return {
            transactionDate: v.trnDate,
            transactionAmount: v.transactionAmount.amount,
            currency: v.transactionAmount.currency,
            drCr: v.drcr === "C" ? self.resource.labels.credit : self.resource.labels.debit
          };
        });
      },

      getQueryAsString = function () {
        const qQuery = {
          criteria: []
        };

        if (VAM_STATEMENT_PERIOD) {
          const toDate = params.baseModel.getDate(),
            fromDate = params.baseModel.getDate();

          fromDate.setDate(fromDate.getDate() - VAM_STATEMENT_PERIOD);

          qQuery.criteria.push({
            operand: "trnDate",
            operator: "BETWEEN",
            value: [oj.IntlConverterUtils.dateToLocalIso(fromDate).slice(0, 10), oj.IntlConverterUtils.dateToLocalIso(toDate).slice(0, 10)]
          });

        }

        return qQuery.criteria.length !== 0 ? JSON.stringify(qQuery) : undefined;
      },

      transactionDetails = function (data, event) {
        const virtualAccountNo = event === "selectedTabChangeHandler" ? data.detail.value : data;

        self.balanceTemplateLoaded(false);
        self.viewTable(false);

        let currAccount = null;

        if (accountsArray && accountsArray.length > 0) {
          currAccount = accountsArray.find(function (acc) {
            return acc.id.value === virtualAccountNo;
          });
        }

        self.individualBalance(currAccount ? currAccount.availableBalance.amount : null);

        if (params.rootModel.rangeData) {
          self.balanceTemplateLoaded(true);
        }

        CashPositionModel.maintenances().then(function (data) {
          if (data && data.configurationDetails) {
            const tmp = data.configurationDetails.find(function (e) {
              return e.propertyId === "VAM_STATEMENT_PERIOD";
            });

            if (tmp && tmp.propertyValue) {
              VAM_STATEMENT_PERIOD = parseInt(tmp.propertyValue);
            }

          }
        }).finally(function () {
          CashPositionModel.fetchTransactionList(virtualAccountNo, getQueryAsString()).then(function (transactions) {
            if (transactions && transactions.items.length > 0) {
              self.viewTable(false);
              mapTable(transactions.items);

              self.transactionDataSource(new oj.PagingDataProviderView(new oj.ArrayDataProvider(tempDTO, {
                idAttribute: "transactionDate"
              })));

              self.viewTable(true);
            } else {
              self.transactionDataSource(new oj.PagingDataProviderView(new oj.ArrayDataProvider([], {})));
              self.viewTable(true);
            }
          });
        });
      };

    self.selectedTabChangeHandler = function (event) {
      transactionDetails(event, "selectedTabChangeHandler");
    };

    const selectedRangeArray = function (tabArray) {
        ko.tasks.runEarly();
        self.tabDataSource(new oj.ArrayDataProvider([], {}));
        self.tabsTemplateLoaded(false);
        self.balanceTemplateLoaded(false);

        const tabLists = [];
        let virtualAccountBalance = 0;

        if (tabArray.length > 0) {
          for (let i = 0; i < tabArray.length; i++) {
            tabLists.push({
              id: i,
              code: tabArray[i].id.value,
              displayValue: tabArray[i].id.displayValue,
              description: tabArray[i].virtualAccountName
            });
          }

          virtualAccountBalance = tabArray[0].availableBalance.amount;
          self.individualBalance(virtualAccountBalance);

          self.tabDataSource(new oj.ArrayDataProvider(tabLists, {
            keyAttributes: "code"
          }));

          self.selectedComponent(tabLists[0].code);
          transactionDetails(tabLists[0].code);
          self.tabsTemplateLoaded(true);
        } else {
          self.balanceTemplateLoaded(false);
          self.individualBalance(0);
          self.tabDataSource(new oj.ArrayDataProvider([], {}));
          self.viewTable(false);
          self.tabsTemplateLoaded(true);
        }

      },

      rangeSelectedInChart = function () {
        let desc,
          startRange,
          endRange;

        if (params.rootModel.selectedTab[0].indexOf("Above") >= 0) {
          desc = params.rootModel.selectedTab[0].split("Above");
          startRange = parseInt(desc[1]);
        } else {
          desc = params.rootModel.selectedTab[0].split("to");
          startRange = parseInt(desc[0]);
          endRange = parseInt(desc[1]);
        }

        if (params.rootModel.selectedTab) {
          self.menuOptions().forEach(function (x) {
            if (x.description[0] === startRange && x.description[1] === endRange) {
              self.selectedItem(String(x.code));
              accountsArray = rangeData[x.code];
              selectedRangeArray(rangeData[x.code]);
            }
          });

        }
      };

    if (rangeData) {
      rangeSelectedInChart();
    }

    self.selectedRange = function (event) {
      accountsArray = rangeData[parseInt(event.detail.value)];
      selectedRangeArray(rangeData[parseInt(event.detail.value)]);
    };

  };
});