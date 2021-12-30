define([
  "ojL10n!resources/nls/conventional-maturity-instructions",
  "ojL10n!resources/nls/generic"
], function(ConventionalMaturityInstructions, Generic) { "use strict";

  const TermDepositOpen = function() {
    return {
      root: {
        openTermDeposit: {
          holdingPatternType: {
            SINGLE: "Single",
            JOINT: "Joint"
          },
          updatePanNo: "Update PAN Number",
          holdingPattern: {
            holdingDetails: "Holding Details",
            holdingPattern: "Holding Pattern",
            selectHoldingPattern: "Select Holding Pattern",
            single: "Single",
            joint: "Joint",
            primaryAccHolder: "Primary Account Holder",
            jointAccHolder1: "Joint Account Holder 1",
            jointAccHolder2: "Joint Account Holder 2",
            currentHoldingPattern: "Current Holding Pattern : Joint",
            modifyHoldingPattern: "Click on the below option if you wish to modify it to single"
          },
          placeholder: {
            pleaseSelect: "Please Select"
          },
          islamicMaturityInstructions: {
            A: "Close on Maturity",
            I: "Renew Principal and Profit",
            P: "Renew Principal and Pay Out the Profit",
            S: "Renew Special Amount and Pay Out the Remaining Amount",
            T: "Renew Profit and Pay Out the Principal"
          },
          tenure: {
            day: "{day} Day",
            month: "{month} Month",
            year: "{year} Year",
            Days: "{day} Days",
            Months: "{month} Months",
            Years: "{year} Years",
            days: "Days",
            months: "Months",
            years: "Years"
          },
          tenureFormat: "{years} Year(s), {months} Month(s), {days} Day(s)",
          depositDetails: {
            depositDetails: "Deposit Details",
            products: "Select Product",
            depositAmount: "Deposit Amount",
            currentExchangeRate: "Current Exchange Rate",
            exchangeAmount: "Exchange Amount",
            productAmountMessage: "Amount should be between {minAmount} and {maxAmount}",
            depositTenure: "Deposit Tenure",
            tenure: "Tenure",
            productTenureMessage: "Minimum allowed is {minTenure} and Maximum allowed is {maxTenure}",
            calculateMaturity: "Calculate Maturity",
            calculateExchangeAmount: "Calculate Exchange Amount",
            sourceAccount: "Source Account",
            depositNumber: "Deposit Number",
            selectCreditAccount: "Select Credit Account",
            maturityDate: "Maturity Date",
            interestRate: "Interest Rate",
            viewInterestRate: "View Interest Rates",
            maturityAmount: "Maturity Amount",
            maturityDetails: "Maturity Details",
            alt: {
              viewInterestRate: "View Interest Rates"
            }
          },
          nominationDetails: {
            nominationDetails: "Nomination Details",
            nomineeName: "Nominee Name",
            guardianName: "Guardian Name",
            addNominee: "Add Nominee",
            errorMessage: {
              minorError: "Please enter guardian details since date of birth of nominee is less than 18 years.",
              notMinorError: "Since nominee is not a minor, guardian details are not required."
            }
          },
          interestslab: {
            amount: "Amount ({currency})"
          },
          depositTypeDescription: "Deposit Types",
          newDeposit: "New Deposit",
          tdHeading: "New {depositType} Deposit",
          noProductMapped: "Please contact bank to create a Deposit.",
          referenceNumber: "Reference Number {refNo}",
          transactionMessage: "Your new Term Deposit has been created!",
          initiationMessage: "Transaction has been initiated successfully and is pending for approval",
          invalidBankCode: "Please validate bank code by clicking on Submit",
          payoutInstructions: {
            payoutInstructions: "Payout Details",
            maturityInstruction: "Maturity Instruction",
            accTransferOption: "Account Transfer Option",
            networkType: "Network Type",
            accNumber: "Account Number",
            accName: "Account Name",
            bankCode: "Bank Code",
            payoutType: "Payout Type",
            submit: "Submit",
            bankAddress: "Bank Address",
            or: "or",
            lookUpBankCode: "Look Up Bank Code",
            payTo: "Pay To",
            paidTo: "Paid to",
            transferTo: "Transfer Account",
            bankname: "Bank Name",
            branch: "Branch",
            address: "Address",
            renewAmount: "Roll over Amount",
            networkTypeMessage: "Please select Domestic Network Type",
            payoutTypes: {
              I: "Internal Account",
              O: "Own Account",
              E: "Domestic Bank Account",
              INT: "International Bank Account"
            },
            interestDate: "Interest Date",
            frequency: "Frequency",
            principal: "Pay Principal To",
            interest: "Pay Interest To"
          },
          validate: {
            emptyAmount: "Please Enter Deposit Amount",
            emptyTenure: "Please Enter Tenure",
            emptyDate: "Please Enter Maturity Date",
            emptyProduct: "Please select a Product"
          },
          INITIATED: "Initiated",
          ACCEPTED: "Pending Approval"
        },
        common: {
          successful: "Successful!"
        },
        tenureDays:{
          tenureLabel: "{day} Days",
          thirtyDaysLabel:"30 Days",
          thirtyDaysValue: 30,
          sixtyDaysLabel:"60 Days",
          sixtyDaysValue:60,
          nintyDaysLabel:"90 Days",
          nintyDaysValue:90,
          oneTwentyDaysLabel:"120 Days",
          oneTwentyDaysValue:120
        },
        generic: Generic,
        conventionalMaturityInstructions:ConventionalMaturityInstructions
      },
      ar: true,
      fr: true,
      cs: true,
      sv: true,
      en: false,
es :true,
      "en-us": false,
      el: false
    };
  };

  return new TermDepositOpen();
});
