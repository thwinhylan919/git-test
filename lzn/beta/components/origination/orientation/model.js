define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  /**
   * @namespace CreditCardStructureSolution~CardStructureSolutionModel
   * @class CardStructureSolutionModel
   */
  return function OrientationModel() {
    const
      /*
       * Extending BaseService
       */
      baseService = BaseService.getInstance();
    let deleteSessionDeffered;
    /**
     * DeleteSession - description.
     *
     * @param  {Object} deferred - Description.
     * @return {void}          Description.
     */
    const deleteSession = function(deferred) {
      const options = {
        url: "session",
        success: function(data) {
          deferred.resolve(data);
        }
      };

      baseService.remove(options);
    };

    return {
      /**
       * DeleteSession - description.
       *
       * @return {Object}  Description.
       */
      deleteSession: function() {
        deleteSessionDeffered = $.Deferred();
        deleteSession(deleteSessionDeffered);

        return deleteSessionDeffered;
      }
    };
  };
});