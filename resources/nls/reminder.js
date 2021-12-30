define([], function() {
  "use strict";

  const ReminderLocale = function() {
    return {
      root: {
        reminder: {
          labels: {
            reminder: "Reminder",
            alerts: "Alerts",
            viewAll: "View All"
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

  return new ReminderLocale();
});