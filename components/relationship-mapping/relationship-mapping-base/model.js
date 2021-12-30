define([
  "baseService"
], function (BaseService) {
  "use strict";

  /**
   * Let RelationshipMappingBaseModel - description.
   *
   * @return {type}  Description.
   */
  const RelationshipMappingBaseModel = function () {
    const baseService = BaseService.getInstance();

    return {
      /**
       * FetchRelationshipMapping - description.
       *
       * @param  {type} deferred - Description.
       * @return {type}          Description.
       */
      fetchRelationshipMapping: function () {
        const options = {
          url: "accountRelationship/maintenance"
        };

        return baseService.fetch(options);
      },
      /**
       * FetchRelationshipEnum - description.
       *
       * @param  {type} deferred - Description.
       * @return {type}          Description.
       */
      fetchRelationshipEnum: function () {
        const options = {
          url: "enumerations/accountRelationshipType"
        };

        return baseService.fetch(options);
      }
    };
  };

  return new RelationshipMappingBaseModel();
});