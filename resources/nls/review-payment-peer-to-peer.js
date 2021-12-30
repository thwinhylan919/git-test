define([
  "ojL10n!resources/nls/payments-common"
], function (Common) {
  "use strict";

  const PaymentPeerToPeer = function () {
    return {
      root: {
        txnname: "Peer to peer transfer",
        transferto: "Transfer To",
        amount: "Amount",
        transferfrom: "Transfer From",
        note: "Note",
        payvia: "Pay via",
        image: "Payee Photo",
        payToContacts: "Pay to Contacts",
        transfermode: {
          FACEBOOK: "Facebook",
          EMAIL: "Email",
          MOBILE: "Mobile",
          TWITTER: "Twitter"
        },
        common: Common.payments.common,
        generic: Common.payments.generic
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

  return new PaymentPeerToPeer();
});
