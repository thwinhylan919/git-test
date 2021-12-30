define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  /**
   * Let SubmissionConfirmationModel - description.
   *
   * @return {Object}  Description.
   */
  const SubmissionConfirmationModel = function() {
    /**
     * Let Model - description.
     *
     * @return {void}  Description.
     */
    const Model = function() {
        this.primary = {
          username: "",
          password: "",
          partyId: "",
          submissionId: ""
        };

        this.coApp = {
          username: "",
          partyId: "",
          submissionId: {
            displayValue: "",
            value: ""
          }
        };
      },
      baseService = BaseService.getInstance();
    let registerCoAppDeferred;
    /**
     * RegisterCoApp - description.
     *
     * @param  {Object} payload  - - - - - - - - - - - - - - - - Description.
     * @param  {Object} deferred Description.
     * @return {void}          Description.
     */
    const registerCoApp = function(payload, deferred) {
      const options = {
        url: "registration/prospect/notification",
        data: payload,
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.add(options);
    };
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
       * GetNewModel - description.
       *
       * @return {Object}  Description.
       */
      getNewModel: function() {
        return new Model();
      },
      /**
       * RegisterCoApp - description.
       *
       * @param  {Object} payload - Description.
       * @return {void}         Description.
       */
      registerCoApp: function(payload) {
        registerCoAppDeferred = $.Deferred();
        registerCoApp(payload, registerCoAppDeferred);

        return registerCoAppDeferred;
      },
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

  return new SubmissionConfirmationModel();
});