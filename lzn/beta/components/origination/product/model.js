define(["jquery", "baseService"], function($, BaseService) {
  "use strict";

  /**
   * This file contains the Tech Agnostic Service
   * consisting of all the REST services APIs for the product component.
   *
   * @namespace Product~service
   * @class ProductService
   */
  const ProductService = function() {
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
     * This function fires a GET request to fetch the product flow details
     * and delegates control to the successhandler along with response data
     * once the details are successfully fetched.
     *
     * @function fetchProductFlow
     * @memberOf ProductService
     * @param {string} productCode      - String indicating the product code of the product whose flow details are to be fetched.
     * @param {Function} successHandler - Function to be called once the flow details are successfully fetched.
     * @example ProductService.fetchProductFlow('productCode',handler);
     * @returns {void}
     */
    this.fetchProductFlow = function(productCode, successHandler) {
      const params = {
        productCode: productCode
        },options = {
        url: "origination/flows/{productCode}",
        success: function(data) {
          successHandler(data);
        }
      };

      baseService.fetchJSON(options, params);
    };

    const fetchAdditionalFlowDeferred = $.Deferred();

    this.fetchAdditionalFlow = function(coappJSON) {
      const params = {
        coappJSON: coappJSON
        },options = {
        url: "origination/flows/{coappJSON}",
        success: function(data) {
          fetchAdditionalFlowDeferred.resolve(data);
        }
      };

      baseService.fetchJSON(options, params);

      return fetchAdditionalFlowDeferred;
    };

    const fetchRequiredFlowcontentDeferred = $.Deferred();

    this.fetchRequiredFlowcontent = function() {
      const options = {
        url: "origination/flows/content",
        success: function(data) {
          fetchRequiredFlowcontentDeferred.resolve(data);
        }
      };

      baseService.fetchJSON(options);

      return fetchRequiredFlowcontentDeferred;
    };

    const fetchRequiredFlowcontentmainDeferred = $.Deferred();

    this.fetchRequiredFlowcontentmain = function() {
      const options = {
        url: "origination/flows/content-main",
        success: function(data) {
          fetchRequiredFlowcontentmainDeferred.resolve(data);
        }
      };

      baseService.fetchJSON(options);

      return fetchRequiredFlowcontentmainDeferred;
    };

    const fetchRequiredFlowTemplateDeferred = $.Deferred();

    this.fetchRequiredFlowTemplate = function() {
      const options = {
        url: "origination/flows/template",
        success: function(data) {
          fetchRequiredFlowTemplateDeferred.resolve(data);
        }
      };

      baseService.fetchJSON(options);

      return fetchRequiredFlowTemplateDeferred;
    };

    const fetchRequiredFlowDeferred = $.Deferred();

    this.fetchRequiredFlow = function() {
      const options = {
        url: "origination/flows/required-flow",
        success: function(data) {
          fetchRequiredFlowDeferred.resolve(data);
        }
      };

      baseService.fetchJSON(options);

      return fetchRequiredFlowDeferred;
    };

    const fetchProductSummaryDeferred = $.Deferred();

    this.fetchProductSummary = function(submissionId) {
      params = {
        submissionId: submissionId
      };

      const options = {
        url: "submissions/{submissionId}/summary",
        success: function(data) {
          fetchProductSummaryDeferred.resolve(data);
        }
      };

      baseService.fetch(options, params);

      return fetchProductSummaryDeferred;
    };

    const fetchUserTypeDeferred = $.Deferred();

    this.fetchUserType = function() {
      const options = {
        showMessage: false,
        url: "me",
        success: function(data) {
          fetchUserTypeDeferred.resolve(data);
        },
        error: function(data) {
          fetchUserTypeDeferred.reject(data);
        }
      };

      baseService.fetch(options);

      return fetchUserTypeDeferred;
    };

    const fetchApplicationInfoDeferred = $.Deferred();

    this.fetchApplicationInfo = function(paylod) {
      const options = {
        url: "applications/coApplicant/prospect",
        data: paylod,
        success: function(data) {
          fetchApplicationInfoDeferred.resolve(data);
        }
      };

      baseService.update(options);

      return fetchApplicationInfoDeferred;
    };

    this.fetchAssociatedOfferDetails = function(submissionId, productGroupSerialNumber, successHandler) {
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

    this.fetchOfferDetails = function(offerId, productType, successHandler) {
      const params = {
          offerId: offerId,
          productType: productType
        },
        options = {
          url: "offers/{offerId}?productType={productType}",
          success: function(data) {
            successHandler(data);
          }
        };

      baseService.fetch(options, params);
    };

    const fetchAdditionalOfferDetailsDeferred = $.Deferred();

    this.fetchAdditionalOfferDetails = function(offerId, productClassName) {
      const params = {
          offerId: offerId,
          productClassName: productClassName
        },
        options = {
          url: "offers/{offerId}?productType={productClassName}",
          success: function(data) {
            fetchAdditionalOfferDetailsDeferred.resolve(data);
          },
          error: function(data) {
            fetchAdditionalOfferDetailsDeferred.reject(data);
          }
        };

      baseService.fetch(options, params);

      return fetchAdditionalOfferDetailsDeferred;
    };
  };

  return new ProductService();
});