define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/virtual-account-view",
  "ojs/ojbutton",
  "ojs/ojinputtext",
  "ojs/ojswitch",
  "ojs/ojcheckboxset"
], function (oj, ko, $, VirtualAccountModel, resourceBundle) {
  "use strict";

  return function (params) {
    const self = this;

    self.resource = resourceBundle;
    self.fromReview = ko.observable(false);
    self.templateLoaded = ko.observableArray(false);
    params.baseModel.registerElement("confirm-screen");
    params.baseModel.registerComponent("virtual-account-search", "virtual-account-management");
    params.baseModel.registerTransaction("virtual-account", "virtual-account-management");
    params.baseModel.registerComponent("view-balance-details", "virtual-account-management");
    params.baseModel.registerComponent("virtual-account-statement", "virtual-account-management");
    params.baseModel.registerElement("modal-window");
    params.dashboard.headerName(self.resource.title);
    self.feedbackReviewHeader = ko.observable(true);
    self.reviewTemplate = ko.observable(true);
    self.viewBalanceLoaded = ko.observable(false);
    self.ibanRequired = ko.observable();
    self.ibanAccNo = ko.observable();
    self.countryOptions = ko.observable([]);
    self.VirtualAccountproducts = ko.observable([]);
    self.viewBalanceDetails = ko.observable();
    self.currencyListData = ko.observable([]);
    self.fromFileUploadData = ko.observable();
    self.displayProductName = ko.observable();
    self.displayCurrencyName = ko.observable();
    self.displayCountryName = ko.observable();
    self.hideAccountFrozen = ko.observable(false);
    self.fromApproval = ko.observable();
    self.fromFileUpload = ko.observable(false);
    self.updateMessage = ko.observable(self.resource.deleteConfirm);
    self.checkZeroBalance = ko.observable(params.rootModel.params.availableBalance !== undefined ? params.rootModel.params.availableBalance : "");
    self.fromFileUpload = ko.observable(false);
    self.recRefId = ko.observable();
    self.realCustomerNo = params.dashboard.userData.userProfile.partyId.value;
    self.realCustomerName = params.dashboard.userData.userProfile.accessibleEntityDTOs[0].partyName;
    self.showBalance = ko.observable();
    self.balanceCurrency = ko.observable();
    self.limit = "0";
    self.offset = "0";

    let VAM_STATEMENT_PERIOD = null;

    function translateBooleanToString(value) {

      if (value === true || value === "Y") {
        return self.resource.yes;
      } else if (value === false || value === "N") {
        return self.resource.no;
      }
    }

    function getQueryAsString() {
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
    }

    function translateAccountLinkageToString(value) {

      if (value === true || value === "A") {
        return self.resource.yes;
      } else if (value === false || value === "S") {
        return self.resource.no;
      }
    }

    function translateFrozenBooleanToString(value) {

      if (value === true || value === "Y") {
        return self.resource.yes;
      } else if (value === false || value === "N") {
        return self.resource.no;
      }

      self.hideAccountFrozen(true);

    }

    if (params.rootModel.params.data) {
      self.fromApproval(true);
      self.virtualAccountViewDTO = params.rootModel.transactionDetails().transactionSnapshot.requestPayload;
    } else if (params.rootModel.params.recRefId) {
      self.fromFileUpload(true);
      self.virtualAccountViewDTO = params.rootModel.params;
    } else {
      self.fromApproval(false);
      self.virtualAccountViewDTO = params.rootModel.params.virtualAccountViewDTO !== undefined ? JSON.parse(params.rootModel.params.virtualAccountViewDTO) : params.rootModel.params.virtualAccountListDTO;
      self.virtualAccountNo = self.virtualAccountViewDTO.id.value;
      self.virtualAccountCcy = self.virtualAccountViewDTO.currencyCode;
    }

    if (!self.fromFileUpload) {
      self.remarks = ko.toJSON({
        remarks: "Delete"
      });
    }

    if (self.virtualAccountViewDTO.balAvailabilityOptions === "O") {
      self.balanceAvailabilityOptionValue = self.resource.ownBalance;
    } else if (self.virtualAccountViewDTO.balAvailabilityOptions === "P") {
      self.balanceAvailabilityOptionValue = self.resource.poorBalance;
    } else if (self.virtualAccountViewDTO.balAvailabilityOptions === "B") {
      self.balanceAvailabilityOptionValue = self.resource.fixedOwnBalance;
      self.fixedAmtFromPoolAmount = self.virtualAccountViewDTO.fixedAmtFromPool.amount;
    }

    if (self.virtualAccountViewDTO.accountStatus === "C") {
      self.status = self.resource.close;
    } else if (self.virtualAccountViewDTO.accountStatus === "A") {
      self.status = self.resource.active;
    } else {
      self.status = self.resource.open;
    }

    self.ibanRequired = translateBooleanToString(self.virtualAccountViewDTO.ibanRequired);
    self.balChkForDebits = translateBooleanToString(self.virtualAccountViewDTO.balChkForDebits);
    self.debitTxnsAllowed = translateBooleanToString(self.virtualAccountViewDTO.debitTxnsAllowed);
    self.creditTxnsAllowed = translateBooleanToString(self.virtualAccountViewDTO.creditTxnsAllowed);
    self.overdraftAllowed = translateBooleanToString(self.virtualAccountViewDTO.overdraftAllowed);
    self.interestCalcReq = translateBooleanToString(self.virtualAccountViewDTO.interestCalcReq);
    self.accountFrozen = translateFrozenBooleanToString(self.virtualAccountViewDTO.frozen);
    self.realAccLinkage = translateAccountLinkageToString(self.virtualAccountViewDTO.realAccLinkage);
    self.ibanAccNo = self.virtualAccountViewDTO.iban;

    self.displayBalanceDetails = function () {

      if (!self.fromFileUpload()) {
        VirtualAccountModel.fetchBalanceDetails(self.virtualAccountNo, self.virtualAccountCcy).then(function (data) {
          if (data && data.virtualAccountDTO && data.virtualAccountDTO.balance) {
            self.viewBalanceDetails(data.virtualAccountDTO);

            for (let i = 0; i < self.viewBalanceDetails().balance.length; i++) {
              if (self.viewBalanceDetails().balance[i].type === "availableBal") {
                self.checkZeroBalance(self.viewBalanceDetails().balance[i].amount[0].amount);
                self.showBalance(self.viewBalanceDetails().balance[i].amount[0].amount);
                self.balanceCurrency(self.viewBalanceDetails().balance[i].amount[0].currency);
                break;
              }
            }
          }

          self.viewBalanceLoaded(true);

        });
      }

    };

    self.displayBalancePanel = function (data) {
      params.dashboard.openRightPanel("view-balance-details", {
        balanceDetails: self.viewBalanceDetails(),
        fromVirtualAccountViewScreen: true
      }, self.resource.balanceDetails);
    };

    self.displayBalanceDetails();

    self.confirmZeroBalance = function () {
      $("#virtualAccountZeroBalance").trigger("openModal");
    };

    self.closeMessage = function () {
      $("#virtualAccountZeroBalance").trigger("closeModal");
    };

    self.doNotDelete = function () {
      $("#virtualAccountDelete").trigger("closeModal");
    };

    self.deleteConfirm = function () {
      if (self.checkZeroBalance() !== 0) {
        self.confirmZeroBalance();
      } else {
        $("#virtualAccountDelete").trigger("openModal");
      }
    };

    self.backToSearch = function () {
      params.dashboard.loadComponent("virtual-account-search", self);
    };

    self.backToRecordList = function () {
      history.go(-1);
    };

    self.edit = function () {
      params.dashboard.loadComponent("virtual-account", {
        virtualAccountViewDTO: JSON.stringify(self.virtualAccountViewDTO),
        fromViewScreen: true
      });
    };

    self.showStatement = function () {
      VirtualAccountModel.maintenances().then(function (data) {
        if (data && data.configurationDetails) {
          const tmp = data.configurationDetails.find(function (e) {
            return e.propertyId === "VAM_STATEMENT_PERIOD";
          });

          if (tmp && tmp.propertyValue) {
            VAM_STATEMENT_PERIOD = parseInt(tmp.propertyValue);
          }

        }
      }).finally(function () {
        VirtualAccountModel.fetchTransactionList(self.virtualAccountNo,getQueryAsString()).then(function (data) {
          params.dashboard.loadComponent("virtual-account-statement", {
            virtualAccountNo: self.virtualAccountNo,
            statementData: data,
            fromVirtualAccountView: true
          });
        });
      });
    };

    VirtualAccountModel.fetchCountryList(self.limit, self.offset).then(function (data) {
      if (data.jsonNode && data.jsonNode.data.length > 0 && data.jsonNode.data) {
        self.countryOptions(data.jsonNode.data);
      }

      for (let i = 0; i < self.countryOptions().length; i++) {
        let country;

        if (self.virtualAccountViewDTO) {
          if (self.virtualAccountViewDTO.address) {
            country = self.virtualAccountViewDTO.address.country;
          } else {
            country = self.virtualAccountViewDTO.countryCode;
          }
        }

        if (self.countryOptions()[i].countryCode === country) {
          self.displayCountryName(self.countryOptions()[i].description);
          break;
        }
      }
    });

    VirtualAccountModel.fetchProductList(self.realCustomerNo, self.limit, self.offset).then(function (data) {
      if (data && data.jsonNode && data.jsonNode.data) {
        self.VirtualAccountproducts(data.jsonNode.data);
      }

      for (let i = 0; i < self.VirtualAccountproducts().length; i++) {
        if (self.VirtualAccountproducts()[i].accCode === self.virtualAccountViewDTO.virtualAccProduct) {
          self.displayProductName(self.VirtualAccountproducts()[i].codeDesc);
          break;
        }
      }
    });

    VirtualAccountModel.fetchCurrencyList(self.limit, self.offset).then(function (data) {
      if (data.jsonNode && data.jsonNode.data && data.jsonNode.data.length > 0) {
        self.currencyListData(data.jsonNode.data);
      }

      for (let i = 0; i < self.currencyListData().length; i++) {
        let currency;

        if (self.virtualAccountViewDTO) {
          if (self.virtualAccountViewDTO.currencyCode) {
            currency = self.virtualAccountViewDTO.currencyCode;
          } else {
            currency = self.virtualAccountViewDTO.defaultAccCcy;
          }
        }

        if (self.currencyListData()[i].currencyCode === currency) {
          self.displayCurrencyName(self.currencyListData()[i].currencyName);
          break;
        }
      }
    });

    self.deleteVirtualAccount = function () {
      self.remark = ko.toJSON({
        remarks: "Delete"
      });

      const confirmScreenMessage = function () {
          return resourceBundle.successMessage;
        },
        isApproval = function (params) {
          if (params.status && params.status.message.code === "DIGX_APPROVAL_REQUIRED") {
            return;
          }

          return confirmScreenMessage;
        };

      VirtualAccountModel.deleteVirtualAccount(self.virtualAccountViewDTO.id.value, self.remark).then(function (data) {
        if ((data && data.status.message === "FAILURE") || (data.status && data.status.message.result === "FAILURE")) {
          params.baseModel.showMessages(null, [data.messages.codes[0].desc], "error");
          $("#virtualAccountDelete").trigger("closeModal");
        } else {
          if (self.virtualAccountViewDTO.realAccLinkage === "S") {
            self.virtualAccountViewDTO.realAccountNo = {
              displayValue: null
            };
          }

          params.dashboard.loadComponent("confirm-screen", {
            transactionResponse: data,
            transactionName: self.resource.title,
            eReceiptRequired: true,
            confirmScreenExtensions: {
              resource: resourceBundle,
              confirmScreenMsgEval: isApproval(data),
              isSet: true,
              confirmScreenDetails: [{
                virtualAccountNo: self.virtualAccountViewDTO.id.displayValue,
                virtualAccountName: self.virtualAccountViewDTO.virtualAccountName,
                realAccountNo: self.virtualAccountViewDTO.realAccountNo.displayValue,
                iBan: self.ibanRequired
              }],
              template: "confirm-screen/virtual-account-delete-confirmation"
            }
          });
        }
      });
    };
  };
});