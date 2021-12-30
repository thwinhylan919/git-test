define(["ojL10n!resources/nls/generic"], function (Generic) {
  "use strict";

  const LoanAppListing = function () {
    return {
      root: {
        generic: Generic,
        header: "Application Tracker",
        loan: "Loan",
        cancel: "Cancel",
        ClickOnClose: "Click here to hide",
        close: "Close",
        back: "Back",
        searchEnable: "Search Application",
        filterEnable: "Apply Filter",
        filterTitle: "Click for filter",
        details: "Application details",
        purpose: "Some purpose to be added here",
        actionReqd: "ACTION REQUIRED",
        select: "Select",
        status: "Status",
        reset: "Reset",
        module: "Module",
        apply: "Apply",
        mDetails: "Module Details",
        searchFields: "Reference Id",
        CustomerName: "Customer Name",
        durationHeading: "Duration",
        RequestType: "Request Type",
        newFacility: "New Facility",
        amendmentFacility: "Facility Amendment",
        collateralEvaluation: "Collateral Evaluation",
        collateralRevaluation: "Collateral Revaluation",
        confirmDelete: "Confirm Delete",
        deleteMsg: "Are you sure you want to delete the draft application named {referenceId}.",
        loadMore: "Load More",
        delete: "Delete",
        draftDeleteMsg: "Draft application named {referenceId} has been successfully deleted.",
        SubmittedOn: "Submitted on",
        SavedOn: "Last Saved on",
        yes: "Yes",
        no: "No",
        confirmPage: "loan-origination-confirm",
        Nodata: "Currently no applications are available with this status",
        requestType: {
          all: "All",
          TermLoan: "Term Loan",
          WorkingCapitalLoan: "Working Capital",
          EquipmentFinancingLoan: "Equipment Loan",
          RealEstateLoan: "Real Estate Loan"
        },
        duration: {
          sevenDays: "Last 7 days",
          fifteenDays: "Last 15 days",
          oneMonth: "Last 1 Month",
          threeMonths: "Last 3 Months",
          sixMonths: "Last 6 Months",
          oneYear: "Last 1 Year"
        },
        processStatus:
        {
          SUBMITTED: "Submitted",
          IN_PROGRESS: "In Progress",
          DRAFT: "Draft",
          COMPLETED: "Completed"
        }
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

  return new LoanAppListing();
});