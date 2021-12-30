define([], function () {
  "use strict";

  const ReviewMailerCreateLocale = function () {
    return {
      root: {
        pageTitle: {
          header: "Mailer"
        },
        headers: {
          mail: "Mail",
          recepients: "Recipients",
          review: "Review",
          transactionName: "Create Mailer",
          heading: "Mailers"
        },
        errorMsg: {
          placeHolderAddUser: "Enter list of User ID",
          placeHolderAddParty: "Enter list of Party ID",
          message: "Enter commas (,) to separate"
        },
        fieldname: {
          mailerName: "Mailer Description",
          addCreateReviewHeaderMsg: "You Initiated a request for creating Mailer. Please review details before you confirm!",
          mailerId: "Mailer Code",
          activationDate: "Send Date",
          sendTime: "Send Time",
          immediately: "Immediately",
          setTime: "Set Time",
          priority: "Priority",
          low: "Low",
          medium: "Medium",
          high: "High",
          subject: "Subject",
          theme: "Theme",
          mailBody: "Mail Body",
          bannerBody: "Banner",
          dateCreated: "Date Created",
          sendTo: "Send To",
          usersList: "List of User ID",
          partyList: "List of Party ID",
          manualTrigger: "{hour} Hour(s) & {minute} Minute(s)",
          expiryDate: "Expiry Date",
          segment: "Segmented User",
          nonSegment: "Non-segmented User"
        },
        roles: {
          corp: "All Corporate Users",
          retail: "All Retail Users",
          admin: "All Bank Administrator"
        },
        buttons: {
          cancel: "Cancel",
          confirm: "Confirm",
          edit: "Edit",
          ok: "Ok",
          back: "Back"
        }
      },
      ar: false,
      en: false,
es :true,
      "en-us": false
    };
  };

  return new ReviewMailerCreateLocale();
});
