define([
  "baseService"
], function (BaseService) {
  "use strict";

  /**
   * Let ReviewRelationshipMappingModel - description.
   *
   * @return {type}  Description.
   */
  const ReviewRelationshipMappingModel = function () {
    const baseService = BaseService.getInstance(),
      /**
       * Let Model - description.
       *
       * @return {type}  Description.
       */
      Model = function () {
        this.createRelationshipMappingPayload = {
          relationshipCode: "",
          hostRelationshipCode: ""
        };
      };

    return {
      /**
       * GetNewModel - description.
       *
       * @return {type}  Description.
       */
      getNewModel: function () {
        return new Model();
      },
      /**
       * CreateRelationshipMapping - description.
       *
       * @param  {type} payload  - - - - - - - - - - - - - - - - Description.
       * @param  {type} deferred Description.
       * @return {type}          Description.
       */
      createRelationshipMapping: function (payload) {
        const options = {
          url: "accountRelationship/maintenance",
          data: payload
        };

        return baseService.add(options);
      },
      /**
       * UpdateRelationshipMapping - description.
       *
       * @param  {type} payload  - - - - - - - - - - - - - - - Description.
       * @param  {type} rmKey    Description.
       * @param  {type} deferred Description.
       * @return {type}          Description.
       */
      updateRelationshipMapping: function (payload, rmKey) {
        const params = {
            rmKey: rmKey
          },
          options = {
            url: "accountRelationship/maintenance/{rmKey}",
            data: payload
          };

        return baseService.update(options, params);
      }
    };
  };

  return new ReviewRelationshipMappingModel();
});