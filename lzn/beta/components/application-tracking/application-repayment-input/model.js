define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  /**
   * Model for repayments input in the Application tracking additional details section. It serves as the model where the data to be used by the application details section is defined. Since this model is tech agnostic, it can be coupled with any technology.
   *
   * @namespace ApplicationRepaymentInputModel~Model
   * @class
   * @property {Object[]} sections - Array containing the distinct additional information sections
   */
  const ApplicationRepaymentInputModel = function() {
    /**
     * @class Model
     * @private
     * @memberOf ApplicationRepaymentInputModel~Model
     */
    const Model = function() {
        this.repaymentsInfo = {
          account: "",
          accountNumber: "",
          details: {
            name: "",
            address: ""
          }
        };
      },
      baseService = BaseService.getInstance();
    let repaymentDataDeferred, accountsDataDeferred, linkAccountsDeferred, institutionCodeDeferred, settlementModesDeferred, submitRepaymentInfoDeferred;
    const fetchRepaymentData = function(submissionId, applicationId, deferred) {
      const params = {
          submissionId:submissionId,
          applicationId:applicationId
      },
      options = {
          url: "submissions/{submissionId}/applications/{applicationId}/repayment",
          success: function(data) {
            deferred.resolve(data);
          }
        };

        baseService.fetch(options, params);
      },
      fetchAccountsData = function(deferred) {
        const options = {
          url: "parties/me/accounts/dda/internal",
          success: function(data) {
            deferred.resolve(data);
          }
        };

        baseService.fetch(options);
      },
      fetchLinkAccounts = function(deferred) {
        const options = {
          url: "parties/me/accounts/dda/external",
          success: function(data) {
            deferred.resolve(data);
          }
        };

        baseService.fetch(options);
      },
      fetchInstitutionCodeTypes = function(deferred) {
        const options = {
          url: "enumerations/institutioncodetypes",
          success: function(data) {
            deferred.resolve(data);
          }
        };

        baseService.fetch(options);
      },
      fetchSettlementModes = function(deferred) {
        const options = {
          url: "enumerations/settlementModes",
          success: function(data) {
            deferred.resolve(data);
          }
        };

        baseService.fetch(options);
      },
      submitRepaymentInfo = function(submissionId, applicationId, data, deferred) {
        const params = {
          submissionId:submissionId,
          applicationId:applicationId
        },
        options = {
          url: "submissions/{submissionId}/applications/{applicationId}/repayment",
          data: JSON.stringify(data),
          success: function(data) {
            deferred.resolve(data);
          }
        };

        baseService.update(options, params);
      };

    return {
      fetchRepaymentData: function(submissionId, applicationId) {
        repaymentDataDeferred = $.Deferred();
        fetchRepaymentData(submissionId, applicationId, repaymentDataDeferred);

        return repaymentDataDeferred;
      },
      fetchAccountsData: function() {
        accountsDataDeferred = $.Deferred();
        fetchAccountsData(accountsDataDeferred);

        return accountsDataDeferred;
      },
      fetchLinkAccounts: function() {
        linkAccountsDeferred = $.Deferred();
        fetchLinkAccounts(linkAccountsDeferred);

        return linkAccountsDeferred;
      },
      fetchInstitutionCodeTypes: function() {
        institutionCodeDeferred = $.Deferred();
        fetchInstitutionCodeTypes(institutionCodeDeferred);

        return institutionCodeDeferred;
      },
      fetchSettlementModes: function() {
        settlementModesDeferred = $.Deferred();
        fetchSettlementModes(settlementModesDeferred);

        return settlementModesDeferred;
      },
      submitRepaymentInfo: function(submissionId, applicationId, data) {
        submitRepaymentInfoDeferred = $.Deferred();
        submitRepaymentInfo(submissionId, applicationId, data, submitRepaymentInfoDeferred);

        return submitRepaymentInfoDeferred;
      },
      getNewModel: function(modelData) {
        return new Model(modelData);
      }
    };
  };

  return new ApplicationRepaymentInputModel();
});
