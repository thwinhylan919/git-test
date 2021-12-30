define([], function () {
  "use strict";

  const GenericLocale = function () {
    return {
      root: {
        error: "Oops! Something went wrong. The page will now reload.",
        noDashboardError: "No dashboard found, please contact Bank Administrator",
        common: {
          cancel: "Cancel",
          submit: "Submit",
          login: "Login",
          search: "Search",
          ok: "Ok",
          reset: "Reset",
          review: "Review",
          confirm: "Confirm",
          done: "Done",
          edit: "Edit",
          create: "Create",
          save: "Save",
          apply: "Apply",
          add: "Add",
          name: "{firstName} {lastName}",
          userName: "{firstName} {lastName} ({userName})",
          clear: "Clear",
          lookUp: "Click to lookup",
          lookUpAlt: "Look Up",
          closeDialog: "Close Dialog",
          closeDialogTitle: "Click to Close Dialog",
          select: "Select",
          delete: "Delete",
          yes: "Yes",
          no: "No",
          back: "Back",
          proceed: "Proceed",
          next: "Next",
          verify: "Verify",
          clickHere: "Click here for {action}",
          ERROR: "Error",
          INFO: "Information",
          SUCCESS: "Success",
          NOTIFICATION: "Notification",
          backToDashboard: "Back to Dashboard",
          amount: "Amount",
          date: "Date",
          fileInput: {
            chooseFile: "Choose file...",
            upload: "Upload"
          },
          tenure: {
            singular: {
              year: "{count} year",
              day: "{count} day",
              month: "{count} month"
            },
            plural: {
              year: "{count} years",
              day: "{count} days",
              month: "{count} months"
            }
          }
        }
      },
      ar: true,
      fr: true,
      cs: true,
      sv: true,
      en: false,
      es: true,
      "en-us": false,
      el: true
    };
  };
  let instance;

  if (!instance) {
    instance = new GenericLocale();
  }

  return instance;
});