define([
  "knockout",
  "./model",
  "ojL10n!resources/nls/net-worth-graph",
  "ojs/ojchart"
], function(ko, Model, ResourceBundle) {
  "use strict";

  /** View tabular structure.
   * It allows user to view structure details in a tree format inside table.
   *
   * @param {Object} rootParams  - An object which contains contect of dashboard and param values.
   * @return {Function} Function.
   * @return {Object} GetNewKoModel.
   *
   */
  return function(rootParams) {
    const self = this;

    self.resource = ResourceBundle;
    self.pieSeriesValueForCredit = ko.observableArray();
    self.pieSeriesValueForDebit = ko.observableArray();
    self.showIHaveGraph = ko.observable(false);
    self.showIOweGraph = ko.observable(false);
    self.amountData = ko.observable(false);
    self.creditCardDetailsLoaded = ko.observable(false);
    self.selectedValue = ko.observable(self.resource.iHave);
    self.TotalAssets = ko.observable();
    self.TotalLiability = ko.observable();
    self.netAssetsValue = ko.observable();
    self.currency = ko.observable();
    self.excessLen = ko.observable(false);

    self.accountList = ko.observableArray();
    self.accountList = ko.observableArray();

    self.accountList.push({
      type: "LOCAL",
      accounts: ko.observableArray()
    });

    self.accountList.push({
      type: "EXT",
      accounts: ko.observableArray()
    });

    self.responseCount = ko.observableArray();
    self.rateResponseCount = ko.observableArray();
    self.rateArray = ko.observableArray([]);
    self.type = ko.observable();
    self.bankConfig = "";
    self.asset = [];
    self.liability = [];

    const summary = [];
    let asset = 0,
      liability = 0,
      netasset = 0;

    self.bankConfig = "";
    self.exchangecurrency = ko.observableArray();

    self.centerLabelStyle = ko.observable({
      "font-size": "1rem",
      color: "#fff"
    });

    self.innerRadius = ko.observable("0.9");
    self.dataLabelPosition = ko.observable("none");
    self.legendPosition = ko.observable("auto");
    self.legendRenderer = ko.observable("off");

    /**
     * This function sets the data of external bank that is to be linked.
     *
     * @function setexternalbankData
     * @param {Object} data - External bank data.
     * @returns {void}
     * @memberOf ExternalAccountNetWorthGraph
     **/
    function setexternalbankData(data) {
      const summarydata = data.externalBankAccountDTOs;

      if (summarydata) {
        for (let k = 0; k < summarydata.length; k++) {
          if (summarydata[k].type === "TRD") {

            if (self.bankConfig.localCurrency === summarydata[k].availableBalance.currency) {
              summary.TRDAmount += summarydata[k].availableBalance.amount;
              self.currency(self.bankConfig.localCurrency);
            } else {
              for (let j = 0; j < self.rateArray().length; j++) {
                if (self.rateArray()[j].toCCY === summarydata[k].availableBalance.currency) {
                  if (self.rateArray()[j].opt === "*") {
                    summary.TRDAmount += self.rateArray()[j].rate * summarydata[k].availableBalance.amount;
                    self.currency(self.bankConfig.localCurrency);
                  } else {
                    summary.TRDAmount += summarydata[k].availableBalance.amount / self.rateArray()[j].rate;
                    self.currency(self.bankConfig.localCurrency);
                  }
                }
              }
            }
          } else if (summarydata[k].type === "CSA") {

            if (self.bankConfig.localCurrency === summarydata[k].availableBalance.currency) {
              summary.CSAAmount += summarydata[k].availableBalance.amount;
              self.currency(self.bankConfig.localCurrency);
            } else {
              for (let l = 0; l < self.rateArray().length; l++) {
                if (self.rateArray()[l].toCCY === summarydata[k].availableBalance.currency) {
                  if (self.rateArray()[l].opt === "*") {
                    summary.CSAAmount += self.rateArray()[l].rate * summarydata[k].availableBalance.amount;
                    self.currency(self.bankConfig.localCurrency);
                  } else {
                    summary.CSAAmount += summarydata[k].availableBalance.amount / self.rateArray()[l].rate;
                    self.currency(self.bankConfig.localCurrency);
                  }
                }
              }
            }
          } else if (summarydata[k].type === "LON") {
            if (self.bankConfig.localCurrency === summarydata[k].outstandingAmount.currency) {
              summary.LOANAmount += summarydata[k].outstandingAmount.amount;
              self.currency(self.bankConfig.localCurrency);
            } else {
              for (let m = 0; m < self.rateArray().length; m++) {
                if (self.rateArray()[m].toCCY === summarydata[k].outstandingAmount.currency) {
                  if (self.rateArray()[m].opt === "*") {
                    summary.LOANAmount += self.rateArray()[m].rate * summarydata[k].outstandingAmount.amount;
                    self.currency(self.bankConfig.localCurrency);
                  } else {
                    summary.LOANAmount += summarydata[k].outstandingAmount.amount / self.rateArray()[m].rate;
                    self.currency(self.bankConfig.localCurrency);
                  }
                }
              }
            }
          }
        }
      }

      self.pieSeriesValueForCredit.push({
        name: self.resource.labels.CSA,
        items: [summary.CSAAmount],
        color: "#FCB300"
      }, {
        name: self.resource.labels.TRD,
        items: [summary.TRDAmount],
        color: "#14BA92"
      });

      self.pieSeriesValueForDebit.push({
        name: self.resource.labels.CSAOD,
        items: [summary.CSAODAmount],
        color: "#FCB300"
      }, {
        name: self.resource.labels.LON,
        items: [summary.LOANAmount],
        color: "#5fefef"
      });

      if (self.pieSeriesValueForCredit().length !== 0) {
        self.showIHaveGraph(true);
        self.amountData(true);
      }

      self.asset = {
        CASA: rootParams.baseModel.formatCurrency(summary.CSAAmount, self.currency()),
        TD: rootParams.baseModel.formatCurrency(summary.TRDAmount, self.currency())
      };

      asset = summary.CSAAmount + summary.TRDAmount + summary.RDAmount;
      netasset = asset - (summary.CSAODAmount + summary.LOANAmount);
      self.TotalAssets(rootParams.baseModel.formatCurrency(asset, self.currency()));
      self.netAssetsValue(rootParams.baseModel.formatCurrency(netasset, self.currency()));

      self.liability = {
        CSAOD: rootParams.baseModel.formatCurrency(summary.CSAODAmount, self.currency()),
        LOAN: rootParams.baseModel.formatCurrency(summary.LOANAmount, self.currency())

      };

      liability = summary.CSAODAmount + summary.LOANAmount;
      self.TotalLiability(rootParams.baseModel.formatCurrency(liability, self.currency()));
    }

    /**
     * This function calculates the customer's net worth across all the accounts.
     *
     * @function calculateNetWorth
     * @param {Object} data - Net worth data.
     * @returns {void}
     * @memberOf ExternalAccountNetWorthGraph
     **/
    function calculateNetWorth(data) {
      const summarydata = data.summary.items;

      ko.utils.arrayForEach(summarydata, function(item) {

        if (item.accountType === "CSA" && item.totalActiveAvailableBalance.amount > 0) {
          self.currency(item.totalActiveAvailableBalance.currency);
          summary.CSAAmount += item.totalActiveAvailableBalance.amount;
        } else if (item.accountType === "CSA" && item.totalActiveAvailableBalance.amount < 0) {
          self.currency(item.totalActiveAvailableBalance.currency);
          summary.CSAODAmount -= item.totalActiveAvailableBalance.amount;
        } else if (item.accountType === "TRD") {
          self.currency(item.totalActiveAvailableBalance.currency);
          summary.TRDAmount += item.totalActiveAvailableBalance.amount;
          summary.RDAmount += item.totalRDActiveAvailableBalance.amount;
        } else if (item.accountType === "LON") {
          self.currency(item.totalActiveOutstandingBalance.currency);
          summary.LOANAmount += item.totalActiveOutstandingBalance.amount;

        }
      });

      if (self.pieSeriesValueForCredit().length !== 0) {
        self.showIHaveGraph(true);
        self.amountData(true);
      }

      self.asset = {
        CASA: rootParams.baseModel.formatCurrency(summary.CSAAmount, self.currency()),
        TD: rootParams.baseModel.formatCurrency(summary.TRDAmount, self.currency())
      };

      asset = summary.CSAAmount + summary.TRDAmount + summary.RDAmount;
      netasset = asset - (summary.CSAODAmount + summary.LOANAmount);
      self.TotalAssets(rootParams.baseModel.formatCurrency(asset, self.currency()));
      self.netAssetsValue(rootParams.baseModel.formatCurrency(netasset, self.currency()));

      self.liability = {
        CSAOD: rootParams.baseModel.formatCurrency(summary.CSAODAmount, self.currency()),
        LOAN: rootParams.baseModel.formatCurrency(summary.LOANAmount, self.currency())

      };

      liability = summary.CSAODAmount + summary.LOANAmount;
      self.TotalLiability(rootParams.baseModel.formatCurrency(liability, self.currency()));
    }

    /**
     * This function sets the data for tha accounts.
     *
     * @function setDataForAccounts
     * @returns {void}
     * @memberOf ExternalAccountNetWorthGraph
     **/
    function setDataForAccounts() {
      self.pieSeriesValueForCredit.removeAll();
      self.pieSeriesValueForDebit.removeAll();
      summary.CSAAmount = 0;
      summary.CSAODAmount = 0;
      summary.TRDAmount = 0;
      summary.RDAmount = 0;
      summary.LOANAmount = 0;
    }

    /**
     * This function sets the data for tha accounts.
     *
     * @function setData
     * @returns {void}
     * @memberOf ExternalAccountNetWorthGraph
     **/
    function setData() {
      setDataForAccounts();

      self.styleDefaults = ko.pureComputed(function() {
        return {
          pieInnerRadius: self.innerRadius(),
          dataLabelPosition: self.dataLabelPosition()
        };
      });

      self.legend = ko.pureComputed(function() {
        return {
          position: self.legendPosition(),
          textStyle: self.centerLabelStyle(),
          rendered: self.legendRenderer()
        };
      });
    }

    setData();

    self.CenterLabelIHave = function(dataContext) {
      if (asset > 0) {
        const pieChartNode = document.createElement("div");

        pieChartNode.innerHTML =
          "<div style=\"position:absolute;text-align:center;font-size:0.9rem;top:4rem;\">" +
          "<div data=\"textlabel\">" + self.resource.iHave + "</div>" +
          "<div data=\"amount\">" + self.TotalAssets() + "</div>" +
          "</div>";

        const outerDiv = pieChartNode.children[0];

        if (rootParams.baseModel.medium()) {
          outerDiv.style.width = (dataContext.innerBounds.width + 40) + "px";
          outerDiv.style.top = (dataContext.innerBounds.y + 30) + "px";
          outerDiv.style.left = (dataContext.innerBounds.x - 20) + "px";
        } else {
          outerDiv.style.width = (dataContext.innerBounds.width + 40) + "px";
          outerDiv.style.top = (dataContext.innerBounds.y + 10) + "px";
          outerDiv.style.left = (dataContext.innerBounds.x - 20) + "px";
        }

        return {
          insert: pieChartNode
        };
      }
    };

    self.CenterLabelIOwe = function(dataContext) {
      if (liability > 0) {
        const pieChartNode = document.createElement("div");

        pieChartNode.innerHTML =
          "<div style=\"position:absolute;text-align:center;font-size:0.9rem;top:4rem;\">" +
          "<div data=\"textlabel\">" + self.resource.iOwe + "</div>" +
          "<div data=\"amount\">" + self.TotalLiability() + "</div>" +
          "</div>";

        const outerDiv = pieChartNode.children[0];

        if (rootParams.baseModel.medium()) {
          outerDiv.style.width = (dataContext.innerBounds.width + 40) + "px";
          outerDiv.style.top = (dataContext.innerBounds.y + 30) + "px";
          outerDiv.style.left = (dataContext.innerBounds.x - 20) + "px";
        } else {
          outerDiv.style.width = (dataContext.innerBounds.width + 40) + "px";
          outerDiv.style.top = (dataContext.innerBounds.y + 10) + "px";
          outerDiv.style.left = (dataContext.innerBounds.x - 20) + "px";
        }

        return {
          insert: pieChartNode
        };
      }
    };

    /**
     * This function checks for the dulplicate currencies.
     *
     * @function checkDuplicateCurrency
     * @param {Object} currency - Duplicate currency.
     * @returns {void}
     * @memberOf ExternalAccountNetWorthGraph
     **/
    function checkDuplicateCurrency(currency) {
      let isDuplicate = false;

      for (let j = 0; j < self.rateArray().length; j++) {
        if (self.rateArray()[j].toCCY === currency) {
          isDuplicate = true;
        }
      }

      return isDuplicate;
    }

    /**
     * This function adds new accounts from other bank to existing account.
     *
     * @function addAccount
     * @returns {void}
     * @memberOf ExternalAccountNetWorthGraph
     **/
    function addAccount() {
      let i;

      for (i = 0; i < self.accountList()[1].accounts().length; i++) {
        const summarydata = self.accountList()[1].accounts()[i].externalBankAccountDTOs;

        if (summarydata) {
          let rateData = "";

          for (let k = 0; k < summarydata.length; k++) {
            if (summarydata[k].type === "LON") {
              if (self.bankConfig.localCurrency !== summarydata[k].outstandingAmount.currency) {
                if (!checkDuplicateCurrency(summarydata[k].outstandingAmount.currency)) {
                  rateData = {
                    fromCCY: self.bankConfig.localCurrency,
                    toCCY: summarydata[k].outstandingAmount.currency,
                    rate: "",
                    opt: ""
                  };

                  self.rateArray.push(rateData);
                }
              }
            } else if (self.bankConfig.localCurrency !== summarydata[k].availableBalance.currency) {
              if (!checkDuplicateCurrency(summarydata[k].availableBalance.currency)) {
                rateData = {
                  fromCCY: self.bankConfig.localCurrency,
                  toCCY: summarydata[k].availableBalance.currency,
                  rate: "",
                  opt: ""
                };

                self.rateArray.push(rateData);
              }
            }
          }
        }
      }

      for (let l = 0; l < self.rateArray().length; l++) {
        const response = Model.fetchExchangeRate(self.bankConfig.homeBranch, self.rateArray()[l].toCCY, self.bankConfig.localCurrency);

        response.done(function(data) {

          if (data.exchangeRateDetails) {
            for (let j = 0; j < self.rateArray().length; j++) {
              if (self.rateArray()[j].toCCY === data.exchangeRateKey.ccy1Code) {
                self.rateArray()[j].rate = data.exchangeRateDetails[0].midRate;
                self.rateArray()[j].opt = "*";
                self.rateResponseCount.push(i);

                if (self.rateArray().length === self.rateResponseCount().length) {
                  for (let l = 0; l < self.accountList()[1].accounts().length; l++) {
                    setexternalbankData(self.accountList()[1].accounts()[l]);
                  }
                }
              }
            }
          } else {
            const response = Model.fetchExchangeRate(self.bankConfig.homeBranch, self.bankConfig.localCurrency, data.exchangeRateKey.ccy1Code);

            response.done(function(data) {
              for (let j = 0; j < self.rateArray().length; j++) {
                if (self.rateArray()[j].toCCY === data.exchangeRateKey.ccy2Code) {
                  self.rateArray()[j].rate = data.exchangeRateDetails[0].midRate;
                  self.rateArray()[j].opt = "/";
                  self.rateResponseCount.push(i);

                  if (self.rateArray().length === self.rateResponseCount().length) {
                    for (let l = 0; l < self.accountList()[1].accounts().length; l++) {
                      setexternalbankData(self.accountList()[1].accounts()[l]);
                    }
                  }
                }
              }
            });
          }
        });

        response.fail(function() {
          self.rateResponseCount.push(i);

          if (self.rateArray().length === self.rateResponseCount().length) {
            for (let k = 0; k < self.accountList()[1].accounts().length; k++) {
              setexternalbankData(self.accountList()[1].accounts()[k]);
            }
          }
        });
      }

      calculateNetWorth(self.accountList()[0].accounts()[0]);
    }

    Model.fetchBankConfiguration().done(function(data) {
      self.bankConfig = data.bankConfigurationDTO;

      Model.fetchAccesstoken().done(function(data) {
        if (data.accessTokenDTOs !== undefined) {
          self.excessLen(data.accessTokenDTOs.length + 1);

          for (let j = 0; j < data.accessTokenDTOs.length; j++) {
            const externalResponse = Model.fetchexternalbankAccounts(data.accessTokenDTOs[j].bankCode);

            externalResponse.done(function(extdata) {
              self.responseCount.push(j);
              self.accountList()[1].accounts.push(extdata);

              if (self.responseCount().length === self.excessLen()) {
                addAccount();
              }
            });

            externalResponse.fail(function() {
              self.responseCount.push(j);

              if (self.responseCount().length === self.excessLen()) {
                addAccount();
              }
            });
          }
        }

        const localAccounts = Model.fetchAccounts();

        localAccounts.done(function(data) {
          self.responseCount.push("j");
          self.accountList()[0].accounts.push(data);

          if (self.responseCount().length === self.excessLen()) {
            addAccount();
          }
        });

        localAccounts.fail(function() {
          self.responseCount.push("j");

          if (self.responseCount().length === self.excessLen()) {
            addAccount();
          }
        });
      });
    });
  };
});