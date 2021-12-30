define([], function () {
    "use strict";

    const createinvoicetemplateLocale = function () {
        return {
            root: {
                heading: {
                    templatesearch: "template search",
                    helppanel: "help panel"
                },
                templatesearch: {
                    templates: "templates",
                    TemplateName: "Template Name",
                    NoofInvoicesSaved: "No. of Invoices Saved",
                    CreatedBy: "Created By",
                    LastUpdated: "Last Updated",
                    templateId: "template Id",
                    templateIdTitle: "Click for template Id",
                    numberofinvoices: "number of invoices"
                },
                helppanel: {},
                componentHeader: "Create Invoice",
                search: "Template Name",
                cancel : "Cancel",
                yes : "Yes",
                no : "No",
                createInvoice : "Create Invoice",
                popUpText : "Do you wish to clear the saved invoices on Create Invoice Page?<br>Click 'Yes' to clear or Click 'No' to merge the template with the saved invoices."
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

    return new createinvoicetemplateLocale();
});
