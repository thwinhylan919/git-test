define([

  "knockout",
  "ojL10n!resources/nls/mobile-landing",
  "platform"
], function (ko, resourceBundle, Platform) {
  "use strict";

  return function (Params) {
    const self = this;

    ko.utils.extend(self, Params.rootModel);
    self.nls = resourceBundle;
    self.renderModuleData = ko.observable(false);
    self.productTiles = ko.observable();
    self.selectedItem = ko.observable("home");
    Params.baseModel.registerComponent("bank-products", "widgets/pre-login");
    Params.baseModel.registerComponent("locator", "atm-branch-locator");
    Params.baseModel.registerComponent("claim-payment-dashboard", "claim-payment");
    Params.baseModel.registerComponent("bot-client", "chatbot");
    Params.baseModel.registerComponent("wallet-signup", "signup");

    self.gohome = function () {
      self.selectedItem("home");
    };

    self.quickLinks = [{
      txt: self.nls.quickLinks.labels.products,
      icon: "origination/products.svg",
      link: "products"
    }, {
      txt: self.nls.quickLinks.labels.claimMoney,
      icon: "origination/claim-money-widget.svg",
      link: "claimMoney"
    }, {
      txt: self.nls.quickLinks.labels.wallet,
      icon: "wallet/wallet-money.svg",
      link: "wallet"
    }];

    if (Params.baseModel.cordovaDevice()) {
      self.quickLinks.splice(0, 0, {
        txt: self.nls.quickLinks.labels.ScanToPay,
        icon: "dashboard/quick-access/scan-to-pay.svg",
        link: "ScanToPay"
      });
    }

    self.onSelectClick = function (data) {
      self.selectedItem(data.link);

      if (data.link === "ScanToPay") {
        Params.baseModel.registerComponent("login-form", "widgets/pre-login");

        Params.dashboard.loadComponent("login-form", {
          landingModule: "payments",
          landingComponent: "scan-qr",
          hideMobileLanding: true,
          params: self
        });
      }

      if (data.link === "products") {
        Params.dashboard.loadComponent("bank-products", {});
      }

      if (data.link === "claimMoney") {
        Params.dashboard.loadComponent("claim-payment-dashboard", {});
      }

      if (data.link === "wallet") {
        Params.dashboard.loadComponent("wallet-signup", {});
      }
    };

    const generateId = function () {
      let text = "";
      const size = 40,
        possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@$%^*()_+{}[]:;<>,.?/";

      for (let i = 0; i < size; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      }

      return "$CH$_" + text;
    };

    self.onChatBotClick = function () {
      Platform.getInstance().then(function (platform) {
        if (Params.baseModel.cordovaDevice() === "ANDROID") {
          const chatbotConfig = platform("getChatbotConfig");

          window.oda.initialize({
            server_url: chatbotConfig.chatbot_url,
            channel_id: chatbotConfig.chatbot_id,
            userId: generateId()
          });
        } else {
          window.chatbot.openChatbot({});
        }
      });
    };

    self.renderModuleData(true);
  };
});