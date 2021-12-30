define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const DDPayeeModel = function() {
    const Model = function() {
        this.addressDetails = {
          modeofDelivery: null,
          addressType: null,
          addressTypeDescription: null,
          postalAddress: {}
        };
      },
      baseService = BaseService.getInstance();
    let readPayeeDeferred;
    const readPayee = function(gId, pId, type, deferred) {
      const options = {
          url: "payments/payeeGroup/{groupId}/payees/{payeeType}/{payeeId}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },
        params = {
          groupId: gId,
          payeeId: pId,
          payeeType: type
        };

      baseService.fetch(options, params);
    };
    let getBranchDetailsDeferred;
    const getBranchDetails = function(branchCode, deferred) {
      const options = {
        url: "locations/branches?branchCode={branchCode}",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      },
      params = {
        branchCode: branchCode
      };

      baseService.fetch(options, params);
    };
    let getPartyAddressDeferred;
    const getPartyAddress = function(deferred) {
      const options = {
        url: "me/party",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };
    let getCountriesDeferred;
    const getCountries = function(deferred) {
      const options = {
        url: "enumerations/country",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };

    return {
      getNewModel: function() {
        return new Model();
      },
      getPayeeDetails: function(payeeGroupId, payeeId) {
        return baseService.fetch({
          url: "payments/payeeGroup/{payeeGroupId}/payees/demandDraft/{payeeId}"
        },{
          payeeGroupId: payeeGroupId,
          payeeId :payeeId
        });
      },
      getBranchDetails: function(branchCode) {
        getBranchDetailsDeferred = $.Deferred();
        getBranchDetails(branchCode, getBranchDetailsDeferred);

        return getBranchDetailsDeferred;
      },
      getPartyAddress: function() {
        getPartyAddressDeferred = $.Deferred();
        getPartyAddress(getPartyAddressDeferred);

        return getPartyAddressDeferred;
      },
      readPayee: function(gId, pId, type) {
        readPayeeDeferred = $.Deferred();
        readPayee(gId, pId, type, readPayeeDeferred);

        return readPayeeDeferred;
      },
      getCountries: function() {
        getCountriesDeferred = $.Deferred();
        getCountries(getCountriesDeferred);

        return getCountriesDeferred;
      },
      updatePayee: function(gId, pId, type, model) {
        return baseService.update({
          url: "payments/payeeGroup/{groupId}/payees/{payeeType}/{payeeId}",
          data: model
        }, {
          groupId: gId,
          payeeId: pId,
          payeeType: type
        });
      },
      confirmPayee: function(gId, pId, type) {
        return baseService.patch({
          url: "payments/payeeGroup/{groupId}/payees/{payeeType}/{payeeId}"
        }, {
          groupId: gId,
          payeeId: pId,
          payeeType: type
        });
      },
      /**
       * Fetches retrieveImage.
       *
       * @param {Object} id - Data containing exchange rate request details.
       * @returns {Promise}  Returns the promise object.
       */
      retrieveImage: function(id) {
        return baseService.fetch({
          url: "contents/{id}"
        }, {
          id: id
        });
      },
      getPayeeMaintenance: function() {
        return baseService.fetch({
          url: "maintenances/payments"
        });
      },
      getGroupDetails: function(groupId) {
        return baseService.fetch({
          url: "payments/payeeGroup/{groupId}"
        }, {
          groupId: groupId
        });
      }
    };
  };

  return new DDPayeeModel();
});