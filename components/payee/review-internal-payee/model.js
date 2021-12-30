define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const reviewInternalPayeeModel = function() {
    const baseService = BaseService.getInstance();
    let getBranchesDeferred;
    const getBranches = function(deferred) {
      const options = {
        url: "locations/country/all/city/all/branchCode/",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };
    let getBranchCodeMaskPositionDeferred;
    const getBranchCodeMaskPosition = function(deferred) {
      const options = {
        url: "configurations/base/ExtSystemsConfig/properties/extsystem.branch.code.mask.position",
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
      getBranches: function() {
        getBranchesDeferred = $.Deferred();
        getBranches(getBranchesDeferred);

        return getBranchesDeferred;
      },
      getPayeeDetails: function(payeeGroupId, payeeId) {
        return baseService.fetch({
          url: "payments/payeeGroup/{payeeGroupId}/payees/internal/{payeeId}"
        },{
          payeeGroupId: payeeGroupId,
          payeeId :payeeId
        });
      },
      getBranchCodeMaskPosition: function() {
        getBranchCodeMaskPositionDeferred = $.Deferred();
        getBranchCodeMaskPosition(getBranchCodeMaskPositionDeferred);

        return getBranchCodeMaskPositionDeferred;
      },
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
      }
    };
  };

  return new reviewInternalPayeeModel();
});