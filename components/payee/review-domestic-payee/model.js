define([
  "baseService"
], function(BaseService) {
  "use strict";

  const domesticIndiaPayeeModel = function() {
    const
      baseService = BaseService.getInstance();

    return {

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
      getPayeeDetails: function(payeeGroupId, payeeId) {
        return baseService.fetch({
          url: "payments/payeeGroup/{payeeGroupId}/payees/domestic/{payeeId}"
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
      getPayeeAccountType: function(region) {
        return baseService.fetch({
          url: "enumerations/payeeAccountType?REGION={region}"
        },{
          region :region
        });
      },
      getPaymentTypes: function(region) {
        return baseService.fetch({
          url: "enumerations/paymentType?REGION={region}"
        }, {
          region: region
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
      },
      getBankDetailsDCC: function(code) {
        return baseService.fetch({
          url: "financialInstitution/domesticClearingDetails/{domesticClearingCodeType}/{domesticClearingCode}"
        }, {
          domesticClearingCodeType: "INDIA",
          domesticClearingCode: code
        });
      },
      getBankDetails: function(code) {
        return baseService.fetch({
          url: "financialInstitution/bicCodeDetails/{BICCode}"
        }, {
          BICCode: code
        });
      },
      getBankDetailsNCC: function(region, code) {
        return baseService.fetch({
          url: "financialInstitution/nationalClearingDetails/{nationalClearingCodeType}/{nationalClearingCode}"
        }, {
          nationalClearingCodeType: region,
          nationalClearingCode: code
        });
      }
    };
  };

  return new domesticIndiaPayeeModel();
});