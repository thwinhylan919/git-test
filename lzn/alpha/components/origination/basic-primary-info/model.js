define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  return function BasicPrimaryInfoModel() {
    const Model = function(model) {
      this.primaryInfo = {
        salutation: model && model.salutation ? model.salutation : "",
        firstName: model && model.firstName ? model.firstName : "",
        middleName: model && model.middleName ? model.middleName : null,
        lastName: model && model.lastName ? model.lastName : "",
        suffix: model && model.suffix ? model.suffix : "",
        birthDate: model && model.birthDate ? model.birthDate : "",
        gender: model && model.gender ? model.gender : "",
        maritalStatus: model && model.maritalStatus ? model.maritalStatus : "",
        noOfDependants: model && model.noOfDependants ? model.noOfDependants : "",
        citizenship: model && model.citizenship ? model.citizenship : "",
        otherSalutation: model && model.otherSalutation ? model.otherSalutation : "",
        permanentResidence: model && model.permanentResidence ? model.permanentResidence : true,
        residentCountry: model && model.residentCountry ? model.residentCountry : "",
        email: model && model.email ? model.email : ""
      };

      this.registrationInfo = {
        securityQuestion: "",
        securityAnswer: ""
      };

      this.isCompleting = true;
      this.adConsent = false;

      this.selectedValues = {
        salutation: "",
        gender: "",
        maritalStatus: "",
        citizenship: "",
        residentCountry: ""
      };

      this.disableInputs = false;
    };
    let modelInitialized = false;
    const baseService = BaseService.getInstance();
    /* variable to make sure that in case there is no change
     * in model no additional fetch requests are fired.*/
    let submissionId, applicantId,
      /**
       * Private method to fetch enumerations for listed salutations. This
       * method will resolve a passed deferred object, which can be returned from calling
       * function to the parent.
       *
       * @function fetchSalutations
       * @memberOf BasicPrimaryInfoModel
       * @private
       */
      fetchSalutationsDeferred;
    const fetchSalutations = function(deferred) {
      const options = {
        url: "enumerations/salutation?for=primary",
        success: function(data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options);
    };
    /**
     * Private method to fetch enumerations for listed marital statuses. This
     * method will resolve a passed deferred object, which can be returned from calling
     * function to the parent.
     *
     * @function fetchOtherSalutations
     * @memberOf BasicPrimaryInfoModel
     * @private
     */
    let fetchOtherSalutationsDeferred;
    const fetchOtherSalutations = function(deferred) {
      const options = {
        url: "enumerations/salutation?for=others",
        success: function(data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options);
    };
    let readApplicantDeferred;
    const readApplicant = function(deferred) {
      const params = {
          submissionId: submissionId
        },
        options = {
          url: "submissions/{submissionId}/applicants",
          success: function(data) {
            deferred.resolve(data);
          }
        };

      baseService.fetch(options, params);
    };
    let updateApplicantDeferred;
    const updateApplicant = function(model, deferred) {
      const params = {
          submissionId: submissionId,
          applicantId: applicantId
        },
        options = {
          url: "submissions/{submissionId}/applicants",
          data: model,
          success: function(data) {
            deferred.resolve(data);
          }
        },
        modelData = JSON.parse(model);

      if (modelData && modelData.applicantId && modelData.applicantId.length > 0) {
        options.url = "submissions/{submissionId}/applicants/{applicantId}";
        params.applicantId = modelData.applicantId;
        baseService.update(options, params);
      } else {
        baseService.add(options, params);
      }
    };

    return {
      init: function(subId, applId) {
        submissionId = subId || undefined;
        applicantId = applId || undefined;
        modelInitialized = true;

        return modelInitialized;
      },
      getNewModel: function(modelData) {
        return new Model(modelData);
      },
      /**
       * Public method to save passed primary info model, and create record for an applicant
       * in our application. This method will instantiate a new deferred object and will
       * return the same to the callee function which will be resolved after call completion
       * with appropriate data and developer can use .then(handler) to handle the data.
       *
       * @function readApplicant
       * @memberOf PrimaryInfoModel
       * @returns {Object} DeferredObject.
       * @example
       * PrimaryInfoModel.createApplicant(applicantModel).then(function (data) {
       *
       * });
       */
      readApplicant: function() {
        readApplicantDeferred = $.Deferred();
        readApplicant(readApplicantDeferred);

        return readApplicantDeferred;
      },
      updateApplicant: function(model) {
        updateApplicantDeferred = $.Deferred();
        updateApplicant(model, updateApplicantDeferred);

        return updateApplicantDeferred;
      },
      /**
       * Public method to fetch enumeration for salutations. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       *
       * @function getSalutations
       * @memberOf PrimaryInfoModel
       * @returns {Object} DeferredObject.
       * @example
       * PrimaryInfoModel.getSalutations().then(function (data) {
       *
       * });
       */
      getSalutations: function() {
        fetchSalutationsDeferred = $.Deferred();
        fetchSalutations(fetchSalutationsDeferred);

        return fetchSalutationsDeferred;
      },
      /**
       * Public method to fetch enumeration for salutations. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       *
       * @function getOtherSalutations
       * @memberOf PrimaryInfoModel
       * @returns {Object} DeferredObject.
       * @example
       * PrimaryInfoModel.getSalutations().then(function (data) {
       *
       * });
       */
      getOtherSalutations: function() {
        fetchOtherSalutationsDeferred = $.Deferred();
        fetchOtherSalutations(fetchOtherSalutationsDeferred);

        return fetchOtherSalutationsDeferred;
      }
    };
  };
});