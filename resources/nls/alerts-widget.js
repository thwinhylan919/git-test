define([], function() {
  "use strict";

  const CasaAccountOverviewLocale = function() {
    return {
      root: {
        accountDetails: {
          labels: {
            alerts: "Alerts",
            alertCount: "Showing {displayCount} of {totalCount}",
            alertsHeader: "Alerts ({count})",
            trash: "Trash",
            delete: "Delete",
            listview: "Swipe to reveal on list view item",
            action: "Swipe Action"
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

  return new CasaAccountOverviewLocale();
});