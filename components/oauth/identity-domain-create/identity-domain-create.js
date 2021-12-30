define([
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/identity-domain",
    "ojs/ojformlayout",
    "ojs/ojvalidationgroup",
    "ojs/ojswitch",
    "ojs/ojcheckboxset",
    "ojs/ojinputtext",
    "ojs/ojdatetimepicker",
    "ojs/ojbutton"
], function (ko, $, IdentityDomainModel, resourceBundle) {
    "use strict";

    return function (params) {
        const self = this;

        ko.utils.extend(self, params.rootModel);
        self.nls = resourceBundle;
        self.identityStore = ko.observableArray();
        params.dashboard.headerName(self.nls.IdentityDomain.IdentityDomainMaintenance);

        params.baseModel.registerComponent("identity-domain-review", "oauth");

        const getNewKoModel = function () {
            const KoModel = ko.mapping.fromJS(IdentityDomainModel.getNewModel());

            return KoModel;
        };

        self.updateDomain = self.params.updateDomain || ko.observable(false);
        self.firstVisit = self.params.firstVisit || ko.observable(true);

        if (self.updateDomain() === false && self.firstVisit() === true) {
            self.firstVisit = ko.observable(true);
            self.accessTokenExpiry = ko.observable();
            self.accessTokenDay = ko.observable();
            self.refreshTokenExpiry = ko.observable();
            self.refreshTokenDay = ko.observable();
            self.azAccessTokenDay = ko.observable();
            self.azAccessTokenExpiry = ko.observable();
            self.azRefreshTokenExpiry = ko.observable();
            self.azRefreshTokenDay = ko.observable();
            self.refreshTokenEnabledflag = ko.observable(false);
            self.azRefreshTokenEnabledflag = ko.observable(false);
            self.viewPageFlg = ko.observable(false);
            self.refreshTokenDisableFieldFlag = ko.observable();
            self.azRefreshTokenDisableFieldFlag = ko.observable();

            self.identityDomainData = getNewKoModel().identityDomainDTO;
            self.authCodeDetail = getNewKoModel().authCodeDetail;
            self.accessTokenDetail = getNewKoModel().accessTokenDetail;
        } else {
            self.accessTokenExpiry = self.params.accessTokenExpiry || ko.observable();
            self.accessTokenDay = self.params.accessTokenDay || ko.observable();
            self.refreshTokenExpiry = self.params.refreshTokenExpiry || ko.observable();
            self.refreshTokenDay = self.params.refreshTokenDay || ko.observable();
            self.azAccessTokenDay = self.params.azAccessTokenDay || ko.observable();
            self.azAccessTokenExpiry = self.params.azAccessTokenExpiry || ko.observable();
            self.azRefreshTokenExpiry = self.params.azRefreshTokenExpiry || ko.observable();
            self.azRefreshTokenDay = self.params.azRefreshTokenDay || ko.observable();
            self.refreshTokenEnabledflag = self.params.refreshTokenEnabledflag || ko.observable();
            self.azRefreshTokenEnabledflag = self.params.azRefreshTokenEnabledflag || ko.observable();
            self.viewPageFlg = self.params.viewPageFlg || ko.observable();
            self.originalRefreshTokenExpiry = self.params.originalRefreshTokenExpiry || ko.observable();
            self.originalAzRefreshTokenExpiry = self.params.originalAzRefreshTokenExpiry || ko.observable();

            self.identityDomainData = self.params.identityDomainData || getNewKoModel().identityDomainDTO;
            self.authCodeDetail = self.params.authCodeDetail || getNewKoModel().authCodeDetail;
            self.accessTokenDetail = self.params.accessTokenDetail || getNewKoModel().accessTokenDetail;

            if (self.params.accessTokenTime) {
                self.accessTokenExpiry("T" + self.params.accessTokenTime.hours + ":" + self.params.accessTokenTime.minutes);
                self.accessTokenDay(self.params.accessTokenTime.day);
            }

            if (self.params.refreshTokenTime) {
                self.refreshTokenExpiry("T" + self.params.refreshTokenTime.hours + ":" + self.params.refreshTokenTime.minutes);
                self.refreshTokenDay(self.params.refreshTokenTime.day);
            }

            if (self.params.azAccessTokenTime) {
                self.azAccessTokenExpiry("T" + self.params.azAccessTokenTime.hours + ":" + self.params.azAccessTokenTime.minutes);
                self.azAccessTokenDay(self.params.azAccessTokenTime.day);
            }

            if (self.params.azRefreshTokenTime) {
                self.azRefreshTokenExpiry("T" + self.params.azRefreshTokenTime.hours + ":" + self.params.azRefreshTokenTime.minutes);
                self.azRefreshTokenDay(self.params.azRefreshTokenTime.day);
            }
        }

        self.refreshTokenChanged = function (event) {
            self.refreshTokenEnabledflag(event.detail.value);
        };

        self.azRefreshTokenChanged = function (event) {
            self.azRefreshTokenEnabledflag(event.detail.value);
        };

        self.updateRefreshTokenChanged = function (event) {
            self.refreshTokenEnabledflag(event.detail.value);

            for (let i = 0; i < self.identityDomainData.tokenDetail.length; i++) {
                if (self.identityDomainData.tokenDetail[i].tokenType === "ACCESS_TOKEN") {
                    self.identityDomainData.tokenDetail[i].refreshTokenExpiry = self.originalRefreshTokenExpiry();
                }
            }
        };

        self.azUpdateRefreshTokenChanged = function (event) {
            self.azRefreshTokenEnabledflag(event.detail.value);

            for (let i = 0; i < self.identityDomainData.tokenDetail.length; i++) {
                if (self.identityDomainData.tokenDetail[i].tokenType === "AUTHZ_CODE") {
                    self.identityDomainData.tokenDetail[i].refreshTokenExpiry = self.originalAzRefreshTokenExpiry();
                }
            }
        };

        if (self.updateDomain() === false && self.firstVisit() === true) {
            if (self.authCodeDetail.tokenExpiry() === "") {
                self.identityDomainData.tokenDetail.push(self.authCodeDetail);
            }

            if (self.accessTokenDetail.tokenExpiry() === "") {
                self.identityDomainData.tokenDetail.push(self.accessTokenDetail);
            }
        }

        self.identityStore([{
            id: "ELDAP",
            label: self.nls.IdentityDomain.embeddedLDAP
        }]);

        self.save = function () {
            if (!params.baseModel.showComponentValidationErrors(document.getElementById("tracker"))) {
                return;
            }

            const parameters = {
                identityDomainData: self.identityDomainData,
                accessTokenExpiry: self.accessTokenExpiry(),
                refreshTokenExpiry: self.refreshTokenExpiry(),
                refreshTokenDay: self.refreshTokenDay(),
                accessTokenDay: self.accessTokenDay(),
                azAccessTokenDay: self.azAccessTokenDay(),
                azAccessTokenExpiry: self.azAccessTokenExpiry(),
                azRefreshTokenExpiry: self.azRefreshTokenExpiry(),
                azRefreshTokenDay: self.azRefreshTokenDay(),
                updateDomain: self.updateDomain(),
                azRefreshTokenEnabledflag : self.azRefreshTokenEnabledflag(),
                refreshTokenEnabledflag : self.refreshTokenEnabledflag(),
                authCodeDetail : self.authCodeDetail,
                accessTokenDetail : self.accessTokenDetail
            };

            params.dashboard.loadComponent("identity-domain-review", parameters,self);
        };

        self.cancel = function () {
            $("#reviewCancel").trigger("openModal");
        };

        self.no = function () {
            $("#reviewCancel").hide();
        };

        self.back = function () {
            history.go(-1);
        };
    };
});