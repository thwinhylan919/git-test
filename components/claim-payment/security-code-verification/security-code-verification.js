define([
  "jquery",
  "knockout",
  "./model",
  "ojL10n!resources/nls/security-code-verification",
  "ojs/ojinputnumber",
  "ojs/ojradioset",
  "ojs/ojvalidationgroup",
  "ojs/ojknockout-validation"
], function ($, ko, SecuritycodeModel, ResourceBundle) {
  "use strict";

  return function (rootParams) {
    const self = this,
      getNewKoModel = function () {
        const KoModel = ko.mapping.fromJS(SecuritycodeModel.getNewModel());

        return KoModel;
      };

    ko.utils.extend(self, rootParams.rootModel);
    self.verificationModel = getNewKoModel().securitycodeVerificationModel;
    self.stageOne = ko.observable(true);
    self.stageTwo = ko.observable(false);
    self.validationTracker = ko.observable();
    self.paymentChecker = self.paymentChecker || ko.observable(false);
    self.paymentMode = ko.observable();
    self.errorMessages = ko.observableArray();
    self.isError = ko.observable(false);
    self.showAliasValueAndAliasMode = ko.observable(false);
    self.isDisable = ko.observable(false);
    self.isDynamicUrl = ko.observable(false);
    self.socialHandle = ko.observable();

    let determinantValue;

    SecuritycodeModel.init();
    self.resource = ResourceBundle;
    rootParams.dashboard.headerName(self.resource.payments.peertopeer.claimPaymentHeader);
    rootParams.baseModel.registerComponent("social-media", "social-media");
    rootParams.baseModel.registerElement("modal-window");

    self.paymentFocusOut= function(event)
    {

      if(self.verificationModel.paymentId().length>0)
      {
      SecuritycodeModel.fetchPaymentDetails(self.verificationModel.paymentId(), determinantValue).then(function (data) {
        self.verificationModel.transferAmount.amount(data.transferDetails.amount.amount);
        self.verificationModel.transferAmount.currency(data.transferDetails.amount.currency);
        self.showAliasValueAndAliasMode(true);
      }).catch(function (data) {
            rootParams.baseModel.showMessages(null, [data.responseJSON.message.validationError[0].errorMessage], "ERROR");
            self.verificationModel.paymentId("");
        });

      }
    };

    self.fetchQueryParams = function (rootData) {
      if (rootData.queryMap && rootData.queryMap.id) {
        self.isDynamicUrl(true);
        self.showAliasValueAndAliasMode(false);
        determinantValue = rootData.queryMap.determinantValue;
        self.verificationModel.paymentId(rootData.queryMap.id);

        SecuritycodeModel.fetchPaymentDetails(rootData.queryMap.id, rootData.queryMap.determinantValue).then(function (data) {
          self.verificationModel.aliasType(data.transferMode);

          if (self.verificationModel.aliasType() === "TWITTER" || self.verificationModel.aliasType() === "FACEBOOK") {
            self.verificationModel.aliasValue(data.transferValue);

            if(data.transferValue){
              self.socialHandle(data.transferValue.split("#")[1]);
            }
          } else {
            self.verificationModel.aliasValue(data.transferValue);
          }

          self.verificationModel.transferAmount.amount(data.transferDetails.amount.amount);
          self.verificationModel.transferAmount.currency(data.transferDetails.amount.currency);
          self.showAliasValueAndAliasMode(true);
        }).catch(function (jqXHR) {
          let i = 0;

          if (jqXHR && jqXHR.responseJSON) {
            if (jqXHR.responseJSON.message) {
              if (jqXHR.responseJSON.message.validationError) {
                for (i = 0; i < jqXHR.responseJSON.message.validationError.length; i++) {
                  self.errorMessages.push(jqXHR.responseJSON.message.validationError[i].errorMessage);
                }
              } else {
                self.errorMessages.push(jqXHR.responseJSON.message.title);
              }

              self.isError(true);
              $("#errormessagewindow").trigger("openModal");
            }
          }
        });
      } else {
        self.verificationModel.aliasType("EMAIL");
        self.showAliasValueAndAliasMode(true);
      }
    };

    self.loadUserProfile = function (response) {
      self.verificationModel.aliasValue(response.id);
    };

    self.changeValue = function (event) {
      self.verificationModel.aliasValue(null);
    };

    self.verifySecurityCode = function (user) {
      if (!rootParams.baseModel.showComponentValidationErrors(document.getElementById("maturityTracker"))) {
        return;
      }

      self.aliasType(self.verificationModel.aliasType());
      self.aliasValue(self.verificationModel.aliasValue());
      self.paymentId(self.verificationModel.paymentId());
      self.amount(self.verificationModel.transferAmount.amount());
      self.currency(self.verificationModel.transferAmount.currency());

      SecuritycodeModel.verifySecurityCode(ko.mapping.toJSON(self.verificationModel, {
        ignore: ["transferAmount"]
      }), determinantValue, self.isDynamicUrl()).then(function (data) {
        self.verificationModel.aliasType(data.aliasType);

        if (self.verificationModel.aliasType() === "TWITTER" || self.verificationModel.aliasType() === "FACEBOOK") {
          self.verificationModel.aliasValue(data.aliasValue);

          if(data.transferValue){
            self.socialHandle(data.transferValue.split("#")[1]);
          }
        } else {
          self.verificationModel.aliasValue(data.aliasValue);
        }

        if (user === "existing") {
          rootParams.baseModel.switchPage({
            homeComponent: "claim-payment-existing-user-dashboard",
            homeModule: "claim-payment-existing-user",
            value: self.aliasValue(),
            type: self.aliasType(),
            id: self.paymentId(),
            amount: self.amount(),
            currency: self.currency(),
            determinantValue :determinantValue,
            menuNavigationAvailable: false,
            isCurrency: true,
            user: "existing"
          }, true);
        } else if (user === "new") {
          self.loadComp("user-onboarding");
        }
      }).catch(function (jqXHR) {
     let i=0;

        if (jqXHR && jqXHR.responseJSON) {
          if (jqXHR.responseJSON.message) {
            if (jqXHR.responseJSON.message.validationError) {
              for (i = 0; i < jqXHR.responseJSON.message.validationError.length; i++) {
                self.errorMessages.push(jqXHR.responseJSON.message.validationError[i].errorMessage);
              }
            } else {
              self.errorMessages.push(jqXHR.responseJSON.message.title);
            }

            self.isError(true);
            $("#errormessagewindow").trigger("openModal");
          }
        }

      }
      );};

    self.transferToArray = [{
        id: "email",
        value: "EMAIL",
        label: self.resource.payments.peertopeer.EMAIL
      },
      {
        id: "mobile",
        value: "MOBILE",
        label: self.resource.payments.peertopeer.mobileno
      }
    ];

    self.existingUser = function () {
      self.verifySecurityCode("existing");
    };

    self.newUser = function () {
      self.verifySecurityCode("new");

    };

    self.back = function () {
      history.back();
    };

    self.back1 = function () {
      if (self.errorMessages()) {
        self.isError(false);
        self.verificationModel.paymentId("");
        self.verificationModel.securityCode("");
        self.verificationModel.aliasValue("");
        self.errorMessages([]);
        $("#errormessagewindow").trigger("closeModal");
      }

      window.location = "../../index.html";
    };
  };
});