define([
    "ojL10n!resources/nls/generic",
    "ojL10n!resources/nls/confirm-screen"
], function(Generic, Confirm) {
    "use strict";

    const ManageVpa = function() {
        return {
            root: {
                manageVpa: {
                    header: "Manage VPA",
                    alt: "Click here to {reference}",
                    title: "Click here to {reference}",
                    vpa: "VPA",
                    createNewVpa: "Create new VPA",
                    deleteVpa: "Delete VPA",
                    deleteVpaMsg: "Are you sure you want to delete the VPA?",
                    noVpa: "You do not have a VPA. You need to create a VPA to be able to use UPI features."
                },
                generic: Generic,
                confirm: Confirm.confirm
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

    return new ManageVpa();
});