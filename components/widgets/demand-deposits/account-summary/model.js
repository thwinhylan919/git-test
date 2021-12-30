define(["baseService"], function(BaseService) {
  "use strict";

  /**
   * Model file for Selected Account detail section. This file contains the model definition
   * for Details section and exports the AccountSummaryModel model which can be used
   * as a component in any form in which specific account detail information are required.
   *
   * @namespace AccountSummaryModel~AccountSummaryModel
   * @property {Object} getSpecificAccountDetailDeferred -To store the deferred object
   * @property {Object} params -To store data passed
   * @property {Object} baseService -To store baseService object
   */
  const AccountSummaryModel = function() {
    const baseService = BaseService.getInstance();

    return {
      getAccountDetails: function() {
        const options = {
          url: "accounts/demandDeposit",
          mockedUrl:"framework/json/design-dashboard/demand-deposits/demand-deposit-analysis/accounts.json",
          selfLoader: true
        };

        return baseService.fetchWidget(options);
      },
      downloadAccounts: function() {
        const options = {
          url: "accounts/demandDeposit?media=application/pdf"
        };

        return baseService.downloadFile(options);
      }
    };
  };

  return new AccountSummaryModel();
});
