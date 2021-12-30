define([
  "baseService"
], function (BaseService) {
  "use strict";

  const baseService = BaseService.getInstance(),
    ReviewThemeMappingModel = function () {
      return {
        createMapping: function (payload) {

          return baseService.add({
            url: "brands/mapping",
            data: payload
          });

        },
        deleteMapping: function (mappedType, mappedValue) {
          const options = {
            url: "brands/mapping?mappingType={mappingType}&mappingValue={mappingValue}"
          };

          return baseService.remove(options, {
            mappingType: mappedType,
            mappingValue: mappedValue
          });
        }
      };
    };

  return new ReviewThemeMappingModel();
});