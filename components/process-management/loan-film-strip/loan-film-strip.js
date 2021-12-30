define([

  "knockout",
  "./model",
  "text!./loan-film-strip.json",
  "ojL10n!resources/nls/loan-film-strip",
  "ojs/ojarraytabledatasource",
  "ojs/ojinputtext",
  "ojs/ojknockout",
  "ojs/ojfilmstrip",
  "ojs/ojavatar"
], function (ko, FilmStriprModel, ProductMap, resourceBundle) {
  "use strict";

  return function (rootParams) {
    const self = this,
      productMap = JSON.parse(ProductMap).products;

    ko.utils.extend(self, rootParams.rootModel);
    self.nls = resourceBundle;
    rootParams.dashboard.headerName(self.nls.header);
    self.mainDto = {};
    self.selected = ko.observable(true);
    self.displayData = ko.observable();
    self.productSelected = ko.observable();
    self.productData = ko.observableArray();
    self.isProductLoaded = ko.observable(false);
    self.isSelected = ko.observable();
    self.productDisplayName = ko.observable();
    self.loadContainer = ko.observable(false);
    self.datasegments = ko.observableArray();
    rootParams.baseModel.registerElement("segment-container");
    self.proceedClickOnce = ko.observable(true);

    self.selectProduct = function (event) {

      if (productMap[event.$data.businessProductCode]) {
        self.productSelected = event.$data.businessProductCode;
        self.productDisplayName = event.$data.businessProductName;
      }

      self.productData().forEach(function (data) {
        data.isSelected(false);
      });

      event.$data.isSelected(true);
      self.selected(false);
    };

    FilmStriprModel.fetchProductDetails().then(function (data) {

      data.jsonNode.data.forEach(function (data) {

        if (productMap[data.businessProductCode]) {
          const currData = {
            businessProductCode: data.businessProductCode,
            businessProductName: productMap[data.businessProductCode].name,
            imgPath: productMap[data.businessProductCode].img,
            isSelected: ko.observable(false),
            businessProductDescription: productMap[data.businessProductCode].businessProductDescription
          };

          self.productData.push(currData);
        }

      });

      self.isProductLoaded(true);
    });

    self.documetsRequired = "fsgbu-ob-clmo-ds-document-upload";

    self.callDataSegment = function () {
      if (self.proceedClickOnce()) {
        self.proceedClickOnce(false);

        FilmStriprModel.fetchDatasegment(self.productSelected).then(function (data) {
          data.jsonNode.Stages[0].DataSegments.forEach(function (segment) {
            self.datasegments.push(segment.code);
          });

          if (data.jsonNode.Stages[0].documentsList !== undefined && data.jsonNode.Stages[0].documentsList.length > 0) {
            self.datasegments.push(self.documetsRequired);
          }

          self.loadContainer();
        });
      }

    };

    self.filmStripFlag = ko.observable(true);

    self.proceed = function () {
      self.callDataSegment();

      self.loadContainer = function () {
        const parameters = {
          productId: "loan",
          dataSegments: self.datasegments(),
          payload: self.mainDto,
          data: {
            productId: self.productSelected,
            productName: self.productDisplayName,
            module: "OBCLPM",
            confirmPage: "loan-origination-confirm",
            trackerFlag: false,
            type:self.productDisplayName
          }
        };

        rootParams.dashboard.loadComponent("segment-container", parameters);
      };

    };
  };
});