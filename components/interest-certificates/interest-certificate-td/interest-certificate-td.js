define([
  "ojs/ojcore",
  "knockout",
  "./model",

  "ojL10n!resources/nls/interest-certificates",
  "ojs/ojinputtext",
  "ojs/ojcheckboxset",
  "ojs/ojselectcombobox",
  "ojs/ojdatetimepicker",
  "ojs/ojvalidation",
  "ojs/ojknockout-validation",
  "ojs/ojpopup",
  "ojs/ojradioset",
  "ojs/ojtable",
  "ojs/ojarraytabledatasource",
  "ojs/ojlabel",
  "ojs/ojlistview",
  "ojs/ojvalidationgroup",
  "ojs/ojpagingcontrol",
  "ojs/ojpagingtabledatasource"
], function(oj, ko, depositModel, resourceBundle) {
  "use strict";

  /**
   * Return function - description.
   *
   * @param  {type} rootParams - Description.
   * @return {type}            Description.
   */
  return function(rootParams) {
    const self = this;

    self.rootParams = rootParams;
    self.resource = resourceBundle;
    rootParams.baseModel.registerElement("account-input");
    self.duration = ko.observable("financialYear");
    self.deposit = ko.observable("TD");
    self.additionalDetails = ko.observable();
    self.validationTracker = ko.observable();
    self.customPayeeId = ko.observable();
    self.fromFavourites = ko.observable(false);
    self.fromInterests = ko.observable(false);
    self.year = ko.observable(false);
    self.years = ko.observable();
    self.type = ko.observable("deposit?module=CON&module=ISL");
    self.interestsLoaded = ko.observable(false);
    self.fromDate = ko.observable();
    self.toDate = ko.observable();
    self.currentDate = rootParams.baseModel.getDate();
    self.minFromDate = ko.observable();
    self.maxFromDate = ko.observable();
    self.minToDate = ko.observable();
    self.maxToDate = ko.observable();
    self.noYears = 3;
    self.financialYear = ko.observable();
    self.financialYears = ko.observableArray([]);
    self.interests = ko.observableArray([]);
    self.yearsLoaded = ko.observable(false);
    self.numberOfAccounts = ko.observable("single");
    self.showDownload = ko.observable(false);
    rootParams.dashboard.headerName(resourceBundle.title);
    self.pagingTableDataSource = ko.observable();
    self.taskCode="TD_I_IC";

    self.columnData = ko.observableArray([{
      headerText: self.resource.tableHeading.accountNo,
      field: "accountId"
    }, {
      headerText: self.resource.tableHeading.productType,
      field: "productName"
    }, {
      headerText: self.resource.tableHeading.date,
      field: "date"
    }, {
      headerText: self.resource.tableHeading.interestCredited,
      field: "interestAmount"
    }]);

    if (self.rootParams.rootModel.params.id && self.rootParams.rootModel.params.type === "TRD") {
      self.customPayeeId(self.rootParams.rootModel.params.id.value);

      if (rootParams.rootModel.params.module === "RD") {
        self.type = ko.observable("deposit?module=RD");
        self.deposit("RD");
      }
    } else {
      self.customPayeeId("");
    }

    depositModel.fetchCurrentDate().done(function(data) {
      self.currentDate = new Date(data.currentDate.valueDate);

      if ((self.currentDate.getMonth() + 1) <= 3) {
        self.financialYear(self.currentDate.getFullYear());
        self.minFromDate(oj.IntlConverterUtils.dateToLocalIso(new Date(self.currentDate.getFullYear() - 3, "03", "01")));

        for (let i = self.noYears; i > 0; i--) {
          self.financialYears.push({
            value: (self.currentDate.getFullYear() - i) + "",
            fromYear: self.currentDate.getFullYear() - i,
            toYear: self.currentDate.getFullYear() - i + 1
          });
        }
      } else {
        self.financialYear(+self.currentDate.getFullYear() + 1);
        self.minFromDate(oj.IntlConverterUtils.dateToLocalIso(new Date(self.currentDate.getFullYear() - 2, "03", "01")));

        for (let i = self.noYears; i > 0; i--) {
          self.financialYears.push({
            value: (self.currentDate.getFullYear() - i + 1) + "",
            fromYear: self.currentDate.getFullYear() - i + 1,
            toYear: self.currentDate.getFullYear() - i + 2
          });
        }
      }

      self.maxFromDate(oj.IntlConverterUtils.dateToLocalIso(self.currentDate));
      self.maxToDate(oj.IntlConverterUtils.dateToLocalIso(self.currentDate));
      self.minToDate(self.fromDate());
      self.yearsLoaded(true);
    });

    /**
     * Option change handler for Financial Year/ Duration.
     *
     * @return {type} Description.
     */
    self.optionChanged = function() {
      self.fromDate("");
      self.toDate("");
      self.years("");

      if (self.duration() === "duration") {
        self.year(true);
      } else {
        self.year(false);
      }
    };

    /**
     * Option change handler for number of Accounts.
     *
     * @return {type}  Description.
     */
    self.numberOfAccountsHandler = function() {
      self.fromDate("");
      self.toDate("");
      self.years("");
      self.duration("financialYear");

      self.dataprovider = new oj.ArrayTableDataSource([], {
        idAttribute: ["id"]
      });

      self.interestsLoaded(false);
      self.year(false);
    };

    /**
     * Option change handler for account type- TD/RD.
     *
     * @return {type}  Description.
     */
    self.depositTypeChanged = function() {
      self.customPayeeId("");
      self.fromDate("");
      self.toDate("");
      self.years("");
      self.duration("financialYear");
      self.interestsLoaded(false);

      if (self.deposit() === "TD") {
        self.type("deposit?module=CON&module=ISL");
      } else {
        self.type("deposit?module=RD");
      }

      self.year(false);
      self.numberOfAccounts("single");
    };

    /**
     * InterestLoaded - description.
     *
     * @param  {type} data - Description.
     * @return {type}      Description.
     */
    function interestLoaded(data) {
      self.interests.removeAll();

      if (data.termDepositInterestResponseDTOs && data.termDepositInterestResponseDTOs.length > 0) {
        let k = 0;

        for (let i = 0; i < data.termDepositInterestResponseDTOs.length; i++) {
          if (data.termDepositInterestResponseDTOs[i].termDepositInterestListResponseDTO) {
            for (let j = 0; j < data.termDepositInterestResponseDTOs[i].termDepositInterestListResponseDTO.accountInterests.length; j++) {
              const interest = data.termDepositInterestResponseDTOs[i].termDepositInterestListResponseDTO;

              self.interests.push({
                accountId: interest.accountInterests[j].accountId.displayValue,
                interestAmount: interest.accountInterests[j].interestAmount.amount,
                interestCurrency: interest.accountInterests[j].interestAmount.currency,
                productName: interest.accountInterests[j].productName,
                date:interest.accountInterests[j].date,
                id: ++k
              });
            }
          }
        }
      }

      if (self.interests().length > 0) {
        self.showDownload(true);
      }

      self.dataprovider = new oj.ArrayTableDataSource(self.interests, {
        idAttribute: ["id"]
      });

      self.pagingTableDataSource(new oj.PagingTableDataSource(self.dataprovider));
      self.interestsLoaded(true);
    }

    /**
     * Self - description.
     *
     * @return {type}  Description.
     */
    self.view = function() {
      const tracker = document.getElementById("tracker");

      if (tracker.valid === "valid") {
        self.interestsLoaded(false);
        self.showDownload(false);

        if (self.duration() === "financialYear") {
          self.fromDate(self.years() + "-04-01");

          if ((+self.years() + 1) === self.financialYear()) {
            self.toDate(+self.currentDate.getFullYear() + "-" + (+self.currentDate.getMonth() + 1) + "-" + self.currentDate.getDate());
          } else {
            self.toDate((+self.years() + 1) + "-03-31");
          }
        }

        if (self.numberOfAccounts() === "single") {
          depositModel.fetchDepositInterests(ko.utils.unwrapObservable(self.customPayeeId()), self.fromDate(), self.toDate(), self.additionalDetails().account.module).done(function(data) {
            self.interests.removeAll();

            if (data.termDepositInterestListResponseDTO && data.termDepositInterestListResponseDTO.accountInterests && data.termDepositInterestListResponseDTO.accountInterests.length > 0) {
              for (let i = 0; i < data.termDepositInterestListResponseDTO.accountInterests.length; i++) {
                self.interests.push({
                  accountId: data.termDepositInterestListResponseDTO.accountInterests[i].accountId.displayValue,
                  interestAmount: data.termDepositInterestListResponseDTO.accountInterests[i].interestAmount.amount,
                  interestCurrency: data.termDepositInterestListResponseDTO.accountInterests[i].interestAmount.currency,
                  productName: data.termDepositInterestListResponseDTO.accountInterests[i].productName,
                  date: data.termDepositInterestListResponseDTO.accountInterests[i].date,
                  id: i
                });
              }
            }

            if (self.interests().length > 0) {
              self.showDownload(true);
            }

            self.dataprovider = new oj.ArrayTableDataSource(self.interests, {
              idAttribute: ["id"]
            });

            self.pagingTableDataSource(new oj.PagingTableDataSource(self.dataprovider));
            self.interestsLoaded(true);
          });
        } else if (self.numberOfAccounts() === "all") {
          if (self.deposit() === "RD") {
            depositModel.fetchRDInterestsForAll(self.fromDate(), self.toDate()).done(function(data) {
              interestLoaded(data);
            });
          } else {
            depositModel.fetchDepositInterestsForAll(self.fromDate(), self.toDate()).done(function(data) {
              interestLoaded(data);
            });
          }
        }
      } else {
        tracker.showMessages();
        tracker.focusOn("@firstInvalidShown");
      }
    };

    /**
     * Anonymous function - description.
     *
     * @return {type}  Description.
     */
    self.download = function() {

      if (self.numberOfAccounts() === "single") {
        depositModel.fetchPDF(ko.utils.unwrapObservable(self.customPayeeId()), self.fromDate(), self.toDate(), self.additionalDetails().account.module);
      } else if (self.numberOfAccounts() === "all") {
        if (self.deposit() === "RD") {
          depositModel.fetchRDPDFForAll(self.fromDate(), self.toDate());
        } else {
          depositModel.fetchPDFForAll(self.fromDate(), self.toDate());
        }
      }
    };
  };
});
