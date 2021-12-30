define([], function () {
    "use strict";

    const deleteWMOrders = function () {
        return {
            root: {
                deleteOrderText: "Do you want to delete the order? Please note that unsaved data will be lost when you navigate away from this page.",
                deleteOrderHeader: "Delete Order",
                yes: "Yes",
                no: "No",
                checkOut: "Proceed to Checkout"
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

    return new deleteWMOrders();
});
