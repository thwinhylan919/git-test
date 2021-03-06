define([], function() {
    "use strict";

    const TransactionGroupLocale = function() {
        return {
            root: {
                INITIATED: "Initiated",
                ACCEPTED: "Pending Approval",
                REJECTED: "Rejected",
                apply: "Apply",
                cancel: "Cancel",
                ok: "Ok",
                error: "Error",
                create: "Create",
                done: "Done",
                submit: "Submit",
                continue: "Continue",
                login: "Login",
                confirm: "Confirm",
                edit: "Edit",
                amount: "Amount",
                tenure: "Tenure",
                save: "Save",
                delete: "Delete",
                search: "Search",
                reset: "Reset",
                add: "Add",
                remove: "Remove",
                demobank: "Futura Bank",
                signout: "Sign Out",
                assign: "Assign",
                select: "Select All",
                fetchdetails: "Fetch Details",
                selectRole: "Select Role",
                transactionMessage: "Transaction completed.",
                referenceNumber: "Reference Number {refNo}",
                back: "Back",
                clear: "Clear",
                confirmationMessage: "Are you sure you want to cancel this transaction ?",
                oneRoleSelectionMessage: "At least one role should be mapped to the user. Please select a role.",
                successful: "Successful!",
                confirmation: "Confirmation",
                OrganizationName: "Enter Valid Organization Name",
                managerNameValidation: "Enter Valid Manager Name",
                empNoValidation: "Enter a valid 6-digit Employee number",
                userNameValidation: "Enter Valid User Name",
                emailValidation: "Enter Valid Email Id",
                titleValidation: "Select an appropriate Title",
                firstNameValidation: "Enter Valid First Name",
                middleNameValidation: "Enter Valid Middle Name",
                lastNameValidation: "Enter Valid Last Name",
                mobNoValidation: "Enter a valid Mobile Number",
                landlineNoValidation: "Enter Valid Landline Number",
                checkAvailability: "Check Availability",
                userExists: "Given Username is already present in the underlying identity store",
                yes: "Yes",
                no: "No",
                backMessage: "If you go back all changes made will be lost. Are you sure you want to go back?",
                alert: "Alert",
                duplicateEntity: "Duplicate entities not allowed.",
                transactions: "Transactions",
                deleteMessage: "Are you sure you want to delete this Transaction Group?"
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

    return new TransactionGroupLocale();
});