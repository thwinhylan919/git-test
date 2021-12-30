define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const UserCreationModel = function() {
    const Model = function() {
        this.primary = {
          username: "",
          password: "",
          partyId: "",
          submissionId: ""
        };

        this.coApp = {
          username: "",
          partyId: "",
          submissionId: {
            displayValue: "",
            value: ""
          },
          applicationId: {
            displayValue: "",
            value: ""
          }
        };

        this.QuesAnsPayload = {
          userSecurityQuestionList: []
        };
      },
      baseService = BaseService.getInstance();
    let notificationSuccessDeferred;
    const notificationSuccess = function(notificationId, deferred) {
      const params = {
          notificationId: notificationId
        },
        options = {
          url: "registration/prospect/notification/{notificationId}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

      baseService.fetch(options, params);
    };
    let deleteSessionDeffered;
    const deleteSession = function(deferred) {
      const options = {
        url: "session",
        success: function(data) {
          deferred.resolve(data);
        }
      };

      baseService.remove(options);
    };
    let registerDeferred;
    const register = function(payload, deferred) {
      const options = {
        url: "registration/prospect",
        data: payload,
        success: function(data, status, jqXhr) {
          deferred.resolve(data, status, jqXhr);
        },
        error: function(data, status, jqXhr) {
          deferred.reject(data, status, jqXhr);
        }
      };

      baseService.add(options);
    };
    let registerThroughLinkDeferred;
    const registerThroughLink = function(payload, deferred, notificationId) {
      const params = {
          notificationId: notificationId
        },
        options = {
          url: "registration/prospect/notification/{notificationId}",
          data: payload,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

      baseService.update(options, params);
    };
    let fetchApplicantDeferred;
    const fetchApplicantList = function(submissionId, deferred) {
      const params = {
          submissionId: submissionId
        },
        options = {
          url: "submissions/{submissionId}/applicants",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

      baseService.fetch(options, params);
    };
    let registerCoAppDeferred;
    const registerCoApp = function(payload, deferred) {
      const options = {
        url: "registration/prospect/notification",
        data: payload,
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.add(options);
    };
    let fetchPasswordPolicyDeferred;
    const fetchPasswordPolicy = function(deferred) {
      const options = {
        url: "passwordPolicy",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };
    let verifyEmailDeferred;
    const verifyEmail = function(payload, deferred) {
      const options = {
        url: "me/emailVerification/otp",
        data: payload,
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.add(options);
    };
    let fetchUserNameTypeDeferred;
    const fetchUserNameType = function(deferred) {
      const options = {
        url: "registration/prospect/userNamePolicy",
        success: function(data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options);
    };
    let submitApplicationDeferred;
    const submitApplication = function(submissionId, deferred) {
      const params = {
          submissionId: submissionId
        },
        options = {
          url: "submissions/{submissionId}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

      baseService.update(options, params);
    };
    let getApplicationsDeferred;
    const getApplications = function(submissionId, deferred) {
      const params = {
          submissionId: submissionId
        },
        options = {
          url: "submissions/{submissionId}/applications",
          success: function(data) {
            deferred.resolve(data);
          }
        };

      baseService.fetch(options, params);
    };
    let fetchSecurityQuestionNumberDeferred;
    const fetchSecurityQuestionNumber = function(deferred) {
      const options = {
        url: "me/securityQuestion/noOfQuestions",
        success: function(data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options);
    };
    let fetchSecurityQuestionListDeferred;
    const fetchSecurityQuestionList = function(deferred) {
      const options = {
        url: "securityQuestion",
        success: function(data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options);
    };
    let postSecurityQuestionsDeferred;
    const postSecurityQuestions = function(payload, refNoHeader, deferred) {
      const options = {
        url: "me/securityQuestion",
        data: payload,
        headers: {
          X_OR_REFERENCE_NO: refNoHeader
        },
        success: function(data, status, jqXhr) {
          deferred.resolve(data, status, jqXhr);
        }
      };

      baseService.add(options);
    };
    let createLoginConfigDeferred;
    const createLoginConfig = function(payload, refNoHeader, deferred) {
      const options = {
        url: "me/loginFlow",
        data: payload,
        headers: {
          X_OR_REFERENCE_NO: refNoHeader
        },
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.add(options);
    };
    let fetchEmailVerificationCheckDeferred;
    const fetchEmailVerificationCheck = function(deferred) {
      const options = {
        url: "configurations/base/OriginationConfig/properties/ORIG_PI_EMAIL_VERIFICATION_REQUIRED",
        success: function(data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options);
    };

    return {
      getNewModel: function() {
        return new Model();
      },
      notificationSuccess: function(notificationId) {
        notificationSuccessDeferred = $.Deferred();
        notificationSuccess(notificationId, notificationSuccessDeferred);

        return notificationSuccessDeferred;
      },
      register: function(payload) {
        registerDeferred = $.Deferred();
        register(payload, registerDeferred);

        return registerDeferred;
      },
      deleteSession: function() {
        deleteSessionDeffered = $.Deferred();
        deleteSession(deleteSessionDeffered);

        return deleteSessionDeffered;
      },
      registerThroughLink: function(payload, notificationId) {
        registerThroughLinkDeferred = $.Deferred();
        registerThroughLink(payload, registerThroughLinkDeferred, notificationId);

        return registerThroughLinkDeferred;
      },
      registerCoApp: function(payload) {
        registerCoAppDeferred = $.Deferred();
        registerCoApp(payload, registerCoAppDeferred);

        return registerCoAppDeferred;
      },
      fetchApplicantList: function(submissionId) {
        fetchApplicantDeferred = $.Deferred();
        fetchApplicantList(submissionId, fetchApplicantDeferred);

        return fetchApplicantDeferred;
      },
      fetchPasswordPolicy: function() {
        fetchPasswordPolicyDeferred = $.Deferred();
        fetchPasswordPolicy(fetchPasswordPolicyDeferred);

        return fetchPasswordPolicyDeferred;
      },
      fetchUserNameType: function() {
        fetchUserNameTypeDeferred = $.Deferred();
        fetchUserNameType(fetchUserNameTypeDeferred);

        return fetchUserNameTypeDeferred;
      },
      fetchEmailVerificationCheck: function() {
        fetchEmailVerificationCheckDeferred = $.Deferred();
        fetchEmailVerificationCheck(fetchEmailVerificationCheckDeferred);

        return fetchEmailVerificationCheckDeferred;
      },
      verifyEmail: function(payload) {
        verifyEmailDeferred = $.Deferred();
        verifyEmail(payload, verifyEmailDeferred);

        return verifyEmailDeferred;
      },
      submitApplication: function(submissionId) {
        submitApplicationDeferred = $.Deferred();
        submitApplication(submissionId, submitApplicationDeferred);

        return submitApplicationDeferred;
      },
      getApplications: function(submissionId) {
        getApplicationsDeferred = $.Deferred();
        getApplications(submissionId, getApplicationsDeferred);

        return getApplicationsDeferred;
      },
      fetchSecurityQuestionNumber: function() {
        fetchSecurityQuestionNumberDeferred = $.Deferred();
        fetchSecurityQuestionNumber(fetchSecurityQuestionNumberDeferred);

        return fetchSecurityQuestionNumberDeferred;
      },
      fetchSecurityQuestionList: function() {
        fetchSecurityQuestionListDeferred = $.Deferred();
        fetchSecurityQuestionList(fetchSecurityQuestionListDeferred);

        return fetchSecurityQuestionListDeferred;
      },
      postSecurityQuestions: function(payload, refNoHeader) {
        postSecurityQuestionsDeferred = $.Deferred();
        postSecurityQuestions(payload, refNoHeader, postSecurityQuestionsDeferred);

        return postSecurityQuestionsDeferred;
      },
      createLoginConfig: function(payload, refNoHeader) {
        createLoginConfigDeferred = $.Deferred();
        createLoginConfig(payload, refNoHeader, createLoginConfigDeferred);

        return createLoginConfigDeferred;
      }
    };
  };

  return new UserCreationModel();
});