define([
  "ojL10n!resources/nls/messages-payments",
  "ojL10n!resources/nls/generic",
  "ojL10n!resources/nls/payments-common"
], function(Messages, Generic, Common) {
  "use strict";

  const ForexdealCreate = function() {
    return {
      root: {
        forexDeal: {
          header: "Initiate Forex Deal Booking",
          partyId: "Party ID",
          partyName: "Party Name",
          partyDetails: "Party Details",
          transactionDetails: "Deal Details",
          status: "Status",
          hostReferenceNumber: "Host Reference Number",
          buyDetails: "Buy Details",
          sellDetails: "Sell Details",
          spot: "Spot",
          forward: "Forward",
          currencyDetails: "Currency Details",
          selectCurrencyCombination: "Currency Pair",
          pleaseSelect: "Please Select",
          buy: "Buy",
          amount: "Amount",
          swapDetails: "Swap Details",
          sell: "Sell",
          totalDays: "Total Days",
          totalNoDays: "{bookingDate} - {valueDate} ({noOfDays} Days)",
          initiate: "Initiate",
          cancel: "Cancel",
          reviewHeaderMsg: "You initiated a request for Deal Initiation. Please review details before you confirm",
          transType: "Transaction Type",
          duration: "Duration",
          currencyCombination: "Currency Pair",
          convenienceCharges: "Convenience Charges",
          editSuccessMessage: "You have initiated your deal successfully !",
          exchangeRate: "Exchange Rate",
          dealType: "Deal Type",
          validity: "Validity",
          errorMessageAmount: "Please enter an Amount",
          customFrequency: "Custom Frequency",
          selectDateRange: "Select Date Range",
          fromDate: "From",
          toDate: "To",
          customDays: "{noOfDays} Days",
          rateExpired: "Transaction has timed out, please initiate again.",
          confirmDeal: "Confirm exchange rate before the cut off.",
          confirmationHeader: "Confirmation cut off",
          alt: "Click here to {reference}",
          title: "Click here to {reference}",
          swapReferencenceNumber:"Swap Reference Number"
        },
        generic: Generic,
        common: Common.payments.common,
        messages: Messages
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

  return new ForexdealCreate();
});