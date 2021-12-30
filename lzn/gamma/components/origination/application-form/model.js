define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const ApplicationFormModel = function() {
    const baseService = BaseService.getInstance(),
      PrimaryInfoModel = function() {
        this.primaryInfo = {
          salutation: " ",
          firstName: "",
          lastName: "",
          birthDate: "",
          noOfDependants: "0",
          citizenship: " ",
          email: "",
          otherSalutation: " "
        };

        this.contact = {
          contactType: "PEM",
          email: ""
        };

        this.registrationInfo = {
          securityQuestion: null,
          securityAnswer: null
        };
      };

    this.functionalAttributesToAdd = function() {
      this.isCompleting = true;
      this.adConsent = false;

      this.selectedValues = {
        salutation: ""
      };

      this.disableInputs = false;
    };

    this.getNewPrimaryInfoModel = function() {
      return new PrimaryInfoModel();
    };

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
            applicantType: "IND"
          }),
          success: function(data) {
            successHandler(data);
          }
        };

      baseService.add(options, params);
    };

    this.validateLoan = function(submissionId, payload) {
      const validateLoanDeferred = $.Deferred(),
        params = {
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

    this.createLoan = function(submissionId, payload, successHandler) {
      const params = {
          submissionId: submissionId
        },
        options = {
          url: "submissions/{submissionId}/loanApplications",
          data: JSON.stringify(payload),
          success: function(data) {
            successHandler(data);
          }
        };

      baseService.add(options, params);
    };

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

    this.fetchDetailsFromExternalRefNo = function(externalRefNo, successHandler) {
      const params = {
          externalRefNumber: externalRefNo
        },
        options = {
          url: "externalRefNumber/{externalRefNumber}",
          success: function(data) {
            successHandler(data);
          }
        };

      baseService.fetch(options, params);
    };

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

  return new ApplicationFormModel();
});