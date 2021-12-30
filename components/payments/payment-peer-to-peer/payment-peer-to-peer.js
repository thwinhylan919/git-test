define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/payment-peer-to-peer",
    "framework/js/constants/constants",
    "platform",
    "framework/js/configurations/config",
    "ojs/ojinputnumber",
    "ojs/ojradioset",
    "ojs/ojknockout-validation",
    "ojs/ojinputtext",
    "ojs/ojdatetimepicker",
    "ojs/ojdialog",
    "ojs/ojselectcombobox",
    "ojs/ojvalidationgroup",
    "ojs/ojavatar",
    "ojs/ojarraydataprovider"
], function (oj, ko, $, PeerToPeerModel, ResourceBundle, Constants, Platform, Configuration) {
    "use strict";

    return function (rootParams) {
        const self = this,
            getNewKoModel = function () {
                const KoModel = ko.mapping.fromJS(PeerToPeerModel.getNewModel());

                return KoModel;
            };

        self.confirmValue = ko.observable();
        ko.utils.extend(self, rootParams.rootModel);

        self.payments = ResourceBundle.payments;
        self.common = ResourceBundle.common;
        self.peerToPeerModel = self.peerToPeerModel || getNewKoModel().P2PPaymentModel;
        self.stageOne = ko.observable(true);
        self.stageTwo = ko.observable(false);
        self.stageThree = ko.observable(false);
        self.additionalDetails = ko.observable();
        self.validationTracker = ko.observable();
        self.paymentId = ko.observable();
        self.p2ppaymentData = ko.observable();
        self.isPeerToPeer = ko.observable(true);
        self.invalidOtpEntered = ko.observable(false);
        self.securityCode = ko.observable();
        self.transferMode = self.transferMode || ko.observable();
        self.externalRefId = ko.observable();
        self.otpEntered = ko.observable();
        self.header = rootParams.header;
        self.friendsList = ko.observableArray();
        self.friendListMap = {};
        self.friendsListLoaded = ko.observable(false);
        self.followerListLoaded = ko.observable(false);
        self.isFacebook = self.isFacebook || ko.observable(false);
        self.isTwitter = self.isTwitter || ko.observable(false);
        self.twitterId = ko.observable();

        self.selectedUserId = ko.observableArray();
        self.isTwitterPaymentDone = self.isTwitterPaymentDone || ko.observable(false);
        self.isUserSelected = self.isUserSelected || ko.observable(false);
        self.shareMessage = ko.observable(self.payments.shareMessage);
        self.isPayToContacts = ko.observable(false);
        self.twitterHandle = ko.observable();
        self.checkFriendList = self.checkFriendList || ko.observable(false);
        self.twitterDummyList = ko.observableArray();
        self.selectedTwitterUser = ko.observableArray();
        self.socialPaymentId = ko.observable();
        self.isUserAvailable = ko.observable(false);
        self.selectedFacebookUser = ko.observable();
        self.facebookRecipientId = ko.observable();
        self.twitterScreenName = ko.observable();

        const transferObject = self.params && self.params.transferObject ? self.params.transferObject() : self.defaultData && self.defaultData.transferObject ? self.defaultData.transferObject() : null;

        if (self.data && self.data().mode === "PAY_TO_CONTACTS") {
            self.isPayToContacts(true);
            rootParams.dashboard.headerName(self.payments.peertopeer.payToContacts);
        }

self.p2pAddPayeeAs = ko.observable("existing-payee");

        self.addPayeeInGroup = ko.observable();
        self.confirmScreenDetails = ko.observable();
        rootParams.baseModel.registerComponent("peer-to-peer-payee", "payee");
        rootParams.baseModel.registerElement("modal-window");
        rootParams.baseModel.registerComponent("transfer-view-limits", "financial-limits");
        rootParams.baseModel.registerComponent("available-limits", "financial-limits");
        rootParams.baseModel.registerComponent("review-payment-peer-to-peer", "payments");
        rootParams.baseModel.registerComponent("social-media", "social-media");

        rootParams.baseModel.registerElement([
            "modal-window",
            "confirm-screen",
            "comment-box",
            "amount-input",
            "account-input"
        ]);

        self.localCurrency = ko.observable();
        self.loadAccessPointList = ko.observable(false);
        self.selectedChannelTypeName = ko.observable();
        self.selectedChannelType = ko.observable();
        self.selectedChannelIndex = ko.observable();
        self.selectedChannel = ko.observable(false);
        self.viewlimits = ko.observable(false);
        self.customPayeeId = ko.observable();
        self.customLimitType = ko.observable("");

        self.channelTypeChangeHandler = function () {
            if (self.selectedChannelIndex() !== null && self.selectedChannelIndex() >= 0 && self.selectedChannelIndex() !== "") {
                self.selectedChannel(false);
                ko.tasks.runEarly();
                self.selectedChannelType(self.channelList()[self.selectedChannelIndex()].id);
                self.selectedChannelTypeName(self.channelList()[self.selectedChannelIndex()].description);
                self.selectedChannel(true);
            }
        };

        self.channelList = ko.observableArray();

        PeerToPeerModel.listAccessPoint().done(function (data) {
            self.channelList(data.accessPointListDTO);

            for (let i = 0; i < data.accessPointListDTO.length; i++) {
                if (data.accessPointListDTO[i].currentLoggedIn === true) {
                    self.selectedChannelIndex(i);
                }
            }

            self.selectedChannel(true);
            self.selectedChannelType(self.channelList()[self.selectedChannelIndex()].id);
            self.selectedChannelTypeName(self.channelList()[self.selectedChannelIndex()].description);
            self.loadAccessPointList(true);
        });

        self.multiCurrencySupportEnabled = ko.observable("Y");

        PeerToPeerModel.listOfProperties().done(function (data) {

            const propertyMultiSupport = data.configurationDetails.filter(function (data) {
                return data.propertyId === "MULTICURRENCY_SUPPORT";
            });

            if (propertyMultiSupport.length > 0) {
                if (propertyMultiSupport[0].propertyValue === "N") {
                    self.multiCurrencySupportEnabled("N");
                } else {
                    self.multiCurrencySupportEnabled("Y");
                }
            }

        });

        PeerToPeerModel.init();
        self.isCommentRequired = ko.observable();

        PeerToPeerModel.fetchBankConfig().then(function (data) {
            self.isCommentRequired(data.bankConfigurationDTO.region === "INDIA");
        });

        self.peerToPeerModel.amount.currency(self.localCurrency());

        const senderName = rootParams.baseModel.format(self.payments.peertopeer.fullName, {
                firstName: rootParams.dashboard.userData.userProfile.firstName,
                lastName: rootParams.dashboard.userData.userProfile.lastName
            }),

            configurationDetails = {};

        self.imageUploadFlag = ko.observable();

        PeerToPeerModel.getPayeeMaintenance().then(function (data) {
            for (let k = 0; k < data.configurationDetails.length; k++) {
                configurationDetails[data.configurationDetails[k].propertyId] = data.configurationDetails[k].propertyValue;
            }

            if (rootParams.dashboard.appData.segment === "CORP") {
                self.imageUploadFlag(configurationDetails.CORPORATE_PAYEE_PHOTO_UPLOAD_ENABLED === "Y" ? 1 : 0);
            } else {
                self.imageUploadFlag(configurationDetails.RETAIL_PAYEE_PHOTO_UPLOAD_ENABLED === "Y" ? 1 : 0);
            }
        });

        self.initiatePayment = function () {
            if(self.walletAccBalance()=== 0.00 || self.walletAccBalance() < self.peerToPeerModel.amount.amount())
            {
                rootParams.baseModel.showMessages(null, [self.payments.peertopeer.noWalletBalanceTotransfer], "ERROR");
            }
            else{
            if (!rootParams.baseModel.showComponentValidationErrors(document.getElementById("peerToPeerTracker"))) {
                return;
            }

            if (self.transferMode() === "email/mobile") {
                if (/^\d+$/.test(self.peerToPeerModel.transferValue())) {
                    self.peerToPeerModel.transferMode("MOBILE");
                } else if (/[a-zA-z@.0-9]+$/.test(self.peerToPeerModel.transferValue())) {
                    self.peerToPeerModel.transferMode("EMAIL");
                }
            } else {
                self.peerToPeerModel.transferMode(self.transferMode());
            }

            self.peerToPeerModel.transferValue(self.peerToPeerModel.transferValue().toLowerCase());

            if (self.peerToPeerModel.transferMode() === "TWITTER") {

                self.peerToPeerModel.transferValue(self.selectedTwitterUser()[0].userId + "#" + self.selectedTwitterUser()[0].screenName);

            } else if (self.peerToPeerModel.transferMode() === "FACEBOOK") {
                self.facebookRecipientId(self.peerToPeerModel.transferValue());
                self.selectedFacebookUser(self.peerToPeerModel.transferValue() + "#" + self.friendListMap[self.peerToPeerModel.transferValue()]);
                self.peerToPeerModel.transferValue(self.selectedFacebookUser());

            }

            const payload = ko.toJSON(self.peerToPeerModel);

            PeerToPeerModel.initiateP2P(payload).done(function (data) {
                self.paymentId(data.paymentId);

                self.baseURL = "payments/transfers/peerToPeer/" + self.paymentId();

                rootParams.dashboard.loadComponent("review-payment-peer-to-peer", {
                    paymentId: self.paymentId(),
                    header: rootParams.dashboard.headerName(),
                    retainedData: self
                }, self);
            });
          }
        };

        self.readP2P = function () {
            PeerToPeerModel.readP2P(self.paymentId()).done(function (data) {
                self.p2ppaymentData(data);
                self.header(false);
                self.stageOne(false);
                self.stageTwo(true);
            });
        };

        self.cancelPayment = function () {
            self.stageOne(true);
            self.header(true);
            self.stageTwo(false);
            self.stageThree(false);
        };

        self.handleFacebookChecks = function () {
            if (self.isFacebook()) {
                window.setTimeout(self.openFacebookWindow, 3000);
            }
        };

        let cnftransferValue,
            transferValue;

        function transferValueValidator_fn(value) {
            transferValue = value;

            if (value) {
                if (cnftransferValue) {
                    if (value === cnftransferValue) {
                        document.getElementById("confirmTransferValueEmail").validate();
                    } else {
                        throw new oj.ValidatorError("ERROR", self.payments.peertopeer.transferValuemsg);
                    }
                } else if (self.confirmValue()) {
                    if (value !== self.confirmValue()) {
                        throw new oj.ValidatorError("ERROR", self.payments.peertopeer.transferValuemsg);
                    }
                }
            }
        }

        function cnfTransferValueValidator_fn(value) {
            if ((self.peerToPeerModel.transferValue() && self.peerToPeerModel.transferValue() !== "") || value) {
                cnftransferValue = value;

                if (transferValue !== cnftransferValue) {
                    if (self.peerToPeerModel.transferValue() !== value) {
                        self.peerToPeerModel.transferValue("");
                        throw new oj.ValidatorError("ERROR", self.payments.peertopeer.transferValuemsg);
                    }
                } else if (transferValue === cnftransferValue) {
                    self.confirmValue(cnftransferValue);
                    cnftransferValue = "";
                    transferValueValidator_fn(transferValue);
                    document.getElementById("transferValueEmail").validate();
                }
            } else {
                throw new oj.ValidatorError("ERROR", self.payments.peertopeer.p2pMessage);
            }
        }

        self.transferValueValidator = [{
            validate: transferValueValidator_fn
        }];

        self.confirmTransferValueValidator = [{
            validate: cnfTransferValueValidator_fn
        }];

        self.restrictedEvent = function () {
            $("#transferValueEmail").bind("copy paste cut", function (e) {
                e.preventDefault();
            });

            $("#confirmTransferValueEmail").bind("copy paste cut", function (e) {
                e.preventDefault();
            });
        };

        self.verifyPayment = function () {
            PeerToPeerModel.verifyP2P(self.paymentId()).done(function (data, status, jqXHR) {
                if (self.peerToPeerModel.transferMode() === "TWITTER" || self.peerToPeerModel.transferMode() === "FACEBOOK") {
                    self.socialPaymentId = data.paymentId;
                }

                self.stageTwo(false);
                self.securityCode(data.securityCode);

                if (data.tokenAvailable) {
                    self.stageThree(true);
                } else {
                    const shareMessage = rootParams.baseModel.format(self.shareMessage(), {
                        transactionName: self.payments.verifyP2PPayment,
                        referenceNumber: data.externalReferenceId
                    });

                    self.externalRefId(data.externalReferenceId);
                    self.securityCode(data.securityCode);

                    rootParams.dashboard.loadComponent("confirm-screen", {
                        jqXHR: jqXHR,
                        hostReferenceNumber: data.externalReferenceId,
                        transactionName: self.payments.transferMoney,
                        p2p: true,
                        facebookPayment: self.isFacebook(),
                        twitterPayment: self.isTwitter(),
                        createPayee: self.createPayee,
                        enableP2PpayeeOptions: self.enableP2PpayeeOptions,
                        p2pAddPayeeAs: self.p2pAddPayeeAs,
                        payeeListExpandAll: self.payeeListExpandAll,
common: self.common,
imageUploadFlag : self.imageUploadFlag,
addPayeeInGroup: self.addPayeeInGroup,
                        shareMessage: shareMessage,
                        confirmScreenExtensions: {
                            successMessage: self.common.confirmScreen.successMessage,
                            statusMessages: self.common.success,
                            isSet: true,
                            taskCode: "PC_F_PRTOPR",
                            confirmScreenDetails: self.confirmScreenDetails(),
                            template: "confirm-screen/payments-template"
                        },
                        additionalDetails: {
                            items: [{
                                label: self.payments.securityCode,
                                value: data.securityCode
                            },
                            {
                                label: self.payments.payvia,
                                value: data.transferMode
                            },
                            {
                                label: data.transferMode ==="TWITTER" ? self.payments.peertopeer.transferto : self.payments.peertopeer.transferValue,
                                value: data.transferMode ==="TWITTER" ? data.transferValue.substring(20) : data.transferValue.replace("&#x40;","@")
                            },
                            {
                                label: self.payments.peertopeer.amount,
                                value: data.transferDetails.amount.amount,
                                currency: data.transferDetails.amount.currency,
                                isCurrency: true
                            },
                            {
                                label: self.payments.peertopeer.transferfrom,
                                value: data.transferDetails.debitAccountId.displayValue
                            }]
                        }
                    }, self);

                    self.handleFacebookChecks();
                    self.handleTwitterChecks();

                }
            });
        };

        self.confirmPayment = function (data, status, jqXHR) {
            self.externalRefId(data.externalReferenceId);
            self.securityCode(data.securityCode);
            self.stageThree(false);

            rootParams.dashboard.loadComponent("confirm-screen", {
                jqXHR: jqXHR,
                hostReferenceNumber: data.externalReferenceId,
                securityCode: data.securityCode,
                transactionName: self.payments.confirmP2PPayment,
                template: "payments/confirm-screen-templates/payment-peer-to-peer"
            }, self);

            self.handleFacebookChecks();
            self.handleTwitterChecks();

        };

        self.paymentDone = function () {
            history.go(-1);
        };

        self.goToDashboard = function () {
            window.location.reload();
        };

        self.selectedFriend = self.selectedFriend || ko.observable();

        self.peerToPeerData = ko.observable({
            transferValue: ""
        });

        self.existingPayee = function () {
            const groupId = self.addPayeeInGroup().groupId,
                obj = ko.utils.arrayFirst(self.payeeListExpandAll(), function (element) {
                    return element.groupId === groupId;
                });

            self.peerToPeerData({
                transferValue: self.peerToPeerModel.transferValue().toLowerCase(),
                payeeGroupId: groupId,
                payeeName: obj.payeeGroupName,
                isNew: false,
                preview: self.addPayeeInGroup().preview ? self.addPayeeInGroup().preview : ko.observable()
            });

            rootParams.dashboard.loadComponent("peer-to-peer-payee", ko.mapping.toJS(self.peerToPeerData()));
        };

        self.newPayee = function () {
            self.peerToPeerData({
                transferValue: self.peerToPeerModel.transferValue().toLowerCase(),
                isNew: true
            });

            rootParams.dashboard.loadComponent("peer-to-peer-payee", ko.mapping.toJS(self.peerToPeerData()));
        };

        self.createPayee = function () {
            if (!rootParams.baseModel.showComponentValidationErrors(document.getElementById("createpayee"))) {
                return;
            }

            if (self.p2pAddPayeeAs() === "existing-payee") {
                self.existingPayee();
            } else {
                self.newPayee();
            }
        };

        self.enableP2PpayeeOptions = function () {
            $("#p2p-payee").trigger("openModal");
        };

        self.transferModeArray = ko.observableArray([{
                code: "email/mobile",
                description: self.payments.peertopeer.transferValue,
                icon: "icons icon-mailbox"
            },
            {
                code: "BANKACCOUNT",
                description: self.payments.bankaccount,
                icon: "icons icon-bank-details"
            },
            {
                code: "FACEBOOK",
                description: self.payments.peertopeer.facebookPayment,
                icon: "icons icon-facebook"
            },
            {
                code: "TWITTER",
                description: self.payments.peertopeer.twitterPayment,
                icon: "icons icon-twitter"
            }
        ]);

        if (self.isPayToContacts()) {
            self.transferModeArray.remove(function (item) {
                return item.code === "BANKACCOUNT";
            });
        }

        if (!self.transferMode()) {
            self.transferMode(self.transferModeArray()[0].code);
        }

        self.transferModeChange = function (event) {
            if (event.detail.value && (event.detail.value === "email/mobile" || event.detail.value === "FACEBOOK" || event.detail.value === "TWITTER")) {
                self.isPeerToPeer(true);
                self.isFacebook(false);
                self.isTwitter(false);

                if (!transferObject) {
                    self.peerToPeerModel.transferValue(null);
                }

                if (event.detail.value === "FACEBOOK") {
                    self.isFacebook(true);
                } else if (event.detail.value === "TWITTER") {
                    self.isTwitter(true);
                    self.openTwitterWindow();
                }
            } else if (event.detail.value === "BANKACCOUNT") {
                self.isPeerToPeer(false);
            }
        };

        self.currencyParser = function (data) {
            const output = {};

            output.currencies = [];

            for (let i = 0; i < data.currencyList.length; i++) {
                output.currencies.push({
                    code: data.currencyList[i].code,
                    description: data.currencyList[i].code
                });
            }

            return output;
        };

        self.viewLimits = function () {
            self.viewlimits(false);
            self.customLimitType("");
            self.customLimitType("PC_F_PRTOPR");
            self.parentTaskCode("PC_F_CPTP");
            ko.tasks.runEarly();
            $("#viewlimits-P2P").trigger("openModal");
            self.viewlimits(true);
        };

        self.closeLimitsModal = function () {
            self.selectedChannelIndex("");
            self.selectedChannel(false);
            ko.tasks.runEarly();
            $("#viewlimits-P2P").trigger("closeModal");
        };

        self.openFacebookWindow = function () {
            const params = {
                app_id: Configuration.thirdPartyAPIs.facebook.apiKey,
                caption: self.payments.verifyP2PPayment,
                link: window.location.origin + "?homeComponent=claim-payment-dashboard&homeModule=claim-payment&menuNavigationAvailable=false&id=" + self.socialPaymentId + "&determinantValue=" + Constants.currentEntity,
                to: self.facebookRecipientId(),
                redirect_uri: "www.facebook.com"
            };
            let url = Configuration.thirdPartyAPIs.facebook.url + "/dialog/send?" + $.param(params);

            if (rootParams.baseModel.cordovaDevice()) {
                Platform.getInstance().then(function (platform) {
                    const server_url = platform("getServerURL");

                    url = server_url + "?homeComponent=claim-payment-dashboard&homeModule=claim-payment&menuNavigationAvailable=false&id=" + self.socialPaymentId + "&determinantValue=" + Constants.currentEntity;

                    window.facebookConnectPlugin.showDialog({
                        method: "send",
                        link: url
                    });
                });
            } else {
                window.open(url, "PAYMENT", "width=900,height=400");
            }
        };

        self.dataProvider = new oj.ArrayDataProvider(self.twitterDummyList, {
            keyAttributes: "userId"
        });

        self.openTwitterWindow = function () {
            if (rootParams.baseModel.cordovaDevice()) {
                Platform.getInstance().then(function (platform) {
                    const server_url = platform("getServerURL") + "/" + Configuration.apiCatalogue.social.contextRoot + "/signin";

                    window.twitter.openTwitterWindow({
                        url: server_url
                    });
                });
            } else {

                const url = window.location.origin + "/" + Configuration.apiCatalogue.social.contextRoot + "/signin";

                window.open(url, "_blank", "height=500,width=650");
            }
        };

        self.openTwitterModal = function () {
            $("#modalDialog1").trigger("openModal");

            const input = document.getElementById("searchBar");

            input.addEventListener("keyup", function (event) {
                event.preventDefault();

                if (event.keyCode === 13) {
                    document.getElementById("okButton").click();
                }
            });
        };

        self.closeTwitterModal = function () {
            if (self.isUserSelected()) {
                $("#modalDialog1").trigger("closeModal");
            }

        };

        self.onUserSelected = function (event) {
            self.selectedTwitterUser([event.data]);
            self.peerToPeerModel.transferValue(self.selectedTwitterUser()[0].userId);
            self.twitterScreenName(self.selectedTwitterUser()[0].screenName);
            self.isUserSelected(true);
            self.closeTwitterModal();

        };

        self.displayScreenName = function () {
            if (!rootParams.baseModel.showComponentValidationErrors(document.getElementById("searchBar"))) {
                return;
            }

            PeerToPeerModel.getTwitterUserList(self.twitterHandle()).then(function (data) {
                self.twitterDummyList(data.userList);
                self.isUserAvailable(true);
            });

        };

        self.handleTwitterChecks = function () {

            const paymentLink = rootParams.baseModel.format(self.payments.peertopeer.paymentLink, {
                currency: self.peerToPeerModel.amount.currency(),
                amount: self.peerToPeerModel.amount.amount(),
                name: senderName
            });

            if (self.peerToPeerModel.transferMode() === "TWITTER") {
                const payload = {

                    recepientId: self.selectedTwitterUser()[0].userId
                };

                Platform.getInstance().then(function (platform) {
                    if (rootParams.baseModel.cordovaDevice()) {
                        payload.msgText = paymentLink + "\n" + platform("getServerURL") + "?homeComponent=claim-payment-dashboard&homeModule=claim-payment&menuNavigationAvailable=false&id=" + self.socialPaymentId + "&determinantValue=" + Constants.currentEntity;

                    } else {
                        payload.msgText = paymentLink + "\n" + window.location.origin + "?homeComponent=claim-payment-dashboard&homeModule=claim-payment&menuNavigationAvailable=false&id=" + self.socialPaymentId + "&determinantValue=" + Constants.currentEntity;
                    }

                    PeerToPeerModel.twitterDm(ko.toJSON(payload)).then(function (data) {
                        if (data.recepientId !== self.selectedTwitterUser()[0].userId) {
                            rootParams.baseModel.showMessages(null, [self.payments.peertopeer.twitterPaymentFailure], "ERROR");
                        }
                    });
                });
            }
        };

        self.expandList = function () {
            if (!rootParams.baseModel.large() && self.friendsList().length > 0) {
                self.loadFriendListComponent();
            }
        };

        self.accountsParser = function (data) {
            const tempData = data;

            if (self.multiCurrencySupportEnabled() === "N") {
                if (tempData) {
                    const filteredAccounts = tempData.filter(function (account) {
                        return account.currencyCode === rootParams.dashboard.appData.localCurrency;
                    });

                    return filteredAccounts;
                }
            }

            return tempData;

        };

        self.loadFriendListComponent = function () {
            rootParams.baseModel.registerComponent("facebook-friend-list", "payments");

            rootParams.dashboard.loadComponent("facebook-friend-list", {
                dataList: self.friendsList,
                selectedValue: self.selectedFriend,
                retainedData: self
            }, self);
        };

        self.loadFriendList = function (response) {
            self.friendsList.removeAll();

            for (let i = 0; i < response.data.length; i++) {
                self.friendsList.push(response.data[i]);
                self.friendListMap[response.data[i].id] = response.data[i].name;
            }

            self.friendsListLoaded(true);
            self.peerToPeerModel.transferValue(self.selectedFriend());

            if (!rootParams.baseModel.large() && response.data.length === 0) {
                rootParams.baseModel.showMessages(null, [self.payments.peertopeer.noFriendsFound], "INFO");
            } else if (!rootParams.baseModel.large() && !self.selectedFriend() && !self.checkFriendList()) {
                self.loadFriendListComponent();
                self.checkFriendList(true);
            }
        };

        self.dispose = null;

        if (transferObject) {
            const temp = transferObject;

            self.transferMode(temp.transferMode);
            self.peerToPeerModel.transferMode(temp.transferMode);
            self.confirmTransferValue(temp.transferValue);
            self.peerToPeerModel.transferValue(temp.transferValue);
            self.peerToPeerModel.amount.amount(temp.amount);
            self.peerToPeerModel.amount.currency(temp.currency);
            self.peerToPeerModel.debitAccountId.value(temp.debitAccountId);
            self.peerToPeerModel.remarks(temp.remarks);
        }
    };
});