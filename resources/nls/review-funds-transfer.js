define([], function() {
  "use strict";

  const AccountDetailsLocale = function() {
    return {
      root: {
        fileupload: {
          filerefid: "File Reference id",
          recrefid: "Record Reference id",
          amount: "Amount",
          debitaccountid: "Debit Account Number",
          review: "Review",
          approvaltype: "Approval Type",
          record: "Record level",
          file: "File level"
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

  return new AccountDetailsLocale();
});