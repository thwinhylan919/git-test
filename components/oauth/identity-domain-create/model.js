/**
 */
define(function() {
  "use strict";

  const IdentityDomainModel = function() {
    const Model = function() {
      this.accessTokenDetail = {
        lifeCycleEnabled: false,
        refreshTokenEnabled: false,
        refreshTokenExpiry: "",
        refreshTokenLifeCycleEnabled: false,
        tokenExpiry: "",
        tokenType: "ACCESS_TOKEN"
      };

      this.authCodeDetail = {
        lifeCycleEnabled: false,
        refreshTokenEnabled: false,
        refreshTokenExpiry: "",
        refreshTokenLifeCycleEnabled: false,
        tokenExpiry: "",
        tokenType: "AUTHZ_CODE"
      };

      this.identityDomainDTO = {
        consentPageURL: null,
        description: null,
        errorPageURL: null,
        id: null,
        identityProvider: null,
        name: null,
        tokenDetail: []
      };
    };

    return {
      /**
       * getNewModel - returns the model
       * @param {String} modelData model for identity domain
       * @returns {Promise}  Returns the promise object
       */
      getNewModel: function(modelData) {
        return new Model(modelData);
      }
    };
  };

  return new IdentityDomainModel();
});