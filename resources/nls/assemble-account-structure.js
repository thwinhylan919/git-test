  define(function () {
    "use strict";

    const viewstructuretree = function () {
      return {
        root: {
          title: "Virtual Accounts Structure",
          treeView: "Tree View",
          tabularView: "Tabular View",
          treeViewTitlemsg: "Click for Tree view",
          tableViewTitlemsg: "Click for Tabular View",
          realAccountNumber: "Real Account Number",
          structureCode: "Structure Code",
          structureName: "Structure Name",
          removeMessage1: "Selected account and all the child accounts beneath will be removed.",
          removeMessage2: "Are you sure you want to remove?",
          edit: "Edit",
          back: "Back",
          cancel: "Cancel",
          ok: "Ok",
          yes: "Yes",
          no: "No",
          askForDelete: "Are you sure you want to delete this Virtual Account Structure?",
          delete: "Delete",
          deleteConfirm: "Delete Confirm",
          balanceDetails: "Account Balance Details",
          link: "Link",
          remove: "Remove",
          validate: "Submit",
          linkAccountHeader: "Link Accounts",
          confirm: "Confirm",
          structureCreateMsg: "Virtual Accounts Structure created successfully.",
          headerAccountNumber: "Header Account Number",
          createMoreStructure: "Create More Structure",
          goToDashboard: "Go To Dashboard",
          moreOptionsAlt: "Click here for more options",
          moreOptionsTitle: "Click here for more options",
          structureUpdateMsg: "Virtual Accounts Structure updated successfully.",
          goToOverview: "Go To Overview",
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