define([
  "ojL10n!resources/nls/messages-payments",
  "ojL10n!resources/nls/generic"
], function(Messages, Generic) {
  "use strict";

  const TransactionLocale = function() {
    return {
      root: {
        payments: {
          addrecipient_header: "Peer To Peer Payee",
          editrecipient_header: "Edit Peer to Peer Payee",
          newPayee: "Peer To Peer Payee",
          peertopeer: {
            peertopeer: "Peer To Peer"
          },
          payee: {
            addnewrecipient: "Add New",
            reviewHeaderMsg: "You initiated a request to add Peer to Peer Payee. Please review details before you confirm!",
            editReviewHeaderMsg: "You initiated a request to edit Peer to Peer Payee. Please review details before you confirm!",
            image: "Payee Photo",
            uploadImage: "Upload",
            peertopeer: {
              successmsg: "{payee} {type} a/c added to your Payee list!",
              payeename: "Payee Name",
              payeevalue: "Email / Mobile",
              payeenickname: "Nickname"
            }
          }
        },
        common: {
          add: "Add",
          cancel: "Cancel",
          confirm: "Confirm",
          done: "Done",
          review: "Review",
          success: "Successful!",
          back: "Back",
          save: "Save"
        },
        messages: Messages,
        generic: Generic
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

  return new TransactionLocale();
});