define(
  ["ojL10n!resources/nls/generic"],
  function(Generic) {
    "use strict";

    const ManageGoalCategory = function() {
      return {
        root: {
          manageGoal: {
            manageGoalSubtitle: "You can manage all the activities related to this goal here",
            goaldetails: "Goal Details",
            goalName: "Name your goal",
            goalamount: "What is your Goal Amount?",
            maturityinst: "Maturity Instructions",
            amounttransferoption: "How would you like the account transfer?",
            maturityAccountNumber: "On maturity, money should be transferred to which account?",
            accountbranch: "Branch",
            standinginst: "Standing Instructions",
            frequency: "At what frequency would you contribute for this Goal?",
            enddate: "What will be the contribution End Date?",
            startdate: "What will be the contribution Start Date?",
            weekly: "Weekly",
            invalidName: "Please enter valid goal name.",
            monthly: "Monthly",
            quarterly: "Quarterly",
            contribute: "Contribute",
            donotproceed: "Don't proceed",
            proceed: "Proceed",
            confirmation: "Confirmation",
            achieved: "{percent}% Achieved",
            currentvalue: "Current Value",
            maturitydate: "Maturity Date",
            transactionType: {
              C: "Credit",
              D: "Debit"
            },
            selectPlaceHolder: "Please Select",
            monthlycontri: "How much would you like to contribute to this Goal?",
            contributedisclaimer: "You can contribute to your Goal as and when you plan to. This will help you achieve this goal faster.",
            activitydisclaimer: "You can view all the goal related financial transactions here.",
            editdisclaimer: "You can edit the goal and standing instructions.",
            editdisclaimerclosed: "Details of the goal which is in closed status.",
            imgCategoryEditAttr: "Click to edit Goal Category Image",
            imgCategoryEdit: "Edit Goal Category Image",
            networkType: "What would be the network type?",
            payeeName: "Please mention the Beneficiary Name",
            bankCode: "Please tell us the Bank code",
            updateConfirmation: "Changes have been saved successfully.",
            SIConfirmation: "Standing Instruction updated successfully.",
            stopTransfer: "Stop Transfer",
            banklookup: "Look up Bank Code",
            banklookupTitle: "Click to have a lookup of bank codes",
            startTransfer: "Start Transfer",
            topupMessage: "You are about to contribute {topupAmount} to your Goal amount. This will make your Goal Account Balance to {goalBalance}. Would you like to proceed?",
            topupConfirmation: "Contribution of {topupAmount} has been made to your Goal: {goalName} successfully. Your current Goal Value is {goalBalance}",
            invalidEndDate: "SI end date can not be less than the SI start date",
            invalidStartDate: "SI start date can not be greater than the SI end date",
            samedates: "SI start date and end date can not be same",
            invalidbankcode: "Invalid Bank Code",
            minmaxamount: "Amount should be between {minAmount} & {maxAmount} and multiples of {incrementStep}",
            minAmountMsg: "Amount should be more than {minAmount} and multiples of {incrementStep}",
            fundingAccountNumber: "Funding Account Number",
            redemptionAccountNumber: "Redemption Account  Number",
            closingDate: "Closing Date",
            invalidCode: "Invalid Code.",
            backToDashboard: "Back To Dashboard",
            editedgoalwithoutStandingInstructions: "Standing instructions will help you achieve your Goal faster! You are about to leave without setting any standing instructions. Would you like to proceed?",
            maxSize: "1000000",
            warning: "Warning"
          },
          withdrawGoal: {
            withdrawdisclaimer: "You can withdraw amount from your Goal Account as and when you plan to. Please provide us with the redemption details.",
            currentValue: "My Current Goal Value",
            natureOfWithdrawal: "What would be the nature of your withdrawal?",
            partial: "Partial",
            full: "Full",
            fullRedeemWarning: "Full withdrawal will lead to the closure of this Goal Account.All active standing instructions would be stopped.",
            howMuchWouldYouLikeTowithdraw: "How much would you like to withdraw from the Goal Account?",
            withdrawWarning: "You are about to withdraw {withdrawAmount} from your Goal account & transfer to <strong>Account number: {accountNumber}.</strong> Would you like to proceed?",
            withdrawSuccessful: "Withdrawal of {withdrawAmount} has been made from your Goal: {goalDataName} successfully.",
            finalValue: "Final Amount",
            alt: "Confirmation image",
            description: "Description",
            type: "Type",
            referenceNumber: "Reference Number",
            amount: "Amount",
            tableCaption: "View Transaction",
            date: "Date",
            largeAmount: "Partial redemption amount can not be equal to or greater than the goal amount.",
            minMaxAmount: "Redemption amount should be between {min} & {max}",
            minAmountLimit: "Redemption amount should be more than {min}",
            header: "Goal Account Activity Details"
          },
          labels: {
            viewedit: "Edit",
            contribute: "Contribute",
            withdraw: "Withdraw",
            viewtransaction: "Transactions",
            self: "To My Mapped Accounts",
            domestic: "Through Domestic Clearing Network",
            internal: "Internal bank Account"
          },
          Generic: Generic,
          navBarDescription: "Manage Goal"
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

    return new ManageGoalCategory();
  }
);