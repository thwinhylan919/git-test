define(["ojL10n!resources/nls/generic", "ojL10n!resources/nls/manage-category"], function(Generic, Category) {
  "use strict";

  const BillerOnboardingLocale = function() {
    return {
      root: {
        generic: Generic,
        manageCategory: Category,
        heading: {
          billerOnboarding: "Biller Onboarding",
          billerCreateTransaction: "Biller Create transaction",
          billerUpdateTransaction: "Biller Update transaction",
          specifications: "Billers Specifications",
          paymentTerms: "Payment Terms and Validations",
          billerAddress: "Biller Address",
          billerdetails: "Biller Details",
          transactionDeleteName: "Delete Biller"
        },
        labels: {
          alt: "Click here for more Details",
          addRow: "Add Row",
          title: "Click here for more Details",
          notAvailable: "NA",
          billerName: "Biller Name",
          billerId: "Biller Id",
          billerNameAndId: "Biller Name and Id",
          billerType: "Biller Type",
          billerCategory: "Biller Category",
          billerCurrency: "Biller Currency",
          billerStatus: "Biller Status",
          billerImageTitle: "Sample Bill Image Title",
          billerImage: "Sample Bill Image",
          billerLogo: "Biller Logo",
          billerLogoTitle: "Biller Logo Title",
          address1: "Address Line 1",
          address2: "Address Line 2",
          address3: "Address Line 3",
          city: "City",
          state: "State",
          country: "Country",
          zipCode: "Pin/Zip Code",
          billerLocation: "Biller Location",
          billerLabel: "Biller Label {sequenceId}",
          chooseFile: "Choose File - *.PNG, *.JPG, *.GIF",
          PRESENTMENT: "Presentment",
          PAYMENT: "Payment",
          PRESENTMENT_PAYMENT: "Presentment and Payment",
          RECHARGE: "Recharge",
          ACTIVE: "Active",
          INACTIVE: "Inactive",
          imageId1: "Image-1",
          imageId2: "Image-2",
          fileId1: "File-1",
          fileId2: "File-2",
          listofBillers: "Billers List Table",
          templateName: "Template Name",
          validationType: "Validation Type",
          validationUrl: "Validation URL",
          AUTO: "Auto",
          OFFLINE: "Offline",
          ONLINE: "Online",
          deleteBillerMsg: "Are you sure you want to delete the Biller {billerName}?",
          close: "Close"
        },
        paymentTerms: {
          paymentAllowed: "Allow",
          partPayment: "Part Payment",
          excessPayment: "Excess Payment",
          latePayment: "Late Payment",
          quickBillPay: "Quick Bill Pay",
          quickRecharge: "Quick Recharge",
          paymentMethods: "Payment Methods",
          DEBITCARD: "Debit Card",
          CREDITCARD: "Credit Card",
          CASA: "Current and Savings Account",
          accountNumber: "Account Number",
          bufferDays: "Auto Payment Buffer Days"
        },
        billerSpecification: {
          specificationType: "Data Type",
          maxLength: "Max Length",
          OPTIONAL: "Optional",
          MANDATORY: "Mandatory",
          TEXT: "Text",
          NUMERIC: "Numeric",
          ALPHANUMERIC: "Alphanumeric",
          DATE: "Date",
          Note:"Note",
          ALPHANUMERIC_WITH_SPECIAL: "Alphanumeric With Special Characters"
        },
        disclaimer: {
          specification: "Note: Biller labels added here will be visible to customer when he is adding the biller and will be appearing the same order as they are mentioned here.",
          manageCategory: "Manage Category",
          categoryInfo: "If the category you want is not available, you can create it here.",
          searchNote: "Accept online bill payment and recharge. You can view and edit details or delete the existing billers by first searching for them.At least one of the four search parameters is needed to search & find the existing billers.You can also create a new biller by clicking on create and capture the full details of the biller.",
          createBillerDetail: "This section details key attributes of a biller like whether customer gets bills presented or not, the type of service biller provides etc. This section also captures  sample bill image that is displayed to customer while adding the biller to pay bills online.",
          createBillerAddress: "This section has the full address of the Biller and Location. Location indicates business geography of the biller and is a key attribute of identification, especially if the biller operates in multiple geographies.",
          createBillerSpecifications: "When adding a biller, customer has to key in unique identities that he has with biller ( Ex: Account ID, Customer No. etc). The labels of these IDs are maintained in this section along with their data type and whether they are mandatory for customer.",
          createBillerPaymentNote: "This section captures validations & checks that get done when  customer is paying a bill. Whether customer can pay bill after due date and from where he can pay the bills : Account, Credit or Debit cards etc. are decided by the flags maintained here.",
          searchNoteHeader: "Create and Maintain Biller",
          createPaymentTerms: "Payment Terms"
        },
        messages: {
          requiredMessage: "This field is mandatory.",
          invalidBillerName: "Biller Name can comprise alphanumerics (A-Z any case, 0-9)&,/,-\"space",
          invalidAcccountNumber: "Account Number can comprise alphanumerics (A-Z any case, 0-9)",
          invalidAddress: "Address can comprise alphanumerics (A-Z any case, 0-9)&,/,-\"space",
          cancelOperation: "Are you sure you want to cancel the operation?",
          reviewDetails: "You initiated a request for Biller Onboarding. Please review details before you confirm!",
          noSearchInputError: "Please enter at least one of the following values - Biller Category,Biller Location,Biller Name.",
          autoBufferValidation: "Auto Buffer days can comprise only Numerics (0-9)",
          invalidCity: "City can comprise alphabets (A-Z any cases and space)",
          invalidState: "State can comprise alphabets (A-Z any cases and space)",
          invalidZipCode: "Zip Code can comprise alphanumerics (A-Z any case, 0-9, space)",
          invalidLocation: "Biller Location can comprise alphabets (A-Z any case and  space) only",
          uniqueLabel: "Label is already in use. Please give a different Label.",
          invalidSpecificationLabel: "Biller Label can comprise alphanumerics (A-Z any case, 0-9)&,/,-\"space",
          invalidMaxlength: "Max Length can comprise of numbers only."
        }
      },
      ar: false,
      en: false,
es :true,
      "en-us": false
    };
  };

  return new BillerOnboardingLocale();
});
