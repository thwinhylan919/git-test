define(["ojL10n!resources/nls/generic"], function(Generic) {
    "use strict";

    const ResourceServerCreateLocale = function() {
        return {
            root: {
                resourceServerCreate: {
                    resoureServerMt: "Resource Server Maintenance",
                    name: "Resource Server Name",
                    domainName: "Identity Domain",
                    description: "Resource Server Description",
                    details: "Resource Server Definition",
                    scopes: "Scopes",
                    scopeName: "Scope Name",
                    scopeDesc: "Scope Description",
                    deleteScope: "Delete Scope",
                    addScope: "Add Scope",
                    select: "Select",
                    save: "Save",
                    back: "Back",
                    cancel: "Cancel",
                    reviewwarning: "Warning",
                    cancelMessage: "Are you sure you want to cancel the operation?",
                    yes: "Yes",
                    no: "No",
                    invalidResourceServerName: "Please enter a valid Resource Server name",
                    invalidResourceServerDesc: "Please enter a valid Resource Server description",
                    invalidScope: "Please fill the scope details",
                    invalidScopeName: "Please enter a valid scope name",
                    invalidScopeDesc: "Please enter a valid scope description",
                    selectIdentityDomain: "Please select an Identity Domain",
                    provideValue: "Please provide a value.",
                    scopeCheck: "Please fill in the scope details before adding a new scope"
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
            el: true
        };
    };

    return new ResourceServerCreateLocale();
});