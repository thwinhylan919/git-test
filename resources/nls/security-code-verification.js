define([], function () {
  "use strict";

  const TransactionLocale = function () {
    return {
      root: {
        payments: {
          peertopeer: {
            enterTransferValue: "Email/Mobile Number",
            enterSecurityCode: "Security Code",
            existing: "Existing Customer",
            paymentId: "Payment ID",
            newUser: "New to Bank",
            selectmode: "Select Mode",
            EMAIL: "Email",
            MOBILE: "Mobile Number",
            mobileno: "Mobile",
            facebook: "Facebook",
            twitter: "Twitter",
            claimPaymentHeader: "Claim Money",
            mode: "Mode",
            twitterPaymentFailure: "Cannot Verify",
            transferAmount: "Transfer Amount",
            twittersigninfailure: "Your Twitter Account Could Not Be Verified",
            paymentIdErrorMessage: "Payment Id cannot be greater than 16 characters",
            aliasType: {
              EMAIL: {
                mode: "Email",
                valueLabel: "Email Address"
              },
              MOBILE: {
                mode: "Mobile",
                valueLabel: "Mobile Number"
              },
              FACEBOOK: {
                mode: "Facebook",
                valueLabel: "Name"
              },
              TWITTER: {
                mode: "Twitter",
                valueLabel: "Twitter Handle"
              }
            }
          }
        },
        common: {
          back: "Back",
          ok: "Ok",
          error: "Error"
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