define([], function() {
  "use strict";

  const notifications = function() {
    return {
      root: {
        header:{
          notifications:"Notifications"
        },
        labels:{
          dateTime: "Date",
          message:"Message",
          DetailTitle:"Click to View Details",
          DetailMessage:"Click to View Details",
          viewAll:"View All",
          viewAllTitle:"Click to View All Details",
          viewAllMessage:"Click to View All Details",
          notificationDetails:"Notification Details",
          noData: "No New Notiﬁcations",
          subData: "Check this section for new notiﬁcations",
          back:"Back"
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

  return new notifications();
});