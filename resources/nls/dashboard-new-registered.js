define(["ojL10n!resources/nls/generic"], function(Generic, initiateLC) {
  "use strict";

  const DashboardNewLocale = function() {
    return {
      root: {
        generic : Generic,
        initiateLC : initiateLC,
        heading: {
          zigmax: "FuturaMax"
        },
        labels: {
          welcome:"Welcome to FuturaMax!!",
          zigmax1:"With FuturaMax, you can manage your money at one place, even if they are held at other banks.",
          zigmax2:"You can discover, where your money really goes as FuturaMax will help you",
          zigmax3:"to comprehensively track your spends across banking relationships.",
          zigmax4:"You are only require to link your savings accounts, checking accounts, credit cards or loan accounts maintained with other banks with FuturaMax as one time process.",
          features:"Latest features:",
          linkAccount: "Link Account"
        }
      },
      ar: false,
      en: false,
es :true,
      "en-us": false
    };
  };

  return new DashboardNewLocale();
});
