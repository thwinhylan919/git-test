/*jslint plusplus: true newcap: false*/
define([
  "baseService"
], function(BaseService) {
  "use strict";

  /**
   * Tech Agnostic Service instance for Primary Info component.
   *
   * @namespace Review.service
   * @class ReviewService
   */
  return function ReviewService() {
    /**
     * baseService instance through which all the rest calls will be made.
     *
     * @attribute baseService
     * @type {Object} BaseService Instance
     * @private
     */
    let params;
    const baseService = BaseService.getInstance();

    /**
     * Method to submit application, this method will be called when user clicks
     * on final submit button after reviewing the entire application in review
     * screen.
     *
     * @function submitApplication
     * @memberOf ReviewService
     * @param {string} submissionId - Submission id against which application is to be submitted.
     * @param {Function} successHandler - Function to be called as a callback on success.
     * @example
     *      ReviewService.submitApplication(submissionId, handler);
     * @returns {void}
     */
    this.submitApplication = function(submissionId, successHandler) {
      params = {
        submissionId: submissionId
      };

      const options = {
        url: "submissions/{submissionId}",
        success: function(data) {
          successHandler(data);
        }
      };

      baseService.update(options, params);
    };

    this.fetchDocumentsByteArray = function(documentUrl, applicantId) {
      params = {
        documentUrl: documentUrl,
        mediaType: "media",
        ownerId: applicantId
      };

      const options = {
        url: "contents/{documentUrl}?alt={mediaType}&ownerId={ownerId}&transactionType=OR"
      };

      baseService.downloadFile(options, params);
    };

    this.fetchRegistrationRequired = function(submissionId, successHandler) {
      params = {
        submissionId: submissionId
      };

      const options = {
        url: "submissions/{submissionId}/registrationValidation",
        success: function(data) {
          successHandler(data);
        }
      };

      baseService.fetch(options, params);
    };

    this.fetchCountryList = function(successHandler) {
      const options = {
        url: "enumerations/country",
        success: function(data) {
          successHandler(data);
        }
      };

      baseService.fetch(options, params);
    };

    this.fetchStates = function(country, successHandler) {
      params = {
        country: country
      };

      const options = {
        url: "enumerations/country/{country}/state",
        success: function(data) {
          successHandler(data);
        }
      };

      baseService.fetch(options, params);
    };

    this.getApplications = function(submissionId, successHandler) {
      params = {
        submissionId: submissionId
      };

      const options = {
        url: "submissions/{submissionId}/applications",
        success: function(data) {
          successHandler(data);
        }
      };

      baseService.fetch(options, params);
    };

    this.getAccountId = function(submissionId, applicactionId, successHandler) {
      params = {
        submissionId: submissionId,
        applicactionId: applicactionId
      };

      const options = {
        url: "submissions/{submissionId}/applications/{applicactionId}/summary",
        success: function(data) {
          successHandler(data);
        }
      };

      baseService.fetch(options, params);
    };

    this.getSelectedOffer = function(submissionId, productGroupSerialNumber, successHandler) {
      const params = {
          submissionId: submissionId,
          productGroupSerialNumber: productGroupSerialNumber
        },
        options = {
          url: "submissions/{submissionId}/products/{productGroupSerialNumber}/selectedOffer",
          success: function(data) {
            successHandler(data);
          }
        };

      baseService.fetch(options, params);
    };
  };
});