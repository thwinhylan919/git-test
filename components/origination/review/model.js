define(["jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  /**
   * Tech Agnostic Service instance for Primary Info component.
   *
   * @namespace Review.service
   * @class ReviewService
   * @extends BaseService {@link BaseService}
   */
  /**
   * Let ReviewService - description.
   *
   * @return {type}  Description.
   */
  const ReviewService = function() {
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
     * @param {String} submissionId submission id against which application is to be submitted
     * @param {Function} successHandler function to be called as a callback on success
     * @example
     *      ReviewService.submitApplication(submissionId, handler);
     */
    /**
     * This - description.
     *
     * @param  {type} submissionId   - - - - - - - - - - - - - - - Description.
     * @param  {type} successHandler Description.
     * @param  {type} errorHandler   Description.
     * @return {type}                Description.
     */
    this.submitApplication = function(submissionId, successHandler, errorHandler) {
      params = {
        submissionId: submissionId
      };

      const options = {
        url: "submissions/{submissionId}",
        success: function(data) {
          successHandler(data);
        },
        error: function(data) {
          errorHandler(data);
        }
      };

      baseService.update(options, params);
    };

    const downloadDocumentDeferred = $.Deferred();

    /**
     * Private method to download the file from server.
     * This method will only be called if submissionId is present, and will resolve a
     * passed deferred object, which can be returned from calling function to the parent.
     *
     * @function downloadDocument
     * @memberOf DocumentUploadModel
     * @param {String} contentId - document reference id
     * @param {String} ownerId - applicant id of owner
     * @param {Object} deferred - An object type Deferred
     * @returns {void}
     * @private
     */
    /**
     * This - description.
     *
     * @param  {type} contentId   - - - - - - - - - - - - - - - - Description.
     * @param  {type} applicantId Description.
     * @return {type}             Description.
     */
    this.downloadDocument = function(contentId, applicantId) {
      const params = {
          contentId: contentId,
          mediaType: "media",
          ownerId: applicantId
        },
        options = {
          url: "contents/{contentId}?alt={mediaType}&ownerId={ownerId}&transactionType=OR",
          success: function(data) {
            downloadDocumentDeferred.resolve(data);
          }
        };

      baseService.downloadFile(options, params);

      return downloadDocumentDeferred;
    };

    /**
     * This - description.
     *
     * @param  {type} submissionId - - - - - - - - - - - - - - - - Description.
     * @param  {type} deferred     Description.
     * @return {type}              Description.
     */
    this.fetchRegistrationRequired = function(submissionId, deferred) {
      params = {
        submissionId: submissionId
      };

      const options = {
        url: "submissions/{submissionId}/registrationValidation",
        success: function(data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options, params);

      return deferred;
    };

    /**
     * This - description.
     *
     * @param  {type} ownerId     - - - - - - - - - - - - - - - - Description.
     * @param  {type} contentId   Description.
     * @return {type}             Description.
     */
    this.fetchDocumentsByteArray = function(ownerId, contentId) {
      params = {
        documentUrl: contentId.value,
        mediaType: "media",
        ownerId: ownerId
      };

      const options = {
        url: "contents/{documentUrl}?alt={mediaType}&ownerId={ownerId}"
      };

      baseService.downloadFile(options, params);
    };

    /**
     * Private method to get the detailed list of uploaded documents.
     * This method will only be called if submissionId is present, and will resolve a
     * passed deferred object, which can be returned from calling function to the parent.
     *
     * @function fetchUploadedDocuments
     * @memberOf DocumentUploadModel
     * @param {String} submissionId - Submission id of the application
     * @param {Object} deferred - An object type Deferred
     * @returns {void}
     * @private
     */
    /**
     * This - description.
     *
     * @param  {type} submissionId - - - - - - - - - - - - - - - - Description.
     * @param  {type} deferred     Description.
     * @return {type}              Description.
     */
    this.fetchUploadedDocuments = function(submissionId, deferred) {
      const params = {
          submissionId: submissionId
        },
        options = {
          url: "submissions/{submissionId}/documents",
          success: function(data) {
            deferred.resolve(data);
          }
        };

      baseService.fetch(options, params);

      return deferred;
    };

    /**
     * This - description.
     *
     * @param  {type} submissionId   - - - - - - - - - - - - - - - - Description.
     * @param  {type} successHandler Description.
     * @return {type}                Description.
     */
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

    /**
     * This - description.
     *
     * @param  {type} submissionId   - - - - - - - - - - - - - - - Description.
     * @param  {type} applicactionId Description.
     * @param  {type} successHandler Description.
     * @return {type}                Description.
     */
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

    /**
     * This - description.
     *
     * @param  {type} submissionId             - - - - - - - - - - - - - - - Description.
     * @param  {type} productGroupSerialNumber Description.
     * @param  {type} successHandler           Description.
     * @return {type}                          Description.
     */
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

  return new ReviewService();
});
