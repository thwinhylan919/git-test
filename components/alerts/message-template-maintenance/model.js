define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const TemplateCycleModel = function() {
    const Model = function() {
        return {
          id: "",
          destinationType: "",
          templateBuffer: "",
          subjectBuffer: "",
          subscribedActions:[{
              actionHolder: null,
              actionId: null,
              auditSequence: null,
              componentId: null,
              description: null,
              determinantValue: null,
              displayName: null,
              enabled: null,
              generatedPackageId: null,
              messageTemplateId: null,
              moduleId: null,
              parameters:[{
                auditSequence: null,
                generatedPackageId: null,
                parameterId: null,
                value: null,
                version: null
              }],
              version:null
            }],
          dataAttributes: [{
            dictionaryArray: null,
            refLinks: null,
            attributeMask: null,
            messageTemplateId: null,
            attributeId: null,
            dataSources: [{
              serviceAttributeId: null,
              activityId: null,
              attributeId: null,
              messageTemplateId: null
            }]
          }]
        };
      },
      MessageDataAttributeModel = function() {
        return {
          dictionaryArray: null,
          refLinks: null,
          attributeMask: null,
          messageTemplateId: null,
          attributeId: null,
          dataSources: null
        };
      },
      MessageDataSourceModel = function() {
        return {
          serviceAttributeId: null,
          activityId: null,
          attributeId: null,
          messageTemplateId: null
        };
      };
    let modelInitialized = false;
    const baseService = BaseService.getInstance();
    /* variable to make sure that in case there is no change
     * in model no additional fetch requests are fired.*/
    let getDestinationTypeDeffered;
    const getDestinationType = function(deferred) {
      const options = {
        url: "enumerations/destinationType",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };
    let getRecipientCategoryDeffered;
    const getRecipientCategory = function(deferred) {
      const options = {
        url: "enumerations/recipientCategory",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };
    let getRecipientDeffered;
    const getRecipient = function(deferred, recipientCategory) {
      const params = {
        recipientCategory:recipientCategory
      },
       options = {
        url: "enumerations/recipient?RecipientCategory={recipientCategory}",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options,params);
    };
    let fetchDataAttributeListDeferred;
    const fetchDataAttributeList = function(activityId, deferred) {
      const params = {
        activityId:activityId
      },
       options = {
        url: "activities/{activityId}/dataAttributes",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options, params);
    };
    let getLocaleDeferred;
    const getLocale = function(deferred) {
        const options = {
          url: "enumerations/locale",
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

          message += "\nObject can't be initialized without a valid url. ";

          return message;
        }(),
        ObjectNotInitialized: function() {
          let message = "";

          message += "\nModel has not been initialized. Please initialize the model before setting properties. ";
          message += "\nProper initialization has to be: ";
          message += "\n\n\tModelName.init(\"url\");";

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
      getNewAttributeModel: function() {
        return new MessageDataAttributeModel();
      },
      getNewDataSourceModel: function() {
        return new MessageDataSourceModel();
      },
      getNewModel: function() {
        return new Model();
      },
      getDestinationType: function() {
        objectInitializedCheck();
        getDestinationTypeDeffered = $.Deferred();
        getDestinationType(getDestinationTypeDeffered);

        return getDestinationTypeDeffered;
      },
      getRecipientCategory: function() {
        objectInitializedCheck();
        getRecipientCategoryDeffered = $.Deferred();
        getRecipientCategory(getRecipientCategoryDeffered);

        return getRecipientCategoryDeffered;
      },
      getRecipient: function(recipientCategory) {
        objectInitializedCheck();
        getRecipientDeffered = $.Deferred();
        getRecipient(getRecipientDeffered, recipientCategory);

        return getRecipientDeffered;
      },
      fetchDataAttributeList: function(activityId) {
        fetchDataAttributeListDeferred = $.Deferred();
        fetchDataAttributeList(activityId, fetchDataAttributeListDeferred);

        return fetchDataAttributeListDeferred;
      },
      getLocale: function() {
        getLocaleDeferred = $.Deferred();
        getLocale(getLocaleDeferred);

        return getLocaleDeferred;
      }
    };
  };

  return new TemplateCycleModel();
});