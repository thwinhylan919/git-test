define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const PurchaseMutualFundModel = function() {
    const baseService = BaseService.getInstance();
    let questionairreDeffered;
    const getRiskProfileQuestionnaire = function(deferred) {
      const options = {
        url: "riskProfileQuestionnaire",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };
    let submissionDeffered;
    const calculateRiskProfiles = function(data, deferred) {
      const option = {
        url: "riskProfileQuestionnaire/submissions",
        data: data,
        success: function(data) {
          deferred.resolve(data);
        }
      };

      baseService.add(option);
    };

    return {
      getRiskProfileQuestionnaire: function() {
        questionairreDeffered = $.Deferred();
        getRiskProfileQuestionnaire(questionairreDeffered);

        return questionairreDeffered;
      },
      calculateRiskProfiles: function(data) {
        submissionDeffered = $.Deferred();
        calculateRiskProfiles(data, submissionDeffered);

        return submissionDeffered;
      }
    };
  };

  return new PurchaseMutualFundModel();
});