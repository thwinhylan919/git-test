define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const baseService = BaseService.getInstance(),
    ReviewBeneMaintenanceModel = function() {
      let createBeneMaintenanceDeferred;
      const createBeneMaintenance = function(model, deferred) {
        const options = {
          url: "beneficiaries",
          data: model,
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          }
        };

        baseService.add(options);
      };
      let deleteBeneficiaryDeffered;
      const deleteBeneficiary = function(beneficiaryId, deferred) {
        const options = {
          url: "beneficiaries/" + beneficiaryId,
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          },
          error: function(data, status, jqXhr) {
            deferred.reject(data, status, jqXhr);
          }
        };

        baseService.remove(options);
      };
      let updateBeneMaintenanceDeferred;
      const updateBeneMaintenance = function(beneficiaryId, model, deferred) {
        const options = {
          url: "beneficiaries/" + beneficiaryId,
          data: model,
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          }
        };

        baseService.update(options);
      };
      let fetchBeniCountryDeferred;
      const fetchBeniCountry = function(deferred) {
        const options = {
          url: "enumerations/country",
          success: function(data) {
            deferred.resolve(data);
          }
        };

        baseService.fetch(options);
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

      return {
        createBeneMaintenance: function(model) {
          createBeneMaintenanceDeferred = $.Deferred();
          createBeneMaintenance(model, createBeneMaintenanceDeferred);

          return createBeneMaintenanceDeferred;
        },
        deleteBeneficiary: function(beneficiaryId) {
          deleteBeneficiaryDeffered = $.Deferred();
          deleteBeneficiary(beneficiaryId, deleteBeneficiaryDeffered);

          return deleteBeneficiaryDeffered;
        },
        updateBeneMaintenance: function(beneficiaryId, model) {
          updateBeneMaintenanceDeferred = $.Deferred();
          updateBeneMaintenance(beneficiaryId, model, updateBeneMaintenanceDeferred);

          return updateBeneMaintenanceDeferred;
        },
        fetchBeniCountry: function() {
          fetchBeniCountryDeferred = $.Deferred();
          fetchBeniCountry(fetchBeniCountryDeferred);

          return fetchBeniCountryDeferred;
        },
        getBankDetailsBIC: function(code) {
          getBankDetailsBICDeferred = $.Deferred();
          getBankDetailsBIC(code, getBankDetailsBICDeferred);

          return getBankDetailsBICDeferred;
        },
        getBeneficiaryDetails: function(beneficiaryId) {
          beneficiaryDetailsDeferred = $.Deferred();
          getBeneficiaryDetails(beneficiaryId, beneficiaryDetailsDeferred);

          return beneficiaryDetailsDeferred;
        }
      };
    };

  return new ReviewBeneMaintenanceModel();
});