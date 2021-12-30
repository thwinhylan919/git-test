define([], function() {
  "use strict";

  const pendingActionMailLogLocale = function() {
    return {
      root: {
        pendingActionMailDetails: {
          labels: {
            msgText: "Pending For Action",
            msFooterText: "Switch to Approver Dashboard",
            switchMessage: "Go to Mailbox",
            messageHeader: "New Messages in Your Inbox",
            mailbox: "Mailbox",
            noAccess: "No transactions awaiting your approval."
          }
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

  return new pendingActionMailLogLocale();
});