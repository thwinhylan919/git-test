define([
  "ojL10n!lzn/beta/resources/nls/origination-generic"
], function(Generic) {
  "use strict";

  const accountFundingLocale = function() {
    return {
      root: {
        compName: "account-funding",
        initialAmountTD: "Deposit Amount",
        initialAmount: "Initial Deposit Amount",
        minAmount: "{amount} minimum",
        tenure: "Tenure",
        minMaxTenure: "Select between {days} Day(s) to {years} Year(s)",
        yearsMessage: "Please enter valid number of years",
        years: "Year(s)",
        monthsMessage: "Please enter valid number of months",
        months: "Month(s)",
        days: "Day(s)",
        fundingTypeClick: "Click For Funding Type",
        fundingTypeOnClick: "Click For Fund Type",
        daysMessage: "Please enter valid number of days",
        frequency: "Interest Payout Frequency",
        frequencyText: "How would you like to receive interest?",
        interestRate: "Interest Rate",
        interestRatePercent: "{interestRate}%",
        interestPayment: "Interest Payment",
        term: "{years} {yearsText}, {months} {monthsText}, {days} {daysText}",
        frequencyList: {
          MONTHLY: "Monthly",
          DAILY: "Daily",
          WEEKLY: "Weekly",
          FORTNIGHTLY: "Fortnightly",
          BIMONTHLY: "Bimonthly",
          QUARTERLY: "Quarterly",
          HALF_YEARLY: "Half Yearly",
          YEARLY: "Yearly",
          MATURITY: "Maturity",
          NONE: "None"
        },
        accountNo: "Account Number",
        branchCode: "Bank ID",
        branchName: "Bank Branch",
        partyName: "Account Name",
        networkProvider: "Card Type",
        cardNumber: "Card Number",
        expiryDate: "Expiration Date",
        nameonCard: "Name on Card",
        securityCode: "Security Code",
        whatisThis: "What is this?",
        whatisThisTextDebit: "Your security code is the 3 digit number printed on the back of your card in the signature line.",
        whatisThisTextCredit: "Your security code is the 3 digit number printed on the back of your card in the signature line.<br> On your American Express card, the 4 digit security code is printed on the front of the card just above the embossed card number.",
        month: "Month",
        year: "Year",
        debit: "Debit",
        credit: "Credit",
        card: "Card",
        fundthrough: "Funding Through",
        fundThrough: "{networkProvider} {cardType} {card}: {aanNumber}",
        fundThroughAcct: "{accountNoText}: {accountNo}",
        urFundingSource: "Your Funding Source",
        selectMethod: "Please select your method of payment",
        option1: "I will transfer funds from another account with the bank.",
        option1sfx: "Your own Savings or Checking account",
        option2: "I will transfer funds from my account at another bank.",
        option2sfx: "Your bank charges may apply",
        option3: "I will use my Credit Card",
        option4: "I will use my Debit Card",
        later: "I will fund my deposit later.",
        laterSfx: "Your account will be processed once we receive your deposit",
        securityReason: "For security purposes your card information will not be saved. You will have to enter this information again when you retrieve your application. Do you still wish to proceed with save?",
        fundingOption: {
          CARD_CREDIT: "I will use my Credit Card",
          CARD_DEBIT: "I will use my Debit Card",
          DDAO: "I will transfer funds from another account with the bank.",
          COLL: "I will transfer funds from my account at another bank.",
          LATER: "I will fund my deposit later."
        },
        messages: {
          fundingOption: "Please select a funding option",
          cardType: "Please select a card type",
          cardName: "Please enter a card name",
          cardNumber: "Please enter a valid card number",
          cardCvv: "Please enter a valid security code",
          cardExpMonth: "Please enter an expiry month",
          cardExpYear: "Please enter an expiry year",
          validCardName: "Please enter a valid card name",
          accountSelect: "Please select an account",
          depositAmount: "Please enter a valid amount",
          years: "Please enter valid number of years",
          months: "Please enter valid number of months",
          days: "Please enter valid number of days",
          frequency: "Please select interest payout frequency"
        },
        generic: Generic
      },
      ar: true,
      fr: true,
      cs: true,
      sv: true,
      en: false,
      "en-us": false,
      el: true
    };
  };

  return new accountFundingLocale();
});
