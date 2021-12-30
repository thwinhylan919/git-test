define(["ojL10n!resources/nls/generic"], function(Generic, initiateLC) {
  "use strict";

  const AggreateAccountLocale = function() {
    return {
      root: {
        generic: Generic,
        initiateLC: initiateLC,
        heading: {
          sites: "Most Popular Sites"
        },
        labels: {
          bankLogo: "Bank Logo",
          bankName: "Bank Name",
          oauth_enabled: "Authorization Enabled",
          noData: "No Data:",
          addExtBank: "Add External Accounts",
          registeraccount: "Register Account",
          unregisteraccount: "Unregister Account",
          regunregaccount: "Register/Unregister Account",
          regsuccessfully: "{bankName} registered successfully",
          messagesucc: "Message",
          deleteSuccessMessage: "Bank has been Unregistered",
          completed: "Completed",
          linkAccount: "Link Account",
          cancel: "Cancel",
          linkButton: "Link",
          deLinkButton: "Delink",
          backToDashboard: "Back To Dashboard",
          delinkAccount: "Delink Account",
          confirmMessage: "Do you want to delink the account?",
          confirmButton: "Confirm",
          cancelButton: "Cancel",
          status: "Status"
        },
        messages: {
          sucessfull: "Successful"
        }

      },
      ar: false,
      en: false,
es :true,
      "en-us": false
    };
  };

  return new AggreateAccountLocale();
});