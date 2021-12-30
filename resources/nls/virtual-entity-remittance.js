define([], function() {
  "use strict";

  const RemittanceLocale = function() {
    return {
      root: {
        pageHeader: "Remitter ID",
        remitterId: "Remitter ID",
        bandHeader: "General Electric",
        custId: "Customer Id",
        listId: "Remitter List ID",
        listIdPlaceholder: "Select List ID",
        addId: "Add Remitter ID",
        range: "Range",
        remIdPlaceholder: "Type Remitter ID",
        from: "Valid From",
        to: "Valid To",
        reconcilationInformation: "Reconciliation Information",
        reconcilationInformationPlaceholder: "Type Information",
        additionalInfo: "Additional Information",
        validFrom: "Valid From",
        validTo: "Valid To",
        remInfoName: "Remitter List Name",
        submit: "Submit",
        cancel: "Cancel",
        back: "Back",
        bannerMessageMultiple: "You initiated a request to create multiple Remitter ID's. Please review details before you confirm!",
        bannerMessageSingle: "You initiated a request to create a Remitter ID. Please review details before you confirm!",
        reviewCaption: "Review",
        confirm: "Confirm",
        addRow: "Add Row",
        remListName: "Remitter List Name : {value}",
        remitterListName: "Remitter List Name",
        actions: "Actions",
        sectionHeader: "Remitter ID Information",
        successMessage: "Remitter ID created successfully.",
        errorMsg: "You can create maximum of {value} Remitter ID's using this option.",
        remittanceListId: "Remitter List ID",
        remittanceName: "Remitter  Name",
        remittanceActionCardText: "Create More Remitter ID's",
        duplicateErrorMessage: "You cannot create duplicate Remitter ID",
        dateValidityErrorMessage: "Validity Start Date should be less than or equal to End Date",
        goToOverview: "Go To Overview",
        noData: "No Remitter List ID available. Please contact administrator!",
        validityMessage: "You must create at least one Remitter ID to proceed."
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

  return new RemittanceLocale();
});
