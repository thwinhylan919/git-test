define([
  "ojs/ojcore",
  "knockout",
  "jquery",

  "./model",
  "ojL10n!resources/nls/sms-primary-account",
  "framework/js/constants/constants",
  "ojs/ojselectcombobox",
  "ojs/ojarraytabledatasource",
  "ojs/ojpagingcontrol",
  "ojs/ojpagingtabledatasource",
  "ojs/ojlistview",
  "ojs/ojswitch",
  "ojs/ojtable",
  "ojs/ojradioset",
  "ojs/ojbutton"
], function(oj, ko, $, Model, resourceBundle, Constants) {
  "use strict";

  return function(Params) {
    const self = this;

    ko.utils.extend(self, Params.rootModel);
    self.resource = resourceBundle;
    self.items = ko.observableArray();
    self.selectedAccount = ko.observable();
    self.isDataLoaded = ko.observable(false);

    self.renderRadioButton = oj.KnockoutTemplateUtils.getRenderer("radio_button", true);
    Params.dashboard.headerName(self.resource.primaryAccountNumber);

    let mePreference = {};

    Model.mePreference().then(function(data) {
      mePreference = data;

      ko.utils.arrayForEach(data.operativeAccount, function(item) {
        if (Constants.currentEntity === item.determinantValue) {
          self.selectedAccount(item.accountId.value);
        }
      });
    });

    Model.getDemandDeposits().then(function(data) {
      const tempData = $.map(data.accounts, function(item) {
        const newObj = {};

        newObj.accountTypeAndNumber = item.id.displayValue + "-" + item.ddaAccountType;
        newObj.partyName = item.partyName;
        newObj.nickName = item.nickName || "-";
        newObj.accountId = item.id.value;

        return newObj;
      });

      ko.utils.arrayPushAll(self.items, tempData);

      self.datasource = new oj.ArrayTableDataSource(self.items, {
        idAttribute: "accountTypeAndNumber"
      });

      self.isDataLoaded(true);

    });

    /**
     * Submit - Click handler for submit.
     *
     * @return {void}  Returns nothing.
     */
    self.submit = function() {
      delete mePreference.status;

      mePreference.operativeAccount = mePreference.operativeAccount.filter(function(item) {
        return item.determinantValue !== Constants.currentEntity;
      });

      mePreference.operativeAccount.push({
        determinantValue: Constants.currentEntity,
        accountId: self.selectedAccount()
      });

      const payload = ko.mapping.toJSON(mePreference);

      Model.updatePreference(payload).then(function() {
        Params.baseModel.showMessages(null, [self.resource.successMsg], "CONFIRMATION");
      });
    };
  };
});