define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";

  const TermDepositPayout = function() {
    return {
      root: {
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
          enterValidAccount: "Enter valid account number",
          renewAmount: "Roll over Amount",
          networkTypeMessage: "Please select Domestic Network Type",
          country: "Country",
          transitNumber: "Transit Number",
          swiftCode: "SWIFT Code",
          beneficiaryName: "Beneficiary Name",
          beneficiaryAddress: "Beneficiary Address",
          correspondenceCharges: "Correspondence Charges",
          internationalTransaction: "Is the foreign Currency being sent to a country other than the home country of currency",
          isInternationalTransaction: {
            yes: "Yes",
            no: "No"
          },
          remittanceCharges: "Charges borne for remittance",
          remittanceChargesOption: {
            B: "Beneficiary (BEN)",
            O: "Remitter (REM)",
            U: "Sharing"
          },
          lookUpSwiftCode: "Lookup SWIFT Code"
        },
        placeholder: {
          pleaseSelect: "Please Select",
          holderName: "Account Holder Name",
          selectAccount: "Select Account",
          currency: "Currency"
        },
        errorMessage: {
            addressError: "Please enter valid address"
        },
        alt: {
          lookUpSwiftCodeAlt: "Lookup SWIFT Code"
        },
        title: {
          lookUpSwiftCodeTitle: "Lookup SWIFT Code"
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
      el: false
    };
  };

  return new TermDepositPayout();
});
