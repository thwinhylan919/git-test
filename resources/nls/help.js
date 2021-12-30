define([], function() {
  "use strict";

  const HelpLocale = function() {
    return {
      root: {
        pageTitle: {
          approver: "Approver"
        },
        note: "* Conversion rates are based on mid rate for Funds Transfer",
        seeAll: "See all frequently asked questions",
        loanNote: "* This calculation is for conventional loan eligibility only.",
        createTransactionGroup: "Create",
        cancel: "Cancel",
        debitCard: {
          query: "Looking for a new Debit Card",
          apply: "Apply for New",
          explore: "Explore Cards"
        },
        payments: {
          setupSI: "Set Repeat Transfers",
          addnewpayee: "Add New Payee",
          addnewbiller: "Add New Biller",
          addnewdebtor: "Add New Debtor",
          alt: "Click here to {reference}",
          title: "Click here to {reference}"
        },
        limit_package_search: {
          create: "Create",
          landingHelpTitleEdit: "Edit Package Details",
          landingHelpTitle: "Limit Package",
          landingHelpTitleView: "Limit Package Details",
          landingHelpTitleCreate: "Create Limit Package",
          landingDescriptionEdit: "You can remove the transaction  from the limit package or can delete/modify the limit definitions mapped against each transaction.You can also add new transaction(s) as part of this limits package.",
          landingDescriptionView: "You can edit the parameters set for each transaction available in a package  or can delete the package by clicking on Delete button. Ensure this package is not in user before you proceed to delete.To speed up the process you can clone an existing limit package. You may also choose to go back to the previous screen or cancel the operation.",
          landingDescription: "This maintenance allows you to search and view limit packages. Also you can create new, edit or delete existing limit packages.Search limit packages based on different search parameters and the matching result will be listed. You can also create a limit package and map the limit definitions for each transaction.",
          landingDescriptionCreate: "You can now create a limit package for specific transaction and for group of transactions. Also you can define applicable Touch Point for a package. To speed up the process you can clone an existing limit package.If you want to create fresh package, ensure to maintain necessary transaction groups, Touch Point groups and required limit definitions before you proceed."
        },
        alerts: {
          landingHelpTitle: "Note",
          landingDescription: "Define & maintain the parameters that drive the internal & external alerts.For a module, you can define the events for alert generation, the text of the alert & whether its mandatory or subscription based for user. These parameters can be viewed, edited & deleted as required.",
          create: "Create",
          landingHelpTitleCreate: "Create Alerts Maintenance",
          landingHelpTitleEdit: "Edit Alerts Maintenance",
          landingHelpTitleView: "View Alerts Maintenance",
          landingDescriptionEdit: "The alerts maintained in the system can be updated or deleted and new ones can be added. Using Search functionality find the alert you want to edit. Once you find the alert in search results , click on it to get to the edit page. Here click on the 'Edit' button and update the required field. You can even delete the alert by clicking on the Delete icon",
          landingDescriptionCreate: "Define & maintain the parameters that drive the internal & external alerts. For a module, you can define the events for alert generation, the text of the alert & whether its mandatory or subscription based for user. Under Message Settings you can define types of recipients ( ex: customer/maker/approver etc)and the delivery mode too (ex:email,push notification etc).",
          landingDescriptionView: "You can find the alert you want to view by searching it based on Module Name and Alert Type. The system will show the matching alerts and you can select the one you want to view and the alert expands to show the details of the alert maintained.",
          alertsSubscriptionSearch: "Alert Subscription - Search",
          alertsSubscriptionUpdate: "Alert Subscription - Update",
          subscriptionSearchDescription: "As Bank Administrator you can subscribe alerts for users or update existing ones. Start by searching for the customer by keying in any of the parameters ( user name, party id, email etc). Select the customer you want and proceed to do the alert subscription",
          subscriptionUpdateDescription: "You can first select the account for which alerts are getting subscribed and then the events for which alerts need to be sent. The delivery mode of the alert can be chosen by selecting the appropriate icons"
        },
        accessPoint: {
          create: "Create",
          limitPackageLink: "Limit Package Management",
          landingHelpTitle: "Create and Maintain Touch Point",
          landinghelpText: "Touch Points are different channels through which the OBDX services can be accessed.Touch Points could be internal like Internet, Mobile, SMS etc and it could also be third party applications i.e. vendor/partners accessing application resources provided OBDX user has given consent to the third party."
        },
        accessPointGroup: {
          create: "Create",
          landingHelpTitleSearch: "Create and Maintain Touch Point",
          landinghelpTextSearch: "You can create new Touch Point groups by clicking on create.",
          landingHelpTitleCreate: "Want to define limits for a group of Touch Points?"
        },
        helpDeskUser: {
          landingHelpTitle: "Help Desk",
          landinghelpText: "This function allows you to perform transaction on behalf of Retail or Corporate User. You can simply search the user by his user User ID or Party ID.Select the user from the list, and enter the OTP communicated by User to authenticate the User. Post successful authentication, you can perform any transaction on the user's session."
        },
        systemRules: {
          systemRulesDescription: "Use this feature to maintain parameter preferences for each enterprise role. You can search for existing system rules defined to view and/or modify the rule and can also create a new system rule as required."
        },
        workflow: {
          landingHelpTitle: "Workflow Management",
          landingHelpDescription1: "You can now create workflows with multiple levels of approvals. Each workflow can be configured to have up to five levels of approval with a specific user or a user group configured at each level.",
          landingHelpDescription2: "Workflows can be created independently and can be attached to a specific transaction/maintenance as part of the approval rule configuration. Ensure to maintain necessary users groups before you proceed."
        },
        rules: {
          landingHelpTitle: "Rules Management",
          landingHelpDescription1: "You create new rules that apply to specific transactions when initiated by a select user or user group need to be approved by the specified user or user groups.",
          landingHelpDescription2: "Rules Management refers to parameters  that drive the enterprise the approvals for financial, non-financial, maintenance and administrative transactions. You can search and view all the approval rules maintained for a party. You can edit the rules and update them."
        },
        segments: {
          landingHelpTitle: "User Segment",
          landingHelpDescription1: "Customers are grouped into user segments so that banks can offer appropriate products and services.",
          landingHelpDescription2: "You can create new user segments and use it subsequently to define specific maintenances at user segment level if required.",
          create: "Create"
        },
        admin_user_group:{
          landingHelpTitle: "Administrator User Groups",
          landingHelpDescription1: "Customers are grouped into user segments so that banks can offer appropriate products and services.",
          landingHelpDescription2: "You can create new user segments and use it subsequently to define specific maintenances at user segment level if required.",
          create: "Create"
        },
        user_group:{
          landingHelpTitle: "User Groups",
          landingHelpDescription1: "Customers are grouped into user segments so that banks can offer appropriate products and services.",
          landingHelpDescription2: "You can create new user segments and use it subsequently to define specific maintenances at user segment level if required."
        },
        userLimits: {
          landingHelpTitle: "User Limits",
          landingHelpDescription1: "You can now enquire the limits assigned to a user for performing various transactions. You can also check a user's utilized and available limits and customer defined limits if any.",
          landingHelpDescription2: "Further you can modify the user's limits for specific transaction."
        },
        partyPreference : {
          landingHelpTitle: "Party Preferences",
          landingHelpDescription: "Parties can have different accesses, daily and cumulative limits and approval patterns which can be set and modified here. Various limit packages are available which are mapped to a party. These preferences are set at party level and applicable for all users of the party. Various limit packages are available which are mapped to a party."
        },
        loanDisbursement : {
          CON : {
            line1: "This is designed to help you with the Loan Disbursement Inquiry.",
            line2: "You will find multiple disbursement entries in your account if you have chosen partial disbursements.",
            line3: "The actual amount of loan disbursed may differ from the amount sanctioned as per the agreement. You may contact Bank for the details.",
            line4: "You can also check the Loan Repayment Schedule for the amount disbursed using the option available in the menu, to know your repayment cycle."
          },
          ISL: {
            line1: "This is designed to help you with the Finance Disbursement Inquiry",
            line2: "You will find multiple disbursement entries in your account if you have chosen partial disbursements.",
            line3: "The actual amount of finance disbursed may differ from the amount sanctioned as per the agreement. You may contact Bank for the details.",
            line4: "You can also check the Finance Repayment Schedule for the amount disbursed using the option available in the menu, to know your repayment cycle."
          }
        },
        loanRepayment: {
          CON: {
            line1: "Quick & hassle-free online loan repayment option just for you! You can pay your overdue loan installments through this option.",
            line2: "It is worth mentioning that making payments ahead of schedule is the best way to lower your overall cost of borrowing.",
            line3: "We allow full and partial pre-payment of the loan at a charge indicated in the agreement.",
            line4: "Make sure you read all the terms and condition set for loan pre-payment."
          },
          ISL: {
            line1: "Quick & hassle-free online Finance repayment option just for you! You can pay your overdue installments through this option.",
            line2: "It is worth mentioning that making payments ahead of schedule is the best way to lower your overall cost of borrowing.",
            line3: "We allow full and partial pre-payment of your Finance at a charge indicated in the agreement.",
            line4: "Make sure you read all the terms and condition set for Finance pre-payment."
          }
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

  return new HelpLocale();
});
