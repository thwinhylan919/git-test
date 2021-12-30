define([
  "jquery",
  "baseService"
  ], function($, BaseService) {
  "use strict";

  /**
   * Let UserListDetailsModel - description.
   *
   * @return {type}  Description.
   */
  const UserListDetailsModel = function() {
    /**
     * baseService instance through which all the rest calls will be made.
     *
     * @attribute baseService
     * @type {Object} BaseService Instance
     * @private
     */
    const baseService = BaseService.getInstance();
    /**
     * readUserDeferred - description
     *
     * @param  {string} id       description
     * @param  {object} deferred description
     * @return {type}          description
     */
    let readUserDeferred;
    const readUser = function(id, deferred) {
      const params = {
          userId: id
        },
        options = {
          url: "users/{userId}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

      baseService.fetch(options, params);
    };

    return {
      readUser: function(Parameters) {
        readUserDeferred = $.Deferred();
        readUser(Parameters, readUserDeferred);

        return readUserDeferred;
      }
    };
  };

  return new UserListDetailsModel();
});