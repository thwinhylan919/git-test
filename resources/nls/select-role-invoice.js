define([], function () {
    "use strict";

    const selectroleinvoiceLocale = function () {
        return {
            root: {
                heading: {
                    SelectRole: "Select Role"
                },
                SelectRole: {
                    SelectyourroleasaBuyeroraSuppliertoviewyourdataintermsofReceivablesorPayables: "Select your role as a Buyer or a Supplier to view your data in terms of Receivables or Payables",
                    Buyer: "Buyer",
                    Supplier: "Supplier",
                    Proceed: "Proceed",
                    Cancel: "Cancel",
                    BuyerSupplierSelection: "Buyer Supplier Selection"
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

    return new selectroleinvoiceLocale();
});