define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const ScheduledInstructionsInfoModel = function() {
    let modelInitialized = false;
    const baseService = BaseService.getInstance();
    let getListDeferred;
    const getList = function(deferred, customListUrl) {
        const options = {
          url: customListUrl,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

        baseService.fetch(options);
      },
      errors = {
        InitializationException: function() {
          let message = "";

          message += "\nObject can't be initialized without a valid submission Id. ";
          message += "\nPlease make sure the submission id is present.";
          message += "\nProper initialization has to be:";
          message += "\n\n\tModelName.init(\"SubId\"[, \"ApplicantId\"]);";

          return message;
        }(),
        ObjectNotInitialized: function() {
          let message = "";

          message += "\nModel has not been initialized. Please initialize the model before setting properties. ";
          message += "\nProper initialization has to be: ";
          message += "\n\n\tModelName.init(\"SubId\"[, \"ApplicantId\"]);";

          return message;
        }()
      },
      objectInitializedCheck = function() {
        if (!modelInitialized) {
          throw new Error(errors.ObjectNotInitialized);
        }
      };

    return {
      init: function() {
        modelInitialized = true;

        return modelInitialized;
      },
      getList: function(customListUrl) {
        objectInitializedCheck();
        getListDeferred = $.Deferred();
        getList(getListDeferred, customListUrl);

        return getListDeferred;
      }
    };
  };

  return new ScheduledInstructionsInfoModel();
});