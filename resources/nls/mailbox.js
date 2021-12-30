define([], function() {
  "use strict";

  const MailboxLocale = function() {
    return {
      root: {
        mailbox: {
          labels: {
            composeMail: "Compose Mail",
            composeMailLoaded: "Compose Your Mail",
            inbox: "Inbox ({count})",
            sentMail: "Sent Mail",
            sentMailTitle: "Click to view Mails sent",
            deletedMail: "Deleted Mail",
            deletedMailTitle: "Click to check Deleted Mails",
            reply: "Reply",
            replyTitle: "Click to Reply",
            delete: "Delete",
            deleteTitle: "Click to Delete Mail",
            back: "Back",
            backTitle: "Click to go back",
            refresh: "Click to Refresh Mail",
            send: "Send",
            sentSuccessMessage: "Your message has been sent. Please note the reference number as {interactionId} for further communications.",
            category: "Category",
            from: "From :",
            subject: "Subject :",
            sentTime: "Sent :",
            receivedTime: "Received",
            charactersLeft: "{number} Characters Left",
            selectall: "Select All",
            inboxwithoutCount: "Inbox",
            inboxwithoutCountTitle: "Click to view mails in Inbox",
            select: "Select",
            mailFolderOptions: "Choose Folder",
            mailFolder: "Open Folder",
            replyPrefix: "Re :",
            party: "Party",
            sentSuccessMessageLocal: "Your message has been sent successfully.",
            restoreTitle: "Click to Restore Mail",
            restore: "Restore",
            refreshTitle: "Refresh",
            backToDashboard: "Back To Dashboard",
            attachFile: "Attach File",
            attachments: "Attachments :"
          },
          headers: {
            deleteMailsConfirmation: "Confirmation",
            mailboxHeader: "Mailbox",
            subject: "Subject",
            to: "To",
            from: "From",
            sentTime: "Sent",
            mailListAdmin: "Mail List Table For Administrator",
            alertList: "Alert List Table",
            notificationList: "Notifications List Table",
            mailListUser: "Mail List Table For User",
            received: "Received",
            alerts: "Alerts",
            notifications: "Notifications",
            mails: "Mails",
            message: "Message",
            readTitle: "Click to Read",
            unreadTitle: "Click to mark it as Unread",
            notification: "Notifications",
            successHeader: "Message Sent",
            referenceNo: "Reference No"
          },
          buttons: {
            cancel: "Cancel",
            confirm: "Confirm",
            ok: "Ok"
          },
          messages: {
            selectMessage: "Are you sure you want to delete this mail?",
            selectedMessages: "You have selected {count} mails. Are you sure you want to delete them?",
            selectedMessagesForPermanentDelete: "You have selected {count} mails. Are you sure you want to delete them permanently?",
            emptySubject: "Please select a subject category",
            emptyParty: "Please select a Party",
            emptyMail: "Cannot send an empty mail",
            fileSize: "Maximum allowed file size 5 MB.",
            fileType: "Allowed file types : JPEG, PNG, DOC, PDF, TXT, ZIP.",
            type: "No item in {type}"
          },
          alerts: {
            mailTab: "Mails ({mailUnreadCount})",
            alertTab: "Alerts ({alertUnreadCount})",
            notificationTab: "Notifications ({notificationUnreadCount})",
            selectAlert: "Are you sure you want to delete this Alert?",
            selectedAlert: "You have selected {count} alerts. Are you sure you want to delete them?",
            selectNotification: "Are you sure you want to delete this Notification?",
            selectedNotification: "You have selected ({count}) notifications. Are you sure you want to delete them?",
            type1: "No item in alerts",
            type2: "No item in notifications"
          }
        },
        navBarDescription: "Mailbox"
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

  return new MailboxLocale();
});
