define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  /**
   * Main file for Asset Information Model. This file contains the model definition
   * for asset information section and exports the AssetsInfoModel which can be injected
   * in any framework and developer will by default get a self aware model for Asset
   * Information Section.<br/><br/>
   * The injected Model Class will have below properties:
   * <ul>
   *      <li>Model for Assets Section using [getNewModel()]{@link AssetsInfoModel.getNewModel}</li>
   *      <li>Service abstractions to fetch all the necessary component level data, which includes:
   *          <ul>
   *              <li>[init()]{@link AssetsInfoModel.init}</li>
   *              <li>[getNewModel()]{@link AssetsInfoModel.getNewModel}</li>
   *              <li>[getAssetTypeList()]{@link AssetsInfoModel.getAssetTypeList}</li>
   *              <li>[getExistingAssets()]{@link AssetsInfoModel.getExistingAssets}</li>
   *              <li>[saveModel()]{@link AssetsInfoModel.saveModel}</li>
   *              <li>[deleteModel()]{@link AssetsInfoModel.deleteModel}</li>
   *          </ul>.
   *      </li>
   * </ul>.
   *
   * @namespace AssetsInfo~AssetsInfoModel
   * @class AssetsInfoModel
   * @property {string} id - asset id
   * @property {string} type - type of selected asset
   * @property {Object} value - object to store value of asset
   * @property {Integer} value.amount - asset's worth
   * @property {string} value.currency - currency code used
   * @property {Integer} ownershipPercentage - ownership percentage
   */
  return function AssetsInfoModel() {
    /**
     * In case more than one instance of model is required, eg for main and co-applicant
     * we are declaring model as a function, of which new instances can be created and
     * used when required.
     *
     * @class Model
     * @private
     * @memberOf AssetsInfoModel
     */
    /**
     * Let Model - description.
     *
     * @return {type}  Description.
     */
    const Model = function() {
        this.type = "";

        this.value = {
          amount: "",
          currency: ""
        };

        this.ownershipPercentage = 100;
        this.temp_isActive = true;

        this.temp_selectedValues = {
          type: ""
        };
      },
      modelInitialized = false,
      baseService = BaseService.getInstance();
    /* variable to make sure that in case there is no change
     * in model no additional fetch requests are fired.*/
    let submissionId, applicantId, profileId, getAssetTypeListDeferred;
    /**
     * Private method to fetch list of Asset Types. This
     * method will resolve a passed deferred object, which can be returned
     * from calling function to the parent.
     *
     * @function getAssetTypeList
     * @memberOf AssetsInfoModel
     * @private
     */
    /**
     * GetAssetTypeList - description.
     *
     * @param  {type} productType - - - - - - - - - - - - - - - - Description.
     * @param  {type} deferred    Description.
     * @return {type}             Description.
     */
    const getAssetTypeList = function(productType, deferred) {
      const options = {
          url: "financialAssetTypes",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },
        params = {
          productType: productType
        };

      baseService.fetch(options, params);
    };
    let fetchCurrencyMasterListDeferred;
      /**
       * fetchCurrencyMasterList - description
       *
       * @param  {type} deferred        description
       * @return {type}                 description
       */
     const fetchCurrencyMasterList = function (deferred) {
        const options = {
          url: "enumerations/currencies",
          success: function (data) {
            deferred.resolve(data);
          }
        };

        baseService.fetch(options);
      };
    let getExistingAssetsDeferred;
    /**
     * Private method to fetch list of existing assets of an applicant. This
     * method will resolve a passed deferred object, which can be returned
     * from calling function to the parent.
     *
     * @function getExistingAssets
     * @memberOf AssetsInfoModel
     * @private
     */
    /**
     * GetExistingAssets - description.
     *
     * @param  {type} deferred - Description.
     * @return {type}          Description.
     */
    const getExistingAssets = function(deferred) {
      const options = {
          url: "submissions/{submissionId}/applicants/{applicantId}/financialProfile/assets",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },
        params = {
          submissionId: submissionId,
          applicantId: applicantId,
          profileId: profileId
        };

      baseService.fetch(options, params);
    };
    let saveModelDeferred;
    /**
     * Private method to save or update information of a users Asset. This
     * method will resolve a passed deferred object, which can be returned
     * from calling function to the parent.
     *
     * @function saveModel
     * @memberOf AssetsInfoModel
     * @private
     */
    /**
     * SaveModel - description.
     *
     * @param  {type} model    - - - - - - - - - - - - - - - - Description.
     * @param  {type} deferred Description.
     * @return {type}          Description.
     */
    const saveModel = function(model, deferred) {
      const options = {
          url: "submissions/{submissionId}/applicants/{applicantId}/financialProfile/assets",
          data: model,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },
        params = {
          submissionId: submissionId,
          applicantId: applicantId
        },
        modelData = JSON.parse(model);

      if (modelData.assetDetails.id) {
        options.url += "/" + modelData.assetDetails.id;
        baseService.update(options, params);
      } else {
        baseService.add(options, params);
      }
    };
    let fetchEmploymentsDeferred;
    /**
     * FetchEmployments - description.
     *
     * @param  {type} submissionId - - - - - - - - - - - - - - - Description.
     * @param  {type} applicantId  Description.
     * @param  {type} deferred     Description.
     * @return {type}              Description.
     */
    const fetchEmployments = function(submissionId, applicantId, deferred) {
      const params = {
          submissionId: submissionId,
          applicantId: applicantId
        },
        options = {
          url: "submissions/{submissionId}/applicants/{applicantId}/employments",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

      baseService.fetch(options, params);
    };
    let saveEmploymentsDeferred;
    /**
     * Private method to save passed occupation information model. Based
     * on the availability or non-availability of liability id attribute
     * on existing model this function will add or update the passed model.
     * This method will resolve a passed deferred object, which can be returned
     * from calling function to the parent.
     *
     * @function saveModel
     * @memberOf OccupationInfoModel
     * @private
     */
    /**
     * SaveEmployments - description.
     *
     * @param  {type} submissionId - - - - - - - - - - - - - - - Description.
     * @param  {type} applicantId  Description.
     * @param  {type} deferred     Description.
     * @return {type}              Description.
     */
    const saveEmployments = function(submissionId, applicantId, deferred) {
      const params = {
          submissionId: submissionId,
          applicantId: applicantId
        },
        options = {
          url: "submissions/{submissionId}/applicants/{applicantId}/employments/profileId",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

      baseService.add(options, params);
    };
    let deleteModelDeferred;
    /**
     * Private method to delete an asset of the user. This
     * method will resolve a passed deferred object, which can be returned
     * from calling function to the parent.
     *
     * @function deleteModel
     * @memberOf AssetsInfoModel
     * @private
     */
    /**
     * DeleteModel - description.
     *
     * @param  {type} assetId  - - - - - - - - - - - - - - - - Description.
     * @param  {type} deferred Description.
     * @return {type}          Description.
     */
    const deleteModel = function(assetId, deferred) {
      const options = {
          url: "submissions/{submissionId}/applicants/{applicantId}/financialProfile/assets/{assetId}?profileId={profileId}",
          data: "",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },
        params = {
          submissionId: submissionId,
          applicantId: applicantId,
          profileId: profileId,
          assetId: assetId
        };

      baseService.remove(options, params);
    };

    return {
      /**
       * Method to initialize the described model, this function can take three params
       * and will throw exception in case no submission id is passed.
       *
       * @param {String} subId - submission id for current application
       * @param {String} applId - applicant id for current user
       * @param {String} profId - profile id for current user
       * @function init
       * @memberOf AssetsInfoModel
       */
      /**
       * Init - description.
       *
       * @param  {type} subId  - - - - - - - - - - - - - - - Description.
       * @param  {type} applId Description.
       * @param  {type} profId Description.
       * @return {type}        Description.
       */
      init: function(subId, applId, profId) {
        submissionId = subId || undefined;
        applicantId = applId || undefined;
        profileId = profId || undefined;

        return modelInitialized;
      },
      /**
       * Method to get new instance of Asset Information model. This method is a static member
       * of AssetsInfoModel class, and on calling it will instantiate the defined [Model]{@link
       * AssetsInfoModel.Model} (private to this class) and return a new instance of same.
       *
       * @function getNewModel
       * @param {object} modelData - javascript object with predefined attributed present with which
       * the model will be initialized
       * @memberOf AssetsInfoModel
       * @returns Model
       */
      /**
       * GetNewModel - description.
       *
       * @param  {type} modelData - Description.
       * @return {type}           Description.
       */
      getNewModel: function(modelData) {
        return new Model(modelData);
      },
      /**
       * Public method to fetch list of Asset types. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       *
       * @function getAssetTypeList
       * @memberOf AssetsInfoModel
       * @returns deferredObject
       * @example
       *      AssetsInfoModel.getAssetTypeList().then(function (data) {
       *
       *      });
       */
      /**
       * GetAssetTypeList - description.
       *
       * @param  {type} productType - Description.
       * @return {type}             Description.
       */
      getAssetTypeList: function(productType) {
        getAssetTypeListDeferred = $.Deferred();
        getAssetTypeList(productType, getAssetTypeListDeferred);

        return getAssetTypeListDeferred;
      },
       /**
       * fetchCurrencyMasterList - description
       *
       * @return {type}  description
       */
      fetchCurrencyMasterList: function () {
        fetchCurrencyMasterListDeferred = $.Deferred();
        fetchCurrencyMasterList(fetchCurrencyMasterListDeferred);

        return fetchCurrencyMasterListDeferred;
      },
      /**
       * Public method to fetch list of existing assets of an applicant. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       *
       * @function getExistingAssets
       * @memberOf AssetsInfoModel
       * @returns deferredObject
       * @example
       *      AssetsInfoModel.getExistingAssets().then(function (data) {
       *
       *      });
       */
      /**
       * GetExistingAssets - description.
       *
       * @return {type}  Description.
       */
      getExistingAssets: function() {
        getExistingAssetsDeferred = $.Deferred();
        getExistingAssets(getExistingAssetsDeferred);

        return getExistingAssetsDeferred;
      },
      /**
       * Public method to save/update asset information of an applicant. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       *
       * @function saveModel
       * @memberOf AssetsInfoModel
       * @returns deferredObject
       * @example
       *      AssetsInfoModel.saveModel().then(function (data) {
       *
       *      });
       */
      /**
       * SaveModel - description.
       *
       * @param  {type} assetModel - Description.
       * @return {type}            Description.
       */
      saveModel: function(assetModel) {
        saveModelDeferred = $.Deferred();
        saveModel(assetModel, saveModelDeferred);

        return saveModelDeferred;
      },
      /**
       * FetchEmployments - description.
       *
       * @param  {type} submissionId - - - - - - - - - - - - - - - - Description.
       * @param  {type} applicantId  Description.
       * @return {type}              Description.
       */
      fetchEmployments: function(submissionId, applicantId) {
        fetchEmploymentsDeferred = $.Deferred();
        fetchEmployments(submissionId, applicantId, fetchEmploymentsDeferred);

        return fetchEmploymentsDeferred;
      },
      /**
       * SaveEmployments - description.
       *
       * @param  {type} applicantId  - - - - - - - - - - - - - - - - Description.
       * @param  {type} model        Description.
       * @return {type}              Description.
       */
      saveEmployments: function(submissionId, applicantId) {
        saveEmploymentsDeferred = $.Deferred();
        saveEmployments(submissionId, applicantId, saveEmploymentsDeferred);

        return saveEmploymentsDeferred;
      },
      /**
       * Public method to delete asset information of an applicant. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       *
       * @function deleteModel
       * @memberOf AssetsInfoModel
       * @returns deferredObject
       * @example
       *      AssetsInfoModel.deleteModel().then(function (data) {
       *
       *      });
       */
      /**
       * DeleteModel - description.
       *
       * @param  {type} assetId - Description.
       * @return {type}         Description.
       */
      deleteModel: function(assetId) {
        deleteModelDeferred = $.Deferred();
        deleteModel(assetId, deleteModelDeferred);

        return deleteModelDeferred;
      }
    };
  };
});
