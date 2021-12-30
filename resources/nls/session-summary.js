define([], function() {
  "use strict";

  const SessionSummaryLocale = function() {
    return {
      root: {
        header: {
          sessionSummary: "Session Summary"
        },
        labels: {
          startDate: "Start Date & Time",
          endDate: "End Date & Time",
          channel: "Channel",
          ipAddress: "IP Address",
          transactionDate: "Transaction Date & Time",
          transactionName: "Transaction Name",
          status: "Status",
          ok: "Ok",
          cancel: "Cancel",
          viewMore: "View More",
          viewLess: "View Less"
        },
        channelType: {
          APINTERNET:"Internet",
          APMOBRESP:"Mobile (Responsive)",
          APSIRICHATBOT:"Siri/Chatbot",
          APWEARABLE:"Wearables",
          APMOBAPP:"Mobile Application",
          MOBILEAPP: "Mobile Application",
          MOBILEBROW: "Mobile Web Browser",
          WEBBROW: "Desktop Web Browser",
          UNKNOWN: "Unknown",
          APSOFTTOKEN:"Soft Token Application",
          SOFTTOKENAPP: "Soft Token Application"
        }
      },
      ar: false,
      fr: true,
      cs: false,
      sv: false,
      en: false,
es :true,
      "en-us": false,
      el: true
    };
  };

  return new SessionSummaryLocale();
});
