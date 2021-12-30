define([], function() {
  "use strict";

  const APIConsumptionReportLocale = function() {
    return {
      root: {
        fromDate: "From Date",
        toDate: "To Date",
        frequency: "Frequency",
        duration: "Duration",
        select: "Select",
        partyId: "Party Id",
        partyName: "Party Name",
        accessPoint: "Touch Point",
        userSegment: "User Segment",
        userId: "User Id"
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

  return new APIConsumptionReportLocale();
});