define([
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/quick-links",
    "ojL10n!resources/nls/bank-products",
    "baseService"
  ],
  function (ko, $, BankProductModel, resourceBundle, resourceBundleProducts, BaseService) {
    "use strict";

    return function (Params) {
      const self = this,
        baseService = BaseService.getInstance();

      ko.utils.extend(self, Params.rootModel);
      self.nls = resourceBundle;
      self.resource = resourceBundleProducts;
      self.renderModuleData = ko.observable(false);
      self.productTiles = ko.observable();
      self.tiles = ko.observableArray([]);

      self.dataLoaded = ko.observable(false);
      ko.utils.extend(self, Params.rootModel);
      self.userData = Params.dashboard.userData;
      self.dataLoaded(true);
      self.resource = resourceBundle;
      self.showPage = ko.observable(false);
      Params.baseModel.registerComponent("layout", "home");
      Params.baseModel.registerComponent("bank-products", "home");
      self.compName = ko.observable();
      self.compName("bank-products");
      self.productHeaderImage = ko.observable("");
      self.homePage = ko.observable(true);
      self.userLoggedIn = ko.observable(false);
      self.label = ko.observable();
      self.context = ko.observable();
      self.userRoles = ko.observableArray();
      self.isLogin = ko.observable(false);
      self.isStatesLoaded = ko.observable(false);
      self.stateOptions = ko.observableArray();
      self.selectedState = ko.observable("");
      self.isStateSelected = ko.observable(false);
      self.selectedStateText = ko.observable("");

      self.goToBack = function () {
        history.back();
      };

      self.actionCardData = ko.observable();
      self.type = ko.observable();
      self.className = ko.observable();
      self.productGroupData = ko.observable();
      self.showComponent = ko.observable(true);
      self.userProfile = ko.observable();
      self.actionData = ko.observable();
      self.stateReload = ko.observable(true);
      self.refreshState = ko.observable(true);
      self.isStateChangeAllowed = ko.observable(true);
      Params.baseModel.registerComponent("tooltip", "home");
      Params.baseModel.registerComponent("login-carousal", "home");
      Params.baseModel.registerComponent("product-groups-carousal", "home");
      Params.baseModel.registerComponent("product-groups-list", "home");
      Params.baseModel.registerComponent("user-information", "forgot-password");
      Params.baseModel.registerComponent("reset-password", "forgot-password");
      Params.baseModel.registerComponent("user-credentials", "registration");
      Params.baseModel.registerComponent("locator", "location");
      Params.baseModel.registerComponent("branch-details", "location");
      Params.baseModel.registerComponent("otp-verification", "base-components");
      Params.baseModel.registerElement("modal-window");
      Params.baseModel.registerElement("row");
      Params.baseModel.registerComponent("product-groups", "home");
      Params.baseModel.registerElement("page-section");
      Params.baseModel.registerComponent("origination-header", "login");
      Params.baseModel.registerComponent("mobile-landing", "home");
      Params.baseModel.registerComponent("search-vehicle", "home");
      self.context = ko.observable();

      BankProductModel.fetchProductTiles().done(function (data) {
        self.productTiles(data.productTypes);
        self.renderModuleData(true);
      });

      self.loadComponentName = function (compName, label, context) {
        self.maintainHistory(compName);
        self.label(label);
        self.compName(compName);
        self.context(context);
      };

      Params.baseModel.registerComponent("page-banner", "widgets/pre-login");
      Params.baseModel.registerComponent("tools-n-calculators", "home");
      Params.baseModel.registerComponent("contact-us", "home");
      Params.baseModel.registerComponent("company-links", "home");
      self.products = ko.observable("bank-products");

      const tempSessionStorageData = self.applicationArguments,
        sessionStorageData = tempSessionStorageData ? JSON.parse(tempSessionStorageData) : {};
      let applicantId;

      self.switchPageProduct = function () {
        this.actionCardData().module = "origination";

        if (this.userLoggedIn() || this.actionCardData().productClass === "CREDIT_CARD") {
          Params.dashboard.loadComponent("product-groups", this);
          this.compName("product-groups");
        } else {
          $("#stateSelection").show().trigger("openModal");
        }
      };

      const options = {
        showMessage: false,
        url: "enumerations/country/US/state",
        success: function (data) {
          self.fetchStatesHandler(data);
        }
      };

      baseService.fetch(options);

      self.fetchStatesHandler = function (data) {
        self.stateOptions(data.enumRepresentations[0].data);
        self.isStatesLoaded(true);

        if (sessionStorageData && sessionStorageData.selectedState) {
          self.isStateSelected(true);
          self.isStateChangeAllowed(false);
          self.selectedState(sessionStorageData.selectedState);
          self.selectedStateText(Params.baseModel.getDescriptionFromCode(self.stateOptions(), self.selectedState()));
        }

        if (self.userData && self.userData.userProfile) {
          self.isStateChangeAllowed(false);
          applicantId = self.userData.userProfile.partyId.value;
          self.fetchSubmissions();
        }
      };

      self.fetchSubmissionsHandler = function (data) {
        if (data.submissions) {
          for (let i = 0; i < data.submissions.length; i++) {
            if (!(data.submissions[i].submitted && JSON.parse(data.submissions[i].submitted))) {
              self.isToBeSynched = false;
              break;
            }
          }

          const isToBeSynchedAfterLoginRedirection = self.isToBeSynched && sessionStorageData && sessionStorageData.loginRedirection && JSON.parse(sessionStorageData.loginRedirection);

          if (isToBeSynchedAfterLoginRedirection) {
            self.synchWithHost("123", applicantId);
          } else {
            self.findStateFromContact(applicantId);
          }
        } else {
          self.findStateFromContact(applicantId);
        }
      };

      self.fetchSubmissions = function () {
        const options = {
          url: "submissions",
          success: function (data) {
            self.fetchSubmissionsHandler(data);
          }
        };

        baseService.fetch(options);
      };

      self.synchWithHostHandler = function (data, applicantId) {
        self.findStateFromContact(applicantId);
      };

      self.synchWithHost = function (submissionId, applicantId) {
        const params = {
            submissionId: submissionId,
            partyId: applicantId
          },
          options = {
            url: "submissions/{submissionId}/applicants/{partyId}/sync",
            success: function (data) {
              self.synchWithHostHandler(data, applicantId);
            }
          };

        baseService.update(options, params);
      };

      self.findStateFromContact = function (applicantId) {
        const params = {
            applicantId: applicantId,
            submissionId: "123"
          },
          options = {
            showMessage: false,
            url: "parties/{applicantId}/addresses?type=PST",
            success: function (data) {
              self.findStateFromContactHandler(data);
            }
          };

        baseService.fetch(options, params);
      };

      self.findStateFromContactHandler = function (data) {
        let state = null,
          i;

        if (data.partyAddressDTO) {
          for (i = 0; i < data.partyAddressDTO.length; i++) {
            if (data.partyAddressDTO[i].type === "RES" && data.partyAddressDTO[i].status === "CURRENT") {
              state = data.partyAddressDTO[i].postalAddress.state;
              break;
            }
          }

          self.verifyState(state);
        } else if (data.applicantAddressDTO) {
          for (i = 0; i < data.applicantAddressDTO.length; i++) {
            if (data.applicantAddressDTO[i].type === "RES" && data.applicantAddressDTO[i].status === "CURRENT") {
              state = data.applicantAddressDTO[i].postalAddress.state;
              break;
            }
          }

          self.verifyState(state);
        } else {
          self.findStateFromSubmissions();
        }
      };

      self.getSubmission = function () {
        const options = {
          showMessage: false,
          url: "submissions",
          success: function (data) {
            if (data.submissions && data.submissions[0]) {
              self.getSubmissionHandler(data);
            }
          }
        };

        baseService.fetch(options);
      };

      self.getSubmissionHandler = function (data) {
        const params = {
            submissionId: data.submissions[0].submissionId.value
          },
          options = {
            showMessage: false,
            url: "submissions/{submissionId}/summary",
            success: function (data) {
              self.findStateFromSubmissionsHandler(data);
            }
          };

        baseService.fetch(options, params);
      };

      self.findStateFromSubmissions = function () {
        self.getSubmission();
      };

      self.findStateFromSubmissionsHandler = function (data) {
        self.verifyState(data.state);
      };

      self.verifyState = function (state) {
        if (self.isStateSelected()) {
          if (self.selectedState() !== state) {
            $("#wrongStateSelection").trigger("openModal");
            self.stateValidationDeferred.reject();
          } else {
            self.stateValidationDeferred.resolve();
          }
        } else {
          self.isStateSelected(true);
          self.isStateChangeAllowed(false);
          self.selectedState(state);
          self.selectedStateText(Params.baseModel.getDescriptionFromCode(self.stateOptions(), self.selectedState()));
          self.stateValidationDeferred.resolve();
        }
      };

      self.applyPattern = function (input, pattern, position) {
        let x = input,
          output = "";

        if (x.length > pattern[position] && position < pattern.length) {
          x = x.substr(pattern[position]);
          output = self.applyPattern(x, pattern, position + 1);
          output = input.substr(0, pattern[position]) + "-" + output;

          return output;
        }

        output += x;

        return output;
      };

      self.maskValue = function (val, len) {
        const a = val.substring(0, len);

        return a.replace(/\d|\D/g, "x") + val.substring(len);
      };

      self.stateModalCancel = function () {
        self.selectedState("");
        self.refreshState(false);
        $("#stateSelection").hide();
        ko.tasks.runEarly();
        self.refreshState(true);
      };

      self.sessionStorageData = {};

      self.loadProduct = function (productGroupData) {
        self.sessionStorageData.productCode = productGroupData.id;
        self.sessionStorageData.productDescription = productGroupData.description;
        self.sessionStorageData.productClassName = productGroupData.allowedProductClassName;
        self.sessionStorageData.productGroupMaxTerm = productGroupData.maxTerm;
        self.sessionStorageData.selectedOfferId = productGroupData.selectedOfferId;

        if (self.selectedState()) {
          self.sessionStorageData.selectedState = self.selectedState();
          self.selectedState("");
        }

        if (productGroupData.allowedProductClassName === "LOANS") {
          self.sessionStorageData.collateralRequired = productGroupData.collateralRequired;
        }

        if (productGroupData.productTypeConstants) {
          self.sessionStorageData.productType = productGroupData.productTypeConstants;
        }

        Params.baseModel.switchPage({
          homeComponent: {
            component: "product-base",
            module: "origination",
            query: {
              context: "index"
            }
          }
        }, false, true, self.sessionStorageData);
      };

      self.actionCardClick = function (data, cardData) {
        self.homePage(false);
        self.type(data);
        self.actionCardData(cardData);
        self.className(cardData.productClass);
        self.switchPageProduct();
      };

      self.stateNotSelected = ko.observable(true);

      self.stateChangeHandler = function (event) {
        if (event.detail.value) {
          self.stateNotSelected(false);
        } else {
          self.stateNotSelected(true);
        }
      };

      BankProductModel.checkLoginStatus().done(function () {
        if (self.userData && self.userData.userProfile) {
          self.userProfile(self.userData.userProfile);
          self.userLoggedIn(true);
        }
      });

      self.hideStateSelectionPopUp = function () {
        self.isStateSelected(true);
        self.selectedStateText(Params.baseModel.getDescriptionFromCode(self.stateOptions(), self.selectedState()));
        Params.dashboard.loadComponent("product-groups", self);
        self.compName("product-groups");
        $("#stateSelection").hide();
      };
    };
  });