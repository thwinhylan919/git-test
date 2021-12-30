  define(function () {
    "use strict";

    const viewstructuretree = function () {
      return {
        root: {
          header: "Virtual Accounts Structure",
          treeView: "Tree View",
          tabularView: "Tabular View",
          treeViewTitlemsg: "Click for Tree view",
          tableViewTitlemsg: "Click for Tabular View",
          realAccountNumber: "Real Account Number",
          structureCode: "Structure Code",
          structureName: "Structure Name",
          edit: "Edit",
          back: "Back",
          cancel: "Cancel",
          ok: "Ok",
          yes: "Yes",
          no: "No",
          askForDelete: "Are you sure you want to delete this Virtual Accounts Structure?",
          delete: "Delete",
          deleteConfirm: "Virtual Accounts Structure",
          balanceDetails: "Account Balance Details",
          totalbalance: "Total Balance",
          error: "Error",
          zeroBalanceError: "Balance of all the child accounts should be zero to delete this structure",
          structureDeleteMsg: "Virtual Accounts Structure deleted successfully.",
          goToOverview: "Go To Overview",
          headerAccountNumber: "Header Account Number",
          createMoreStructure: "Create More Structure",
          goToDashboard: "Go to Dashboard",
          virtualMultiCurrencyAccountNo : "Virtual Multi-Currency Account Number"
        },
        ar: true,
        fr: true,
        cs: true,
        sv: true,
        en: false,
es :true,
        "en-us": false,
        el: true
      };
    };

    return new viewstructuretree();
  });