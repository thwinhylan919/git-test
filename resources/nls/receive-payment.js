define([], function() {
  "use strict";

  const TransactionLocale = function() {
    return {
      root: {
        payments: {
          peertopeer: {
            existingUser: {
              email: "Registered Email",
              password: "Password"
            }
          }
        },
        common: {
          cancel: "Cancel",
          login: "Login",
          registration: "Registration"
        }
      },
      ar: false,
      fr: true,
      cs: false,
      sv: false,
      en: false,
es :true,
      "en-us": false,
      el: false
    };
  };

  return new TransactionLocale();
});