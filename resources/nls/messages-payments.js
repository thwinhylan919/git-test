define([], function() {
  "use strict";

  const MessagesPaymentLocale = function() {
    return {
      root: {
        addPayee: {
          name: "Please enter valid name",
          otp: "Please enter valid OTP"
        },
        payment: {
          email: "Please enter a valid email ID",
          mobile: "Please enter valid mobile number",
          noNetworkSuggested : "We are unable to process your transfer at the moment. Please contact the bank for further information.",
          noNetworkSuggestedLimits : "The amount entered is not within supported network limits. Please enter an amount of a different value.",
          noWalletFutureTransaction : "Wallet account does not support future dated transactions",
          noWalletBalanceTotransfer : "Insufficient Account balance.",
          placeHolderEmail: "Enter Email id",
          placeHolderMobile: "Enter mobile number",
          placeHolderAmount: "Enter Amount",
          placeHolderPurpose: "Enter Purpose",
          placeHolderRemarks: "Enter Remarks"
        },
        payeeInternal: {
          accountnumber: "Please enter valid account number",
          accountname: "Please enter valid account name",
          accountnickname: "Please enter valid account nickname"
        },
        payeeAccDomesticIn: {
          accountnumber: "Please enter valid account number",
          accountname: "Please enter valid account name",
          ifsc: "Please enter valid network code",
          accountnickname: "Please enter valid account nickname"
        },
        payeeAccDomesticUk: {
          accountnumber: "Please enter valid account number",
          accountname: "Please enter valid account name",
          swiftcode: "Please enter valid network code",
          sortcode: "Please enter valid sort code",
          accountnickname: "Please enter valid account nickname"
        },
        payeeAccDomesticSepa: {
          recipientaccnumber: "Please enter valid recipient account number",
          bankcode: "Please enter valid bank code",
          accountnickname: "Please enter valid account nickname",
          debtorid: "Please enter valid debit id",
          debtorname: "Please enter valid debit name",
          debtoraccnumber: "Please enter valid debit account number"
        },
        payeeAccInternational: {
          accountnumber: "Please enter valid account number",
          accountname: "Please enter valid account name",
          swiftcode: "Please enter valid network code",
          bankname: "Please enter valid bank name",
          bankaddress: "Please enter valid bank address",
          accountnickname: "Please enter valid account nickname",
          city: "Please enter valid city name"
        },
        payeeCounterDomesticIn: {
          accountnickname: "Please enter valid account nickname",
          ifsc: "Please enter valid network code",
          recipientname: "Please enter valid recipient name",
          residentialaddress: "Please enter valid residential address",
          postalCode: "Please enter valid postal code",
          identificationnum: "Please enter valid identification number",
          city: "Please enter valid city name"
        },
        payeeCounterInternational: {
          accountnickname: "Please enter valid account nickname",
          swiftcode: "Please enter valid network code",
          bankname: "Please enter valid bank name",
          bankaddress: "Please enter valid bank address",
          recipientname: "Please enter valid recipient name",
          residentialaddress: "Please enter valid residential address",
          postalcode: "Please enter a valid postal code",
          identificationnum: "Please enter valid identification number",
          city: "Please enter valid city name"
        },
        payeeDDDomestic: {
          accountnickname: "Please enter valid account nickname",
          address: "Please enter valid address",
          postalcode: "Please enter a valid postal code",
          city: "Please enter valid city name"
        },
        payeeDDInternational: {
          accountnickname: "Please enter valid account nickname",
          address: "Please enter valid address",
          postalcode: "Please enter a valid postal code",
          city: "Please enter valid city name"
        },
        address: {
          country: "Please select country",
          state: "Please select state",
          invalidCity: "Please specify a valid city",
          city: "Please select city",
          branch: "Please select branch",
          zipcode: "Please enter a valid zip code",
          addressType: "Please Select Address Type",
          selectCity: "Select City",
          selectBranch: "Select Branch",
          selectAddress: "Select Address"
        },
        charactersLeft: "Characters left"
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

  return new MessagesPaymentLocale();
});
