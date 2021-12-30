define([], function() {
  "use strict";

  const pageBannerLocale = function() {
    return {
      root: {
        pageBanner: {
          labels: {
            banking: "Banking<span>.</span>Unprecedented<span>.</span>",
            assurance: "Your financial security guaranteed.",
            login: "Login",
            title: "We have build something new for you!",
            alexa: "'Hey Alexa, ask Futura Bank how much is my Account balance?'",
            billPayment: "From making bill payment to track your spending, now you can manage your Futura Bank account by simply talking with Alexa.",
            netBanking: "To make your internet banking experience seamless, Futura Bank has introduced Face recognition for unlocking your Futura Bank application, Banking on the watch and anytime video and voice assistance on your internet banking."
          },
          alt: {
            alexa: "Alexa Logo",
            pageBanner: "Page Banner"
          },
          features: "Set of features"
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

  return new pageBannerLocale();
});