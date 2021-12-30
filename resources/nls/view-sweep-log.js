define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";

  const viewSweepLog = function() {
    return {
      root: {
        header: {
          sweepLog: "Sweep Log"
        },
        download:{
          pdf:"PDF",
          csv:"CSV"
        },
        noData: "No New Sweeps",
        subData: "Check this section for sweep details",
        sweepDetails:"Sweep Details",
        sweepDetailsTitle:"Sweep Details",
        viewAll:"View All",
        downloadTitle:"Click to Download",
        downloadMessage:"Click to Download",
        refreshTitle:"Click to Refresh",
        refreshMessage:"Click to Refresh",
        viewAllTitle:"Click to View All",
        viewAllMessage:"Click to View All",
        refresh: "Refresh",
        structure: "Structure",
        status: "Status",
        fromDate: "From Date",
        toDate: "To Date",
        sweep: "Sweep",
        downloadPdf: "Download",
        statusTypes: {
          upcoming: "Upcoming",
          executed: "Executed",
          exception: "Exception"
        },
        passCombination: "The document is password protected, it is a combination of the first 4 letters of your name (in capital letters) followed by your date of birth (in combination of first 2 letters of Date and Month).",
        passwordExample: "Example, if your name is Roopa Lal and date of birth is 23-12-1980, then your password is ROOP2312",
        passwordNotification: "Password Combination",
        sweepLogDetails: {
          instructionDesc:"Instruction Description",
          sweeplogdetailTable: "Sweep Log Table",
          dateTime: "Date & Time",
          structureDetails: "Structure Details",
          type: "Type",
          sweepOutAccount: "Sweep out Account",
          sweepOutAmount: "Sweep out Amount",
          exchangeRate: "Exchange Rate",
          sweepInAccount: "Sweep in Account",
          sweepInAmount: "Sweep in Amount",
          sourceAccount: "Source Account",
          destinationAccount: "Destination Account",
          exception: "Exception Message"
        },
        type: {
          sweep: "Sweep",
          reverseSweep: "Reverse Sweep"
        },
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

  return new viewSweepLog();
});