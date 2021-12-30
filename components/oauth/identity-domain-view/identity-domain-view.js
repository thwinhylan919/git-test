define([
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/identity-domain",
    "ojs/ojcheckboxset",
    "ojs/ojdatetimepicker",
    "ojs/ojbutton"
], function (ko, $, Model, resourceBundle) {
    "use strict";

    return function (params) {
        const self = this;

        self.nls = resourceBundle;
        ko.utils.extend(self, params.rootModel);
        params.dashboard.headerName(self.nls.header);
        self.identityDomain = ko.observable(false);
        self.identityDomainData = ko.observable();
        self.tokenExpiry = ko.observable();
        self.refreshTokenExpiry = ko.observable();
        self.azTokenExpiry = ko.observable();
        self.azRefreshTokenExpiry = ko.observable();
        self.authCodeDetail = ko.observable();
        self.accessTokenDetail = ko.observable();
        self.accessTokenTime = ko.observable();
        self.refreshTokenTime = ko.observable();
        self.azAccessTokenTime = ko.observable();
        self.azRefreshTokenTime = ko.observable();
        self.tokenDetailArray = ko.observableArray();
        self.updateDomain = ko.observable(true);
        self.eldap = ko.observable();
        self.refreshTokenEnabled = ko.observable();
        self.azRefreshTokenEnabled = ko.observable();
        self.refreshTokenEnabledflag = ko.observable();
        self.azRefreshTokenEnabledflag = ko.observable();
        self.viewPageFlg = ko.observable(true);
        self.originalRefreshTokenExpiry = ko.observable();
        self.originalAzRefreshTokenExpiry = ko.observable();

        params.dashboard.headerName(self.nls.IdentityDomain.IdentityDomainMaintenance);
        params.baseModel.registerComponent("identity-domain-search", "oauth");
        params.baseModel.registerComponent("identity-domain-create", "oauth");

        let days, daysms, hours, hoursms, minutes, minutesms, seconds;

        Model.fetchIdentityDomain(self.params.domainName).then(function (data) {
            self.identityDomain(true);

            self.identityDomainData(data.jsonNode.identityDomainDTO);
            self.tokenDetailArray(self.identityDomainData().tokenDetail);

            if (self.identityDomainData().identityProvider === "ELDAP") {
                self.eldap = self.nls.IdentityDomain.embeddedLDAP;
            }

            for (let i = 0; i < self.tokenDetailArray().length; i++) {
                if (self.tokenDetailArray()[i].tokenType === "ACCESS_TOKEN") {
                    self.accessTokenDetail(self.tokenDetailArray()[i]);
                } else {
                    self.authCodeDetail(self.tokenDetailArray()[i]);
                }
            }

            if (self.accessTokenDetail().refreshTokenEnabled === true) {
                self.refreshTokenEnabled = self.nls.IdentityDomain.refreshTokenEnable;
                self.refreshTokenEnabledflag(true);
            } else {
                self.refreshTokenEnabled = self.nls.IdentityDomain.refreshTokenDisable;
                self.refreshTokenEnabledflag(false);
            }

            if (self.authCodeDetail().refreshTokenEnabled === true) {
                self.azRefreshTokenEnabled = self.nls.IdentityDomain.refreshTokenEnable;
                self.azRefreshTokenEnabledflag(true);
            } else {
                self.azRefreshTokenEnabled = self.nls.IdentityDomain.refreshTokenDisable;
                self.azRefreshTokenEnabledflag(false);
            }

            if (self.identityDomain()) {
                self.tokenExpiry(self.timeConversion(self.accessTokenDetail().tokenExpiry));

                self.accessTokenTime({
                    day: days,
                    hours: hours,
                    minutes: minutes
                });

                self.originalRefreshTokenExpiry(self.accessTokenDetail().refreshTokenExpiry);
                self.refreshTokenExpiry(self.timeConversion(self.accessTokenDetail().refreshTokenExpiry));

                self.refreshTokenTime({
                    day: days,
                    hours: hours,
                    minutes: minutes
                });

                self.azTokenExpiry(self.timeConversion(self.authCodeDetail().tokenExpiry));

                self.azAccessTokenTime({
                    day: days,
                    hours: hours,
                    minutes: minutes
                });

                self.originalAzRefreshTokenExpiry(self.authCodeDetail().refreshTokenExpiry);
                self.azRefreshTokenExpiry(self.timeConversion(self.authCodeDetail().refreshTokenExpiry));

                self.azRefreshTokenTime({
                    day: days,
                    hours: hours,
                    minutes: minutes
                });
            }
        });

        self.timeConversion = function (tokenExpiry) {
            days = Math.floor(tokenExpiry / (24 * 60 * 60));
            daysms = tokenExpiry % (24 * 60 * 60);
            hours = Math.floor(daysms / (60 * 60));
            hoursms = tokenExpiry % (60 * 60);
            minutes = Math.floor(hoursms / 60);
            minutesms = tokenExpiry % 60;
            seconds = Math.floor(minutesms);

            if (hours.toString().length === 1) { hours = "0" + hours; }

            if (minutes.toString().length === 1) { minutes = "0" + minutes; }

            if (seconds.toString().length === 1) { seconds = "0" + seconds; }

            return days + "Days," + hours + "Hour:" + minutes + "Minutes:" + seconds + "Seconds";
        };

        self.edit = function () {
            if (!params.baseModel.showComponentValidationErrors(document.getElementById("tracker"))) {
                return;
            }

            const parameters = {
                identityDomainData: self.identityDomainData(),
                accessTokenTime: self.accessTokenTime(),
                refreshTokenTime: self.refreshTokenTime(),
                azAccessTokenTime: self.azAccessTokenTime(),
                azRefreshTokenTime: self.azRefreshTokenTime(),
                accessTokenDetail: self.accessTokenDetail(),
                authCodeDetail: self.authCodeDetail(),
                accessTokenExpiry: self.accessTokenExpiry,
                refreshTokenExpiry: self.refreshTokenExpiry,
                refreshTokenDay: self.refreshTokenDay,
                accessTokenDay: self.accessTokenDay,
                azAccessTokenDay: self.azAccessTokenDay,
                azAccessTokenExpiry: self.azAccessTokenExpiry,
                azRefreshTokenExpiry: self.azRefreshTokenExpiry,
                azRefreshTokenDay: self.azRefreshTokenDay,
                updateDomain: self.updateDomain,
                refreshTokenEnabledflag: self.refreshTokenEnabledflag,
                azRefreshTokenEnabledflag: self.azRefreshTokenEnabledflag
            };

            params.dashboard.loadComponent("identity-domain-create", parameters, self);
        };

        self.cancel = function () {
            $("#reviewCancel").trigger("openModal");
        };

        self.no = function () {
            $("#reviewCancel").hide();
        };

        self.back = function () {
            let parameters;

            params.dashboard.loadComponent("identity-domain-search", parameters, self);
        };
    };
});