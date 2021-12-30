define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const baseService = BaseService.getInstance(),
    SearchBeneMaintenanceModel = function() {
      let beneficiaryListDeferred;
      const getBeneficiaryList = function(deferred) {
        const options = {
          url: "beneficiaries",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

        baseService.fetch(options);
      };
      let beneficiaryDetailsDeferred;
      const getBeneficiaryDetails = function(beneficiaryId, deferred) {
        const options = {
            url: "beneficiaries/{beneficiaryId}",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            beneficiaryId: beneficiaryId
          };

        baseService.fetch(options, params);
      };
      let getBankDetailsBICDeferred;
      const getBankDetailsBIC = function(code, deferred) {
        const options = {
            url: "financialInstitution/bicCodeDetails/{BICCode}",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            BICCode: code
          };

        baseService.fetch(options, params);
      };

      return {
        getBeneficiaryList: function() {
          beneficiaryListDeferred = $.Deferred();
          getBeneficiaryList(beneficiaryListDeferred);

          return beneficiaryListDeferred;
        },
        getBeneficiaryDetails: function(beneficiaryId) {
          beneficiaryDetailsDeferred = $.Deferred();
          getBeneficiaryDetails(beneficiaryId, beneficiaryDetailsDeferred);

          return beneficiaryDetailsDeferred;
        },
        getBankDetailsBIC: function(code) {
          getBankDetailsBICDeferred = $.Deferred();
          getBankDetailsBIC(code, getBankDetailsBICDeferred);

          return getBankDetailsBICDeferred;
        }
      };
    };

  return new SearchBeneMaintenanceModel();
});