define([

  "knockout",
  "jquery",
  "ojL10n!resources/nls/account-snapshot",
  "./model",
  "baseLogger",
  "framework/js/constants/constants",
  "platform",
  "ojs/ojaccordion"
], function (ko, $, ResourceBundle, Model, BaseLogger, Constants, Platform) {
  "use strict";

  return function (rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    self.resource = ResourceBundle;
    rootParams.dashboard.headerName(self.resource.CasaAccounts);
    self.selectedItem = ko.observable();
    self.dataLoaded = ko.observable(false);
    rootParams.dashboard.fabRequired(false);
    rootParams.dashboard.backAllowed(false);
    self.dataSource = null;
    self.accounts = null;
    rootParams.baseModel.registerComponent("account-snapshot-details", "accounts");
    rootParams.baseModel.registerElement("modal-window");

    self.disableQuickSnapshot = function () {
      $("#goToDashBoardModal").trigger("openModal");
    };

    self.deleteSession = function () {
      Model.deleteSession().then(function () {
        Platform.getInstance().then(function (platform) {
          platform("logOut");
        });
      });
    };

    self.no = function () {
      $("#goToDashBoardModal").trigger("closeModal");
    };

    self.ok = function () {

      const successCallback = function () {
          $("#goToDashBoardModal").trigger("closeModal");
          rootParams.genericViewModel.resetLayout();
        },
        failureCallBack = function () {
          BaseLogger.error("FAILURE IN DELETING ACCOUNT SNAPSHOT FROM APP PREFERENCE");
        };

      Model.getMePreference().then(function (data) {
        const mePreference = data;

        delete mePreference.status;

        ko.utils.arrayForEach(mePreference.userAccessPointRelationship, function (item) {
          if (Constants.currentEntity === item.determinantValue && item.accessPointId === "APSNAPSHOT") {
            item.status = false;
          }
        });

        Model.updateMePreference(ko.mapping.toJSON(mePreference)).then(function () {
          window.plugins.appPreferences.remove(successCallback, failureCallBack, "account_snapshot_status");
          self.deleteSession();
        });
      });

    };

    Model.getDemandDeposits().then(function (data) {
      if (!data.accounts) {
        data.accounts = [];
      }

      ko.utils.arrayForEach(data.accounts, function (item) {
        item.accountId = item.id.displayValue;
      });

      self.accounts = data.accounts;
      self.dataLoaded(true);
    });

    self.selectedItem.subscribe(function (newValue) {
      const selectedAccountData = self.accounts.filter(function (account) {
        return account.accountId === newValue[0];
      })[0];

      rootParams.baseModel.registerComponent("account-snapshot-details", "accounts");

      rootParams.dashboard.loadComponent("account-snapshot-details", {
        accountDetails: selectedAccountData
      }, self);
    });

    self.refreshWidget = function () {
      $(".account-snapshot-accordian-container").ojAccordion("refresh");
    };
  };
});