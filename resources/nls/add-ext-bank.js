define(["ojL10n!resources/nls/generic", "ojL10n!resources/nls/trade-finance-common", "ojL10n!resources/nls/trade-finance-errors"], function(Generic, TradeFinanceCommon, TradeFinanceErrors) {
    "use strict";

    const AddBankLocale = function() {
        return {
            root: {
                generic: Generic,
                heading: {
                    addBank: "External Bank Maintenance",
                    createBank: "Add External Bank",
                    bankDetails: "Bank Details",
                    authDetails: "OAuth Authorization Details",
                    reviewExtBank: "Review Bank details",
                    transactionDeleteName: "Delete Bank",
                    bankUpdateTransaction: "Bank Update transaction",
                    externalApi: "External API Details"
                },
                labels: {
                    update: "Update",
                    add: "Add",
                    alt: "Click here for more Details",
                    title: "Click here for more Details",
                    bankLogo: "Bank Logo",
                    bankName: "Bank Name",
                    bankIdentifier: "Bank Identifier",
                    bankDomain: "Bank Domain",
                    oauth_enabled: "Enabled Authorization",
                    addExtBank: "Add External Bank",
                    close: "Close",
                    imageId2: "Image-2",
                    fileId2: "File-2",
                    bankLogoTitle: "Bank Logo Title",
                    notAvailable: "NA",
                    deleteExtBank: "Delete External Bank",
                    removeExtBank: "Remove External Bank",
                    deleteBankMsg: "Are you sure you want to delete {bankName} from the External Bank Maintenance List?",
                    enterName: "Enter External Bank Name",
                    noData: "No Data to display",
                    bankaddress: "Bank Address",
                    bankurl: "Bank URL",
                    status: "Enable OAuth Details",
                    enabledon: "Enabled on",
                    authDetails: "Authorization Details",
                    authurl: "Authorization URL",
                    tokenurl: "Token URL",
                    revokeurl: "Revoke URL",
                    redirecturl: "Redirect URL",
                    clientid: "Client ID",
                    clientsecret: "Client Secret Keys",
                    extapi: "External API {sequenceId}",
                    externalapi: "External API",

                    ExternalAPI01: "Account List",
                    ExternalAPI02: "Account Details",
                    ExternalAPI03: "Current & Saving Account Activity",
                    ExternalAPI04: "Term Deposit Account Activity",
                    ExternalAPI05: "Loan Account Activity",
                    ExternalAPI06: "Account Summary",
                    selectExternalAPI: "Select API",
                    enterExternalAPI: "Enter API URL",
                    templateName: "Template Name",
                    enabled: "Enabled",
                    disabled: "Disabled",
                    mandatory: "Mandatory",
                    optional: "Optional",
                    addRow: "Add External API",
            clientsecretpwd:"******",
            scope:"Scope"
                },
                messages: {
                    invalidExtBank: "External Bank Name can comprise alphanumerics (A-Z any case, 0-9)&,/,-\"space",
                    invalidAddress: "Address can comprise alphanumerics (A-Z any case, 0-9)&,/,-\"space",
                    invalidUrl: "URL can comprise alphanumerics (A-Z any case, 0-9)&,/,-\"space",
                    invalidClientDetails: "Client Details can comprise alphanumerics (A-Z any case, 0-9)&,/,-\"space",
                    emptyFileErrorMsg: "The uploaded file is empty, Please upload a valid file.",
                    fileSizeErrorMsg: "The uploaded file exceeds the maximum permissible size of 100 KB. Please reduce the file size and try again.",
                    noFileFoundErrorMessage: "Please choose a file to upload",
                    reviewDetails: "You initiated an External Bank Maintenance.Please review details before you confirm!",
                    noSearchInputError: "Please enter the bank Name.",
                    invalidExternalapiLabel: "External API Label can comprise alphanumerics (A-Z any case, 0-9)&,/,-\"space",
                    uniqueLabel: "Label is already in use. Please give a different Label.",
                    uniqueApiName: "API name is already in use. Pleas select different API.",
                    invalidScope: "Scope can comprise alphanumerics (A-Z any case, 0-9)&,/,-\"space",
                    addmessage: "You can enter External Bank by clicking on Add.",
                    maintainheadiing: "Add and Maintain External Bank Accounts",
                    createmessage: "External Bank Account Details.",
                    notes: "Notes",
                    cancelOperation: "Are you sure you want to cancel the operation?"
                },
                confirmScreen: {
                    deleteSuccessMessage: "Bank has been deleted.",
                    updateSuccessMessage: "Bank details updated successfully.",
                    completed: "Completed",
                    initiated: "Initiated",
                    pendingApproval: "Pending Approval",
                    status: "Status : {status}"
                },
                common: TradeFinanceCommon,
                tradeFinanceErrors: TradeFinanceErrors
            },
            ar: false,
            en: false,
es :true,
            "en-us": false
        };
    };

    return new AddBankLocale();
});
