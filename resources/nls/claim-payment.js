define([
  "ojL10n!resources/nls/messages-claim-payment",
  "ojL10n!resources/nls/generic"
], function(Messages, Generic) {
  "use strict";

  const TransactionLocale = function() {
    return {
      root: {
        payments: {
          peertopeer: {
            titleRetail: "Claim Payment",
            titleSecurity: "Security Code Verification",
            claimPaymentHeader: "Claim Money",
            enterTransferValue: "Email/Mobile",
            enterSecurityCode: "Security Code",
            purpose: "Purpose",
            remarks: "Remarks",
            amount: "Amount",
            securitycodeClaim: "Enter security code to claim",
            existing: "Existing Customer",
            newUser: "New to Bank",
            existingCustomer: "Are you an existing customer of the bank?",
            paymentConfirm: "Payment processed successfully.",
            registration: "Registration",
            accountInformation: "Account Information",
            peertopeerconfirmation: "Thank you for submitting your details.",
            login: "Login",
            securitycode: "Security Code",
            details: "Details",
            validation: "Validation",
            recievepayment: "Receive payment",
            success: "Success",
            accnotselected: "Account Not selected",
            globalpayee: {
              firstName: "First Name",
              lastName: "Last Name",
              mobileNumber: "Mobile Number",
              phoneNumber: "Phone Number",
              email: "Email",
              aliasValue: "Alias Value",
              aliasType: "Alias Type",
              userName: "User Name",
              password: "Password",
              passwordMatch: "Password doesn't match",
              confirmPassword: "Confirm Password",
              otpmsg: "An OTP has been sent to you for confirming the recipient",
              resendotp: "Resend OTP",
              enterotp: "Enter OTP",
              accountNumber: "Account Number",
              accountName: "Account Name",
              branch: "Branch",
              payeeType: "Payee Type",
              thisBank: "This Bank",
              otherBank: "Other Bank",
              ifsc: "IFSC Code",
              bic:  "BIC Code",
              lookupifsccode: "Lookup IFSC Code",
              transferTo: "Transfer To",
              accountInfo: "Account Information",
              confirmation: "Confirmation",
              userCreatedMsg: "User created successfully. Please Login to continue.",
              review: "Review"
            },
            existingUser: {
              email: "Registered Email",
              password: "Password"
            },
            claimPayment: {
              successmsg: "Successful!",
              successmsg2: "Funds Transferred to {account} successfully.",
              successmsg3: "Reference Number {referenceNumber}",
              logoutMessage: "You will be logged out of the online banking application if you proceed with Cancel. Are you sure you want to continue with Cancel ?"
            }
          }
        },
        common: {
          select: "Select",
          back: "Back",
          submit: "Submit",
          success: "Successful",
          edit: "Edit",
          update: "Update",
          add: "Add",
          cancel: "Cancel",
          confirm: "Confirm",
          initiate: "Initiate",
          create: "Create",
          pay: "Pay",
          done: "Done",
          pleaseSelect: "Please Select",
          search: "Search",
          yes: "Yes",
          no: "No",
          reset: "Reset",
          ok: "Ok",
          verify: "Verify",
          login: "Login",
          logout: "Logout"
        },
        messages: Messages,
        generic: Generic
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
