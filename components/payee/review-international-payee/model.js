define([
  "baseService"
], function(BaseService) {
  "use strict";

  const internationalPayeeModel = function() {
    const baseService = BaseService.getInstance();

    return {
      retrieveImage: function(id) {
        return baseService.fetch({
          url: "contents/{id}"
        }, {
          id: id
        });
      },
      getPayeeDetails: function(payeeGroupId, payeeId) {
        return baseService.fetch({
          url: "payments/payeeGroup/{payeeGroupId}/payees/international/{payeeId}"
        },{
          payeeGroupId: payeeGroupId,
          payeeId :payeeId
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
      getCountries: function() {
        return baseService.fetch({
          url: "enumerations/country"
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
      },
      getBankDetailsBIC: function(code) {
        return baseService.fetch({
          url: "financialInstitution/bicCodeDetails/{BICCode}"
        }, {
          BICCode: code
        });
      },
      getBankDetailsNCC: function(code) {
        return baseService.fetch({
          url: "financialInstitution/nationalClearingDetails/{nationalClearingCodeType}/{nationalClearingCode}"
        }, {
          nationalClearingCodeType: "NCC",
          nationalClearingCode: code
        });
      }
    };
  };

  return new internationalPayeeModel();
});