define([
    "jquery",
    "baseService"
  ], function ($, BaseService) {
    "use strict";

    const baseService = BaseService.getInstance(),
     DocumentUploadrModel = function () {

      let getDocumentDetailsDeffered;
      const fetchDocumentsDetails = function(contentId, ownerId, deferred) {
        const options = {
            url: "contents/{contentId}?alt=media&ownerId={ownerId}&transactionType={transactionType}&toBeDownloaded=true",
            success: function(data) {
              deferred.resolve(data);
          }
        },
        params = {
          contentId: contentId,
          moduleIdentifier: "CREDIT_FACILITY",
          ownerId:ownerId,
          transactionType: "MO"
        };

        baseService.downloadFile(options, params);
      };

      let getDocumentListDeffered;
      const fetchDocumentList = function(partyId, applicationId, deferred){
        const options = {
        url: "processManagement/{applicationId}/documents?partyId={partyId}&transactionType=MO",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function (data) {
          deferred.reject(data);
          }
        },
        params = {
          applicationId: applicationId,
          partyId: partyId
        };

        baseService.fetch(options, params);
      };

      return {
        fetchDocumentsDetails: function(contentId, ownerId) {
          getDocumentDetailsDeffered = $.Deferred();
          fetchDocumentsDetails(contentId, ownerId, getDocumentDetailsDeffered);

          return getDocumentDetailsDeffered;
        },
        fetchDocumentList: function(partyId, applicationId){
          getDocumentListDeffered = $.Deferred();
          fetchDocumentList(partyId, applicationId, getDocumentListDeffered);

          return getDocumentListDeffered;
        }
      };
    };

    return new DocumentUploadrModel();
  });