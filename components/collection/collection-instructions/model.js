define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const baseService = BaseService.getInstance(),
    InstructionsDetailsModel = function() {
      let getBillInstructionsDefered;
      const getBillInstructions = function(deferred) {
        const options = {
          url: "bills/instructions",
          success: function(data) {
            deferred.resolve(data);
          }
        };

        baseService.fetch(options);
      };

      return {
        getBillInstructions: function() {
          getBillInstructionsDefered = $.Deferred();
          getBillInstructions(getBillInstructionsDefered);

          return getBillInstructionsDefered;
        }
      };
    };

  return new InstructionsDetailsModel();
});