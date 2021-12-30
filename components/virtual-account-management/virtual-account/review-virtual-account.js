define([

  "knockout",
  "./model",
  "ojL10n!resources/nls/virtual-account-create",
  "ojs/ojbutton"
], function (ko, VirtualAccountModel, resourceBundle) {
  "use strict";

  return function (params) {
    const self = this;

    ko.utils.extend(self, params.rootModel || params.rootModel.previousState);
    self.resource = resourceBundle;
    params.dashboard.headerName(self.resource.title);
    params.baseModel.registerElement("confirm-screen");
    params.baseModel.registerComponent("virtual-account-create", "virtual-account-management");
    params.baseModel.registerComponent("virtual-account-structure-create", "virtual-account-management");
    self.fromReview = ko.observable(false);
    self.reviewTemplate = ko.observable(true);
    self.transactionName = ko.observable();
    self.displayCountryName = ko.observable();
    self.displayProductName = ko.observable();
    self.countryOptions = ko.observable([]);
    self.currencyListData = ko.observable([]);
    self.VirtualAccountproducts = ko.observable([]);
    self.displayCurrencyName = ko.observable();
    self.updateMessage = ko.observable(self.resource.title);
    self.realCustomerNo = params.dashboard.userData.userProfile.partyId.value;
    self.realCustomerName = params.dashboard.userData.userProfile.accessibleEntityDTOs[0].partyName;
    self.virtualAccountReviewDto = params.rootModel.params.virtualAccountCreateDTO;
    self.flowCheck = ko.observable();
    self.limit = "0";
    self.offset = "0";
    self.fromApproval = ko.observable(false);
    self.dtoLoaded = ko.observable(false);

    if (params.rootModel.params.data && params.rootModel.params.taskCode !== "VAMA_M_CVA") {
      self.virtualAccountNo = ko.mapping.fromJS(params.rootModel.params.data.virtualAccountDTO.id.value);

    }
    else if (params.rootModel.params.virtualAccountCreateDTO !== undefined) {
      self.virtualAccountNo = ko.mapping.fromJS(params.rootModel.params.virtualAccountCreateDTO.id.value);

    }

    if (params.rootModel.params.flowCheck) {
      self.flowCheck = ko.observable(true);
    } else {
      self.flowCheck = ko.observable(false);
    }

    if (!params.rootModel.params.data && params.rootModel.params.virtualAccountCreateDTO.realAccountNo()) {
      self.displayAccountNumber = params.rootModel.params.virtualAccountCreateDTO.realAccountNo().displayValue;
    }

    self.realLinkFromApproval = function () {
      if (self.virtualAccountReviewDto.realAccLinkage() === "A") {
        self.displayAccountNumber = self.virtualAccountReviewDto.realAccountNo.displayValue();
      }
    };

    const helperFunction = function () {
      VirtualAccountModel.fetchCountryList(self.limit, self.offset).then(function (data) {
        if (data.jsonNode && data.jsonNode.data.length > 0 && data.jsonNode.data) {
          self.countryOptions(data.jsonNode.data);
        }

        for (let i = 0; i < self.countryOptions().length; i++) {
          if (self.countryOptions()[i].countryCode === self.virtualAccountReviewDto.address.country()) {
            self.displayCountryName(self.countryOptions()[i].description);
            break;
          }
        }
      });

      VirtualAccountModel.fetchCurrencyList(self.limit, self.offset).then(function (data) {
        if (data.jsonNode && data.jsonNode.data && data.jsonNode.data.length > 0) {
          self.currencyListData(data.jsonNode.data);
        }

        for (let i = 0; i < self.currencyListData().length; i++) {
          if (self.currencyListData()[i].currencyCode === self.virtualAccountReviewDto.currencyCode()) {
            self.displayCurrencyName(self.currencyListData()[i].currencyName);
            break;
          }
        }
      });

      VirtualAccountModel.fetchProductList(self.realCustomerNo, self.limit, self.offset).then(function (data) {
        if (data.jsonNode.data) {
          self.VirtualAccountproducts(data.jsonNode.data);
        }

        for (let i = 0; i < self.VirtualAccountproducts().length; i++) {
          if (self.VirtualAccountproducts()[i].accCode === self.virtualAccountReviewDto.virtualAccProduct()) {
            self.displayProductName(self.VirtualAccountproducts()[i].codeDesc);
            break;
          }
        }
      });

      if (self.virtualAccountReviewDto.ibanRequired() === true) {
        self.ibanRequired = self.resource.yes;
      } else if (self.virtualAccountReviewDto.ibanRequired() === false) {
        self.ibanRequired = self.resource.no;
      }

      if (self.virtualAccountReviewDto.balChkForDebits() === true) {
        self.balChkForDebits = self.resource.yes;
      } else if (self.virtualAccountReviewDto.balChkForDebits() === false) {
        self.balChkForDebits = self.resource.no;
      }

      if (self.virtualAccountReviewDto.overdraftAllowed() === true) {
        self.overdraftValue = self.resource.yes;
      } else if (self.virtualAccountReviewDto.overdraftAllowed() === false) {
        self.overdraftValue = self.resource.no;
      }

      if (self.virtualAccountReviewDto.realAccLinkage() === "A") {
        self.realAccLinkageValue = self.resource.yes;

      } else if (self.virtualAccountReviewDto.realAccLinkage() === "S") {
        self.realAccLinkageValue = self.resource.no;
      }

      if (self.virtualAccountReviewDto.interestCalcReq() === true) {
        self.interestCalcReq = self.resource.yes;
      } else if (self.virtualAccountReviewDto.interestCalcReq() === false) {
        self.interestCalcReq = self.resource.no;
      }

      if (self.virtualAccountReviewDto.debitTxnsAllowed() === true) {
        self.debitTxnsAllowed = self.resource.yes;
      } else if (self.virtualAccountReviewDto.debitTxnsAllowed() === false) {
        self.debitTxnsAllowed = self.resource.no;
      }

      if (self.virtualAccountReviewDto.creditTxnsAllowed() === true) {
        self.creditTxnsAllowed = self.resource.yes;
      } else if (self.virtualAccountReviewDto.creditTxnsAllowed() === false) {
        self.creditTxnsAllowed = self.resource.no;
      }

      if (self.virtualAccountReviewDto.accountFrozen !== undefined) {
        if (self.virtualAccountReviewDto.accountFrozen() === true) {
          self.accountFrozen = self.resource.yes;
        } else if (self.virtualAccountReviewDto.accountFrozen() === false) {
          self.accountFrozen = self.resource.no;
        }
      }

      if (self.virtualAccountReviewDto.interestCalcReq() === true) {
        self.interestCalcReq = self.resource.yes;
      } else if (self.virtualAccountReviewDto.interestCalcReq() === false) {
        self.interestCalcReq = self.resource.no;
      }

      if (self.virtualAccountReviewDto.balAvailabilityOptions() === "O") {
        self.displayBalAvlValue = self.resource.ownBal;
      } else if (self.virtualAccountReviewDto.balAvailabilityOptions() === "P") {
        self.displayBalAvlValue = self.resource.poolBal;
      } else if (self.virtualAccountReviewDto.balAvailabilityOptions() === "B") {
        self.displayBalAvlValue = self.resource.fixedBalAvl;
      }
    },
      readVirtualAccount = function () {
        VirtualAccountModel.fetchVirtualAccount(self.virtualAccountReviewDto.id.value()).then(function (data) {
          if (data && data.virtualAccountDTO) {
            self.virtualAccountReviewDto = ko.mapping.fromJS(data.virtualAccountDTO);
            self.realLinkFromApproval();
            helperFunction();
            self.dtoLoaded(true);
          }
        });
      },
      helperFunction2 = function () {
        if (params.rootModel.params.taskCode === "VAMA_M_DVA") {
          readVirtualAccount();
        } else {
          self.realLinkFromApproval();
          helperFunction();
          self.dtoLoaded(true);
        }
      };

    if (self.virtualAccountReviewDto) {
      helperFunction();
      self.dtoLoaded(true);
    } else if (params.rootModel.params.data) {
      self.fromApproval(true);
      self.virtualAccountReviewDto = ko.mapping.fromJS(params.rootModel.params.data.virtualAccountDTO);
      helperFunction2();
    }

    self.confirm = function () {
      const vAccCreateDto = ko.toJSON(ko.mapping.toJS(self.virtualAccountReviewDto)),
        confirmScreenCreateMessage = function () {
          return resourceBundle.successCreateMessage;
        },
        confirmScreenUpdateMessage = function () {
          return resourceBundle.successUpdateMessage;
        },
        isApproval = function (params) {
          if (params.status && params.status.message.code === "DIGX_APPROVAL_REQUIRED") {
            return;
          }

          return !self.virtualAccountNo() ? confirmScreenCreateMessage : confirmScreenUpdateMessage;
        },
        sendVirtualAccount = function (data) {
          if (data.status && data.status.message.code === "DIGX_APPROVAL_REQUIRED") {
            return;
          }

          return data.virtualAccountDTO.id.displayValue;
        };

      if (!self.virtualAccountNo()) {

        const VaccCreateTempDto = JSON.parse(vAccCreateDto);

        delete VaccCreateTempDto.id;
        delete VaccCreateTempDto.ibanAccNo;

        if (VaccCreateTempDto.balAvailabilityOptions === "O" || VaccCreateTempDto.balAvailabilityOptions === "P") {
          VaccCreateTempDto.fixedAmtFromPool = null;
        }

        const vAccCreateDtoFinal = JSON.stringify(VaccCreateTempDto);

        VirtualAccountModel.createVirtualAccount(vAccCreateDtoFinal).then(function (data) {
          if ((data && data.status === "FAILURE") || (data.status && data.status.result === "FAILURE")) {
            params.baseModel.showMessages(null, [data.messages.codes[0].desc], "error");
          } else {
            params.dashboard.loadComponent("confirm-screen", {
              transactionResponse: data,
              transactionName: self.resource.title,
              eReceiptRequired: true,
              confirmScreenExtensions: {
                resource: resourceBundle,
                confirmScreenMsgEval: isApproval(data),
                confirmScreenDetails: [{
                  virtualAccountNo: sendVirtualAccount(data),
                  virtualAccountName: self.virtualAccountReviewDto.virtualAccountName(),
                  realAccLinkage: self.virtualAccountReviewDto.realAccLinkage(),
                  realAccountNo: self.displayAccountNumber,
                  iBan: self.ibanRequired
                }],
                isSet: true,
                template: "confirm-screen/virtual-account-create-confirmation"

              }
            });

          }
        });
      } else {

        const VaccCreateTempDto = JSON.parse(vAccCreateDto);

        if (VaccCreateTempDto.overdraftAllowed === false) {
          VaccCreateTempDto.odFixedAmount = {
            currency: VaccCreateTempDto.currencyCode,
            amount: 0

          };
        }

        if (VaccCreateTempDto.balAvailabilityOptions === "O" || VaccCreateTempDto.balAvailabilityOptions === "P") {
          VaccCreateTempDto.fixedAmtFromPool = null;
        }

        const vAccUpdateDtoFinal = JSON.stringify(VaccCreateTempDto);

        VirtualAccountModel.updateVirtualAccount(vAccUpdateDtoFinal, self.virtualAccountNo()).then(function (data) {
          if ((data && data.status === "FAILURE") || (data.status && data.status.result === "FAILURE")) {
            params.baseModel.showMessages(null, [data.messages.codes[0].desc], "error");
          } else {
            params.dashboard.loadComponent("confirm-screen", {
              transactionResponse: data,
              transactionName: self.resource.title,
              eReceiptRequired: true,
              confirmScreenExtensions: {
                resource: resourceBundle,
                confirmScreenMsgEval: isApproval(data),
                isSet: true,
                confirmScreenDetails: [{
                  virtualAccountNo: self.virtualAccountReviewDto.id,
                  virtualAccountName: self.virtualAccountReviewDto.virtualAccountName,
                  realAccLinkage: self.virtualAccountReviewDto.realAccLinkage,
                  realAccountNo: self.displayAccountNumber,
                  iBan: self.ibanRequired
                }],
                template: "confirm-screen/virtual-account-update-confirmation"

              }
            });
          }
        });
      }
    };

  };
});