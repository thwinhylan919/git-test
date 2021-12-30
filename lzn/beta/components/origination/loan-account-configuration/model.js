define([
  "jquery",
  "baseService"
], function ($, BaseService) {
  "use strict";

  return function LoanAccountConfigurationModel() {
    const Model = function () {
      this.loanAccountConfigurationInfo = {
        loanAccountConfiguration: {
          fixedTermDuration: {
            days: "",
            months: "",
            years: ""
          },
          variableTermDuration: {
            days: 0,
            months: 0,
            years: 0
          },
          loanAccountConfigStageDetails: [{
            stageCode: "",
            stageName: "",
            frequencies: "",
            tenure: {
              days: "",
              months: "",
              years: ""
            }
          }],
          fixedTermPresent: true,
          interestOnlyPresent: true,
          statementFrequncy: "",
          redraw: true,
          statementRequired: true
        }
      };
    };
    let modelInitialized = false;
    const baseService = BaseService.getInstance();
    /* variable to make sure that in case there is no change
     * in model no additional fetch requests are fired.*/
    let submissionId, applicantId,
      fetchLoanApplnOfferDetailsDeferred;
    const fetchLoanApplnOfferDetails = function (deferred, offerId) {
      const params = {
          submissionId: submissionId,
          offerId: offerId
        },
        options = {
          url: "submissions/{submissionId}/offers/{offerId}",
          success: function (data) {
            deferred.resolve(data);
          },
          error: function (data) {
            deferred.reject(data);
          }
        };

      baseService.fetch(options, params);
    };
    let saveAccountConfigurationDeferred;
    const saveAccountConfiguration = function (model, applicationId, deferred) {
      const params = {
          submissionId: submissionId,
          applicationId: applicationId
        },
        options = {
          url: "submissions/{submissionId}/applications/{applicationId}/accountConfiguration/loans",
          data: model,
          success: function (data) {
            deferred.resolve(data);
          },
          error: function (data) {
            deferred.reject(data);
          }
        };

      baseService.add(options, params);
    };
    let fetchAccountConfigurationDeferred;
    const fetchAccountConfiguration = function (applicationId, deferred) {
      const params = {
          submissionId: submissionId,
          applicationId: applicationId
        },
        options = {
          url: "submissions/{submissionId}/applications/{applicationId}/accountConfiguration/loans",
          success: function (data) {
            deferred.resolve(data);
          },
          error: function (data) {
            deferred.reject(data);
          }
        };

      baseService.fetch(options, params);
    };
    let fetchEnumDeferred;
    const fetchEnum = function (deferred) {
      const options = {
        url: "enumerations/frequency?for=loanStatement",
        success: function (data) {
          deferred.resolve(data);
        },
        error: function (data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };
    let fetchInterestRepaymentFrequencyDeferred;
    const fetchInterestRepaymentFrequency = function (deferred) {
      const options = {
        url: "enumerations/interestRepaymentFrequency",
        success: function (data) {
          deferred.resolve(data);
        },
        error: function (data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };
    let fetchInstallmentRepaymentFrequencyDeferred;
    const fetchInstallmentRepaymentFrequency = function (deferred) {
      const options = {
        url: "enumerations/installmentRepaymentFrequency",
        success: function (data) {
          deferred.resolve(data);
        },
        error: function (data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };
    let fetchAccountPreferenceDeferred;
    const fetchAccountPreference = function (deferred) {
      const params = {
          submissionId: submissionId,
          applicantId: applicantId
        },
        options = {
          url: "submissions/{submissionId}/applicants/{applicantId}/accountConfiguration/loans/preferences",
          success: function (data) {
            deferred.resolve(data);
          },
          error: function (data) {
            deferred.reject(data);
          }
        };

      baseService.fetch(options, params);
    };
    let saveAccountPreferenceDeferred;
    const saveAccountPreference = function (model, deferred) {
      const params = {
          submissionId: submissionId,
          applicantId: applicantId
        },
        options = {
          url: "submissions/{submissionId}/applicants/{applicantId}/accountConfiguration/loans/preferences",
          data: model,
          success: function (data) {
            deferred.resolve(data);
          },
          error: function (data) {
            deferred.reject(data);
          }
        };

      baseService.update(options, params);
    };

    return {
      init: function (subId, appId) {
        submissionId = subId || undefined;
        applicantId = appId || undefined;
        modelInitialized = true;

        return modelInitialized;
      },
      getNewModel: function (modelData) {
        return new Model(modelData);
      },
      fetchLoanApplnOfferDetails: function (offerId) {
        fetchLoanApplnOfferDetailsDeferred = $.Deferred();
        fetchLoanApplnOfferDetails(fetchLoanApplnOfferDetailsDeferred, offerId);

        return fetchLoanApplnOfferDetailsDeferred;
      },
      saveAccountConfiguration: function (model, applicantId) {
        saveAccountConfigurationDeferred = $.Deferred();
        saveAccountConfiguration(model, applicantId, saveAccountConfigurationDeferred);

        return saveAccountConfigurationDeferred;
      },
      fetchAccountConfiguration: function (applicantId) {
        fetchAccountConfigurationDeferred = $.Deferred();
        fetchAccountConfiguration(applicantId, fetchAccountConfigurationDeferred);

        return fetchAccountConfigurationDeferred;
      },
      fetchEnum: function () {
        fetchEnumDeferred = $.Deferred();
        fetchEnum(fetchEnumDeferred);

        return fetchEnumDeferred;
      },
      fetchInterestRepaymentFrequency: function () {
        fetchInterestRepaymentFrequencyDeferred = $.Deferred();
        fetchInterestRepaymentFrequency(fetchInterestRepaymentFrequencyDeferred);

        return fetchInterestRepaymentFrequencyDeferred;
      },
      fetchInstallmentRepaymentFrequency: function () {
        fetchInstallmentRepaymentFrequencyDeferred = $.Deferred();
        fetchInstallmentRepaymentFrequency(fetchInstallmentRepaymentFrequencyDeferred);

        return fetchInstallmentRepaymentFrequencyDeferred;
      },
      fetchAccountPreference: function () {
        fetchAccountPreferenceDeferred = $.Deferred();
        fetchAccountPreference(fetchAccountPreferenceDeferred);

        return fetchAccountPreferenceDeferred;
      },
      saveAccountPreference: function (model) {
        saveAccountPreferenceDeferred = $.Deferred();
        saveAccountPreference(model, saveAccountPreferenceDeferred);

        return saveAccountPreferenceDeferred;
      }
    };
  };
});