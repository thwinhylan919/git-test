define([], function() {
    "use strict";

    const FlowLocale = function() {
        return {
            root: {
                buttons: {
                    submit: "Submit",
                    confirm: "Confirm",
                    next: "Continue",
                    back: "Back",
                    cancel: "Cancel",
                    draft: "Save as Draft"
                },
                stage: "Stage {stageNumber}",
                review: "Review"
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

    return new FlowLocale();
});