/**
 */
define([

  "baseService"
], function(BaseService) {
  "use strict";

  const SMSBankingViewModel = function() {
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
      }
    };
  };

  return new SMSBankingViewModel();
});