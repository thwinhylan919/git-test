/**
 */
define([

  "baseService"
], function(BaseService) {
  "use strict";

  const SMSBankingEditModel = function() {
    const Model = function() {
        this.requestDataAttribute = {
          attribute: {
            attributeID: null,
            attributeName: null
          },
          dataAttrOrder: null
        };

        this.responseDataAttribute = {
          attribute: {
            attributeID: null,
            attributeName: null
          }
        };

        this.eventTempUpdate = {
          dto: {
              event: {
              eventName: null
            },
            pinRequired: false,
            requestTemplate: {
              id: null,
              message: null,
              requestDataAttributes: []
            },
            responseTemplate: {
              id: null,
              message: null,
              responseDataAttributes: []
            }
          }
        };
      },
      baseService = BaseService.getInstance();

    return {
      /**
       * GetNewModel - returns the model.
       *
       * @param {string} modelData - Model for event Template.
       * @returns {Promise}  Returns the promise object.
       */
      getNewModel: function(modelData) {
        return new Model(modelData);
      },
      /**
       * FetchResponseAttributeList - fetches event attribute List.
       *
       * @param {string} eventId  - EventId for an event.
       * @returns {Promise}  Returns the promise object.
       */
      fetchResponseAttributeList: function(eventId) {
        const params = {
            eventId: eventId
          },
          options = {
            url: "smsbanking/events/{eventId}/responseDataAttributes"
          };

        return baseService.fetch(options, params);
      },
      /**
       * FetchRequestAttributeList - fetches request attribute List.
       *
       * @param {string} eventId  - EventId for an event.
       * @returns {Promise}  Returns the promise object.
       */
      fetchRequestAttributeList: function(eventId) {
        const params = {
            eventId: eventId
          },
          options = {
            url: "smsbanking/events/{eventId}/requestDataAttributes"
          };

        return baseService.fetch(options, params);
      }
    };
  };

  return new SMSBankingEditModel();
});