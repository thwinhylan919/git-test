define([
    "ojs/ojcore",
    "ojL10n!resources/nls/authorize-consent",
    "text!./authorize-consent.json",
    "knockout",
    "jquery",
    "framework/js/configurations/config",
    "./model",
    "ojs/ojformlayout",
    "ojs/ojvalidationgroup",
    "ojs/ojcheckboxset",
    "ojs/ojradioset",
    "ojs/ojbutton"
],
function (oj, resourceBundle,ConsentsJSON, ko, $,Configurations, Model ) {
    "use strict";

    return function (params) {
        const self = this;

        self.nls = resourceBundle;
        self.dataLoaded = ko.observable(false);
        self.accountsArray = [];
        self.consentDTO = null;
        self.hasDebitorAccount = false;

        const templates = JSON.parse(ConsentsJSON),
         accountAccessDTO = JSON.parse(ConsentsJSON).accountAccessDTO;

        self.template=null;
        params.baseModel.registerElement(["page-section", "row"]);

        let consentId = "",
         state = "";

        self.debitorAccount = ko.observable();
        self.selectedAccounts = ko.observableArray([]);
        self.touchPointName = "";
        self.accountName = "";

        const addUserLocale = function (url) {
            return params.baseModel.QueryParams.add(url, {
                locale: params.baseModel.getLocale()
            }, true);
        },

        normalizeURL = function (url) {
            if (url.split("?").length > 1) {
                return url.split("?")[0] + "?" + url.split("?").pop().replace(/(&?)\w+=(?:&|undefined(&)?|null(&)?|$)/g, "$1").replace(/&$/, "");
            }

            return url;
        },
        getResourceURL = function(options) {
            const baseUrl = Configurations.apiCatalogue[options.apiType].contextRoot;

            return baseUrl + "/" + options.version + "/" + options.url;
        },

         fetchConsentTemplate = function(data){
            let consentType = null;

            if (self.consentDTO.Permissions) {
                consentType = "ACCOUNT";
            } else if (self.consentDTO.DebtorAccount) {
                consentType = "FUNDSCONFIRMATION";
            } else if (self.consentDTO.Initiation.FirstPaymentDateTime) {
                consentType = self.consentDTO.Initiation.CurrencyOfTransfer ? "INTERNATIONALSTANDINGORDER" :"DOMESTICSTANDINGORDER";
            } else if (self.consentDTO.Initiation.RequestedExecutionDateTime) {
                consentType = self.consentDTO.Initiation.CurrencyOfTransfer ? "INTERNATIONALSCHEDULEDPAYMENT" :"DOMESTICSCHEDULEPAYMENT";
            } else {
                consentType = self.consentDTO.Initiation.CurrencyOfTransfer ? "INTERNATIONALPAYMENT" : "DOMESTICPAYMENT";
            }

            self.template = templates.consents.find(function (object) {
                return object.id === consentType;
            });
        };

        self.submitForm = function (formObject,act ,state) {

            const options = {
                url :"authz?act={act}&state={state}",
                formObject: formObject,
                version: "oauth2",
                apiType: "digx-auth-extended"
            },
            parameters = {
                    act:act,
                    state: state
                };

            options.url = getResourceURL(options);

            if (parameters) {
                options.url = params.baseModel.format(options.url, parameters, true);
            }

            options.url = addUserLocale(options.url);
            options.url = normalizeURL(options.url);

            const formElement = document.createElement("form");

            Object.keys(options.formObject).forEach(function (key) {
                const inputElement = document.createElement("input");

                inputElement.setAttribute("type", "hidden");

                if (typeof options.formObject[key] === "object") {
                    options.formObject[key] = JSON.stringify(options.formObject[key]);
                }

                inputElement.setAttribute("value", options.formObject[key]);
                inputElement.setAttribute("name", key);
                formElement.appendChild(inputElement);
            });

            formElement.setAttribute("action", options.url);
            formElement.setAttribute("method", "POST");
            document.body.appendChild(formElement);
            formElement.submit();
        };

        self.afterRender = function (data) {
            consentId = data.queryMap.consentId;
            state = data.queryMap.state;

            Model.getAccounts(data.queryMap.consentId, data.queryMap.client_id, data.queryMap.state).then(function (data) {
                self.touchPointName = data.resourceResponse.touchPointName;
                self.consentDTO = data.resourceResponse.consentDTO;
                fetchConsentTemplate(self.consentDTO);
                params.dashboard.headerName(self.nls.heading[self.template.header]);

                 if (self.consentDTO.ExpirationDateTime) {
                     self.consentDTO.ExpirationDateTime = oj.IntlConverterUtils.dateToLocalIso(new Date(self.consentDTO.ExpirationDateTime));
                 }

                 if (self.consentDTO.Initiation && self.consentDTO.Initiation.RequestedExecutionDateTime) {
                     self.consentDTO.Initiation.RequestedExecutionDateTime = oj.IntlConverterUtils.dateToLocalIso(new Date(self.consentDTO.Initiation.RequestedExecutionDateTime));
                 }

                if (self.consentDTO.Initiation && self.consentDTO.Initiation.DebtorAccount) {
                    self.debitorAccount(self.consentDTO.Initiation.DebtorAccount.Identification);
                    self.hasDebitorAccount = true;
                }

                if (self.consentDTO.DebtorAccount) {
                    self.debitorAccount(self.consentDTO.DebtorAccount.Identification);

                    const debtorAccount = data.resourceResponse.accounts.find(function (account) {
                        return account.id.value === self.debitorAccount();
                    });

                    self.accountName = debtorAccount.accountNickname ? debtorAccount.accountNickname : debtorAccount.partyName ;
                    self.hasDebitorAccount = true;
                }

                if (self.consentDTO.Initiation && self.consentDTO.Initiation.CreditorAccount.Identification) {
                    self.accountsArray = ko.utils.arrayFilter(data.resourceResponse.accounts, function (account) {
                        return account.id.value !== self.consentDTO.Initiation.CreditorAccount.Identification;
                    });
                } else {
                    self.accountsArray = data.resourceResponse.accounts;
                }

                self.dataLoaded(true);
            });
        };

        self.denyConsent = function (data) {
            self.submitForm({
                consentId: consentId,
                action: "REJECT"
            }, "",
             data.queryMap.state );
        };

        self.authorizeConsent = function (data) {
            if (!params.baseModel.showComponentValidationErrors(document.getElementById("tracker"))) {
                return;
            }

            const accountExclusionList = [];

            if (self.debitorAccount()) {
                accountExclusionList.push({
                    accountNumber: {
                        value: self.debitorAccount()
                    },
                    taskIds: [
                        self.template.taskId
                    ]
                });
            } else {
                self.selectedAccounts().forEach(function (selectedAccount) {
                    accountExclusionList.push({
                        accountNumber: {
                            value: selectedAccount
                        },
                        taskIds: [
                            self.template.taskId
                        ]
                    });
                });
            }

            for (let j = 0; j < accountAccessDTO.accessPointAccountDTOs.accessPointAccountDTOs.length; j++) {
                if (accountAccessDTO.accessPointAccountDTOs.accessPointAccountDTOs[j].accountType === "CSA") {
                    accountAccessDTO.accessPointAccountDTOs.accessPointAccountDTOs[j].accountExclusionDTOs = accountExclusionList;
                }
            }

            accountAccessDTO.consentId = data.queryMap.consentId;

            self.submitForm({
                accountAccessDTO: accountAccessDTO
            }, "1", data.queryMap.state);
        };

        $(document).on("2facancelled", function () {
            self.submitForm({
                consentId: consentId,
                action: "REJECT"
            }, "",
                state);
        });
    };
});