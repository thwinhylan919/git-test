define([
    "baseService"
], function(BaseService) {
  "use strict";

  /**
   * Model for securitycode section.
   *
   * @namespace Security code~ApplicationRolesCreateModel
   * @class
   * @property {string} securityCode - entered secuirty code
   * @property {string} primaryApplicantName - primaryapplicant name
   */
  const DeleteObjectModel = function() {
    const baseService = BaseService.getInstance();

    /**
     * Function to get new instance of ApplicationRolesCreateModel.
     *
     * @function
     * @memberOf SecurityCode~ApplicationRolesCreateModel.
     * @returns Model.
     */
    this.getNewModel = function() {
      return new this.Model();
    };

    this.deleteObject = function(Parameters, userId, successHandler, errorHandler) {
      const options = {
          url: "users",
          data: Parameters,
          success: function(data, status, jqXhr) {
            successHandler(data, status, jqXhr);
          },
          error: function(data, status, jqXhr) {
            errorHandler(data, status, jqXhr);
          }
        },
        params = {
          userId: userId
        };

      baseService.remove(options, params);
    };
  };

  return new DeleteObjectModel();
});