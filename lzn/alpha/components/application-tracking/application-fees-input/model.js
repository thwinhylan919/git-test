define([
  "jquery",
  "baseService"
], function ($, BaseService) {
  "use strict";

  /**
   * Model for application fees input in the Application tracking additional details section. It serves as the model where the data to be used by the application details section is defined. Since this model is tech agnostic, it can be coupled with any technology.
   *
   * @namespace ApplicationFeesInputModel~Model
   * @class
   * @property {Object[]} sections - Array containing the distinct additional information sections
   */
  const ApplicationRepaymentInputModel = function () {
    /**
     * @class Model
     * @private
     * @memberOf ApplicationFeesInputModel~Model
     */
    const Model = function () {
        this.applicationFeesData = {
          feeTypes: "",
          defer: "",
          collect: "",
          capitalise: ""
        };
      },
      baseService = BaseService.getInstance();
    let appFeesDeffered, collectionTypeDeffered, accountsDeffered, feesUpdateDeffered;
    const fetchAppFees = function (submissionId, applicationId, deferred) {
        const params = {
            submissionId: submissionId,
            applicationId: applicationId
          },
          options = {
            url: "submissions/{submissionId}/applications/{applicationId}/fees",
            success: function (data) {
              deferred.resolve(data);
            }
          };

        baseService.fetch(options, params);
      },
      fetchCollectionType = function (deferred) {
        const options = {
          url: "enumerations/collectionType",
          success: function (data) {
            deferred.resolve(data);
          }
        };

        baseService.fetch(options);
      },
      fetchAccounts = function (deferred) {
        const options = {
          url: "parties/me/accounts/dda/internal",
          success: function (data) {
            deferred.resolve(data);
          }
        };

        baseService.fetch(options);
      },
      updateFeesCollection = function (submissionId, applicationId, data, deferred) {
        const params = {
            submissionId: submissionId,
            applicationId: applicationId
          },
          options = {
            url: "submissions/{submissionId}/applications/{applicationId}/fees",
            data: JSON.stringify(data),
            success: function (data) {
              deferred.resolve(data);
            }
          };

        baseService.update(options, params);
      };

    return {
      fetchAppFees: function (submissionId, applicationId) {
        appFeesDeffered = $.Deferred();
        fetchAppFees(submissionId, applicationId, appFeesDeffered);

        return appFeesDeffered;
      },
      fetchCollectionType: function () {
        collectionTypeDeffered = $.Deferred();
        fetchCollectionType(collectionTypeDeffered);

        return collectionTypeDeffered;
      },
      fetchAccounts: function () {
        accountsDeffered = $.Deferred();
        fetchAccounts(accountsDeffered);

        return accountsDeffered;
      },
      updateFeesCollection: function (submissionId, applicationId, data) {
        feesUpdateDeffered = $.Deferred();
        updateFeesCollection(submissionId, applicationId, data, feesUpdateDeffered);

        return feesUpdateDeffered;
      },
      getNewModel: function (modelData) {
        return new Model(modelData);
      }
    };
  };

  return new ApplicationRepaymentInputModel();
});