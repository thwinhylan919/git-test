define([
  "jquery"
], function($) {
  "use strict";

  /**
   * @namespace AlertsMaintenance~Model
   * @class AlertsSubscriptionModel
   */
  const AlertsSubscriptionTDModel = function() {
    /**
     * In case more than one instance of model is required
     * we are declaring model as a function, of which new instances can be created and
     * used when required.
     *
     * @class Model
     * @private
     */
    const AccountModel = function() {
        return {
          accountType: null,
          accountId: null,
          accountDisplayId: null,
          alertsAvailable: null,
          activityEventActions: null
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
      },
      PreferenceModel = function() {
        return {
          version: null,
          generatedPackageId: null,
          auditSequence: null,
          destination: null,
          recipientCategory: null,
          transactionAmount: null,
          consolidationRequired: null,
          timeRestricted: null,
          startRestrictedTime: null,
          endRestrictedTime: null,
          urgencyType: null,
          activityId: null,
          eventId: null,
          actionId: null,
          subscriptionId: null,
          subscriptionLevel: null,
          subscriberValue: null,
          subscriptionLevelAccountKey: null,
          destinationAddress: null
        };
      };

    return {
      getNewAccountModel: function() {
        return new AccountModel();
      },
      getNewActivityEventActionModel: function() {
        return new ActivityEventActionModel();
      },
      getNewPreferenceModel: function() {
        return new PreferenceModel();
      },
      getSubscribedAlertList: function() {
        const getSubscribedAlertListDeferred = $.Deferred();

        return getSubscribedAlertListDeferred;
      }
    };
  };

  return new AlertsSubscriptionTDModel();
});