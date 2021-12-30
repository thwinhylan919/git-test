define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",

  "ojL10n!resources/nls/debit-card-details",
  "ojs/ojknockout",
  "ojs/ojinputnumber",
  "ojs/ojtable",
  "ojs/ojdatacollection-utils",
  "ojs/ojarraytabledatasource",
  "ojs/ojinputtext",
  "ojs/ojbutton",
  "ojs/ojknockout-validation",
  "ojs/ojvalidation"
], function(oj, ko, $, ManageCardLimitModel, locale) {
  "use strict";

  return function(Params) {
    const self = this;

    ko.utils.extend(self, Params.rootModel);
    self.locale = locale;
    Params.dashboard.headerName(self.locale.header.debitCardDetails);
    self.mobileView = ko.observable(false);
    self.mobileViewIntl = ko.observable(false);
    self.fetchlimitdata = ko.observableArray();
    self.isDataLoaded = ko.observable(false);
    self.limitTypeLocal = ko.observable();
    self.mode = ko.observable("VIEW");
    self.internationalMode = ko.observable("InternationalVIEW");
    self.isInternationalTxn = ko.observable(true);

    if (self.params.isInternationalTxn) {
      self.isInternationalTxn(self.params.isInternationalTxn === "true");
    }

    self.datasource = ko.observableArray();
    self.internationLimitDataSource = ko.observableArray();
    self.dailyLimitsData = ko.observableArray();
    self.internationLimitData = ko.observableArray();
    self.dataLoaded = ko.observable(false);
    self.mode = ko.observable();
    self.editFlag = ko.observable(true);
    self.editIntnlLimitFlag = ko.observable(true);
    self.editcombinedLimitFlag = ko.observable(true);
    self.rowTemplateValue = ko.observable("rowTemplate");
    self.internationalLimitTemplateValue = ko.observable("internationalLimitRowTemplate");
    self.validationTracker = ko.observable();
    self.payload = ManageCardLimitModel.getNewDebitCardDetailsModel();
    Params.baseModel.registerElement("confirm-screen");
    Params.baseModel.registerElement("amount-input");
    self.srNo = ko.observable();
    self.combinedLimit = ko.observable();
    self.combinedMaxLimit = ko.observable();
    self.domesticMaxlimitPresent = ko.observable(false);
    self.intMaxlimitPresent = ko.observable(false);
    self.combinedMaxlimitPresent = ko.observable(false);

    self.columns = [{
      headerText: self.locale.debitCards.limits.facility,
      sortable: "disabled"
    }, {
      headerText: self.locale.debitCards.limits.NoOfTran,
      sortable: "disabled"
    }, {
      headerText: self.locale.debitCards.limits.Amount,
      sortable: "disabled"
    }];

    self.reviewTransactionName = {
      header: self.locale.debitCards.reviewHead1,
      reviewHeader: self.locale.debitCards.reviewHead
    };

    if (self.params.mode) {
      self.mode(self.params.mode);
      self.rowTemplateValue(self.params.rowTemplateValue);

      if (self.internationalTransactionsValue()) {
        if (self.params.internationalMode) {
          self.internationalMode(self.params.internationalMode);
          self.internationalLimitTemplateValue(self.params.internationalLimitTemplateValue);
        }

        self.internationLimitDataSource = new oj.ArrayTableDataSource(self.params.intlData, {
          idAttribute: "limitType"
        });
      }

      self.datasource = new oj.ArrayTableDataSource(self.params.data, {
        idAttribute: "limitType"
      });

      self.isDataLoaded(true);
    } else {
      self.mode("VIEW");
    }

    self.back = function() {
      history.back();
    };

    self.openModal = function(id) {
      $("#" + id).trigger("openModal");
    };

    self.cancel = function(id) {
      $("#" + id).trigger("closeModal");
    };

    self.editLimit = function() {
      self.editFlag(false);

      if (Params.baseModel.small()) {
        self.mobileView(true);
      } else {
        self.rowTemplateValue("editRowTemplate");
      }

      self.mode("EDIT");
    };

    self.editIntnlLimit = function() {
      self.editIntnlLimitFlag(false);
      self.internationalLimitTemplateValue("editInternationalLimit");

      if (Params.baseModel.small()) {
        self.mobileViewIntl(true);
      } else {
        self.internationalMode("InternationalEDIT");
      }
    };

    self.editCombinedLimit = function() {
      self.editcombinedLimitFlag(false);
    };

    self.editLimitConfirm = function() {
      self.editFlag(true);
      self.editIntnlLimitFlag(true);
      self.editcombinedLimitFlag(true);
      self.payload.accountId = self.accountId;

      let debitCardLimitArray = [];

      for (let i = 0; i < self.dailyLimitsData.length; i++) {
        const debitCardLimit = ManageCardLimitModel.getNewDebitCardLimitsModel();

        if (self.dailyLimitsData[i].unit) {
          debitCardLimit.unit = self.datasource.data[i].unit;
        }

        debitCardLimit.amount = ko.mapping.toJS(self.dailyLimitsData[i].amountType());
        debitCardLimit.count = self.dailyLimitsData[i].count();
        debitCardLimit.limitType = self.dailyLimitsData[i].limitType;

        if (self.dailyLimitsData[i].maxLimitAmount) {
          debitCardLimit.maxLimitAmount = ko.mapping.toJS(self.dailyLimitsData[i].maxLimitAmount());
        }

        debitCardLimitArray[i] = debitCardLimit;
      }

      self.payload.debitCardLimit = debitCardLimitArray;
      debitCardLimitArray = [];

      for (let i = 0; i < self.internationLimitData.length; i++) {
        const debitCardLimit = ManageCardLimitModel.getNewDebitCardLimitsModel();

        if (self.internationLimitData[i].unit) {
          debitCardLimit.unit = self.datasource.data[i].unit;
        }

        debitCardLimit.amount = ko.mapping.toJS(self.internationLimitData[i].amountType());
        debitCardLimit.count = self.internationLimitData[i].count();
        debitCardLimit.limitType = self.internationLimitData[i].limitType;

        if (self.internationLimitData[i].maxLimitAmount) {
          debitCardLimit.maxLimitAmount = ko.mapping.toJS(self.internationLimitData[i].maxLimitAmount());
        }

        debitCardLimitArray[i] = debitCardLimit;
      }

      self.payload.debitCardInternationalLimit = debitCardLimitArray;

      if (self.combinedLimit()) {
        self.payload.totalAmountLimit = ko.mapping.toJS(self.combinedLimit());
      }

      if (self.combinedMaxLimit()) {
        self.payload.totalAmountMaxLimit = ko.mapping.toJS(self.combinedMaxLimit());
      }

      ManageCardLimitModel.updateLimits(self.accountId, self.cardNo, ko.toJSON(self.payload)).done(function(data) {
        self.srNo(data.serviceId);
        Params.baseModel.showMessages(null, [Params.baseModel.format(self.locale.debitCards.limits.requestSubmitted,{srNo : data.serviceId})], "CONFIRMATION");
      });
    };

    self.reviewLimit = function() {
      const context = {};

      context.mode = "REVIEW";
      context.internationalMode = "InternationalREVIEW";
      context.isInternationalTxn = "false";
      context.rowTemplateValue = "rowTemplate";
      context.internationalLimitTemplateValue = "internationalLimitRowTemplate";
      context.data = self.datasource.data;

      if (self.internationLimitDataSource && self.internationLimitDataSource.data) {
        context.intlData = self.internationLimitDataSource.data;
      }

      Params.dashboard.loadComponent("debit-card-limits", context);
    };

    self.reviewInternationalLimit = function() {
      const context = {};

      context.mode = "REVIEW";
      context.internationalMode = "InternationalREVIEW";
      context.isInternationalTxn = "true";
      context.rowTemplateValue = "rowTemplate";
      context.internationalLimitTemplateValue = "internationalLimitRowTemplate";
      context.data = self.datasource.data;
      context.intlData = self.internationLimitDataSource.data;
      Params.dashboard.loadComponent("debit-card-limits", context);
    };

    self.ok = function() {
      history.go(-2);
    };

    Params.baseModel.registerComponent("debit-card-pin-request", "demand-deposits");
    Params.baseModel.registerComponent("debit-card-hotlisting", "demand-deposits");

    if (self.mode() !== "REVIEW") {
      ManageCardLimitModel.fetchLimits(self.accountId, self.cardNo).done(function(data) {
        self.isDataLoaded(true);

        const limitsData = $.map(data.debitCardDetails[0].debitCardLimit, function(limitsDataLocal) {
            if (limitsDataLocal.limitType) {
              if (limitsDataLocal.limitType === "A") {
                self.limitTypeLocal(self.locale.debitCards.limits.ownAtmLimits);
              } else if (limitsDataLocal.limitType === "R") {
                self.limitTypeLocal(self.locale.debitCards.limits.remoteAtmLimits);
              } else if (limitsDataLocal.limitType === "P") {
                self.limitTypeLocal(self.locale.debitCards.limits.ownPointSaleLimits);
              } else if (limitsDataLocal.limitType === "RP") {
                self.limitTypeLocal(self.locale.debitCards.limits.RemotePointSaleLimits);
              } else if (limitsDataLocal.limitType === "EC") {
                self.limitTypeLocal(self.locale.debitCards.limits.eCommerce);
              }

              limitsDataLocal.limitTypeLocal = self.limitTypeLocal();
              limitsDataLocal.count = ko.observable(ko.utils.unwrapObservable(limitsDataLocal.count));

              if (limitsDataLocal.maxLimitAmount) {
                if (limitsDataLocal.maxLimitAmount.amount && limitsDataLocal.maxLimitAmount.currency) {
                  self.domesticMaxlimitPresent(true);
                }

                limitsDataLocal.maxLimitAmount = ko.observable(ko.mapping.fromJS({
                  amount: ko.observable(ko.utils.unwrapObservable(limitsDataLocal.maxLimitAmount.amount)),
                  currency: ko.observable(ko.utils.unwrapObservable(limitsDataLocal.maxLimitAmount.currency))
                }));
              }

              if (limitsDataLocal.amountType) {
                limitsDataLocal.amountType = ko.observable(ko.mapping.fromJS({
                  amount: ko.observable(ko.utils.unwrapObservable(limitsDataLocal.amountType.amount)),
                  currency: ko.observable(ko.utils.unwrapObservable(limitsDataLocal.amountType.currency))
                }));
              } else {
                limitsDataLocal.amountType = ko.observable(ko.mapping.fromJS({
                  amount: ko.observable(ko.utils.unwrapObservable(limitsDataLocal.amount.amount)),
                  currency: ko.observable(ko.utils.unwrapObservable(limitsDataLocal.amount.currency))
                }));
              }

              return limitsDataLocal;
            }
          }),
          internationalLimitsData = $.map(data.debitCardDetails[0].debitCardInternationalLimit, function(limitsDataLocal) {
            if (limitsDataLocal.limitType) {
              if (limitsDataLocal.limitType === "A") {
                self.limitTypeLocal(self.locale.debitCards.limits.ownAtmLimits);
              } else if (limitsDataLocal.limitType === "R") {
                self.limitTypeLocal(self.locale.debitCards.limits.remoteAtmLimits);
              } else if (limitsDataLocal.limitType === "P") {
                self.limitTypeLocal(self.locale.debitCards.limits.ownPointSaleLimits);
              } else if (limitsDataLocal.limitType === "RP") {
                self.limitTypeLocal(self.locale.debitCards.limits.RemotePointSaleLimits);
              } else if (limitsDataLocal.limitType === "EC") {
                self.limitTypeLocal(self.locale.debitCards.limits.eCommerce);
              }

              limitsDataLocal.limitTypeLocal = self.limitTypeLocal();
              limitsDataLocal.count = ko.observable(ko.utils.unwrapObservable(limitsDataLocal.count));

              if (limitsDataLocal.maxLimitAmount) {
                if (limitsDataLocal.maxLimitAmount.amount && limitsDataLocal.maxLimitAmount.currency) {
                  self.intMaxlimitPresent(true);
                }

                limitsDataLocal.maxLimitAmount = ko.observable(ko.mapping.fromJS({
                  amount: ko.observable(ko.utils.unwrapObservable(limitsDataLocal.maxLimitAmount.amount)),
                  currency: ko.observable(ko.utils.unwrapObservable(limitsDataLocal.maxLimitAmount.currency))
                }));
              }

              if (limitsDataLocal.amountType) {
                limitsDataLocal.amountType = ko.mapping.fromJS({
                  amount: limitsDataLocal.amountType.amount,
                  currency: limitsDataLocal.amountType.currency
                });
              } else {
                limitsDataLocal.amountType = ko.observable(ko.mapping.fromJS({
                  amount: ko.observable(ko.utils.unwrapObservable(limitsDataLocal.amount.amount)),
                  currency: ko.observable(ko.utils.unwrapObservable(limitsDataLocal.amount.currency))
                }));
              }

              return limitsDataLocal;
            }
          });
        let i,
          j;

        self.sortedIternationalData = [];

        let sortedCount = 0;

        for (i = 0; i < limitsData.length; i++) {
          for (j = 0; j < internationalLimitsData.length; j++) {
            if (limitsData[i].limitType === internationalLimitsData[j].limitType) {
              self.sortedIternationalData[sortedCount++] = internationalLimitsData[j];
              break;
            }
          }
        }

        if (limitsData.length > 0) {
          self.dailyLimitsData = limitsData;

          self.datasource = new oj.ArrayTableDataSource(limitsData, {
            idAttribute: "limitType"
          });

          self.dataLoaded(true);
        }

        if (internationalLimitsData.length > 0) {
          self.internationLimitData = internationalLimitsData;

          self.internationLimitDataSource = new oj.ArrayTableDataSource(self.sortedIternationalData, {
            idAttribute: "limitType"
          });
        }

        if (data.debitCardDetails[0].totalAmountLimit) {
          self.combinedLimit(ko.mapping.fromJS({
            amount: ko.observable(ko.utils.unwrapObservable(data.debitCardDetails[0].totalAmountLimit.amount)),
            currency: ko.observable(ko.utils.unwrapObservable(data.debitCardDetails[0].totalAmountLimit.currency))
          }));
        }

        if (data.debitCardDetails[0].totalAmountLimit) {
          if (data.debitCardDetails[0].totalAmountMaxLimit.amount && data.debitCardDetails[0].totalAmountMaxLimit.currency) {
            self.combinedMaxlimitPresent(true);
          }

          self.combinedMaxLimit(ko.mapping.fromJS({
            amount: ko.observable(ko.utils.unwrapObservable(data.debitCardDetails[0].totalAmountMaxLimit.amount)),
            currency: ko.observable(ko.utils.unwrapObservable(data.debitCardDetails[0].totalAmountMaxLimit.currency))
          }));
        }
      });
    }

    self.cancelIntlEdit = function() {
      if (Params.baseModel.small()) {
        self.mobileViewIntl(false);
      } else {
        self.internationalMode("InternationalVIEW");
        self.internationalLimitTemplateValue("internationalLimitRowTemplate");
      }
    };

    self.cancelEdit = function() {
      if (Params.baseModel.small()) {
        self.mobileView(false);
      } else {
        self.mode("VIEW");
        self.rowTemplateValue("rowTemplate");
      }
    };
  };
});
