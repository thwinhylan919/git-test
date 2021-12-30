define(["baseService"], function(BaseService) {
  "use strict";

  /**
   * Model file for Selected Account detail section. This file contains the model definition
   * for Details section and exports the LoanSummaryModel model which can be used
   * as a component in any form in which specific account detail information are required.
   *
   * @namespace LoanSummaryModel~LoanSummaryModel.
   * @property {Object} baseService -To store baseService object
   * @return {Object} LoanSummaryModel.
   */
  const LoanSummaryModel = function() {
    const baseService = BaseService.getInstance();

    return {
      getAccountDetails: function() {
        const options = {
          url: "accounts/loan",
          mockedUrl:"framework/json/design-dashboard/loans/loan-portfolio.json",
          selfLoader: true
        };

        return baseService.fetchWidget(options);
      },
      downloadAccounts: function() {
        const options = {
          url: "accounts/loan?media=application/pdf"
        };

        return baseService.downloadFile(options);
      }
    };
  };

  return new LoanSummaryModel();
});
