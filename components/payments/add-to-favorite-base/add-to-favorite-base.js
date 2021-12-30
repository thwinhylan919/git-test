define([

    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/payments-common",
    "ojs/ojinputnumber",
    "ojs/ojinputtext",
    "ojs/ojradioset",
    "ojs/ojcheckboxset",
    "ojs/ojdatetimepicker",
    "ojs/ojdialog",
    "ojs/ojselectcombobox",
    "ojs/ojvalidationgroup",
    "ojs/ojknockout-validation",
    "ojs/ojpopup",
    "ojs/ojavatar"
], function(ko, $, AddToFavoriteModel, ResourceBundle) {
    "use strict";

    return function(rootParams) {

        const self = this;

        ko.utils.extend(self, rootParams.rootModel);

        self.nls = ResourceBundle;

        const getNewKoModel = function() {
            const KoModel = ko.mapping.fromJS(AddToFavoriteModel.getNewModel());

            return KoModel;
        };

        self.disableOk = ko.observable(false);

        self.favoritesPayLoad = getNewKoModel().favoritesModel;

        self.stageFavoriteSuccess = ko.observable(false);

        self.stageFavoriteAdd = ko.observable(true);

        self.favoriteSuccess = function() {
            self.stageFavoriteAdd(false);
            self.stageFavoriteSuccess(true);
        };

        self.closeFavoriteModal = function() {
            $("#confirm-modal").trigger("closeModal");
            self.stageFavoriteSuccess(false);
            self.stageFavoriteAdd(true);
        };

        self.persistFavorites = function() {
            self.disableOk(true);
            self.data.params.favorite(false);

            self.favoritesPayLoad.id(self.data.params.paymentId);
            self.favoritesPayLoad.payeeId(self.data.params.payeeId);
            self.favoritesPayLoad.payeeGroupId(self.data.params.groupId);

            self.favoritesPayLoad.transactionType(self.data.params.transactionType);

            self.favoritesPayLoad.amount.currency(self.data.params.model.amount.currency);
            self.favoritesPayLoad.amount.amount(self.data.params.model.amount.amount);

            if(self.data.params.model.debitAccountId !== undefined)
            {
            self.favoritesPayLoad.debitAccountId.value(self.data.params.model.debitAccountId.value());
            }
            else if(self.data.params.model.debitAccount!== undefined)
            {
                self.favoritesPayLoad.debitAccountId.value(self.data.params.model.debitAccount.value());
            }
            else{
                self.favoritesPayLoad.debitAccountId = null;
            }

            self.favoritesPayLoad.accountType(self.data.params.model.accountType);

            self.favoritesPayLoad.purpose(self.data.params.model.purpose ? self.data.params.model.purpose() : null);
            self.favoritesPayLoad.remarks(self.data.params.model.remarks);
            self.favoritesPayLoad.valueDate(self.data.params.model.startDate);
            self.favoritesPayLoad.charges(self.data.params.model.charges ? self.data.params.model.charges() : null);
            self.favoritesPayLoad.payeeAccountName(self.data.params.accountName ? self.data.params.accountName : self.data.params.payeeDetails().accountName);
            self.favoritesPayLoad.payeeNickName(self.data.params.customPayeeName);

            if (self.data.params.model.creditAccountId) {
                self.favoritesPayLoad.creditAccountId.value(self.data.params.model.creditAccountId.value);
            } else {
                self.favoritesPayLoad.creditAccountId = null;
            }

            if (self.data.params.transactionType === "INTERNATIONALFT" || self.data.params.transactionType === "INTERNATIONALFT_PAYLATER") {
                self.favoritesPayLoad.otherDetails = self.data.params.model.otherDetails;
                self.favoritesPayLoad.intermediaryBankNetwork = self.data.params.model.intermediaryBankNetwork;
                self.favoritesPayLoad.intermediaryBankDetails = self.data.params.model.intermediaryBankDetails;
            }

            if (self.data.params.domesticPayeeType === "INDIA") {
                self.favoritesPayLoad.network(self.data.params.network);
            }

            AddToFavoriteModel.addFavorites(ko.toJSON(self.favoritesPayLoad)).done(function() {
                self.favoriteSuccess();
            }).fail(function() {
                self.closeFavoriteModal();
            });
        };
    };
});