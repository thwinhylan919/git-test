/**
 */
define([

  "baseService"
], function(BaseService) {
  "use strict";

  const SMSBankingSearchModel = function() {
    const baseService = BaseService.getInstance();

    return {
      /**
       * FetcheventTemplateMappings - fetches event Template.
       *
       * @param  {string} eventId  - Id of mapped event template.
       * @param  {string} locale - Locale selected for event template.
       * @param  {string} menuSelected - SMS/Missed Call selected for event template.
       * @returns {Promise}  Returns the promise object.
       */
      fetcheventTemplateMappings: function(eventId, locale, menuSelected) {
        const params = {
            eventId: eventId,
            locale: locale,
            menuSelected: menuSelected
          },
          options = {
            url: "smsbanking/events/{eventId}/type/{menuSelected}/locale/{locale}/eventTemplateMappings"
          };

        return baseService.fetch(options, params);
      },
      /**
       * Fetches event listing.
       *
       * @returns {Promise}  Returns the promise object.
       */
      fetchEventDescriptionList: function() {
        const options = {
          url: "smsbanking/events"
        };

        return baseService.fetch(options);
      },
      /**
       * Fetches locale listing.
       *
       * @returns {Promise}  Returns the promise object.
       */
      fetchLocaleDescriptionList: function() {
        const options = {
          url: "enumerations/locale"
        };

        return baseService.fetch(options);
      }
    };
  };

  return new SMSBankingSearchModel();
});