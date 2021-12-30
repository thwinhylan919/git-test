/**
 * td-nominee-list contains all the CASA accounts for which nominee details can be displayed.
 *
 * @module nominee
 * @requires {ojcore} oj
 * @requires {knockout} ko
 * @requires {jquery} $
 * @requires {object} tdNomineeListModel
 * @requires {object} ResourceBundle
 */
define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/td-nominee-list",
  "ojs/ojtable",
  "ojs/ojpagingcontrol",
  "ojs/ojarraytabledatasource",
  "ojs/ojpagingtabledatasource",
  "ojs/ojpopup"
], function(oj, ko, $, tdNomineeListModel, ResourceBundle) {
  "use strict";

  /** User should see the landing page for Nominations with View/Add/Edit Nominee option for
   * Term Deposit accounts under Term Deposit tab for account holding pattern as either single or joint
   * and nominee is already registered.
   * If nominee if not registered and account holding pattern is joint
   * then a popup will the specified information related to that user.
   *
   * @param {Object}  rootParams  - An object which contains contect of dashboard and param values
   * @return {Function} function
   */
  return function(rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    self.resource = ResourceBundle;
    self.dataSourceLoaded = ko.observable(false);
    self.accountsdataSource = ko.observable();
    rootParams.baseModel.registerComponent("add-edit-nominee", "nominee");
    rootParams.baseModel.registerComponent("read-nominee", "nominee");
    rootParams.dashboard.headerName(self.resource.tdNominee.header);

    /** All rest will be called once the component is loaded and html will be loaded only after
     * receiving the rest response.
     * Rest response can be either successful or rejected.
     *
     * @instance {object} tdNomineeListModel
     * @param fetchAccountList
     * @response {array}  data  An array containg the response of the rest fired
     */
    tdNomineeListModel.fetchAccountList().then(function(data) {
      let accountsListArray = [];

      /**
       * @param1 {account} data.accounts  contains the list of accounts
       * @param2 {object} a  An instance of the response
       * @return {object}
       */
      accountsListArray = $.map(data.accounts, function(a) {
        return {
          accountNumber: a.id,
          accountValue: a.id.value,
          primaryHolderName: a.partyName,
          holdingPattern: self.resource.tdNominee.holdingPatternType[a.holdingPattern],
          nomineeType: self.resource.tdNominee.isNomineeRegistered[a.nomineeRegistered],
          action: a.holdingPattern + (a.nomineeRegistered ? "-R" : "-NR"),
          accountType: a.ddaAccountType
        };
      });

      self.accountsdataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(accountsListArray, {
        idAttribute: "accountValue"
      }) || []));

      self.dataSourceLoaded(true);
    });

    /**
     * This function will check the different conditions on the basis of account holding pattern
     * and nominee registration type and allows the user to perform different operations as per their
     * specified roles for Term Deposit accounts.
     *
     * @memberof tdNomineeListModel
     * @function actionHandler
     * @param {index} data  - An object containing the context of the selected row of the table.
     * @returns {void}
     */
    self.actionHandler = function(data) {
      const selectedAccountId=ko.mapping.toJS(data.accountNumber);

      switch (data.action) {
        case "SINGLE-NR":
          rootParams.dashboard.loadComponent("add-edit-nominee", {
            selectedAccountId: selectedAccountId,
            selectedAccountType: "TRD",
            iseditable: false,
            landingComponent: "td-nominee-list"
          });

          break;
        case "JOINT-R":
          rootParams.dashboard.loadComponent("read-nominee", {
            selectedAccountId: selectedAccountId,
            selectedAccountType: "TRD",
            iseditable: false,
            landingComponent: "td-nominee-list"
          });

          break;
        case "SINGLE-R":
          rootParams.dashboard.loadComponent("read-nominee", {
            selectedAccountId: selectedAccountId,
            selectedAccountType: "TRD",
            iseditable: true,
            landingComponent: "td-nominee-list"
          });

          break;
        case "JOINT-NR":{

          const popup = document.querySelector("#popup");

          if (popup.isOpen()) {
            popup.close();
          } else {
            popup.open("#action_link" + data.accountNumber.value);
          }

          break;
        }
        default:
          break;
      }
    };

    /** This function will close the popup on either clicking cancel icon of popup or clicking anywhere.
     *
     * @memberof tdNomineeListModel
     * @function closePopup
     * @returns {void}
     */
    self.closePopup = function() {
      const popup = document.querySelector("#popup");

      popup.close();
    };
  };
});
