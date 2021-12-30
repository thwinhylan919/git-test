define(["baseService", "jquery"], function(BaseService, $) {
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
     * @returns {void}
     * @example ProductService.fetchProductFlow('productCode',handler);
     */
    this.fetchProductFlow = function(productCode, successHandler) {
      const params = {
       productCode:productCode
     },
       options = {
        url: "origination/flows/{productCode}",
        success: function(data) {
          successHandler(data);
        }
      };

      baseService.fetchJSON(options,params);
    };

    const fetchAdditionalFlowDeferred = $.Deferred();

    this.fetchAdditionalFlow = function(coappJSON) {
      const params = {
        coappJSON:coappJSON
      },
      options = {
        url: "origination/flows/{coappJSON}",
        success: function(data) {
          fetchAdditionalFlowDeferred.resolve(data);
        }
      };

      baseService.fetchJSON(options, params);

      return fetchAdditionalFlowDeferred;
    };

    const fetchSubmissionListDeferred = $.Deferred();

    this.fetchSubmissionList = function() {
      const options = {
        url: "submissions",
        success: function(data) {
          fetchSubmissionListDeferred.resolve(data);
        }
      };

      baseService.fetch(options);

      return fetchSubmissionListDeferred;
    };

    const createSubmissionDeferred = $.Deferred();

    this.createSubmission = function(payload) {
      const options = {
        url: "submissions/",
        showMessage: false,
        data: JSON.stringify(payload),
        success: function(data) {
          createSubmissionDeferred.resolve(data);
        },
        error: function(data) {
          createSubmissionDeferred.reject(data);
        }
      };

      baseService.add(options);

      return createSubmissionDeferred;
    };

    const createApplicantDeferred = $.Deferred();

    this.createApplicant = function(submissionId, payload) {
      const params = {
          submissionId: submissionId
        },
        options = {
          url: "submissions/{submissionId}/applicants",
          data: JSON.stringify(payload),
          success: function(data) {
            createApplicantDeferred.resolve(data);
          },
          error: function(data) {
            createApplicantDeferred.reject(data);
          }
        };

      baseService.add(options, params);

      return createApplicantDeferred;
    };

    const getDealerVehicleDetailsDeferred = $.Deferred();

    this.getDealerVehicleDetails = function(transactionId) {
      const params = {
          transactionId: transactionId
        },
        options = {
          url: "loanItems/{transactionId}",
          success: function(data) {
            getDealerVehicleDetailsDeferred.resolve(data);
          },
          error: function(data) {
            getDealerVehicleDetailsDeferred.reject(data);
          }
        };

      baseService.fetch(options, params);

      return getDealerVehicleDetailsDeferred;
    };

    const deleteDealerVehicleDetailsDeferred = $.Deferred();

    this.deleteDealerVehicleDetails = function(transactionId) {
      const params = {
          transactionId: transactionId
        },
        options = {
          url: "loanItems/{transactionId}",
          success: function(data) {
            deleteDealerVehicleDetailsDeferred.resolve(data);
          },
          error: function(data) {
            deleteDealerVehicleDetailsDeferred.reject(data);
          }
        };

      baseService.remove(options, params);

      return deleteDealerVehicleDetailsDeferred;
    };

    const submitRequirementsDeferred = $.Deferred();

    this.submitRequirements = function(submissionId, requirements) {
      params = {
        submissionId: submissionId
      };

      const options = {
        url: "submissions/{submissionId}/loanApplications",
        data: requirements,
        success: function(data) {
          submitRequirementsDeferred.resolve(data);
        },
        error: function(data) {
          submitRequirementsDeferred.reject(data);
        }
      };

      baseService.add(options, params);

      return submitRequirementsDeferred;
    };

    const validateLoanDeferred = $.Deferred();

    this.validateLoan = function(submissionId, payload) {
      const params = {
          submissionId: submissionId
        },
        options = {
          url: "submissions/{submissionId}/loanApplications/validation",
          data: JSON.stringify(payload),
          success: function(data) {
            validateLoanDeferred.resolve(data);
          }
        };

      baseService.update(options, params);

      return validateLoanDeferred;
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

    const fetchRequiredFlowPagesDeferred = $.Deferred();

    this.fetchRequiredFlowPages = function() {
      const options = {
        url: "origination/flows/pages",
        success: function(data) {
          fetchRequiredFlowPagesDeferred.resolve(data);
        }
      };

      baseService.fetchJSON(options);

      return fetchRequiredFlowPagesDeferred;
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

    const fetchRequiredWorkflowDeferred = $.Deferred();

    this.fetchRequiredWorkflow = function(productClass, productSubClass) {
      const params = {
          productClass: productClass,
          productSubClass: productSubClass
        },
        options = {
          url: "workflows?productClass={productClass}&productSubClass={productSubClass}&status=active",
          success: function(data) {
            fetchRequiredWorkflowDeferred.resolve(data);
          }
        };

      baseService.fetch(options, params);

      return fetchRequiredWorkflowDeferred;
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

    const fetchApplicantsDeferred = $.Deferred();

    this.fetchApplicants = function(submissionId) {
      const params = {
        submissionId:submissionId
      },
      options = {
        url: "submissions/{submissionId}/applicants",
        success: function(data) {
          fetchApplicantsDeferred.resolve(data);
        }
      };

      baseService.fetch(options, params);

      return fetchApplicantsDeferred;
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
  };

  return new ProductService();
});
