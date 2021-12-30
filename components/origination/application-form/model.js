define([
  "baseService"
], function(BaseService) {
  "use strict";

  /**
   * <b>ApplicationFormService: </b> file containing service definitions for application form information section.
   * This file is written in JavaScript and jQuery and is independent of any other framework, this <b>Tech Agnostic
   * design makes service a resuable-injectable module, which can be used with any framework</b>.<br/><br/>
   * In order to make sure that all the available service calls are following the necessary protocols.<br/><br/>
   * Necessary service calls and utility functions for mentioned component/model includes:
   * <ul>
   *      <li>[fetchpplicantList()]{@link ApplicationFormService.fetchpplicantList}</li>
   * </ul>.
   *
   * @namespace  ApplicationForm~ApplicationFormService
   * @constructor ApplicationFormService
   * @property {Object}   log - Logger reference
   * @property {Object}   baseService - The BaseService object
   * @property {boolean}  devMode - Whether in dev mode
   * @property {string}   baseUrl - URL string
   */
  const ApplicationFormService = function() {
    /* Extending predefined baseService to get ajax functions. */
    const baseService = BaseService.getInstance();

    /**
     * Method to fetch the list of applicants against a particular applicant id.
     *
     * @param  {type} submissionId   - - - - - - - - - - - - - - - - Description.
     * @param  {type} successHandler Description.
     * @return {type}                Description.
     */
    this.fetchpplicantList = function(submissionId, successHandler) {
      const params = {
        submissionId:submissionId
      },
      options = {
        url: "submissions/{submissionId}/applicants",
        success: function(data) {
          successHandler(data);
        }
      };

      baseService.fetch(options, params);
    };

    /**
     * This - description.
     *
     * @param  {type} successHandler - - - - - - - - - - - - - - - - Description.
     * @param  {type} errorHandler   Description.
     * @return {type}                Description.
     */
    this.fetchUserType = function(successHandler, errorHandler) {
      const options = {
        showMessage: false,
        url: "me",
        success: function(data) {
          successHandler(data);
        },
        error: function(data) {
          errorHandler(data);
        }
      };

      baseService.fetch(options);
    };

    /**
     * This - description.
     *
     * @param  {type} submissionId             - - - - - - - - - - - - - - Description.
     * @param  {type} facilityId               Description.
     * @param  {type} productGroupSerialNumber Description.
     * @param  {type} successHandler           Description.
     * @return {type}                          Description.
     */
    this.createApplicant = function(submissionId, facilityId, productGroupSerialNumber, successHandler) {
      const params = {
          submissionId: submissionId
        },
        options = {
          url: "submissions/{submissionId}/applicants",
          data: JSON.stringify({
            facilityId: facilityId,
            productGroupSerialNumber: productGroupSerialNumber,
            applicantRelationshipType: "APPLICANT",
            partyType: "IND"
          }),
          success: function(data) {
            successHandler(data);
          }
        };

      baseService.add(options, params);
    };

    /**
     * This - description.
     *
     * @param  {type} submissionId - - - - - - - - - - - - - - Description.
     * @param  {type} url          Description.
     * @param  {type} payload      Description.
     * @param  {type} deferred     Description.
     * @return {type}              Description.
     */
    this.validateLoan = function(submissionId, url, payload, deferred) {
      const params = {
          submissionId: submissionId
        },
        options = {
          url: url,
          data: JSON.stringify(payload),
          success: function(data) {
            deferred.resolve(data);
          }
        };

      baseService.update(options, params);

      return deferred;
    };

    /**
     * This - description.
     *
     * @param  {type} submissionId            - - - - - - - - - - - - - - Description.
     * @param  {type} applicantId             Description.
     * @param  {type} validateEmploymentIndex Description.
     * @param  {type} successHandler          Description.
     * @return {type}                         Description.
     */
    this.validateEmployment = function(submissionId, applicantId, validateEmploymentIndex, successHandler) {
      const params = {
          submissionId: submissionId,
          applicantId: applicantId
        },
        options = {
          url: "submissions/{submissionId}/applicants/{applicantId}/employments/validateEmployments",
          success: function(data) {
            successHandler(data, validateEmploymentIndex);
          }
        };

      baseService.fetch(options, params);
    };

    /**
     * This - description.
     *
     * @param  {type} submissionId   - - - - - - - - - - - - - - - Description.
     * @param  {type} applicantId    Description.
     * @param  {type} successHandler Description.
     * @return {type}                Description.
     */
    this.fetchOccupationDetails = function(submissionId, applicantId, successHandler) {
      const params = {
          submissionId: submissionId,
          applicantId: applicantId
        },
        options = {
          url: "submissions/{submissionId}/applicants/{applicantId}/employments",
          success: function(data) {
            successHandler(data);
          }
        };

      baseService.fetch(options, params);
    };
  };

  return new ApplicationFormService();
});
