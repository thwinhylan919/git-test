define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const AccountDetailsModel = function() {
    const baseService = BaseService.getInstance();
    let fetchLoanDetailsDeffered;
    const fetchLoanDetails = function(accNo, deffered) {
      const options = {
        url: "accounts/loan/" + accNo,
        success: function(data) {
          deffered.resolve(data);
        },
        error: function(data) {
          deffered.reject(data);
        }
      };

      baseService.fetch(options);
    };
    let fetchLoanScheduleDetailsDeffered;
    const fetchLoanScheduleDetails = function(accNo, deffered) {
      const options = {
        url: "accounts/loan/" + accNo + "/schedule",
        success: function(data) {
          deffered.resolve(data);
        },
        error: function(data) {
          deffered.reject(data);
        }
      };

      baseService.fetch(options);
    };
    let fetchOutstandingDetailsDeffered;
    const fetchOutstandingDetails = function(accNo, deffered) {
      const options = {
        url: "accounts/loan/" + accNo + "/outstanding",
        success: function(data) {
          deffered.resolve(data);
        },
        error: function(data) {
          deffered.reject(data);
        }
      };

      baseService.fetch(options);
    };

    return {
      fetchLoanDetails: function(accNo) {
        fetchLoanDetailsDeffered = $.Deferred();
        fetchLoanDetails(accNo, fetchLoanDetailsDeffered);

        return fetchLoanDetailsDeffered;
      },
      fetchLoanScheduleDetails: function(accNo) {
        fetchLoanScheduleDetailsDeffered = $.Deferred();
        fetchLoanScheduleDetails(accNo, fetchLoanScheduleDetailsDeffered);

        return fetchLoanScheduleDetailsDeffered;
      },
      fetchOutstandingDetails: function(accNo) {
        fetchOutstandingDetailsDeffered = $.Deferred();
        fetchOutstandingDetails(accNo, fetchOutstandingDetailsDeffered);

        return fetchOutstandingDetailsDeffered;
      }
    };
  };

  return new AccountDetailsModel();
});