define([], function() {
  "use strict";

  const AboutLocale = function() {
    return {
      root: {
        header: "Contact Us",
        productShortName: "MTB",
        productName: "Myanma Tourism Bank",
        address: "437/(KA),Pyay Road,8 Ward,Kamayut Township,Yangon,Myanmar",
        contact: "09682682682",
        poweredBy: "Powered By",
        poweredByValue: "Oracle",
        copyright: "www.facebook.com/MyanmaTourismBank",
        build: "Build"
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

  return new AboutLocale();
});