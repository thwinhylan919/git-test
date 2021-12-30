define([
  "baseService"
], function(BaseService) {
  "use strict";

  const payoutInstructionsModel = function() {
    const baseService = BaseService.getInstance();

    return {
      fetchTransferOption: function() {
        const options = {
          url: "enumerations/payOutOption"
        };

        return baseService.fetch(options);
      },
      fetchCASAAccountData: function() {
        const options = {
          url: "accounts/demandDeposit"
        };

        return baseService.fetch(options);
      },
      fetchBankAddress: function(bankCode) {
        const params ={
          bankCode: bankCode
        },
        options = {
          url: "locations/branches?branchCode={bankCode}"
        };

        return baseService.fetch(options, params);
      },
      fetchNetworkType: function() {
        const options = {
          url: "enumerations/networkType?REGION=INDIA"
        };

        return baseService.fetch(options);
      },
      fetchBranch: function(clearingCodeType, clearingCode) {
        const params ={
          clearingCode: clearingCode,
          clearingCodeType: clearingCodeType
        },
        options = {
          url: "financialInstitution/domesticClearingDetails/{clearingCodeType}/{clearingCode}"
        };

        return baseService.fetch(options, params);
      },
      getCorrespondenceCharges: function() {
        const options = {
          url: "enumerations/correspondanceChargeType"
        };

        return baseService.fetch(options);
      },
      getBankDetailsBIC: function(code) {
        const options = {
            url: "financialInstitution/bicCodeDetails/{BICCode}"
        },
        params = {
          BICCode: code
        };

        return baseService.fetch(options, params);
      }
    };
  };

  return new payoutInstructionsModel();
});
