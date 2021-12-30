define([
  "baseService"
], function(BaseService) {
  "use strict";

  const BankProductModel = function() {
    const baseService = BaseService.getInstance();

    return {
      /**
       * FetchProductTiles - gets product types.
       *
       * @return {Promise}  Returns the promise object.
       */
      fetchProductTiles: function() {
        const params = {
            status: "ACTIVE"
          },
          options = {
            url: "productTypes?status={status}"
          };

        return baseService.fetch(options, params);
      },
      /**
       * FetchDealerList - get list of dealers.
       *
       * @return {Promise}  Returns the promise object.
       */
      fetchDealerList: function() {
        const options = {
          url: "dealers"
        };

        return baseService.fetch(options);
      },
      /**
       * FetchProductGroups - gets the list of product groups.
       *
       * @param  {Object} url  - Url to fetch respective product groups.
       * @return {Promise}     Returns the promise object.
       */
      fetchProductGroups: function(url) {

        const options = {
          url: url
        };

        return baseService.fetch(options);
      },
      /**
       * CreateSession - creates session.
       *
       * @return {Promise}  Returns the promise object.
       */
      createSession: function() {
        const options = {
          url: "session"
        };

        return baseService.add(options);
      }

    };
  };

  return new BankProductModel();
});
