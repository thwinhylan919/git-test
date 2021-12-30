define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const SubmissionConfirmationModel = function() {
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
      getNewModel: function() {
        return new Model();
      },
      deleteSession: function() {
        deleteSessionDeffered = $.Deferred();
        deleteSession(deleteSessionDeffered);

        return deleteSessionDeffered;
      },
      registerCoApp: function(payload) {
        registerCoAppDeferred = $.Deferred();
        registerCoApp(payload, registerCoAppDeferred);

        return registerCoAppDeferred;
      }
    };
  };

  return new SubmissionConfirmationModel();
});