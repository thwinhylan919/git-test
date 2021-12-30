/**
 * Model for product-details
 * @param1 {object} jquery instance
 * @param2 {object} BaseService base service instance for server communication
 * return {object} productDetailsModel Modal instance
 */
define([

  "baseService"
], function(BaseService) {
  "use strict";

  const productDetailsModel = function() {
    const baseService = BaseService.getInstance();

    return {
      /**
       * FetchProducts - fetches products maintained in the system.
       *
       * @returns {Promise}  Returns the promise object.
       */
      fetchProducts: function() {
        return baseService.fetch({
          url: "productTypes"
        });
      }
    };
  };

  return new productDetailsModel();
});
