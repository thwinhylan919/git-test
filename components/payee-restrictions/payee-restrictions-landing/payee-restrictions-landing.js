define([
  "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/payee-restrictions-landing",
  "promise",
  "ojs/ojinputnumber",
  "ojs/ojknockout-validation",
  "ojs/ojbutton"
], function (ko, $, PayeeCountLimitModel, ResourceBundle) {
  "use strict";

  return function (Params) {
    const self = this;
    let newLimit, retainedLimit;
    const getpayload = function () {
        const KoModel = ko.mapping.fromJS(PayeeCountLimitModel.getNewModel());

        return KoModel.updatePayload;
      },
      getUpdateElement = function () {
        const KoModel = ko.mapping.fromJS(PayeeCountLimitModel.getNewModel());

        return KoModel.updateElement;
      };

    ko.utils.extend(self, Params.rootModel);
    self.enterpriseRole = ko.observable(self.params.enterpriseRole);
    self.segmentSelectedForRole = ko.observable(self.params.segmentSelectedForRole);
    self.targetType = ko.observable(self.params && self.params.targetType ? self.params.targetType : null);
    self.targetValue = ko.observable(self.params && self.params.targetValue ? self.params.targetValue : null);
    self.searchResultLoaded = ko.observable(false);
    self.resource = ResourceBundle.resource;
    self.searchResult = ko.observable();
    self.validationTracker = ko.observable();
    self.isEdit = ko.observable(false);
    self.isReview = ko.observable(false);
    self.isInitite = ko.observable(true);
    self.searchResultMap = {};
    Params.dashboard.headerName(self.resource.payeeCount.title);

    Params.baseModel.registerElement([
      "confirm-screen",
      "modal-window",
      "action-header"
    ]);

    self.payeeLimitStatus = [{
        id: "Y",
        label: self.resource.common.yes
      },
      {
        id: "N",
        label: self.resource.common.no
      }
    ];

    PayeeCountLimitModel.listAllLimits(self.targetType(), self.targetValue()).done(function (data) {
      self.searchResult(data.payeeCountLimitList);

      for (let i = 0; i < self.searchResult().length; i++) {
        let payeeTypeLimit;

        for (let j = 0; j < self.searchResult()[i].accountPayee.length; j++) {
          self.searchResult()[i].accountPayee[j].payeeCountLimitStatus = ko.observable(self.searchResult()[i].accountPayee[j].payeeCountLimitStatus ? "Y" : "N");
          payeeTypeLimit = self.searchResult()[i].accountPayee[j];

          self.searchResultMap[payeeTypeLimit.payeeType + "-" + payeeTypeLimit.effectiveDate] = {
            payeesPerDay: payeeTypeLimit.payeesPerDay,
            payeeCountLimitStatus: payeeTypeLimit.payeeCountLimitStatus()
          };
        }

        for (let k = 0; k < self.searchResult()[i].draftpayee.length; k++) {
          self.searchResult()[i].draftpayee[k].payeeCountLimitStatus = ko.observable(self.searchResult()[i].draftpayee[k].payeeCountLimitStatus ? "Y" : "N");
          payeeTypeLimit = self.searchResult()[i].draftpayee[k];

          self.searchResultMap[payeeTypeLimit.payeeType + "-" + payeeTypeLimit.effectiveDate] = {
            payeesPerDay: payeeTypeLimit.payeesPerDay,
            payeeCountLimitStatus: payeeTypeLimit.payeeCountLimitStatus()
          };
        }
      }

      self.searchResultLoaded(true);
    });

    self.showWarning = function () {
      if (!Params.baseModel.showComponentValidationErrors(self.validationTracker())) {
        return;
      }

      $("#effectivedate").trigger("openModal");
    };

    self.hideWarning = function () {
      $("#effectivedate").hide();
    };

    self.switchEditMode = function () {
      self.searchResultLoaded(false);
      self.isInitite(false);

      if (self.isReview()) {
        self.isReview(false);
      } else {
        self.isEdit(!self.isEdit());
      }

      ko.tasks.runEarly();
      self.searchResultLoaded(true);
    };

    self.switchEditModenRetainValues = function () {
      if (!self.isReview() && !self.isEdit()) {
        Params.dashboard.hideDetails();
      }

      self.isInitite(false);

      for (let i = 0; i < self.searchResult().length; i++) {
        for (let j = 0; j < self.searchResult()[i].accountPayee.length; j++) {
          newLimit = self.searchResult()[i].accountPayee[j];
          retainedLimit = self.searchResultMap[newLimit.payeeType + "-" + newLimit.effectiveDate];

          if (retainedLimit.payeesPerDay !== newLimit.payeesPerDay || retainedLimit.payeeCountLimitStatus !== newLimit.payeeCountLimitStatus()) {
            self.searchResult()[i].accountPayee[j].payeesPerDay = retainedLimit.payeesPerDay;
            self.searchResult()[i].accountPayee[j].payeeCountLimitStatus(retainedLimit.payeeCountLimitStatus);
          }
        }

        for (let k = 0; k < self.searchResult()[i].draftpayee.length; k++) {
          newLimit = self.searchResult()[i].draftpayee[k];
          retainedLimit = self.searchResultMap[newLimit.payeeType + "-" + newLimit.effectiveDate];

          if (retainedLimit.payeesPerDay !== newLimit.payeesPerDay || retainedLimit.payeeCountLimitStatus !== newLimit.payeeCountLimitStatus()) {
            self.searchResult()[i].draftpayee[k].payeesPerDay = retainedLimit.payeesPerDay;
            self.searchResult()[i].draftpayee[k].payeeCountLimitStatus(retainedLimit.payeeCountLimitStatus);
          }
        }
      }

      self.switchEditMode();
    };

    self.goToReviewScreen = function () {
      self.isReview(true);
      self.hideWarning();
    };

    self.confirmEdit = function () {
      let payload = getpayload();

      for (let i = 0; i < self.searchResult().length; i++) {
        let updateElement;

        for (let j = 0; j < self.searchResult()[i].accountPayee.length; j++) {
          newLimit = self.searchResult()[i].accountPayee[j];
          retainedLimit = self.searchResultMap[newLimit.payeeType + "-" + newLimit.effectiveDate];

          if (retainedLimit.payeesPerDay !== newLimit.payeesPerDay || retainedLimit.payeeCountLimitStatus !== newLimit.payeeCountLimitStatus()) {
            updateElement = getUpdateElement();
            updateElement.entityDTO.value(self.targetValue());
            updateElement.entityDTO.type(self.targetType());
            updateElement.payeeType(newLimit.payeeType);
            updateElement.payeesPerDay(newLimit.payeesPerDay);
            updateElement.payeeCountLimitStatus(newLimit.payeeCountLimitStatus() === "Y");
            payload.payeeCountLimitList().push(updateElement);
          }
        }

        for (let k = 0; k < self.searchResult()[i].draftpayee.length; k++) {
          newLimit = self.searchResult()[i].draftpayee[k];
          retainedLimit = self.searchResultMap[newLimit.payeeType + "-" + newLimit.effectiveDate];

          if (retainedLimit.payeesPerDay !== newLimit.payeesPerDay || retainedLimit.payeeCountLimitStatus !== newLimit.payeeCountLimitStatus()) {
            updateElement = getUpdateElement();
            updateElement.payeeType(newLimit.payeeType);
            updateElement.payeesPerDay(newLimit.payeesPerDay);
            updateElement.entityDTO.value(self.targetValue());
            updateElement.entityDTO.type(self.targetType());
            updateElement.payeeCountLimitStatus(newLimit.payeeCountLimitStatus() === "Y");
            payload.payeeCountLimitList().push(updateElement);
          }
        }
      }

      payload = ko.toJSON(payload);

      PayeeCountLimitModel.addPayeeLimits(payload).then(function (data) {
        self.searchResultLoaded(false);

        Params.dashboard.loadComponent("confirm-screen", {
          transactionResponse: data,
          transactionName: self.resource.payeeCount.title,
          okLabel: self.resource.common.ok,
          template: "payee/confirm-screen-templates/payee-restrictions-landing"
        }, self);
      });
    };
  };
});