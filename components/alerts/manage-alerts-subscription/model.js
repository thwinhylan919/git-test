define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  /**
   * @namespace AlertsMaintenance~Model
   * @class AlertsSubscriptionModel
   * @extends BaseService {@link BaseService}
   */
  const AlertsSubscriptionModel = function() {
    const baseService = BaseService.getInstance(),
      /**
       * In case more than one instance of model is required
       * we are declaring model as a function, of which new instances can be created and
       * used when required.
       *
       * @class Model
       * @private
       */
      PartyDetailsModel = function() {
        return {
          partyDetails: {
            party: {
              value: "",
              displayValue: ""
            },
            userType: "",
            partyName: "",
            partyDetailsFetched: false,
            additionalDetails: "",
            partyFirstName: "",
            partyLastName: "",
            emailAddress: "",
            mobileNumber: ""
          }
        };
      },
      SubscribedActionModel = function() {
        return {
          version: null,
          generatedPackageId: null,
          auditSequence: null,
          alertName: null,
          activityId: null,
          eventId: null,
          actionId: null,
          subscribedActionStartDate: null,
          subscribedActionEndDate: null,
          subscriptionPreferences: null,
          actionTemplate: null,
          module: null,
          subscriptionId: null,
          subscriptionLevel: null,
          subscriptionLevelAccountKey: null,
          subscriptionLevelPartyKey: null
        };
      },
      ActionSubscriptionModel = function() {
        return {
          version: null,
          active: null,
          subscribedActions: null,
          subscriber: null,
          subscriptionEndDate: null,
          subscriptionStartDate: null,
          subscriptionLevel: null,
          subscriptionId: null
        };
      },
      SubscriberModel = function() {
        return {
          id: null,
          subscriberType: null,
          party: null
        };
      },
      ActivityEventActionModel = function() {
        return {
          activityEventAction: null,
          emailPreference: null,
          emailSelected: null,
          smsPreference: null,
          smsSelected: null,
          mailboxPreference: null,
          mailboxSelected: null
        };
      };
    let subscriptionForPartyDeferred;
    const getSubscriptionForParty = function(deferred, partyId) {
      const options = {
          url: "actionSubscriptions?party={partyId}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },
        params = {
          partyId: partyId
        };

      baseService.fetch(options, params);
    };
    let subscriptionForUserDeferred;
    const getSubscriptionForUser = function(deferred, userId) {
      const options = {
          url: "actionSubscriptions?userId={userId}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },
        params = {
          userId: userId
        };

      baseService.fetch(options, params);
    };
    let createSubscriptionDeferred;
    const createSubscription = function(model, deferred) {
      const options = {
        url: "actionSubscriptions",
        data: model,
        success: function(data, status, jqXhr) {
          deferred.resolve(data, status, jqXhr);
        },
        error: function(data, status, jqXhr) {
          deferred.reject(data, status, jqXhr);
        }
      };

      baseService.add(options);
    };
    let updateSubscriptionDeferred;
    const updateSubscription = function(model, subscriptionId, deferred) {
      const params = {
        subscriptionId:subscriptionId
      },
       options = {
        url: "actionSubscriptions/{subscriptionId}",
        data: model,
        success: function(data, status, jqXhr) {
          deferred.resolve(data, status, jqXhr);
        },
        error: function(data, status, jqXhr) {
          deferred.reject(data, status, jqXhr);
        }
      };

      baseService.update(options,params);
    };
    let deleteSubscriptionDeferred;
    const deleteSubscription = function(subscriptionId, deferred) {
      const options = {
          url: "actionSubscriptions/{subscriptionId}",
          data: "",
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          },
          error: function(data, status, jqXhr) {
            deferred.reject(data, status, jqXhr);
          }
        },
        params = {
          subscriptionId: subscriptionId
        };

      baseService.remove(options, params);
    };
    let accountListDeferredParty;
    const getAccountListParty = function(deferred, party, accountType) {
      const options = {
          url: "parties/{party}/accounts?accountType={accountType}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },
        params = {
          party: party,
          accountType: accountType
        };

      baseService.fetch(options, params);
    };
    let accountListDeferredUser;
    const getAccountListUser = function(deferred, party, userId, accountType) {
      const options = {
          url: "accountAccess?partyId={party}&userId={userId}&accountType={accountType}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },
        params = {
          party: party,
          userId: userId,
          accountType: accountType
        };

      baseService.fetch(options, params);
    };
    let activityEventActionListDeferred;
    const getActivityEventActionList = function(deferred, moduleId) {
      const options = {
          url: "activityEventActions?moduleId={moduleType}&alertType=S",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },
        params = {
          moduleType: moduleId
        };

      baseService.fetch(options, params);
    };
    let userDetailsDeferred;
    const getUserDetails = function(deferred, userId) {
      const options = {
          url: "users/{userId}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },
        params = {
          userId: userId
        };

      baseService.fetch(options, params);
    };
    let getEnterpriseRolesDeferred;
    const getEnterpriseRoles = function(deferred) {
      const options = {
        url: "enterpriseRoles?isLocal=true",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };
    let searchUserDetailsDeferred;
    const searchUserDetails = function(deferred, userType, partyId) {
      const options = {
          url: "users?userType={userType}&partyId={partyId}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },
        params = {
          userType: userType,
          partyId: partyId
        };

      baseService.fetch(options, params);
    };

    return {
      getNewPartyDetailsModel: function() {
        return new PartyDetailsModel();
      },
      getSubscriptionForParty: function(partyId) {
        subscriptionForPartyDeferred = $.Deferred();
        getSubscriptionForParty(subscriptionForPartyDeferred, partyId);

        return subscriptionForPartyDeferred;
      },
      getSubscriptionForUser: function(userId) {
        subscriptionForUserDeferred = $.Deferred();
        getSubscriptionForUser(subscriptionForUserDeferred, userId);

        return subscriptionForUserDeferred;
      },
      getNewSubscribedActionModel: function() {
        return new SubscribedActionModel();
      },
      getNewActionSubscriptionModel: function() {
        return new ActionSubscriptionModel();
      },
      getNewSubscriberModel: function() {
        return new SubscriberModel();
      },
      getNewActivityEventActionModel: function() {
        return new ActivityEventActionModel();
      },
      createSubscription: function(subscriptionModel) {
        createSubscriptionDeferred = $.Deferred();
        createSubscription(subscriptionModel, createSubscriptionDeferred);

        return createSubscriptionDeferred;
      },
      updateSubscription: function(subscriptionModel, subscriptionId) {
        updateSubscriptionDeferred = $.Deferred();
        updateSubscription(subscriptionModel, subscriptionId, updateSubscriptionDeferred);

        return updateSubscriptionDeferred;
      },
      deleteSubscription: function(subscriptionId) {
        deleteSubscriptionDeferred = $.Deferred();
        deleteSubscription(subscriptionId, deleteSubscriptionDeferred);

        return deleteSubscriptionDeferred;
      },
      getAccountListParty: function(party, accountType) {
        accountListDeferredParty = $.Deferred();
        getAccountListParty(accountListDeferredParty, party, accountType);

        return accountListDeferredParty;
      },
      getAccountListUser: function(party, userId, accountType) {
        accountListDeferredUser = $.Deferred();
        getAccountListUser(accountListDeferredUser, party, userId, accountType);

        return accountListDeferredUser;
      },
      getActivityEventActionList: function(moduleId) {
        activityEventActionListDeferred = $.Deferred();
        getActivityEventActionList(activityEventActionListDeferred, moduleId);

        return activityEventActionListDeferred;
      },
      getUserDetails: function(userId) {
        userDetailsDeferred = $.Deferred();
        getUserDetails(userDetailsDeferred, userId);

        return userDetailsDeferred;
      },
      searchUserDetails: function(userType, partyId) {
        searchUserDetailsDeferred = $.Deferred();
        searchUserDetails(searchUserDetailsDeferred, userType, partyId);

        return searchUserDetails;
      },
      getEnterpriseRoles: function() {
        getEnterpriseRolesDeferred = $.Deferred();
        getEnterpriseRoles(getEnterpriseRolesDeferred);

        return getEnterpriseRolesDeferred;
      }
    };
  };

  return new AlertsSubscriptionModel();
});