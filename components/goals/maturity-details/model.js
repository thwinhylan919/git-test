define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const maturityDetails = function maturityDetails() {
    const baseService = BaseService.getInstance(),
      modelInitialized = true,
      Model = function() {
        this.dummyObject = {
          selfAccountObject: {
            value: ""
          },
          accountNumber: "",
          accountType: "",
          networkType: "",
          name: "",
          bankCode: "",
          bankDetails: "",
          branch: ""
        };
      };
    let getNetworkTypesDeferred;
    const getNetworkTypes = function(region, deferred) {
      const options = {
          url: "enumerations/networkType?REGION={region}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },
        params = {
          region: region
        };

      baseService.fetch(options, params);
    };
    let getBankDetailsDCCDeferred;
    const getBankDetailsDCC = function(code, network, deferred) {
        const options = {
            url: "financialInstitution/domesticClearingDetails?financialInstitutionCodeSearchType=S&financialInstitutionCode={code}&network={network}",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            code: code,
            network: network
          };

        baseService.fetch(options, params);
      },
      objectInitializedCheck = function() {
        if (!modelInitialized) {
          throw new Error();
        }
      };

    return {
      getNewModel: function(modelData) {
        return new Model(modelData);
      },
      getNetworkTypes: function(region) {
        objectInitializedCheck();
        getNetworkTypesDeferred = $.Deferred();
        getNetworkTypes(region, getNetworkTypesDeferred);

        return getNetworkTypesDeferred;
      },
      getBankDetailsDCC: function(code, network) {
        objectInitializedCheck();
        getBankDetailsDCCDeferred = $.Deferred();
        getBankDetailsDCC(code, network, getBankDetailsDCCDeferred);

        return getBankDetailsDCCDeferred;
      }
    };
  };

  return new maturityDetails();
});