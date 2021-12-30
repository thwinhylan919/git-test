define(["baseService"], function(BaseService) {
  "use strict";

  /**
   * This file contains the Tech Agnostic Service
   * consisting of all the REST services APIs for the product component.
   *
   * @namespace CoApp~service
   * @class ProductService
   * @extends BaseService {@link BaseService}
   */
  const StatementModel = function() {
    /**
     * baseService instance through which all the rest calls will be made.
     *
     * @attribute baseService
     * @type {Object} BaseService Instance
     * @private
     */
    const baseService = BaseService.getInstance();

    return {
      fetchAccounts: function() {
        const options = {
          url: "transactions/count?countFor=created",
          mockedUrl:"framework/json/design-dashboard/accounts/demand-deposit.json",
          showMessage: false
        };

        return baseService.fetchWidget(options);
      }
    };
  };

  return new StatementModel();
});
