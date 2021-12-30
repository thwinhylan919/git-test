define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const ViewDiscrepanciesModel = function() {
    const baseService = BaseService.getInstance(),
      discrepancyModel = function() {
        this.discrepancies = {
          discrepancyDTO: []
        };
      };
    let initiateCustomerAcceptanceDeferred;
    const initiateCustomerAcceptance = function(billReferenceNumber, model, deferred) {
      const options = {
        url: "bills/discrepancies/" + billReferenceNumber + "/customeracceptance",
        data: model,
        success: function(data, status, jqXhr) {
          deferred.resolve(data, status, jqXhr);
        }
      };

      baseService.add(options);
    };
    let fetchBranchDateDeferred;
    const fetchBranchDate = function(code, deferred) {
      const options = {
          url: "branchdate/{branchCode}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },
        params = {
          branchCode: code
        };

      baseService.fetch(options, params);
    };

    return {
      getNewdiscrepancyModel: function() {
        return new discrepancyModel();
      },
      initiateCustomerAcceptance: function(billReferenceNumber, model) {
        initiateCustomerAcceptanceDeferred = $.Deferred();
        initiateCustomerAcceptance(billReferenceNumber, model, initiateCustomerAcceptanceDeferred);

        return initiateCustomerAcceptanceDeferred;
      },
      fetchBranchDate: function(code) {
        fetchBranchDateDeferred = $.Deferred();
        fetchBranchDate(code, fetchBranchDateDeferred);

        return fetchBranchDateDeferred;
      }
    };
  };

  return new ViewDiscrepanciesModel();
});