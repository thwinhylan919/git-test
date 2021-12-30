define([
  "ojL10n!resources/nls/messages-payments",
  "ojL10n!resources/nls/generic",
  "ojL10n!resources/nls/payments-common"
], function (Messages, Generic, Common) {
  "use strict";

  const TransactionLocale = function () {
    return {
      root: {
        payments: {
          txnname: "Peer to peer transfer",
          payvia: "Pay via",
          transfermode: {
            FACEBOOK: "Facebook",
            EMAIL: "Email",
            MOBILE: "Mobile",
            TWITTER: "Twitter"
          },

          transferModeType: {
            FACEBOOK: "Email ID",
            EMAIL: "Email ID",
            MOBILE: "Mobile Number",
            TWITTER: "Email ID"
          },

          transferWallet: {
            recipientMobileNumber: "Recipient's Mobile Number",
            enterMobileNumber: "Enter Mobile Number",
            amountPlaceholder: "0.00",
            wallet: "Wallet",
            betweenWallets: "Between Wallets",
            currency: "Currency",
            currencyValidation: "Invalid Currency",
            amountValidation: "Please enter a valid amount",
            minAmountValidation: "Please enter more than minimum amount",
            maxAmountValidation: "Please enter less than maximum amount",
            balanceNholding: "Balance : {balance}"
          },

          viewlimits: "View Limits",
          viewlimitsTitle: "View Limits",
          bankaccount: "Bank Account",
          addNewrecipientmsg: "You will first add the bank account details of the recipient and then continue to transfer",
          addbankaccount: "Add Bank Account",
          successmsg2: "Transfer of {amount} has been made to {payee}",
          successmsg3: "Reference Number {referenceNumber}",
          securityCode: "Security Code",
          verifyP2PPayment: "Peer To Peer Payment",
          confirmP2PPayment: "Peer To Peer Payment",
          transferMoney: "Transfer Money",
          reviewandtransfer: "Review",
          shareMessage: "{transactionName} request of {amount} has been initiated.\nTransfer To: {transferTo}\nReference number:{referenceNumber}\nValue Date:{valueDate}",
          peertopeer: {
            transferValue: "Email/Mobile",
            confirmTransferValue: "Confirm Email/Mobile",
            p2pMessage: "Input email/mobile field first",
            transferValuemsg: "Email/Mobile values do not match",
            noWalletBalanceTotransfer : "Insufficient Account balance.",
            transferMode: "Transfer Via",
            transferfrom: "Transfer From",
            transferto: "Transfer To",
            channel: "Channel",
            showInformation: "Select channel to view its limits",
            pleaseSelect: "Please Select",
            addp2pPayeemsg: "Save {payee} to your Payee list?",
            existingPayee: "Existing Payee",
            newPayee: "New Payee",
            amount: "Amount",
            note: "Note",
            p2ptransfer: "Peer to peer transfer",
            facebookPayment: "Facebook",
            twitterPayment: "Twitter",
            contactListHeader: "Select Contact",
            noFriendsFound: "No friend in your friend list have authorized for this type of transaction",
            facebookContactsHelp: "Facebook contacts who have provided permission to bank are present in the list",
            payToContacts: "Pay to Contacts",
            clickHere: "Click Here to select Twitter Handle",
            enterTwitterHandle: "Enter Twitter Handle",
            twitterPaymentSuccess: "Your Payment Is Successful.",
            twitterPaymentFailure: "Your Payment Has Failed Please Try Again",
            searchButton: "OK",
            searchTwitter: "Specify Twitter ID or Select your follower",
            twitterHeader: "Select Twitter Handle",
            searchBar: "Specify Twitter ID or Name",
            twitterNote: "You can send payment to twitter handle who are following you or to recipients who have enabled direct messages.",
            twitterUser: "No User To Display",
            fullName: "{firstName} {lastName}",
            paymentLink: "You have received a payment of amount {currency} {amount} from {name}. Please click on the following link to claim the amount."

          }
        },
        common: Common.payments.common,
        messages: Messages,
        generic: Generic
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

  return new TransactionLocale();
});