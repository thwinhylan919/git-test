define([

    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/identity-domain",
    "ojs/ojcheckboxset",
    "ojs/ojbutton"
], function(ko, $, Model, resourceBundle) {
    "use strict";

    return function(params) {
        const self = this;

        ko.utils.extend(self, params.rootModel);
        self.nls = resourceBundle;
        self.Nls = resourceBundle.IdentityDomain;
        self.firstVisit = self.params.firstVisit || ko.observable(true);
        self.identityDomainData = self.params.identityDomainData || ko.observable();
        self.authCodeDetail = self.params.authCodeDetail || ko.observable();
        self.accessTokenDetail = self.params.accessTokenDetail || ko.observable();
        self.transactionStatus = ko.observable();
        self.transactionName = ko.observable(self.nls.IdentityDomain.IdentityDomainMaintenance);
        self.httpStatus = ko.observable();
        self.eldap = ko.observable();
        self.azRefreshTokenEnabled = ko.observable();
        self.refreshTokenEnabled = ko.observable();
        params.dashboard.headerName(self.nls.IdentityDomain.IdentityDomainMaintenance);
        params.baseModel.registerElement("confirm-screen");

        let days, daysms, hours, hoursms, minutes, minutesms, sec, daystoms, time, minutestoms, hourstoms, i;

        self.convertTime = function(days, tokenExpiry) {
            daystoms = days * 24 * 60 * 60;
            time = tokenExpiry.substring(tokenExpiry.indexOf("T") + 1, 6);
            hours = time.substring(0, time.indexOf(":"));
            minutes = tokenExpiry.substring(time.indexOf(":") + 2, 6);
            hourstoms = hours * 60 * 60;
            minutestoms = minutes * 60;

            return daystoms + hourstoms + minutestoms;
        };

        self.timeConversion = function(tokenExpiry) {
            days = Math.floor(tokenExpiry / (24 * 60 * 60));
            daysms = tokenExpiry % (24 * 60 * 60);
            hours = Math.floor(daysms / (60 * 60));
            hoursms = tokenExpiry % (60 * 60);
            minutes = Math.floor(hoursms / 60);
            minutesms = tokenExpiry % 60;
            sec = Math.floor(minutesms);

            if (hours.toString().length === 1) { hours = "0" + hours; }

            if (minutes.toString().length === 1) { minutes = "0" + minutes; }

            if (sec.toString().length === 1) { sec = "0" + sec; }

            return days + "Days," + hours + "Hour:" + minutes + "Minutes:" + sec + "Seconds";
        };

        self.tokenExpiry = ko.observable(self.convertTime(self.params.accessTokenDay, self.params.accessTokenExpiry));

        if (self.params.refreshTokenEnabledflag === true) {
            if (self.params.updateDomain === true) {
                self.identityDomainData.tokenDetail[0].refreshTokenExpiry = ko.observable(self.convertTime(self.params.refreshTokenDay, self.params.refreshTokenExpiry));
            }

            self.refreshTokenExpiry = ko.observable(self.convertTime(self.params.refreshTokenDay, self.params.refreshTokenExpiry));
        } else {
            self.refreshTokenExpiry = ko.observable();
        }

        self.azTokenExpiry = ko.observable(self.convertTime(self.params.azAccessTokenDay, self.params.azAccessTokenExpiry));

        if (self.params.azRefreshTokenEnabledflag === true) {
            if (self.params.updateDomain === true) {
            self.identityDomainData.tokenDetail[1].refreshTokenExpiry = ko.observable(self.convertTime(self.params.azRefreshTokenDay, self.params.azRefreshTokenExpiry));
            }

            self.azRefreshTokenExpiry = ko.observable(self.convertTime(self.params.azRefreshTokenDay, self.params.azRefreshTokenExpiry));
        } else {
            self.azRefreshTokenExpiry = ko.observable();
        }

        self.displayTokenExpiry = ko.observable(self.timeConversion(self.tokenExpiry()));
        self.displayRefreshTokenExpiry = ko.observable(self.timeConversion(self.refreshTokenExpiry()));
        self.displayAzTokenExpiry = ko.observable(self.timeConversion(self.azTokenExpiry()));
        self.displayAzRefreshTokenExpiry = ko.observable(self.timeConversion(self.azRefreshTokenExpiry()));

        if (self.params.updateDomain === false) {
            for (i = 0; i < self.params.identityDomainData.tokenDetail().length; i++) {
                if (self.params.identityDomainData.tokenDetail()[i].tokenType() === "ACCESS_TOKEN") {
                    self.params.identityDomainData.tokenDetail()[i].tokenExpiry = self.tokenExpiry();
                    self.params.identityDomainData.tokenDetail()[i].refreshTokenExpiry = self.refreshTokenExpiry();
                } else {
                    self.params.identityDomainData.tokenDetail()[i].tokenExpiry = self.azTokenExpiry();
                    self.params.identityDomainData.tokenDetail()[i].refreshTokenExpiry = self.azRefreshTokenExpiry();
                }
            }

            if (self.params.identityDomainData.identityProvider() === "ELDAP") {
                self.eldap = self.nls.IdentityDomain.embeddedLDAP;
            }

            if (self.accessTokenDetail.refreshTokenEnabled() === true) {
                self.refreshTokenEnabled(self.Nls.refreshTokenEnable);
            } else {
                self.refreshTokenEnabled(self.Nls.refreshTokenDisable);
            }

            if (self.authCodeDetail.refreshTokenEnabled() === true) {
                self.azRefreshTokenEnabled = self.Nls.refreshTokenEnable;
            } else {
                self.azRefreshTokenEnabled = self.Nls.refreshTokenDisable;
            }
        } else {
            for (i = 0; i < self.identityDomainData.tokenDetail.length; i++) {
                if (self.identityDomainData.tokenDetail[i].tokenType === "ACCESS_TOKEN") {
                    self.identityDomainData.tokenDetail[i].tokenExpiry = self.tokenExpiry();
                } else {
                    self.identityDomainData.tokenDetail[i].tokenExpiry = self.azTokenExpiry();
                }
            }

            if (self.identityDomainData.identityProvider === "ELDAP") {
                self.eldap = self.nls.IdentityDomain.embeddedLDAP;
            }

            if (self.accessTokenDetail.refreshTokenEnabled === true) {
                self.refreshTokenEnabled(self.Nls.refreshTokenEnable);
            } else {
                self.refreshTokenEnabled(self.Nls.refreshTokenDisable);
            }

            if (self.authCodeDetail.refreshTokenEnabled === true) {
                self.azRefreshTokenEnabled = self.Nls.refreshTokenEnable;
            } else {
                self.azRefreshTokenEnabled = self.Nls.refreshTokenDisable;
            }
        }

        self.confirm = function() {
            if (self.params.updateDomain) {
                Model.updateIDDomain(ko.mapping.toJSON(self.identityDomainData)).done(function(data, status, jqXhr) {
                    self.httpStatus(jqXhr.status);
                    self.transactionStatus(data.status);

                    params.dashboard.loadComponent("confirm-screen", {
                        jqXHR: jqXhr,
                        transactionName: self.nls.IdentityDomain.IdentityDomainMaintenance,
                        template: "oauth/confirm-screen-template"
                    }, self);
                });
            } else {
                Model.createIDDomain(ko.mapping.toJSON(self.params.identityDomainData)).done(function(data, status, jqXhr) {
                    self.httpStatus(jqXhr.status);
                    self.transactionStatus(data.status);

                    params.dashboard.loadComponent("confirm-screen", {
                        jqXHR: jqXhr,
                        transactionName: self.nls.IdentityDomain.IdentityDomainMaintenance,
                        template: "oauth/confirm-screen-template"
                    }, self);
                });
            }
        };

        self.cancel = function() {
            $("#reviewCancel").trigger("openModal");
        };

        self.no = function() {
            $("#reviewCancel").hide();
        };

        self.back = function() {
            self.firstVisit(false);
            history.go(-1);
        };
    };
});