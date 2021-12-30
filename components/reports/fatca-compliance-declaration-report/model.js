/**
 * Model for fatca-compliane-declaration-report
 * @param1 {object} jquery jquery instance
 * @param2 {object} BaseService base service instance for server communication
 * @return {object} reportGenerationModel Modal instance
 */
define([
  "baseService"
], function (BaseService) {
  "use strict";

  const reportGenerationModel = function () {
    const baseService = BaseService.getInstance();

    return {
      /**
       * FetchEnumeration - fires the enumeration to fetch fatca compliance form types.
       *
       * @param  {type} deferred             - Description.
       * @return {type}                      Description.
       */
      fetchEnumeration: function () {
        const options = {
          url: "enumerations/fatcaFormTypes"
        };

        return baseService.fetch(options);
      }
    };
  };

  return new reportGenerationModel();
});