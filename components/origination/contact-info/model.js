define([
  "jquery",
  "baseService"
], function ($, BaseService) {
  "use strict";

  /**
   * Main file for Contact Information Model. This file contains the model definition
   * for contact information section and exports the ContactInfoModel which can be injected
   * in any framework and developer will, by default get a self aware model for Identity
   * Information Section.<br/><br/>
   * The injected Model Class will have below properties:
   * <ul>
   *      <li>Model for Income Section using [getNewModel()]{@link ContactInfoModel.getNewModel}</li>
   *      <li>Service abstractions to fetch all the necessary component level data, which includes:
   *          <ul>
   *              <li>[fetchCountryList()]{@link ContactInfoModel.fetchCountryList}</li>
   *              <li>[fetchAccomodationTypeList()]{@link ContactInfoModel.fetchAccomodationTypeList}</li>
   *              <li>[createAddresses()]{@link ContactInfoModel.createAddresses}</li>
   *              <li>[createContact()]{@link ContactInfoModel.createContact}</li>
   *              <li>[updateAddresses()]{@link ContactInfoModel.updateAddresses}</li>
   *              <li>[updateContact()]{@link ContactInfoModel.updateContact}</li>
   *              <li>[synchronizeRequests()]{@link ContactInfoModel.synchronizeRequests}</li>
   *          </ul>.
   *      </li>
   * </ul>.
   *
   * @namespace ContactInfo~ContactInfoModel
   * @class ContactInfoModel
   * @property {Object}  contact - an object containing user's contact details
   * @property {string}  contact.contactType - type of contact
   * @property {Object}  contact.phone - Object containing phone details of user
   * @property {string}  contact.phone.type - phone type
   * @property {string}  contact.phone.areaCode - phone's area code
   * @property {string}  contact.phone.number - phone number
   * @property {string}  contact.phone.mobile - mobile number
   * @property {Object}  address - an object containing user's address details
   * @property {string}  address.type - type of address
   * @property {string}  address.accomodationType - type of accommodation
   * @property {Date}    address.stayingSince - beginning year for stay in current address
   * @property {Object}  address.postalAddress - postalAddress object
   * @property {string}  address.postalAddress.country - country of residence
   * @property {string}  address.postalAddress.city - city of residence
   * @property {string}  address.postalAddress.postalCode - zipcode
   * @property {string}  address.postalAddress.line1 - postalAddress line 1
   * @property {string}  address.postalAddress.line2 - postalAddress line 2
   * @property {boolean} isCompleting - co-applicant is self filling the form
   * @property {Object}  dictionaryArray - additional data for services
   */
  return function ContactInfoModel() {
    /**
     * In case more than one instance of model is required, eg for main and co-applicant
     * we are declaring model as a function, of which new instances can be created and
     * used when required.
     *
     * @class Model
     * @private
     * @memberOf ContactInfoModel
     */
    /**
     * Let Model - description.
     *
     * @return {type}  Description.
     */
    const Model = function () {
      this.contactInfo = {
        contacts: [{
          contactType: "",
          phone: {
            areaCode: "",
            number: ""
          }
        },
        {
          contactType: "",
          phone: {
            areaCode: "",
            number: ""
          }
        }
        ],
        address: {
          type: "RES",
          accomodationType: "",
          stayingSince: "",
          sameAsCurrent: true,
          status: "CURRENT",
          postalAddress: {
            country: "",
            city: "",
            postalCode: "",
            line1: "",
            line2: ""
          }
        },
        mailingAddress: {
          type: "PST",
          accomodationType: null,
          stayingSince: "",
          sameAsCurrent: true,
          status: "CURRENT",
          postalAddress: {
            country: "",
            city: "",
            postalCode: "",
            line1: "",
            line2: ""
          }
        }
      };

      this.monthlyMortgage = {
        currency: "",
        amount: null
      };

      this.monthlyRent = {
        currency: "",
        amount: ""
      };

      this.isCompleting = true;

      this.selectedValues = {
        accomodationType: "",
        contactType1: "",
        contactType2: "",
        country: "",
        countryMailing: ""
      };

      this.disableInputs = false;
      this.email = "";
    };
    let modelInitialized = false;
    const baseService = BaseService.getInstance();
    /* variable to make sure that in case there is no change
     * in model no additional fetch requests are fired.*/
    let modelStateChanged = true,
      submissionId, applicantId, getAccomodationTypeListDeferred;
    /**
     * GetAccomodationTypeList - description.
     *
     * @param  {type} deferred - Description.
     * @return {type}          Description.
     */
    const getAccomodationTypeList = function (deferred) {
      const options = {
        url: "accommodationTypes",
        success: function (data) {
          deferred.resolve(data);
        },
        error: function (data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };
    let fetchCountryListDeferred;
    /**
     * FetchCountryList - description.
     *
     * @param  {type} deferred - Description.
     * @return {type}          Description.
     */
    const fetchCountryList = function (deferred) {
      const options = {
        url: "enumerations/country",
        success: function (data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options);
    };
    let getExistingExpensesDeferred;
    /**
     * Private method to fetch list of existing expenses of the user. This
     * method will resolve a passed deferred object, which can be returned
     * from calling function to the parent.
     *
     * @function getExistingExpenses
     * @memberOf ExpenseInfoModel
     * @private
     */
    /**
     * GetExistingExpenses - description.
     *
     * @param  {type} profileId - - - - - - - - - - - - - - - - Description.
     * @param  {type} deferred  Description.
     * @return {type}           Description.
     */
    const getExistingExpenses = function (profileId, deferred) {
      modelStateChanged = false;

      const options = {
        url: "submissions/{submissionId}/applicants/{applicantId}/financialProfile/expenses?profileId={profileId}",
        success: function (data) {
          deferred.resolve(data);
        },
        error: function () {
          deferred.reject();
        }
      },
        params = {
          submissionId: submissionId,
          applicantId: applicantId,
          profileId: profileId
        };

      baseService.fetch(options, params);
    };
    let getPhoneTypeListDeferred;
    /**
     * GetPhoneTypeList - description.
     *
     * @param  {type} deferred - Description.
     * @return {type}          Description.
     */
    const getPhoneTypeList = function (deferred) {
      const options = {
        url: "enumerations/phonetype",
        success: function (data) {
          deferred.resolve(data);
        },
        error: function (data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };
    let getISDCodeListDeferred;
    /**
     * GetISDCodeList - description.
     *
     * @param  {type} deferred - Description.
     * @return {type}          Description.
     */
    const getISDCodeList = function (deferred) {
      const options = {
        url: "enumerations/ISDCode",
        success: function (data) {
          deferred.resolve(data);
        },
        error: function (data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };
    let getExistingContactsDeferred;
    /**
     * GetExistingContacts - description.
     *
     * @param  {type} deferred - Description.
     * @return {type}          Description.
     */
    const getExistingContacts = function (deferred) {
      const params = {
        submissionId: submissionId,
        applicantId: applicantId
      },
        options = {
          url: "submissions/{submissionId}/applicants/{applicantId}/contactPoints",
          success: function (data) {
            deferred.resolve(data);
          }
        };

      baseService.fetch(options, params);
    };
    let getExistingAddressesDeferred;
    /**
     * GetExistingAddresses - description.
     *
     * @param  {type} deferred - Description.
     * @return {type}          Description.
     */
    const getExistingAddresses = function (deferred) {
      const params = {
        submissionId: submissionId,
        applicantId: applicantId
      },
        options = {
          url: "submissions/{submissionId}/applicants/{applicantId}/addresses",
          success: function (data) {
            deferred.resolve(data);
          },
          error: function (data) {
            deferred.reject(data);
          }
        };

      baseService.fetch(options, params);
    };
    let saveContactModelDeferred;
    /**
     * SaveContactModel - description.
     *
     * @param  {type} contactModel - - - - - - - - - - - - - - - - Description.
     * @param  {type} deferred     Description.
     * @return {type}              Description.
     */
    const saveContactModel = function (contactModel, deferred) {
      modelStateChanged = true;

      const params = {
        submissionId: submissionId,
        applicantId: applicantId
      },
        options = {
          url: "submissions/{submissionId}/applicants/{applicantId}/contactPoints",
          data: contactModel,
          success: function (data) {
            deferred.resolve(data);
          },
          error: function () {
            deferred.reject();
          }
        };

      baseService.add(options, params);
    };
    let fetchExistingLiabilitiesDeferred;
    /**
     * Private method to fetch existing liabilities for the user, this method will
     * only be called if applicant and profile ids are present, and will resolve a
     * passeddeferred object, which can be returned from calling function to the
     * parent.
     *
     * @function fetchExistingLiabilities
     * @memberOf LiabilitiesInfoModel
     * @private
     */
    /**
     * FetchExistingLiabilities - description.
     *
     * @param  {type} profileId - - - - - - - - - - - - - - - - Description.
     * @param  {type} deferred  Description.
     * @return {type}           Description.
     */
    const fetchExistingLiabilities = function (profileId, deferred) {
      modelStateChanged = false;

      const options = {
        url: "submissions/{submissionId}/applicants/{applicantId}/financialProfile/liabilities?profileId={profileId}",
        success: function (data) {
          deferred.resolve(data);
        },
        error: function () {
          deferred.reject();
        }
      },
        params = {
          submissionId: submissionId,
          applicantId: applicantId,
          profileId: profileId
        };

      baseService.fetch(options, params);
    };
    let saveAddressModelDeferred;
    /**
     * SaveAddressModel - description.
     *
     * @param  {type} addressModel - - - - - - - - - - - - - - Description.
     * @param  {type} addOrUpdate  Description.
     * @param  {type} addId        Description.
     * @param  {type} deferred     Description.
     * @return {type}              Description.
     */
    const saveAddressModel = function (addressModel, addOrUpdate, addId, deferred) {
      modelStateChanged = true;

      const params = {
        submissionId: submissionId,
        applicantId: applicantId
      },
        options = {
          url: "submissions/{submissionId}/applicants/{applicantId}/addresses",
          data: addressModel,
          success: function (data) {
            deferred.resolve(data);
          },
          error: function (data) {
            deferred.reject(data);
          }
        };

      if (addOrUpdate > 0) {
        options.url = "submissions/{submissionId}/applicants/{applicantId}/addresses";
        options.url = options.url + "/" + addId;
        baseService.update(options, params);
      } else {
        baseService.add(options, params);
      }
    };
    let saveModelDeferred;
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
     * SaveModel - description.
     *
     * @param  {type} model    - - - - - - - - - - - - - - - - Description.
     * @param  {type} deferred Description.
     * @return {type}          Description.
     */
    const saveModel = function (model, deferred) {
      modelStateChanged = true;

      const params = {
        submissionId: submissionId,
        applicantId: applicantId
      },
        options = {
          url: "submissions/{submissionId}/applicants/{applicantId}/employments/profiles",
          data: model,
          success: function (data) {
            deferred.resolve(data);
          },
          error: function (data) {
            deferred.reject(data);
          }
        };

      baseService.add(options, params);
    };
    let saveModelExpenseDeferred;
    /**
     * Private method to save/update the expense data of the user. This
     * method will resolve a passed deferred object, which can be returned
     * from calling function to the parent.
     *
     * @function saveModelExpense
     * @memberOf ExpenseInfoModel
     * @private
     */
    /**
     * SaveModelExpense - description.
     *
     * @param  {type} model     - - - - - - - - - - - - - Description.
     * @param  {type} profileId Description.
     * @param  {type} update    Description.
     * @param  {type} expenseId Description.
     * @param  {type} deferred  Description.
     * @return {type}           Description.
     */
    const saveModelExpense = function (model, profileId, update, expenseId, deferred) {
      modelStateChanged = true;

      const params = {
        submissionId: submissionId,
        applicantId: applicantId,
        profileId: profileId
      },
        options = {
          url: "submissions/{submissionId}/applicants/{applicantId}/financialProfile/expenses",
          data: model,
          success: function (data) {
            deferred.resolve(data);
          },
          error: function () {
            deferred.reject();
          }
        };

      if (update) {
        options.url += "/" + expenseId;
        baseService.update(options, params);
      } else {
        baseService.add(options, params);
      }
    };
    let saveModelLiabilitiesDeferred;
    /**
     * Private method to save passed liabilities information model. Based
     * on the availability or non-availability of liability id attribute
     * on existing model this function will add or update the passed model.
     * This method will resolve a passed deferred object, which can be returned
     * from calling function to the parent.
     *
     * @function saveModelLiabilities
     * @memberOf LiabilitiesInfoModel
     * @private
     */
    /**
     * SaveModelLiabilities - description.
     *
     * @param  {type} model         - - - - - - - - - - - - - - Description.
     * @param  {type} update        Description.
     * @param  {type} liabilitiesId Description.
     * @param  {type} deferred      Description.
     * @return {type}               Description.
     */
    const saveModelLiabilities = function (model, update, liabilitiesId, deferred) {
      modelStateChanged = true;

      const params = {
        submissionId: submissionId,
        applicantId: applicantId
      },
        options = {
          url: "submissions/{submissionId}/applicants/{applicantId}/financialProfile/liabilities",
          data: model,
          success: function (data) {
            deferred.resolve(data);
          }
        };

      if (update) {
        options.url = "submissions/{submissionId}/applicants/{applicantId}/financialProfile/liabilities/" + liabilitiesId;
        baseService.update(options, params);
      } else {
        baseService.add(options, params);
      }
    };
    let fetchEmploymentsDeferred;
    /**
     * FetchEmployments - description.
     *
     * @param  {type} deferred - Description.
     * @return {type}          Description.
     */
    const fetchEmployments = function (deferred) {
      const params = {
        submissionId: submissionId,
        applicantId: applicantId
      },
        options = {
          url: "submissions/{submissionId}/applicants/{applicantId}/employments",
          success: function (data) {
            deferred.resolve(data);
          },
          error: function (data) {
            deferred.reject(data);
          }
        };

      baseService.fetch(options, params);
    };
    let fireBatchDeferred;
    /**
     * FireBatch - description.
     *
     * @param  {type} batchData - - - - - - - - - - - - - - - - Description.
     * @param  {type} deferred  Description.
     * @return {type}           Description.
     */
    const fireBatch = function (batchData, deferred) {
      const options = {
        headers: {
          BATCH_ID: "2655"
        },
        url: "batch/",
        success: function (data) {
          deferred.resolve(data);
        },
        error: function (data) {
          deferred.reject(data);
        }
      };

      baseService.batch(options, {}, batchData);
    };
    let checkStayingSinceDateDeferred;
    /**
     * CheckStayingSinceDate - description.
     *
     * @param  {type} dateData - - - - - - - - - - - - - - - - Description.
     * @param  {type} deferred Description.
     * @return {type}          Description.
     */
    const checkStayingSinceDate = function (dateData, deferred) {
      modelStateChanged = true;

      const params = {
        submissionId: submissionId,
        applicantId: applicantId,
        date: dateData
      },
        options = {
          url: "submissions/{submissionId}/applicants/{applicantId}/validateAddressDate/{date}",
          showMessage: false,
          success: function (data) {
            deferred.resolve(data);
          },
          error: function (data) {
            deferred.reject(data);
          }
        };

      baseService.fetch(options, params);
    },
      errors = {
        /**
         * InitializationException - description
         *
         * @return {type}  description
         */
        InitializationException: function () {
          let message = "";

          message += "\nObject can't be initialized without a valid submission Id. ";
          message += "\nPlease make sure the submission id is present.";
          message += "\nProper initialization has to be:";
          message += "\n\n\tModelName.init(\"SubId\"[, \"ApplicantId\"]);";

          return message;
        }(),
        /**
         * InvalidApplicantId - description
         *
         * @return {type}  description
         */
        InvalidApplicantId: function () {
          let message = "";

          message += "\nNo applicant id found, please make sure applicant id is present while initializing the model. ";
          message += "\nProper initialization has to be: ";
          message += "\n\n\tModelName.init(\"SubId\"[, \"ApplicantId\"]);";

          return message;
        }(),
        /**
         * ObjectNotInitialized - description
         *
         * @return {type}  description
         */
        ObjectNotInitialized: function () {
          let message = "";

          message += "\nModel has not been initialized. Please initialize the model before setting properties. ";
          message += "\nProper initialization has to be: ";
          message += "\n\n\tModelName.init(\"SubId\"[, \"ApplicantId\"]);";

          return message;
        }()
      },
      /**
       * ObjectInitializedCheck - description.
       *
       * @return {type}  Description.
       */
      objectInitializedCheck = function () {
        if (!modelInitialized) {
          throw new Error(errors.ObjectNotInitialized);
        }
      };

    return {
      /**
       * Method to initialize the described model, this function can take two params
       * and will throw exception in case no submission id is passed.
       *
       * @param {String} subId - submission id for current application
       * @param {String} applId - applicant id for current user
       * @function init
       * @memberOf LiabilitiesInfoModel
       */
      /**
       * Init - description.
       *
       * @param  {type} subId  - - - - - - - - - - - - - - - - Description.
       * @param  {type} applId Description.
       * @return {type}        Description.
       */
      init: function (subId, applId) {
        submissionId = subId || undefined;
        applicantId = applId || undefined;

        if (!submissionId) {
          throw new Error(errors.InitializationException);
        }

        if (!applicantId) {
          throw new Error(errors.InvalidApplicantId);
        }

        modelInitialized = true;
        this.getExistingContacts();
        this.getExistingAddresses();

        return modelInitialized;
      },
      /**
       * Method to get new instance of Identity Information model. This method is a static member
       * of IdentityInfoModel class, and on calling it will instantiate the defined [Model]{@link
       * IdentityInfoModel.Model} (private to this class) and return a new instance of same.
       *
       * @function getNewModel
       * @param {object} modelData - javascript object with predefined attributed present with which
       * the model will be initialized
       * @memberOf LiabilitiesInfoModel
       * @returns Model
       */
      /**
       * GetNewModel - description.
       *
       * @param  {type} modelData - Description.
       * @return {type}           Description.
       */
      getNewModel: function (modelData) {
        return new Model(modelData);
      },
      /**
       * GetAccomodationTypeList - description.
       *
       * @return {type}  Description.
       */
      getAccomodationTypeList: function () {
        objectInitializedCheck();
        getAccomodationTypeListDeferred = $.Deferred();
        getAccomodationTypeList(getAccomodationTypeListDeferred);

        return getAccomodationTypeListDeferred;
      },
      /**
       * GetPhoneTypeList - description.
       *
       * @return {type}  Description.
       */
      getPhoneTypeList: function () {
        objectInitializedCheck();
        getPhoneTypeListDeferred = $.Deferred();
        getPhoneTypeList(getPhoneTypeListDeferred);

        return getPhoneTypeListDeferred;
      },
      /**
       * GetISDCodeList - description.
       *
       * @return {type}  Description.
       */
      getISDCodeList: function () {
        objectInitializedCheck();
        getISDCodeListDeferred = $.Deferred();
        getISDCodeList(getISDCodeListDeferred);

        return getISDCodeListDeferred;
      },
      /**
       * GetExistingContacts - description.
       *
       * @return {type}  Description.
       */
      getExistingContacts: function () {
        objectInitializedCheck();

        if (!applicantId) {
          throw new Error(errors.InvalidApplicantId);
        }

        if (modelStateChanged) {
          getExistingContactsDeferred = $.Deferred();

          $.when(getAccomodationTypeListDeferred).done(function () {
            getExistingContacts(getExistingContactsDeferred);
          });
        }

        return getExistingContactsDeferred;
      },
      /**
       * GetExistingAddresses - description.
       *
       * @return {type}  Description.
       */
      getExistingAddresses: function () {
        objectInitializedCheck();

        if (!applicantId) {
          throw new Error(errors.InvalidApplicantId);
        }

        if (modelStateChanged) {
          getExistingAddressesDeferred = $.Deferred();

          $.when(getAccomodationTypeListDeferred).done(function () {
            getExistingAddresses(getExistingAddressesDeferred);
          });
        }

        return getExistingAddressesDeferred;
      },
      /**
       * SaveContactModel - description.
       *
       * @param  {type} contactModel - Description.
       * @return {type}              Description.
       */
      saveContactModel: function (contactModel) {
        objectInitializedCheck();
        saveContactModelDeferred = $.Deferred();
        saveContactModel(contactModel, saveContactModelDeferred);

        return saveContactModelDeferred;
      },
      /**
       * SaveAddressModel - description.
       *
       * @param  {type} addressModel - - - - - - - - - - - - - - - Description.
       * @param  {type} addOrUpdate  Description.
       * @param  {type} addId        Description.
       * @return {type}              Description.
       */
      saveAddressModel: function (addressModel, addOrUpdate, addId) {
        objectInitializedCheck();
        saveAddressModelDeferred = $.Deferred();
        saveAddressModel(addressModel, addOrUpdate, addId, saveAddressModelDeferred);

        return saveAddressModelDeferred;
      },
      /**
       * SaveModel - description.
       *
       * @param  {type} model - Description.
       * @return {type}       Description.
       */
      saveModel: function (model) {
        objectInitializedCheck();
        saveModelDeferred = $.Deferred();
        saveModel(model, saveModelDeferred);

        return saveModelDeferred;
      },
      /**
       * FireBatch - description.
       *
       * @param  {type} batchData - Description.
       * @return {type}           Description.
       */
      fireBatch: function (batchData) {
        objectInitializedCheck();
        fireBatchDeferred = $.Deferred();
        fireBatch(batchData, fireBatchDeferred);

        return fireBatchDeferred;
      },
      /**
       * FetchEmployments - description.
       *
       * @return {type}  Description.
       */
      fetchEmployments: function () {
        fetchEmploymentsDeferred = $.Deferred();
        fetchEmployments(fetchEmploymentsDeferred);

        return fetchEmploymentsDeferred;
      },
      /**
       * FetchExistingLiabilities - description.
       *
       * @param  {type} profileId - Description.
       * @return {type}           Description.
       */
      fetchExistingLiabilities: function (profileId) {
        objectInitializedCheck();
        fetchExistingLiabilitiesDeferred = $.Deferred();
        fetchExistingLiabilities(profileId, fetchExistingLiabilitiesDeferred);

        return fetchExistingLiabilitiesDeferred;
      },
      /**
       * FetchCountryList - description.
       *
       * @return {type}  Description.
       */
      fetchCountryList: function () {
        fetchCountryListDeferred = $.Deferred();
        fetchCountryList(fetchCountryListDeferred);

        return fetchCountryListDeferred;
      },
      /**
       * SaveModelLiabilities - description.
       *
       * @param  {type} model         - - - - - - - - - - - - - - - Description.
       * @param  {type} update        Description.
       * @param  {type} liabilitiesId Description.
       * @return {type}               Description.
       */
      saveModelLiabilities: function (model, update, liabilitiesId) {
        objectInitializedCheck();
        saveModelLiabilitiesDeferred = $.Deferred();
        saveModelLiabilities(model, update, liabilitiesId, saveModelLiabilitiesDeferred);

        return saveModelLiabilitiesDeferred;
      },
      /**
       * SaveModelExpense - description.
       *
       * @param  {type} model     - - - - - - - - - - - - - - Description.
       * @param  {type} profileId Description.
       * @param  {type} update    Description.
       * @param  {type} expenseId Description.
       * @return {type}           Description.
       */
      saveModelExpense: function (model, profileId, update, expenseId) {
        objectInitializedCheck();
        saveModelExpenseDeferred = $.Deferred();
        saveModelExpense(model, profileId, update, expenseId, saveModelExpenseDeferred);

        return saveModelExpenseDeferred;
      },
      /**
       * GetExistingExpenses - description.
       *
       * @param  {type} profileId - Description.
       * @return {type}           Description.
       */
      getExistingExpenses: function (profileId) {
        objectInitializedCheck();
        getExistingExpensesDeferred = $.Deferred();
        getExistingExpenses(profileId, getExistingExpensesDeferred);

        return getExistingExpensesDeferred;
      },
      /**
       * CheckStayingSinceDate - description.
       *
       * @param  {type} dateData - Description.
       * @return {type}          Description.
       */
      checkStayingSinceDate: function (dateData) {
        objectInitializedCheck();
        checkStayingSinceDateDeferred = $.Deferred();
        checkStayingSinceDate(dateData, checkStayingSinceDateDeferred);

        return checkStayingSinceDateDeferred;
      }
    };
  };
});