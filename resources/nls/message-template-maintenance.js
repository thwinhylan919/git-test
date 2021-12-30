define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";

  const MessageTemplateLocale = function() {
    return {
      root: {
        genericTemplate: Generic.common,
        message_template: {
          id: "Template Code",
          name: "Template name",
          description: "Template description",
          recipientCategory: "Recipient Category",
          recipient: "Recipient",
          recipientType: "Recipient Type",
          destinationType: "Delivery Mode",
          emailSubject: "Email Subject",
          pushTitle: "Message Title",
          secureSubject: "On Screen Subject",
          emailContent: "Email Message",
          pushContent: "Notification Message",
          secureContent: "On Screen Message",
          smsContent: "SMS Message Text",
          dataAttributeIndex: "Data Attribute {index}",
          attributeMaskIndex: "Attribute Mask {index}",
          details: "Alert Message Template Details",
          recipientDetails: "Recipient Message Details",
          searchRecipient: "Select",
          email: "Email",
          onScreen: "On Screen",
          sms: "SMS",
          push: "Push Notification",
          dataAttribute: "Data Attribute",
          attributeMask: "Attribute Mask",
          setAttributeMask: "Attribute Mask",
          labelAction: "Actions",
          actionId: "Action Id",
          actionDesc: "Description",
          actionText: "Action Text",
          isEnabled: "Status",
          attributeId: "Attribute Id",
          addNew: "Add",
          copyContent: "Copy content from Email",
          alertType: "Alert Type",
          locale: "Locale",
          messageTextError: "Message text cannot be empty."
        },
        alertType: {
          S: "Subscribed",
          M: "Mandatory"
        },
        recipientEnum: {
          CUSTOMER: "Customer",
          INITIATOR: "Initiator",
          APPROVER: "Approver",
          PREVIOUS_APPROVER: "Previous Approver",
          NEXT_APPROVER: "Next Approver",
          USER: "User"
        },
        recipientCategoryEnum: {
          PARTY: "Party",
          BANKER: "Banker",
          CORPORATE: "Corporate",
          EXTERNAL: "External"
        },
        locale: {
          en_US: "English(United States)",
          en: "English",
          fr: "French",
          ru: "Russian",
          ar : "Arabic"
        },
        headers: {
          MESSAGEDETAILS: "Message Details"
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

  return new MessageTemplateLocale();
});
