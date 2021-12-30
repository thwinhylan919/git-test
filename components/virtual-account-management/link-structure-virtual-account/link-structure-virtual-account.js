/**
 * link-structure-virtual-account helps to add accounts for a particular structure for a particular id
 *
 * @module virtual-account-managemnt
 * @requires {ojcore} oj
 * @requires {knockout} ko
 * @requires {jquery} $
 * @requires {object} ResourceBundle
 */
define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "ojL10n!resources/nls/link-structure-account",
  "ojs/ojoption",
  "ojs/ojtable",
  "ojs/ojpagingcontrol",
  "ojs/ojpagingtabledatasource",
  "ojs/ojcheckboxset",
  "ojs/ojradioset",
  "ojs/ojvalidationgroup",
  "ojs/ojarraydataprovider",
  "ojs/ojarraytabledatasource"
], function(oj, ko, $, ResourceBundle) {
  "use strict";

  /** Structure Account mapping for a particular structure of the party.
   *
   * @param {Object} rootParams  - An object which contains contect of dashboard and param values.
   * @return {Function} Function.
   * @return {Object} GetNewKoModel.
   *
   */
  return function(rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    self.resource = ResourceBundle;
    rootParams.baseModel.registerElement("search-box");
    self.accountListDetailsDataSource = ko.observable();
    self.dataSource = ko.observableArray();
    self.selectedHeaderAccount = ko.observable();
    self.headerAccount = ko.observable();
    self.limit = "0";
    self.offset = "0";
    self.realAccLinkage = "S";
    self.viewTable = ko.observable(false);
    self.accountList = ko.observable();
    self.realCustomerName = rootParams.dashboard.userData.userProfile.accessibleEntityDTOs[0].partyName;
    self.realCustomerNo = rootParams.dashboard.userData.userProfile.partyId.value;
    self.realAccountNo = rootParams.rootModel.realAccountNo;
    self.virtualAccountData = ko.observable(rootParams.rootModel.virtualAccountData());
    self.allCheck = ko.observableArray();

    const newArr = [];

    self.headerText = ko.observableArray([{
        renderer: oj.KnockoutTemplateUtils.getRenderer("checkbox_tmpl", true),
        headerRenderer: oj.KnockoutTemplateUtils.getRenderer("checkbox_hdr_tmpl", true),
        sortProperty: "none"
      },
      {
        headerText: self.resource.virtualAccountNo,
        field: "virtualAccountDisplayValue",
        renderer: oj.KnockoutTemplateUtils.getRenderer("virtualAccountNumber", true)
      },
      {
        headerText: self.resource.virtualAccountName,
        field: "childAccountName",
        renderer: oj.KnockoutTemplateUtils.getRenderer("childAccountName", true)
      },
      {
        headerText: self.resource.creationDate,
        field: "accOpenDate",
        renderer: oj.KnockoutTemplateUtils.getRenderer("dateIdentifier", true)
      }
    ]);

    /**
     * This function will be used to add the selected accounts from the list of accounts from table and then close the overlay.
     *
     * @memberOf link-structure-virtual-account
     * @function tableFieldsDTO
     * @param {Object} data - To be passed for specific operation.
     * @returns {void}
     */
    self.tableFieldsDTO = function(data) {
      self.accountList($.map(data, function(v) {
        const newDTO = {};

        newDTO.virtualAccountNo = v.id;
        newDTO.virtualAccountDisplayValue = v.id.displayValue;
        newDTO.childAccountName = v.virtualAccountName;
        newDTO.accOpenDate = v.openingDate;
        newDTO.accountCurrency = v.currencyCode;
        newDTO.selectedAccount = ko.observableArray();

        return newDTO;
      }));
    };

    if (self.virtualAccountData().length > 0) {
      for (let i = 0; i < self.virtualAccountData().length; i++) {
        newArr.push(self.virtualAccountData()[i]);
      }

      self.tableFieldsDTO(self.virtualAccountData());

      if (newArr.length) {
        self.dataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.accountList(), {
          keyAttributes: "virtualAccountNo"
        })));

        self.viewTable(true);
      }
    } else {
      self.dataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource([], {})));
      self.viewTable(true);
    }

    /**
     * This function will be used to add all acounts based on select all option for for all the check boxes
     *
     * @memberOf link-structure-virtual-account
     * @function selectAllListener
     * @param {object} event to be passed for handler
     * @returns {void}
     */
    self.selectedAccts = [];

    self.selectAllListener = function(event) {
      if(event.detail.value[0]) {
        self.allCheck.push("all");

        for(let j= 0; j < self.accountList().length; j++) {
            self.accountList()[j].selectedAccount.push(self.accountList()[j].virtualAccountNo);
            self.selectedAccts.push(self.accountList()[j].virtualAccountNo);
        }
      } else if (event.detail.previousValue[0]) {

        for(let j= 0; j < self.accountList().length; j++) {
          self.accountList()[j].selectedAccount([]);
        }

        self.selectedAccts = [];
        self.allCheck([]);
      }
    };

    /**
     * This function will be used to add accounts selected through checkbox one by one.
     *
     * @memberOf link-structure-virtual-account
     * @function selectedAccountListener
     * @param {Object} event - To be passed for the selected account.
     * @returns {void}
     */
    self.selectedAccountListener = function(event) {
      if (event.detail.updatedFrom === "internal") {
        if (event.detail.value[0]) {
          self.selectedAccts.push(event.detail.value[0]);
        } else if (event.detail.previousValue[0]) {
          self.selectedAccts.splice(self.selectedAccts.indexOf(event.detail.value[0]), 1);
        }
      }
    };

    /**
     * This function will be used to add the selected accounts from the list of accounts from table and then close the overlay.
     *
     * @memberOf link-structure-virtual-account
     * @function addAccount
     * @returns {void}
     */
    self.addAccount = function() {
      const selectedAccountDetailsArray = [];

      for (let i = 0; i < self.selectedAccts.length; i++) {
        selectedAccountDetailsArray.push(ko.utils.arrayFirst(self.accountList(), function(element) {
          return element.virtualAccountNo === self.selectedAccts[i];
        }));
      }

      self.selectedAccountArray(selectedAccountDetailsArray);
      rootParams.closeHandler();
    };

    /**
     * This function will be used to clear the selected accounts from the list of accounts from table.
     *
     * @memberOf link-structure-virtual-account
     * @function clearAllAccounts
     * @returns {void}
     */
    self.clearAllAccounts = function() {
      self.selectedAccts = [];

      for(let j= 0; j < self.accountList().length; j++) {
        self.accountList()[j].selectedAccount([]);
      }

      self.allCheck([]);
    };
  };
});
