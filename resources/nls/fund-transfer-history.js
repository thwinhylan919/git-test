define([
  "ojL10n!resources/nls/messages-payments",
  "ojL10n!resources/nls/generic",
  "ojL10n!resources/nls/payments-common"
], function(Messages, Generic, Common) {
  "use strict";

  const TransactionLocale = function() {
    return {
      root: {
        history: {
          addrecipient_header: "Add Payee",
          self:"Own Account",
          placeHolder:"Please Select",
          allPayees:"All",
          download: "Download",
          errorMessage:"No matches found for the search criteria specified.",
          errorMessageDate:"To Date field cannot be greater than the From Date field.",
          showMoreOptions:"More Search Options",
          showLessOptions:"Less Search Options",
          transferTypeList:{
            SELFFT:"Self",
            SELFFT_PAYLATER:"Self Transfer Pay Later",
            INTERNALFT:"Internal",
            INTERNALFT_PAYLATER:"Internal Transfer Pay Later",
            INDIADOMESTICFT:"Domestic",
            INDIADOMESTICFT_PAYLATER:"Domestic Transfer Pay Later",
            DOMESTICDRAFT:"Domestic Draft",
            DOMESTICDRAFT_PAYLATER:"Domestic Draft Pay Later",
            PEER_TO_PEER:"Peer to Peer"
          },
          statusHeaders:{
            success:"Successful",
            failed:"Failed",
            inprogress:"In Progress"
          }
        },
        headers: {
          fundTransferHistory: "Fund Transfer History",
          payeeName:"Payee Name",
          transactionReferenceNumber:"Transaction Reference Number",
          fromDate:"From Date",
          toDate:"To Date",
          viewDetails:"View Details",
          reInitiate: "Re-Initiate"
        },
        tableHeaders: {
          header:"Fund Transfer History",
          date: "Date",
          debitAccountId: "From Account",
          payeeDetails: "Payee Details",
          transferType: "Transfer Type",
          amount: "Amount",
          referenceNumber: "Reference Number",
          status: "Status",
          actions:"Actions"
        },
        common: Common.payments.common,
        messages: Messages,
        generic: Generic
      }
    };
  };

  return new TransactionLocale();
});
