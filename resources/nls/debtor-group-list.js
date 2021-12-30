define([
  "ojL10n!resources/nls/messages-payments",
  "ojL10n!resources/nls/generic",
  "ojL10n!resources/nls/payments-common"
], function(Messages, Generic, Common) {
  "use strict";

  const DebtorGroupListLocale = function() {
    return {
      root: {
        debtors: {
          addnewdebtors: "Add New Debtors",
          managedebtor_header: "Manage Debtors",
          moreOptions: "More Options",
          options: "More Options",
          uploadSuccess: "Debtor Photo {message} Successfully",
          imageMessage: {
            EDIT: "Edited",
            UPLOAD: "Uploaded",
            REMOVE: "Removed"
          },
          labels: {
            request: "Request",
            requestmoney: "Request Money",
            view: "View Details",
            delete: "Delete",
            header: "Debtor List",
            details: "Debtor Details",
            debtorname: "Debtor Name : {name}",
            biccode: "BIC code",
            iban: "IBAN",
            deleteDebtor: "Delete Debtor",
            searchBy: "Name"
          },
          common: Common.payments.common,
          message: {
            delete: "You are about to delete a Debtor- {name} from your list. The Debtor will be deleted from the application  & all details will be lost! Are you sure you want to proceed?"
          },
          messages: Messages,
          generic: Generic
        }
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

  return new DebtorGroupListLocale();
});