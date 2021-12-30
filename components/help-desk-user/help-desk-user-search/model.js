/**
 */
define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  /**
   * This file contains the Tech Agnostic Service
   * consisting of all the REST services APIs for the product component.
   *
   * @returns {void}
   */
  const HelpDeskUserSearchModel = function() {
    /**
     * baseService instance through which all the rest calls will be made.
     *
     * @attribute baseService
     * @type {Object} BaseService Instance
     * @private
     */
    const baseService = BaseService.getInstance();
    /**
     * Creates new user session by help desk user.
     * @param {Object} payload - payload to create a help desk session.
     * @param {Object} deferred - deferred object used to store data if successfully fetched
     * @example HelpDeskUserSearchModel.helpDeskUserSessionCreate(payload,deferred).then();
     * @returns {void}
     */
    let helpDeskUserSessionCreateDeferred;
    const helpDeskUserSessionCreate = function(payload, deferred) {
      const options = {
        data: payload,
        url: "helpDeskSession",
        success: function(data) {
          deferred.resolve(data);
        }
      };

      baseService.add(options);
    };

    return {
      /**
       * This function fires a GET request to get the party details and validate it.
       *
       * fetchPartyDetails
       * @memberOf ProductService
       * @param {Object} partyId - object containg party id data
       * @example HelpDeskUserSearchModel.fetchPartyDetails(partyId).then();
       *
       *
       *
       *
       *
       *
       *
       *
       *
       *
       *
       *
       *
       *
       *
       *
       *
       *
       *
       *
       * @returns {Promise} Returns the promise object
       */
      fetchPartyDetails: function(partyId) {
        const params = {
            partyId: partyId
          },
          options = {
            url: "parties?partyId={partyId}"
          };

        return baseService.fetch(options, params);
      },
      /**
       * FetchUsersList - fetch the list of users.
       *
       * @memberOf ProductService
       * @param {Object} Parameters  - Based on different parameters fetch the user list.
       * @example HelpDeskUserSearchModel.fetchUsersList(Parameters).then();
       * @returns {Promise} Returns the promise object.
       */
      fetchUsersList: function(Parameters) {
        const params = {
            username: Parameters.username,
            partyId: Parameters.partyId,
            userType: Parameters.userType
          },
          options = {
            url: "users?username={username}&userType={userType}&partyId={partyId}"
          };

        return baseService.fetch(options, params);
      },
      /**
       * FetchMeDetails - fetch the user profile data for logged in user.
       *
       * @memberOf ProductService
       * @example HelpDeskUserSearchModel.fetchMeDetails().then();
       * @returns {Promise} Returns the promise object.
       */
      fetchMeDetails: function() {
        const options = {
          url: "me"
        };

        return baseService.fetch(options);
      },
      baseServiceProps: function(key, value) {
        return baseService.props(key, value);
      },
      /**
       * Creates new user session by help desk user.
       *
       * @param {Object} payload  - Payload to create a help desk session.
       * @returns {Object} HelpDeskUserSessionCreateDeferred deferred object used to store data if successfully fetched.
       */
      helpDeskUserSessionCreate: function(payload) {
        helpDeskUserSessionCreateDeferred = $.Deferred();
        helpDeskUserSessionCreate(payload, helpDeskUserSessionCreateDeferred);

        return helpDeskUserSessionCreateDeferred;
      }
    };
  };

  return new HelpDeskUserSearchModel();
});