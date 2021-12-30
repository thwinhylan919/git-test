define(["baseService"], function(BaseService) {
  "use strict";

  /**
   * This file contains the Tech Agnostic Service
   * consisting of all the REST services APIs for the product component.
   *
   * @namespace Product~service
   * @class ProductService
   * @extends BaseService {@link BaseService}
   */
  /**
   * Let ProductService - description.
   *
   * @return {type}  Description.
   */
  const ProductService = function() {
    /**
     * baseService instance through which all the rest calls will be made.
     *
     * @attribute baseService
     * @type {Object} BaseService Instance
     * @private
     */
    const baseService = BaseService.getInstance();

    /**
     * This - description.
     *
     * @return {type}  Description.
     */
    this.fetchSubmissionList = function() {
      const options = {
        url: "submissions"
      };

      return baseService.fetch(options);
    };

    /**
     * This - description.
     *
     * @param  {type} productGroupId - Description.
     * @return {type}                Description.
     */
    this.listOffers = function(productGroupId) {
      const params = {
          productGroupId: productGroupId
        },
        options = {
          url: "productGroups/{productGroupId}/offers"
        };

      return baseService.fetch(options, params);
    };

    /**
     * This - description.
     *
     * @param  {type} offerId     - - - - - - - - - - - - - - - - Description.
     * @param  {type} productType Description.
     * @return {type}             Description.
     */
    this.fetchOffersAdditionalDetails = function(offerId, productType) {
      const params = {
          offerId: offerId,
          productType: productType
        },
        options = {
          url: "offers/{offerId}?productType={productType}"
        };

      return baseService.fetch(options, params);
    };

    /**
     * GetMe - function to fire me GET request.
     *
     * @return {Void} Description.
     */
    this.getMe = function () {
      const options = {
        url: "me",
        nonceRequired: true,
        showMessage: false
      };

      return baseService.fetch(options);
    };

    /**
     * This - description.
     *
     * @param  {type} payload - Description.
     * @return {type}         Description.
     */
    this.createSubmission = function(payload, entity) {
      const options = {
        url: "submissions/",
        showMessage: false,
        data: JSON.stringify(payload),
        headers: {
          "x-noncecount": 25,
          "x-target-unit": entity
        }
      };

      return baseService.add(options);
    };

    /**
     * This - description.
     *
     * @param  {type} submissionId - - - - - - - - - - - - - - - - Description.
     * @param  {type} payload      Description.
     * @return {type}              Description.
     */
    this.createApplicant = function(submissionId, payload) {
      const params = {
          submissionId: submissionId
        },
        options = {
          url: "submissions/{submissionId}/applicants",
          data: JSON.stringify(payload)
        };

      return baseService.add(options, params);
    };

    /**
     * This - description.
     *
     * @param  {type} transactionId - Description.
     * @return {type}               Description.
     */
    this.getDealerVehicleDetails = function(transactionId) {
      const params = {
          transactionId: transactionId
        },
        options = {
          url: "loanItems/{transactionId}"
        };

      return baseService.fetch(options, params);
    };

    /**
     * This - description.
     *
     * @param  {type} transactionId - Description.
     * @return {type}               Description.
     */
    this.deleteDealerVehicleDetails = function(transactionId) {
      const params = {
          transactionId: transactionId
        },
        options = {
          url: "loanItems/{transactionId}"
        };

      return baseService.remove(options, params);
    };

    /**
     * This - description.
     *
     * @param  {type} submissionId - - - - - - - - - - - - - - - - Description.
     * @param  {type} requirements Description.
     * @return {type}              Description.
     */
    this.submitRequirements = function(submissionId, requirements) {
      const params = {
        submissionId: submissionId
      },

       options = {
        url: "submissions/{submissionId}/loanApplications",
        data: requirements,
        showMessage: false
      };

      return baseService.add(options, params);
    };

    /**
     * This - description.
     *
     * @param  {type} submissionId - - - - - - - - - - - - - - - - Description.
     * @param  {type} payload      Description.
     * @return {type}              Description.
     */
    this.validateLoan = function(submissionId, payload) {
      const params = {
          submissionId: submissionId
        },
        options = {
          url: "submissions/{submissionId}/loanApplications/validation",
          data: JSON.stringify(payload)
        };

      return baseService.update(options, params);
    };

    /**
     * This - description.
     *
     * @param  {type} productClass    - - - - - - - - - - - - - - - - Description.
     * @param  {type} productSubClass Description.
     * @return {type}                 Description.
     */
    this.fetchRequiredWorkflow = function(productClass, productSubClass) {
      const params = {
          productClass: productClass,
          productSubClass: productSubClass
        },
        options = {
          url: "workflows?productClass={productClass}&productSubClass={productSubClass}&status=active"
        };

      return baseService.fetch(options, params);
    };

    /**
     * This - description.
     *
     * @param  {type} submissionId - Description.
     * @return {type}              Description.
     */
    this.fetchProductSummary = function(submissionId) {
      const params = {
        submissionId: submissionId
      },

       options = {
        url: "submissions/{submissionId}/summary"
      };

      return baseService.fetch(options, params);
    };

    /**
     * This - description.
     *
     * @return {type}  Description.
     */
    this.fetchUserType = function() {
      const options = {
        showMessage: false,
        url: "me"
      };

      return baseService.fetch(options);
    };

    /**
     * This - description.
     *
     * @param  {type} paylod - Description.
     * @return {type}        Description.
     */
    this.fetchApplicationInfo = function(payload) {
      const options = {
        url: "applications/coApplicant/prospect",
        data: payload
      };

      return baseService.update(options);
    };

    /**
     * This - description.
     *
     * @param  {type} submissionId - Description.
     * @return {type}              Description.
     */
    this.fetchApplicants = function(submissionId) {
      const params={
        submissionId:submissionId
      },
      options = {
        url: "submissions/{submissionId}/applicants"
      };

      return baseService.fetch(options, params);
    };

    /**
     * This - description.
     *
     * @param  {type} partyId - Description.
     * @return {type}         Description.
     */
    this.fetchPartyDetails = function(partyId) {
      const options = {
        url: "parties/" + partyId,
        showMessage: false
      };

      return baseService.fetch(options);
    };

    /**
     * This - description.
     *
     * @param  {type} offerId        - - - - - - - - - - - - - - - Description.
     * @param  {type} productType    Description.
     * @return {type}                Description.
     */
    this.fetchOfferDetails = function(offerId, productType) {
      const params = {
          offerId: offerId,
          productType: productType
        },
        options = {
          url: "offers/{offerId}?productType={productType}"
        };

      return baseService.fetch(options, params);
    };
  };

  return new ProductService();
});
