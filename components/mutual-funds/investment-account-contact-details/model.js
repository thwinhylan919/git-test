define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  /**
   * Main file for Service Request global Model<br/><br/>
   * The injected Model Class will have below properties:
   *
   * @namespace
   * @class OrderStatusModel
   */
  const OrderStatusModel = function() {

      const baseService = BaseService.getInstance();

      let fetchCountryListDeferred;
          /**
           * FetchCountryList - description.
           *
           * @param  {type} deferred - Description.
           * @return {type}          Description.
           */
           const fetchCountryList = function(deferred) {
            const options = {
              url: "enumerations/country",
              success: function(data) {
                deferred.resolve(data);
              }
            };

            baseService.fetch(options);
          };

    return {
      fetchCountryList: function() {
        fetchCountryListDeferred = $.Deferred();
        fetchCountryList(fetchCountryListDeferred);

        return fetchCountryListDeferred;
      }
    };
  };

  return new OrderStatusModel();
});
