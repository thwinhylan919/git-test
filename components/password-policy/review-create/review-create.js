define([
  "knockout",
    "./model",
  "ojL10n!resources/nls/password-policy-create",
  "ojs/ojselectcombobox",
  "ojs/ojinputtext",
  "ojs/ojcheckboxset"
], function(ko, PasswordPolicyCreateReviewModel, locale) {
  "use strict";

  return function(params) {
    const self = this,
      getNewKoModel = function() {
        const KoModel = ko.mapping.fromJS(PasswordPolicyCreateReviewModel.getNewModel());

        return KoModel;
      };

    ko.utils.extend(self, params.rootModel);
    self.nls = locale;
    params.baseModel.registerElement("row");
    self.userTypeEnums = ko.observableArray([]);
    self.userTypeEnumsLoaded = ko.observable(false);
    params.dashboard.headerName(self.nls.pageTitle.header);
    self.personalDetExclusionReview = ko.observableArray();
    self.createPayloadToReview = ko.mapping.toJS(params.rootModel.params.data);
    self.exclusionDetailListValues = getNewKoModel().exclusionDetailListValues;

    if (self.createPayloadToReview.personalDetExclude) {
      ko.utils.arrayForEach(self.createPayloadToReview.personalDetExclude, function(item) {
        if (item === self.exclusionDetailListValues.dob()) {
          self.personalDetExclusionReview.push(self.nls.exclusionDetail.dob);
        } else if (item === self.exclusionDetailListValues.firstname()) {
          self.personalDetExclusionReview.push(self.nls.exclusionDetail.firstname);
        } else if (item === self.exclusionDetailListValues.lastname()) {
          self.personalDetExclusionReview.push(self.nls.exclusionDetail.lastname);
        } else if (item === self.exclusionDetailListValues.userid()) {
          self.personalDetExclusionReview.push(self.nls.exclusionDetail.userid);
        } else if (item === self.exclusionDetailListValues.partyid()) {
          self.personalDetExclusionReview.push(self.nls.exclusionDetail.partyid);
        }
      });
    }

    self.create = function () {
      PasswordPolicyCreateReviewModel.createPasswordPolicy(ko.toJSON(params.rootModel.params.data)).done(function (data, status, jqXhr) {
        params.dashboard.loadComponent("confirm-screen", {
          jqXHR: jqXhr,
          transactionName: self.nls.header.transactionName,
          transactionResponse: data
        });
      });
    };

    PasswordPolicyCreateReviewModel.fetchUserGroupOptions().done(function(data) {
      self.userTypeEnums(data.enterpriseRoleDTOs);
      self.userTypeEnumsLoaded(true);
    });
  };
});