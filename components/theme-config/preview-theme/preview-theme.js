define(["knockout",
  "jquery", "ojL10n!resources/nls/preview-theme", "ojs/ojarraydataprovider"
], function (ko, $, locale, ArrayDataProvider) {
  "use strict";

  return function (params) {
    const self = this;

    self.currentTokens = params.currentTokens;
    self.sizeUnit = params.sizeUnit;
    self.mode = params.mode;
    self.isCSSCustomPropAvailable = params.baseModel.isCSSCustomPropAvailable;
    self.computedBindings = self.isCSSCustomPropAvailable() ? {} : {};
    self.modelInit = params.modelInit || ko.observable(true);
    self.resourceBundle = locale;
    params.baseModel.registerComponent("account-nickname", "accounts");
    params.baseModel.registerComponent("review-dashboard-mapping", "dashboard-template");
    self.menuSelection = ko.observable("option1");
    self.confirmScreenComponent = "confirm-screen";

    const baseFontFamily = window.getComputedStyle(document.body).getPropertyValue("--base-font-family");

    function loadFonts(url, fontFamily) {
      if (url.match(/^https\:\/\/fonts\.googleapis\.com\/css/)) {
        const link = document.createElement("link");

        link.href = url;
        link.rel = "stylesheet";
        link.setAttribute("brand", "preview-font");
        $("link[brand='preview-font']").remove();
        document.head.appendChild(link);
        document.querySelector(".preview-theme-container").style.fontFamily = fontFamily;
      } else {
        document.querySelector(".preview-theme-container").style.fontFamily = baseFontFamily;
      }
    }

    function setCSSProps(propertyName, value) {
      if (typeof value === "number") {
        value += self.sizeUnit;
      }

      document.querySelector(".preview-theme-container").style.setProperty(propertyName, value);
    }

    if (self.mode === "review") {
      Object.keys(self.currentTokens).forEach(function (key) {
        setCSSProps(key, ko.utils.unwrapObservable(self.currentTokens[key]));
      });
    }

    self.uiOptions = {
      menuFloat: "left",
      fullWidth: false,
      defaultOption: self.menuSelection
    };

    self.selectedValue = ko.observable("option2");

    self.menuOptions = ko.observableArray([{
        id: "option1",
        label: self.resourceBundle.sampleTxt.option1
      },
      {
        id: "option2",
        label: self.resourceBundle.sampleTxt.option2
      },
      {
        id: "option3",
        label: self.resourceBundle.sampleTxt.option3
      }
    ]);

    const deptArray = [{
        DepartmentId: 10,
        DepartmentName: self.resourceBundle.data.table.data1
      },
      {
        DepartmentId: 20,
        DepartmentName: self.resourceBundle.data.table.data2
      },
      {
        DepartmentId: 30,
        DepartmentName: self.resourceBundle.data.table.data3
      }
    ];

    self.dataprovider = new ArrayDataProvider(deptArray, {
      keyAttributes: "DepartmentId"
    });

    self.previewId = "previewModalWindowDemo" + params.baseModel.incrementIdCount();

    self.showModalWindow = function () {
      $("#" + self.previewId).trigger("openModal");
    };

    self.showAlertBox = function () {
      params.baseModel.showMessages({}, [self.resourceBundle.sampleTxt.demoAlertTxt], "WARNING");

      setTimeout(function () {
        params.baseModel.showMessages({}, [self.resourceBundle.sampleTxt.demoAlertTxt], "INFO");
      }, 200);

      setTimeout(function () {
        params.baseModel.showMessages({}, [self.resourceBundle.sampleTxt.demoAlertTxt], "ERROR");
      }, 400);
    };

    self.showOverlay = function () {
      params.dashboard.openRightPanel("theme-list", {}, self.resourceBundle.pageHeader);
    };

    self.headerMessages = ko.observableArray();

    self.headerMessages.push({
      icon: "dashboard/confirmation.svg",
      headerMessage: self.resourceBundle.labels.confirmText,
      summaryMessage: self.resourceBundle.sampleTxt["confirm-screen"],
      headerStyle: "successHeader",
      eReceiptDetails: {
        enableEReceipt: false
      }
    }, {
      icon: "dashboard/cancellation.svg",
      headerMessage: self.resourceBundle.labels.errorText,
      summaryMessage: self.resourceBundle.sampleTxt["error-screen"],
      headerStyle: "errorHeader",
      eReceiptDetails: {
        enableEReceipt: false
      }
    });

    self.reviewTransactionName = {
      header: self.resourceBundle.generic.common.review,
      reviewHeader: self.resourceBundle.sampleTxt["review-screen"]
    };

    Object.keys(self.currentTokens).forEach(function (key) {
      setCSSProps(key, ko.utils.unwrapObservable(self.currentTokens[key]));
    });

    if (params.baseModel.isCSSCustomPropAvailable()) {
      self.computedReference = ko.computed(function () {
        if (self.currentTokens["--base-font-url"]() && self.currentTokens["--base-font-family"]()) {
          loadFonts(self.currentTokens["--base-font-url"](), self.currentTokens["--base-font-family"]());
        } else if (document.querySelector(".preview-theme-container")) {
          document.querySelector(".preview-theme-container").style.fontFamily = baseFontFamily;
        }
      });
    }

    self.dispose = function () {
      self.computedReference.dispose();
    };
  };
});