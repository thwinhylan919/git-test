define([], function() {
    "use strict";

    const securedBanking = function() {
      return {
        root: {
          header: "Easy and Secured Banking",
          description: "Futura Bank Mobile application is a convenient and secure way of banking with a features catering to you all your financial needs.",
          tools: {
            title:{
              authentication: "Face/ Fingerprint/ PIN/ Pattern based authentication",
              snapshot: "Quick Snapshot",
              chatbot: "Chatbot",
              qrPayment: "QR based Payment",
              siriPay: "Siri Payments & Balance Inquiry",
              iMessage: "iMessage Payment",
              facebook: "Pay to Facebook contact",
              pushNotification: "Push Notification",
              download: {
                description: "To know more download Futura Bank application today, and enjoy banking at your fingertips!",
                label: "Download"
              }
            }
          },
          features: "Features of banking",
          alt: {
            easyBanking: "Easy Banking Icon",
            notification: "Message Notification Icon"
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

    return new securedBanking();
  });