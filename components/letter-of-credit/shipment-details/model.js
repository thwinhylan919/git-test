define([
    "jquery",
    "baseService"
  ], function($, BaseService) {
    "use strict";

    const baseService = BaseService.getInstance(),
    ShipimentDetailsModel = function() {
        let fetchtransportationModesDeferred;
      const fetchtransportationModes = function(deferred) {
        const options = {
            url: "enumerations/transportationModes",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
                deferred.reject(data);
              }
          };

        baseService.fetch(options);
      };

      return{
        fetchtransportationModes: function() {
            fetchtransportationModesDeferred = $.Deferred();
            fetchtransportationModes(fetchtransportationModesDeferred);

            return fetchtransportationModesDeferred;
          }
      };
    };

    return new ShipimentDetailsModel();
});
