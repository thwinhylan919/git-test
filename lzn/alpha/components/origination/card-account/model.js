define([
    "baseService"
], function(BaseService) {
  "use strict";

  const CardAccountModel = function() {
    const baseService = BaseService.getInstance(),
      CardModel = function() {
        this.cardDelMode = "";
        this.cardDelBranch = "";
        this.pinDelMode = "";
        this.pinDelBranch = "";
        this.stmtDelMode = "";

        /**
        Add permanent address to these fields
        */
        this.address = {
          country: "",
          state: "",
          city: "",
          postalCode: "",
          line1: "",
          line2: ""
        };

        this.selectedValues = {
          cardDelBranch: "",
          pinDelBranch: ""
        };
      };

    this.getNewModel = function() {
      return new CardModel();
    };

    /*
     * Rest call to fetch all addresses for provided applicantId
     */
    this.getAddress = function(successHandler, submissionId, applicantId) {
      const params = {
          submissionId: submissionId,
          applicantId: applicantId
        },
        options = {
          url: "submissions/{submissionId}/applicants/{applicantId}/addresses",
          success: function(data) {
            successHandler(data);
          }
        };

      baseService.fetch(options, params);
    };

    /**
     * Get in-draft account details.
     *
     * @param {Function} successHandler - SuccessHandler to be invoked.
     * @param {Object} submissionId - Submission Id.
     * @param {Object} facilityId - Facility Id.
     * @returns {void}
     */
    this.getAccountDetails = function(successHandler, submissionId, facilityId) {
      const params = {
          submissionId: submissionId,
          facilityId: facilityId
        },
        options = {
          url: "submissions/{submissionId}/creditCardApplications/supplementaryCard?offerId={offerId}&facilityId={facilityId}&simulationId={simulationId}",
          success: function(data) {
            successHandler(data);
          }
        };

      baseService.fetch(options, params);
    };

    /**
     * REST call to create Credit card account.
     *
     * @param {Function} successHandler - SuccessHandler to be invoked.
     * @param {Object} submissionId - Submission Id.
     * @param {Object} senddata - Data to be sent to service.
     * @returns {void}
     */
    this.createCardAccount = function(successHandler, submissionId, senddata) {
      const params = {
          submissionId: submissionId
        },
        options = {
          url: "submissions/{submissionId}/creditCardApplications/account",
          data: JSON.stringify(senddata),
          success: function(data) {
            successHandler(data);
          }
        };

      baseService.add(options, params);
    };

    /**
     * Fetch branches from the host for card and Pin delivery preferences.
     *
     * @param {string} successHandler - Success Handler.
     * @param {Object} submissionId - Subbmission id for application.
     * @returns {void}
     */
    this.fetchBranches = function(successHandler, submissionId) {
      const params = {
          submissionId: submissionId
        },
        options = {
          url: "locations/branches",
          success: function(data) {
            successHandler(data);
          }
        };

      baseService.fetch(options, params);
    };
  };

  return new CardAccountModel();
});