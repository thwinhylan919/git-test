define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const cancelInstructionModel = function() {
    const baseService = BaseService.getInstance();
    let readInstructionDetailsDeferred;
    const readInstructionDetails = function(extRefId, deferred) {
      const options = {
          url: "payments/instructions?status=ACTIVE&externalReferenceId={externalReferenceId}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },
        params = {
          externalReferenceId: extRefId
        };

      baseService.fetch(options, params);
    };

    return {
      readInstructionDetails: function(extRefId) {
        readInstructionDetailsDeferred = $.Deferred();
        readInstructionDetails(extRefId, readInstructionDetailsDeferred);

        return readInstructionDetailsDeferred;
      }
    };
  };

  return new cancelInstructionModel();
});