define([
  "baseService"
], function (BaseService) {
  "use strict";

  const RelationshipMatrixMappingModel = function () {
    const baseService = BaseService.getInstance(),
      /**
       * In case more than one instance of model is required,
       * we are declaring model as a function, of which new instances can be created and
       * used when required.
       *
       * @class Model
       * @private
       * @return {void}  Description.
       */
      Model = function () {
        this.taskToAccountRelationshipMapping = {
          taskToAccountRelationshipDTOs: [{
            taskId: "",
            accountRelationshipCode: "",
            accountType: ""
          }]
        };
      };

    return {
      /**
       * GetNewModel - description.
       *
       * @param  {type} modelData - Description.
       * @return {type}           Description.
       */
      getNewModel: function () {
        return new Model();
      },
      /**
       * Let fetchTasksDeferred - description.
       *
       * @param  {type} deferred - Description.
       * @return {type}          Description.
       */
      fetchTasks: function () {
        const options = {
          url: "accountRelationship/mapping"
        };

        return baseService.fetch(options);
      },
      fetchRelationships: function () {
        const options = {
          url: "accountRelationship/maintenance"
        };

        return baseService.fetch(options);
      },
      createMapping: function (payload) {
        const options = {
          url: "accountRelationship/mapping",
          data: payload
        };

        return baseService.add(options);
      },
      /**
       * Anonymous function - description.
       *
       * @param  {type} payload   - - - - - - - - - - - - - - - Description.
       * @param  {type} mappingId Description.
       * @param  {type} deferred  Description.
       * @return {type}           Description.
       */
      updateMapping: function (payload, mappingId) {
        const params = {
            mappingId: mappingId
          },
          options = {
            url: "accountRelationship/mapping/{mappingId}",
            data: payload
          };

        return baseService.update(options, params);
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

  return new RelationshipMatrixMappingModel();
});