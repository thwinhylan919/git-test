define([
  "ojL10n!resources/nls/messages-merchant",
  "ojL10n!resources/nls/generic"
], function(Messages, Generic) {
  "use strict";

  const TransactionLocale = function() {
    return {
      root: {
        merchant: {
          header: "Merchant Management",
          outwardHeader: "Outward Remittance - Merchant Management",
          inwardHeader: "Inward Remittance - Merchant Management",
          remittanceType: "Select Remittance Type",
          remittanceHeader: "Remittance Type",
          createMerchantConfirm: "Merchant Maintenance",
          deleteMerchantConfirm: "Merchant Maintenance",
          editMerchantConfirm: "Merchant Maintenance",
          merchant_header: "Merchant Onboarding",
          merchantid: "Merchant Id",
          merchantdesc: "Merchant Description",
          accounttype: "Account Type",
          outward: "Outward Remittance",
          inward: "Inward Remittance",
          accountidnumber: "Account Number",
          successUrl: "Success URL",
          failureUrl: "Failure URL",
          redirectionUrl: "Redirection URL",
          casa: "Current and Savings",
          successmsg: "Your updates regarding Merchant management have been saved.",
          none: "None",
          checksumAlgorithm: "Checksum Algorithm",
          securityKey: "Security Key",
          securitykeyvalidationmsg: "Security key length must be 16",
          checksumtype: "Checksum Type",
          deleteaccount: "Are you sure you want to delete merchant {name}?",
          deleteaccountsuccess: "Delete request of merchant {name}",
          branch: "Branch",
          accounts: "Accounts",
          alt: "Click here for more Details",
          title: "Click here for more Details",
          questionText: "Are you sure you want to cancel Merchant Creation?",
          list: "Merchant List Details",
          creditAccountDetails: "Credit Account Details",
          serviceCharge: "Service Charge Account Details",
          commissionAccountFlag: "Define another account for service charge",
          userAccountFlag: "Default customer's debit account number as request parameter",
          responseRedirections: "Response Redirections",
          urls: "URL",
          checksumDetails: "Checksum Details",
          message: "Please enter valid description",
          initiateHeaderForOutward: "You initiated a request for Outward Remittance - Merchant Management. Please review details before you confirm!",
          initiateHeaderForInward: "You initiated a request for Inward Remittance - Merchant Management. Please review details before you confirm!"
        },
        common: {
          select: "Select",
          save: "Save",
          cancel: "Cancel",
          view: "View",
          create: "Create",
          edit: "Edit",
          search: "Search",
          done: "Done",
          back: "Back",
          review: "Review",
          success: "Successful!",
          delete: "Delete",
          ok: "Ok",
          confirm: "Confirm",
          clear: "Clear"
        },
        qrCode: "QR Code",
        clickHereForQrCode: "Click Here For QR Code",
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