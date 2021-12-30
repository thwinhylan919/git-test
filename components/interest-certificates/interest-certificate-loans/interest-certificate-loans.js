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
  "ojs/ojvalidationgroup",
  "ojs/ojpagingcontrol",
  "ojs/ojpagingtabledatasource"
], function(oj, ko, loansModel, resourceBundle) {
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
    self.deposit = ko.observable();
    self.additionalDetails = ko.observable();
    self.validationTracker = ko.observable();
    self.customPayeeId = ko.observable();
    self.fromFavourites = ko.observable(false);
    self.year = ko.observable(false);
    self.years = ko.observable("");
    rootParams.dashboard.headerName(resourceBundle.title);
    self.type = ko.observable("loan");
    self.fromDate = ko.observable("");
    self.toDate = ko.observable("");
    self.interestsLoaded = ko.observable(false);
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
    self.pagingTableDataSource = ko.observable();
    self.taskCode="LN_I_IC";

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
      headerText: self.resource.tableHeading.interestPaid,
      field: "interestAmount"
    }]);

    if (self.rootParams.rootModel.params.id && self.rootParams.rootModel.params.type === "LON") {
      self.customPayeeId(self.rootParams.rootModel.params.id.value);
    } else {
      self.customPayeeId("");
    }

    loansModel.fetchCurrentDate().done(function(data) {
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
      self.year(false);
      self.duration("financialYear");

      self.dataprovider = new oj.ArrayTableDataSource([], {
        idAttribute: ["id"]
      });

      self.interestsLoaded(false);
    };

    /**
     * Self - description.
     *
     * @return {type} Description.
     */
    self.view = function() {
      const tracker = document.getElementById("tracker");

      if (tracker.valid === "valid") {
        self.showDownload(false);
        self.interestsLoaded(false);

        if (self.duration() === "financialYear") {
          self.fromDate(self.years() + "-04-01");

          if ((+self.years() + 1) === self.financialYear()) {
            self.toDate(+self.currentDate.getFullYear() + "-" + (+self.currentDate.getMonth() + 1) + "-" + self.currentDate.getDate());
          } else {
            self.toDate((+self.years() + 1) + "-03-31");
          }
        }

        if (self.numberOfAccounts() === "single") {
          loansModel.fetchLoanInterests(ko.utils.unwrapObservable(self.customPayeeId()), self.fromDate(), self.toDate()).done(function(data) {
            self.interests.removeAll();

            if (data.loanAccountInterestListResponseDTO && data.loanAccountInterestListResponseDTO.accountInterestDTO && data.loanAccountInterestListResponseDTO.accountInterestDTO.length > 0) {
              for (let i = 0; i < data.loanAccountInterestListResponseDTO.accountInterestDTO.length; i++) {
                self.interests.push({
                  accountId: data.loanAccountInterestListResponseDTO.accountInterestDTO[i].accountId.displayValue,
                  interestAmount: data.loanAccountInterestListResponseDTO.accountInterestDTO[i].interestAmount.amount,
                  interestCurrency: data.loanAccountInterestListResponseDTO.accountInterestDTO[i].interestAmount.currency,
                  productName: data.loanAccountInterestListResponseDTO.accountInterestDTO[i].productName,
                  date: data.loanAccountInterestListResponseDTO.accountInterestDTO[i].date,
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
          loansModel.fetchLoanInterestsForAll(self.fromDate(), self.toDate()).done(function(data) {
            self.interests.removeAll();

            if (data.loanAccountInterestResponseDTOs && data.loanAccountInterestResponseDTOs.length > 0) {
              let k = 0;

              for (let i = 0; i < data.loanAccountInterestResponseDTOs.length; i++) {
                if (data.loanAccountInterestResponseDTOs[i].loanAccountInterestListResponseDTO) {
                  for (let j = 0; j < data.loanAccountInterestResponseDTOs[i].loanAccountInterestListResponseDTO.accountInterestDTO.length; j++) {
                    const interests = data.loanAccountInterestResponseDTOs[i].loanAccountInterestListResponseDTO;

                    self.interests.push({
                      accountId: interests.accountInterestDTO[j].accountId.displayValue,
                      interestAmount: interests.accountInterestDTO[j].interestAmount.amount,
                      interestCurrency: interests.accountInterestDTO[j].interestAmount.currency,
                      productName: interests.accountInterestDTO[j].productName,
                      date: interests.accountInterestDTO[j].date,
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
          });
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
        loansModel.fetchPDF(ko.utils.unwrapObservable(self.customPayeeId()), self.fromDate(), self.toDate());
      } else if (self.numberOfAccounts() === "all") {
        loansModel.fetchPDFForAll(self.fromDate(), self.toDate());
      }
    };
  };
});
