define(["ojL10n!resources/nls/generic"], function(Generic) {
    "use strict";

    const OauthClientLocale = function() {
        return {
            root: {
                note: "Client",
                description1: "Clients are Third Party Providers that can access information from the resource server on behalf of the user if the user has provided consent to the Third Party Providers.",
                clientId: "Client Id",
                clientName: "Client Name",
                clientDesc: "Client Description",
                noDescription: "Please select a Identity Domain",
                invalidIdentityDomain: "Please select a Identity Domain",
                invalidClientId: "Please enter a valid client id",
                duplicateResourceServer: "You cannot add the same Resource Server again. Please add scopes for the already selected Resource Server.",
                deleteDefaultScope: "Remove Default Scope",
                deleteScope: "Remove Scope",
                identityDomain: "Identity Domain",
                clientType: "Client Type",
                search: "Search",
                cancel: "Cancel",
                select: "Please Select",
                clientHeading: "Client Maintenance",
                clear: "Clear",
                confidential: "Confidential",
                public: "Public",
                save: "Save",
                ok: "Ok",
                mobile: "Mobile",
                searchResults: "Search Results",
                clientDefn: "Client Definition",
                redirectURLs: "Redirect URL",
                redirectURL: "Redirect URL",
                grantType: "Grant Type",
                scopes: "Scope",
                selectScopes: "Select Scopes",
                edit: "Edit",
                clientSecret: "Client Secret",
                back: "Back",
                generate: "Generate",
                resourceServer: "Resource Server",
                addScope: "Add Scope",
                removeScope: "Remove Scope",
                defaultScope: "Default Scope",
                confirm: "Confirm",
                create: "Create",
                addDefaultScope: "Add Default Scope",
                reviewHeading: "Review",
                deleteURL: "Remove URL",
                addURL: "Add Redirect URL",
                togglePassword: "Toggle Password",
                editReviewMessage: "You initiated changes for Client. Please review details before you confirm!",
                urlCheck: "Please enter a valid URL.",
                invalidScope: "Please select scopes for the client",
                invalidClientName: "Please enter a valid client name.",
                invalidClientDesc: "Please enter client description.",
                invalidClientSecret: "Please enter client secret.",
                invalidRedirectURL: "Please enter redirect URL.",
                invalidGrantType: "Please select at least one client grant.",
                invalidClientType: "Please select client type.",
                invalidDefaultScope: "Please select a default scope.",
                invalidGrant: "For a Refresh Token grant either Password or Authorization Code grant is mandatory.",
                clientTypes: {
                    CONFIDENTIAL_CLIENT: "Confidential Client",
                    PUBLIC_CLIENT: "Public Client",
                    MOBILE: "Mobile Client"
                },
                grantTypes: {
                    AUTHORIZATION_CODE: "Authorization Code",
                    PASSWORD: "Password",
                    CLIENT_CREDENTIALS: "Client Credentials",
                    JWT_BEARER: "JWT Bearer",
                    REFRESH_TOKEN: "Refresh Token"
                },
                generic: Generic
            },
            ar: false,
            fr: true,
            cs: false,
            sv: false,
            en: false,
es :true,
            "en-us": false,
            el: false
        };
    };

    return new OauthClientLocale();
});