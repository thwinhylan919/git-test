define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const baseService = BaseService.getInstance(),
    AccountDetailsModel = function() {
      const Model = function() {
        this.accountDetailsPayload = {
          accountNumber: "",
          routingNumber: "",
          bankName: "",
          accountType: "",
          temp_maskAccountNumber: "",
          temp_reAccountNumber: "",
          temp_maskReAccountNumber: "",
          temp_selectedAccountType: ""
        };
      };
      let getAccountDetailsDeferred;
      const getAccountDetails = function(submissionId, deferred) {
        const params = {
            submissionId: submissionId
          },
          options = {
            url: "submissions/{submissionId}/settlementDetails",
            success: function(data) {
              deferred.resolve(data);
            }
          };

        baseService.fetch(options, params);
      };
      let getAccountTypeListDeferred;
      const getAccountTypeList = function(deferred) {
        const options = {
          url: "enumerations/settlementAccountTypes",
          success: function(data) {
            deferred.resolve(data);
          }
        };

        baseService.fetch(options);
      };
      let submitAccountDetailsDeferred;
      const submitAccountDetails = function(submissionId, payload, deferred, isToBeUpdated) {
        const params = {
            submissionId: submissionId
          },
          options = {
            url: "submissions/{submissionId}/settlementDetails",
            data: payload,
            success: function(data) {
              deferred.resolve(data);
            }
          };

        if (isToBeUpdated) {
          baseService.update(options, params);
        } else {
          baseService.add(options, params);
        }
      };

      return {
        getNewModel: function(modelData) {
          return new Model(modelData);
        },
        getAccountDetails: function(submissionId) {
          getAccountDetailsDeferred = $.Deferred();
          getAccountDetails(submissionId, getAccountDetailsDeferred);

          return getAccountDetailsDeferred;
        },
        getAccountTypeList: function() {
          getAccountTypeListDeferred = $.Deferred();
          getAccountTypeList(getAccountTypeListDeferred);

          return getAccountTypeListDeferred;
        },
        submitAccountDetails: function(submissionId, payload, isToBeUpdated) {
          submitAccountDetailsDeferred = $.Deferred();
          submitAccountDetails(submissionId, payload, submitAccountDetailsDeferred, isToBeUpdated);

          return submitAccountDetailsDeferred;
        }
      };
    };

  return new AccountDetailsModel();
});