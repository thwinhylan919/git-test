define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const BeneficiaryDetailsModel = function() {
    const baseService = BaseService.getInstance();
    let fetchAccountDetailsDeffered;
    const fetchAccountDetails = function(type, deffered) {
      let url;

      if (type === "accounts") {
        url = "payments/payeeGroup?expand=ALL&types=INTERNAL,INTERNATIONAL,INDIADOMESTIC,UKDOMESTIC,SEPADOMESTIC,PEERTOPEER";
      } else {
        url = "payments/payeeGroup?expand=ALL&types=DEMANDDRAFT";
      }

      const options = {
        url: url,
        success: function(data) {
          deffered.resolve(data);
        },
        error: function(data) {
          deffered.reject(data);
        }
      };

      baseService.fetch(options);
    };
    let fireBatchDeferred;
    const batchRead = function(deferred, batchRequest, type) {
      const options = {
        url: "batch",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.batch(options, {
        type: type
      }, batchRequest);
    };

    return {
      fetchAccountDetails: function(type) {
        fetchAccountDetailsDeffered = $.Deferred();
        fetchAccountDetails(type, fetchAccountDetailsDeffered);

        return fetchAccountDetailsDeffered;
      },
      getCountries: function() {
        return baseService.fetch({
          url: "enumerations/country"
        });
      },
      batchRead: function(batchRequest, type) {
        fireBatchDeferred = $.Deferred();
        batchRead(fireBatchDeferred, batchRequest, type);

        return fireBatchDeferred;
      },
      getPayeeAccountType: function() {
        return baseService.fetch({
          url: "enumerations/payeeAccountType?REGION=INDIA"
        });
      },
      getPayeeMaintenance: function() {
        return baseService.fetch({
          url: "maintenances/payments"
        });
      }
    };
  };

  return new BeneficiaryDetailsModel();
});