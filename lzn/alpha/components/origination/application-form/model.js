define([
    "baseService"
], function(BaseService) {
  "use strict";

  const ApplicationFormModel = function() {
    const baseService = BaseService.getInstance(),
      PrimaryInfoModel = function() {
        this.primaryInfo = {
          salutation: " ",
          firstName: "",
          lastName: "",
          birthDate: "",
          gender: null,
          maritalStatus: null,
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
      },
      PostAccConfigReq = function() {
        this.postAccConfigReq = {
          productGroupSerialNumber: "",
          offerId: "",
          simulationId: null,
          offerCurrency: "",
          termDepositApplicationRequirementDTO: {
            requestedAmount: {
              currency: "",
              amount: ""
            },
            requestedTenure: {
              days: "",
              months: "",
              years: ""
            },
            frequency: "",
            noOfCoApplicants: ""
          }
        };
      };

    this.functionalAttributesToAdd = function() {
      this.isCompleting = true;
      this.adConsent = false;

      this.selectedValues = {
        salutation: "",
        gender: "",
        maritalStatus: ""
      };

      this.disableInputs = false;
    };

    this.getNewPrimaryInfoModel = function() {
      return new PrimaryInfoModel();
    };

    this.getNewPostAccConfigReq = function() {
      return new PostAccConfigReq();
    };

    this.fetchpplicantList = function(submissionId, successHandler) {
      const options = {
        url: "submissions/{submissionId}/applicants",
        success: function(data) {
          successHandler(data);
        }
      },
      params = {
        submissionId: submissionId
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
            partyType: "IND"
          }),
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

    this.getAccConfig = function(submissionId, applicantId, successHandler) {
      const params = {
          submissionId: submissionId,
          applicantId: applicantId
        },
        options = {
          url: "submissions/{submissionId}/applicants/{applicantId}/accountConfiguration",
          success: function(data) {
            successHandler(data);
          }
        };

      baseService.fetch(options, params);
    };

    this.postAccConfigReq = function(submissionId, applicantId, payload, successHandler) {
      const params = {
          submissionId: submissionId,
          applicantId: applicantId
        },
        options = {
          url: "submissions/{submissionId}/applicants/{applicantId}/accountConfiguration/requirement",
          data: payload,
          success: function(data) {
            successHandler(data);
          }
        };

      baseService.add(options, params);
    };

    this.putAccConfig = function(submissionId, applicantId, successHandler) {
      const params = {
          submissionId: submissionId,
          applicantId: applicantId
        },
        options = {
          url: "submissions/{submissionId}/applicants/{applicantId}/accountConfiguration",
          data: JSON.stringify({}),
          success: function(data) {
            successHandler(data);
          }
        };

      baseService.update(options, params);
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
