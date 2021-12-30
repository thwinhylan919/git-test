define(["ojL10n!resources/nls/generic"], function(Generic) {
    "use strict";

    const ServiceAdvisorsLocale = function() {
        return {
            root: {
                advisorHeading: "My Advisors",
                fullName: "{firstName} {middleName} {lastName}",
                fullNameWithoutMiddleName: "{firstName} {lastName}",
                contactNumber: "{areaCode} {number}",
                advisorList: "Advisors List",
                emailTitle: "Email is {address}",
                emailAlt: "Email is {address}",
                info: "Please contact Futura Bank for getting <br>your advisors details.",
                bankContact: "1800-000-000",
                bankContactAlt: "Click here to call",
                bankContactTitle: "Click here to call",
                serviceAdvisorTyep: {
                    RM: "Relationship Manager",
                    SM: "Service Manager"
                },
                call: {
                    alt: "Click here to call",
                    title: "Click here to call"
                },
                generic: Generic
            },
            ar: true,
            fr: true,
            cs: true,
            sv: true,
            en: false,
es :true,
            "en-us": false,
            el: false
        };
    };

    return new ServiceAdvisorsLocale();
});