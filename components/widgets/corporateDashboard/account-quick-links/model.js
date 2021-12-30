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

      validateAccess: function(accountId, taskCode) {
        const options = {
          url: "accountAccess/" + accountId + "/validation/" + taskCode
        };

        return baseService.fetch(options);
      }
    };
  };

  return new StatementModel();
});