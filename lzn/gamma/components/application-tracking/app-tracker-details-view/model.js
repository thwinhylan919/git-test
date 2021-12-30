define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  /**
   * Model for application details view section in the application tracking page. It serves as the model where the data to be used by the application details section is defined. Since this model is tech agnostic, it can be coupled with any technology.
   *
   * @namespace ApplicationDetailsViewModel~Model
   * @class ApplicationDetailsViewModel
   */
  const ApplicationDetailsViewModel = function() {
    /**
     * baseService instance through which all the rest calls will be made.
     *
     * @attribute baseService
     * @type {Object} BaseService Instance
     * @private
     */
    const baseService = BaseService.getInstance();
    let applicationFormDeferred, fetchDocumentsByteArrayDeffered;
    const fetchApplicationForm = function(submissionId, applicationId, deferred) {
      const params = {
      submissionId:submissionId,
      applicationId:applicationId
      },
       options = {
        url: "submissions/{submissionId}/applications/{applicationId}/applicationform",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options, params);
    };
    let readPreferencesDeffered;
    const readPreferences = function(submissionId, applicationId, deferred) {
      const params = {
      submissionId:submissionId,
      applicationId:applicationId
      },
       options = {
        url: "submissions/{submissionId}/applications/{applicationId}/primaryPreferences",
        success: function(data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options, params);
    };
    let readMembershipDetailsDeffered;
    const readMembershipDetails = function(submissionId, applicationId, deferred) {
      const params = {
      submissionId:submissionId,
      applicationId:applicationId
      },
       options = {
        url: "submissions/{submissionId}/applications/{applicationId}/membership",
        success: function(data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options, params);
    };
    let readAdditionalDetailsDeffered;
    const readAdditionalDetails = function(submissionId, applicationId, deferred) {
      const params = {
      submissionId:submissionId,
      applicationId:applicationId
      },
       options = {
        url: "submissions/{submissionId}/applications/{applicationId}/additionalDetails",
        success: function(data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options, params);
    };
    let readAddOnCardHolderDetailsDeffered;
    const readAddOnCardHolderDetails = function(submissionId, applicationId, deferred) {
      const params = {
      submissionId:submissionId,
      applicationId:applicationId
      },
       options = {
        url: "submissions/{submissionId}/applications/{applicationId}/addOnCardHolders",
        success: function(data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options, params);
    };
    let readBalanceTransferDetailsDeffered;
    const readBalanceTransferDetails = function(submissionId, applicationId, deferred) {
        const params = {
      submissionId:submissionId,
      applicationId:applicationId
      },
       options = {
          url: "submissions/{submissionId}/applications/{applicationId}/balanceTransfer",
          success: function(data) {
            deferred.resolve(data);
          }
        };

        baseService.fetch(options, params);
      },
      fetchDocumentsByteArray = function(documentUrl, ownerId, deferred) {
        const params = {
            documentUrl: documentUrl,
            mediaType: "media",
            ownerId: ownerId
          },
          options = {
            url: "contents/{documentUrl}?alt={mediaType}&ownerId={ownerId}&transactionType=OR",
            success: function(data) {
              deferred.resolve(data);
            }
          };

        baseService.downloadFile(options, params);
      };
    let fetchAddressesDeferred;
    const fetchAddresses = function(applicantId, deferred) {
      const params = {
          applicantId: applicantId
        },
        options = {
          showMessage: false,
          url: "parties/{applicantId}/addresses",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

      baseService.fetch(options, params);
    };
    let fetchStatesDeferred;
    /**
     *MEthod to fetch states.
     */
    const fetchStates = function(country, deferred) {
      const params = {
          countryCode: country
        },
        options = {
          url: "enumerations/country/{countryCode}/state",
          success: function(data) {
            deferred.resolve(data);
          }
        };

      baseService.fetch(options, params);
    };
    let fetchBranchesDeferred;
    const fetchBranches = function(submissionId, deferred) {
      const params = {
          submissionId: submissionId
        },
        options = {
          url: "locations/branches",
          success: function(data) {
            deferred.resolve(data);
          }
        };

      baseService.fetch(options, params);
    };

    return {
      fetchApplicationForm: function(submissionId, applicationId) {
        applicationFormDeferred = $.Deferred();
        fetchApplicationForm(submissionId, applicationId, applicationFormDeferred);

        return applicationFormDeferred;
      },
      readPreferences: function(ubmissionId, applicationId) {
        readPreferencesDeffered = $.Deferred();
        readPreferences(ubmissionId, applicationId, readPreferencesDeffered);

        return readPreferencesDeffered;
      },
      readMembershipDetails: function(submissionId, applicationId) {
        readMembershipDetailsDeffered = $.Deferred();
        readMembershipDetails(submissionId, applicationId, readMembershipDetailsDeffered);

        return readMembershipDetailsDeffered;
      },
      readBalanceTransferDetails: function(submissionId, applicationId) {
        readBalanceTransferDetailsDeffered = $.Deferred();
        readBalanceTransferDetails(submissionId, applicationId, readBalanceTransferDetailsDeffered);

        return readBalanceTransferDetailsDeffered;
      },
      readAdditionalDetails: function(submissionId, applicationId) {
        readAdditionalDetailsDeffered = $.Deferred();
        readAdditionalDetails(submissionId, applicationId, readAdditionalDetailsDeffered);

        return readAdditionalDetailsDeffered;
      },
      readAddOnCardHolderDetails: function(submissionId, applicationId) {
        readAddOnCardHolderDetailsDeffered = $.Deferred();
        readAddOnCardHolderDetails(submissionId, applicationId, readAddOnCardHolderDetailsDeffered);

        return readAddOnCardHolderDetailsDeffered;
      },
      fetchDocumentsByteArray: function(documentUrl, ownerId) {
        fetchDocumentsByteArrayDeffered = $.Deferred();
        fetchDocumentsByteArray(documentUrl, ownerId, fetchDocumentsByteArrayDeffered);

        return fetchDocumentsByteArrayDeffered;
      },
      fetchAddresses: function(applicantId) {
        fetchAddressesDeferred = $.Deferred();
        fetchAddresses(applicantId, fetchAddressesDeferred);

        return fetchAddressesDeferred;
      },
      fetchBranches: function(country) {
        fetchBranchesDeferred = $.Deferred();
        fetchBranches(country, fetchBranchesDeferred);

        return fetchBranchesDeferred;
      },
      fetchStates: function(country) {
        fetchStatesDeferred = $.Deferred();
        fetchStates(country, fetchStatesDeferred);

        return fetchStatesDeferred;
      }
    };
  };

  return new ApplicationDetailsViewModel();
});