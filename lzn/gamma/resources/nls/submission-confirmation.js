define([
  "ojL10n!lzn/gamma/resources/nls/origination-generic"
], function(Generic) {
  "use strict";

  const submissionConfirmationLocale = function() {
    return {
      root: {
        msg1: "We will intimate you via email when your opening deposit has been successfully processed.",
        msg2: "A copy of all important documents, including the disclosures and notices, will be mailed to you and will arrive at your residential address within a few working days.",
        msg3: "Your new debit card and Personal Identification Number (PIN) will arrive at your residential address within a few working days once your account has been opened. For added security, your card and PIN will arrive separately in the mail",
        nxtSteps: "Next Steps",
        statusLabel: "Status :",
        status: "<span class='{bold}>Status</span>:Your account has been opened. However, you will be able to access your account only once your opening deposit has been processed.",
        congratsMsg: "Congratulations, your new {offerName} Account has been opened!",
        thankNote: "Thank you for submitting your application.",
        thankNoteName: "Thank you for submitting your application, {firstName}.",
        refstatus: "Status:  <span class='text emphasize'>{applicationStatus}.</span> We need to review your information in order to take a decision.",
        refMsg1: "Once your information has been verified, we will send you an Email containing the status of your application. We will follow up will a letter, sent to your residential address, within the next few days of having made our decision.",
        refMsg2: "You will be able to access your account when your account has been approved and your opening deposit has been processed. We will intimate you via email and post when your opening deposit has been successfully processed.",
        cardRefMsg1: "If approved, your new Credit Card will arrive at your residential address within a few working days. If we are unable to grant you a credit card, we will let you know why in writing.",
        accNo: "Account Number :  <span class='text application-no'>{identificationTypeAcc}</span>",
        appRefNo: "Application Reference Number : <span class='text application-no'>{applicationRefNo}</span>",
        congratsMsgTD: "Congratulations, your new {offerName} Account has been opened!",
        coAppregister: "Register the co-applicant",
        sendlink: "Send Link",
        coApplinkMsg: "Send a link to the co-applicant so that they may register with us. They can then view and track the application themselves.",
        primaryAppregister: "Register the primary applicant",
        primaryApplinkMsg: "Send a link to the primary applicant so that they may register with us.They can then view and track the application themselves.",
        applicationSubmittedAndUnderReview: "Your application has been successfully submitted and is being reviewed.",
        successfullyRegistered: "You have been successfully registered.",
        messages: {
          email: "Please enter a valid email ID",
          coAppMsg: "Registration link has been sent successfully to the specified email ID"
        },
        applicationStatus: {
          APPLICATION_APPROVED: "Application Approved",
          APPLICATION_PROCESSED: "Application Processed",
          APPLICATION_PROCESSED_JOINT_PENDING: "Application Processed Joint Pending",
          APPLICATION_REJECTED: "Application Rejected",
          DECLINE_LETTER_DISPATCHED: "Decline Letter Dispatched",
          APPLICATION_AUTODECISION_REFERRED: "Application Auto Decision Referred",
          APPLICATION_WITHDRAWN: "Application Withdrawn",
          APPLICATION_EXPIRED: "Application Expired",
          APPLICATION_WITHDRAWN_DURING_EDIT: "Application Withdrawn During Edit",
          APPLICATION_SUBMITTED: "Application submitted",
          SUBMISSION_INCOMPLETE: "Submission Incomplete",
          SUBMISSION_IN_PROGRESS: "Submission In Progress",
          SUBMISSION_SUBMITTED: "Submission Submitted",
          SUBMISSION_WITHDRAWN: "Submission Withdrawn",
          SUBMISSION_EXPIRED: "Submission Expired",
          SUBMISSION_CANCELLED: "Submission Cancelled",
          SUBMISSION_PREASSESSMENT_COMPLETED: "Submission Pre-Assessment Completed",
          SUBMISSION_COMPLETED: "Submission Completed",
          SUBMISSION_COMPLETED_JOINT_PENDING: "Joint Applicant Pending",
          MARKED_FOR_WITHDRAW: "Submission marked for withdraw",
          MARKED_FOR_EDIT: "Submission marked for edit",
          MARKED_FOR_EDIT_SAVED: "Submission marked for edit saved",
          MARKED_FOR_MANUAL_CREDIT_DECISION: "Submission marked for Manual Credit Decision",
          PRELIMINARY_ASSESSMENT_FAILED: "Preliminary Assessment Failed",
          PRELIMINARY_DECISION_APPROVED: "Preliminary Decision Approved",
          PRELIMINARY_DECISION_CONDITIONALLY_APPROVED: "Preliminary Decision Conditionally Approved",
          PRELIMINARY_DECISION_DECLINED: "Preliminary Decision Declined",
          PRELIMINARY_DECISION_REFERRED: "Preliminary Decision Referred",
          AUTO_DUE_DILIGENCE_APPROVED: "Auto Due Diligence Approved",
          AUTO_DUE_DILIGENCE_DECLINED: "Auto Due Diligence Declined",
          AUTO_DUE_DILIGENCE_REFERRED: "Auto Due Diligence Referred",
          MANUAL_DUE_DILIGENCE_APPROVED: "Manual Due Diligence Approved",
          MANUAL_DUE_DILIGENCE_DECLINED: "Manual Due Diligence Declined",
          MANUAL_DUE_DILIGENCE_DEFERRED: "Manual Due Diligence Referred",
          FINANCIAL_CAPTURE_COMPLETED: "Financial Capture Completed",
          FINANCIAL_ANALYSIS_COMPLETED: "Financial Analysis Completed",
          APPLICATION_AUTO_DECISION_APPROVED: "Application Auto Decision Approved",
          APPLICATION_AUTODECISION_CONDITIONALLY_APPROVED: "Application Auto Decision Conditionally Approved",
          APPLICATION_AUTO_DECISION_REJECTED: "Application Auto Decision Rejected",
          APPLICATION_AUTODECISION_REFERRED_DOWNSELL: "Application Auto Decision Referred Down-sell",
          DOWNSELL_OFFER_CHECKLIST_GENERATED: "Down-sell Offer Checklist Generated",
          DOWNSELL_OFFER_DOCUMENT_DISPATCHED: "Down-sell Offer Checklist Dispatched",
          APPLICATION_DOWNSELL_ACCEPTED: "Application Down-sell Accepted",
          APPLICATION_DOWNSELL_REJECTED: "Application Down-sell Rejected",
          APPLICATION_DOWNSELL_REFERRED: "Application Down-sell Referred",
          APPLICATION_OFFER_DECLINED: "Application Offer Declined",
          APPLICATION_MANUAL_DECISION_PENDING: "Application Manual Decision Pending",
          APPLICATION_MANUAL_DECISION_ACCEPTED: "Application Manual Decision Accepted",
          APPLICATION_MANUAL_DECISION_REJECTED: "Application Manual Decision Rejected",
          STRUCTURE_SOLN_CONFIRMED: "Structure Solution Confirmed",
          APPLICATION_REJECT_CHECKLIST_GENERATED: "Application Reject Checklist Generated",
          APPLICATION_REJECT_OFFER_DISPATCHED: "Application Reject Checklist Dispatched",
          ACCOUNT_OPENING_DONE: "Account Opening Done",
          FULFILLED: "Fulfilled",
          CREDIT_CARD_CREATED: "Credit Card Created"
        },
        generic: Generic
      },
      ar: true,
      fr: true,
      cs: true,
      sv: true,
      en: false,
      "en-us": false,
      el: true
    };
  };

  return new submissionConfirmationLocale();
});
