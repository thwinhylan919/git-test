define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const AccountDetailsModel = function() {
    const baseService = BaseService.getInstance();
    let fetchTdDetailsDeffered;
    const fetchTdDetails = function(accNo, deffered) {
      const params ={
          accNo: accNo
        },options = {
        url: "accounts/deposit/{accNo}",
        success: function(data) {
          deffered.resolve(data);
        },
        error: function(data) {
          deffered.reject(data);
        }
      };

      baseService.fetch(options, params);
    };
    let fetchPayoutInstructionsDeffered;
    const fetchPayoutInstructions = function(accNo, deffered) {
      const params ={
          accNo: accNo
        },options = {
        url: "accounts/deposit/{accNo}/payOutInstructions",
        success: function(data) {
          deffered.resolve(data);
        },
        error: function(data) {
          deffered.reject(data);
        }
      };

      baseService.fetch(options, params);
    };
    let fetchBranchDetailsDeffered;
    const fetchBranchDetails = function(branchNo, deffered) {
      const params ={
          branchNo: branchNo
        },options = {
        url: "locations/branches?branchCode={branchNo}",
        success: function(data) {
          deffered.resolve(data);
        },
        error: function(data) {
          deffered.reject(data);
        }
      };

      baseService.fetch(options, params);
    };

    return {
      fetchTdDetails: function(accNo) {
        fetchTdDetailsDeffered = $.Deferred();
        fetchTdDetails(accNo, fetchTdDetailsDeffered);

        return fetchTdDetailsDeffered;
      },
      fetchPayoutInstructions: function(accNo) {
        fetchPayoutInstructionsDeffered = $.Deferred();
        fetchPayoutInstructions(accNo, fetchPayoutInstructionsDeffered);

        return fetchPayoutInstructionsDeffered;
      },
      fetchBranchDetails: function(branchNo) {
        fetchBranchDetailsDeffered = $.Deferred();
        fetchBranchDetails(branchNo, fetchBranchDetailsDeffered);

        return fetchBranchDetailsDeffered;
      }
    };
  };

  return new AccountDetailsModel();
});