define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/mutual-fund-information",
  "ojs/ojarraydataprovider",
  "ojs/ojvalidationgroup",
  "ojs/ojinputtext",
  "ojs/ojarraytabledatasource",
  "ojs/ojchart",
  "ojs/ojlistview",
  "ojs/ojbutton",
  "ojs/ojcollectiontabledatasource",
  "ojs/ojdatetimepicker"
], function (oj, ko, $, FundInformationModel, resourceBundle, ArrayDataProvider) {
  "use strict";

  return function (params) {
    const self = this;

    ko.utils.extend(self, params.rootModel);
    self.resource = resourceBundle;
    self.details = ko.observable();
    self.fundCategory = ko.observable();
    self.weekLow = ko.observable();
    self.dataSource = ko.observable();
    self.weekHigh = ko.observable();
    self.showSnapshotResults = ko.observable(false);
    self.snapshotdetails = ko.observable();
    self.returnSinceLaunch = ko.observable();
    self.latestDividend = ko.observable();
    self.showInvestmentDetails = ko.observable(false);
    self.showPortfolioDetails = ko.observable(false);
    self.showPerformanceDetails = ko.observable(false);
    self.date = ko.observable();
    self.toDate = ko.observable();
    self.fromDate = ko.observable();
    self.schemeCode = ko.observable();
    self.investmentDetails = ko.observable();
    self.minInitialInvestment = ko.observable();
    self.minSubsequentInvestment = ko.observable();
    self.minWithdrawl = ko.observable();
    self.minBalance = ko.observable();
    self.repurchaseAllowed = ko.observable();
    self.resellAllowed = ko.observable();
    self.repurchaseStartDate = ko.observable();
    self.repurchaseEndDate = ko.observable();
    self.purchasePricingMethod = ko.observable();
    self.purchaseCutOffTime = ko.observable();
    self.redemptionTime = ko.observable();
    self.minInvestment = ko.observable();
    self.minNoOfInstallment = ko.observable();
    self.dateAllowed = ko.observable();
    self.recurringTransferAllowed = ko.observable();
    self.recurringWithdrawlAllowed = ko.observable();
    self.topSectorsLoaded = ko.observable(false);
    self.topHoldingsLoaded = ko.observable(false);
    self.performanceDetailsLoaded = ko.observable(false);
    self.lineGroups = ko.observableArray();
    self.lineSeries = ko.observableArray([]);
    self.showchartdetails = ko.observable(false);
    self.lineSeriesValue = ko.observableArray();
    self.showtopSectors = ko.observable(false);
    self.showtopHoldings = ko.observable(false);
    self.menuSelection = ko.observable("snapshot");
    self.items = ko.observableArray([]);
    self.item = ko.observableArray([]);
    self.graphDate = ko.observableArray([]);
    self.toggleValue = ko.observable("toggle-sectors");
    params.dashboard.headerName(self.resource.purchaseOrder);
    params.baseModel.registerComponent("scheme-details-bar", "mutual-funds");
    params.baseModel.registerComponent("fund-info-bar", "mutual-funds");
    self.schemeBar = ko.observable("fund-info-bar");
    params.baseModel.registerElement("nav-bar");
    self.schemeCode(params.rootModel.schemeCode);

    self.uiOptions = {
      menuFloat: "left",
      fullWidth: false,
      defaultOption: self.menuSelection
    };

    self.menuOptions = ko.observableArray([{
        id: "snapshot",
        label: self.resource.snapshotTab
      },
      {
        id: "performance",
        label: self.resource.performanceTab
      },
      {
        id: "portfolio",
        label: self.resource.portfolioTab
      },
      {
        id: "howToInvest",
        label: self.resource.howToInvestTab
      }
    ]);

    self.menuSelection.subscribe(function () {
      self.showSnapshotResults(false);
      self.showInvestmentDetails(false);
      self.showPortfolioDetails(false);
      self.showPerformanceDetails(false);
      self.showtopSectors(false);
      self.showtopHoldings(false);

      if (self.menuSelection() === "snapshot") {
        self.readSnapshot();
      } else if (self.menuSelection() === "performance") {
        self.fetchSchemePerformance();
      } else if (self.menuSelection() === "portfolio") {
        self.showtopSectors(true);
        self.toggleValue("toggle-sectors");
        self.fetchSchemePortfolio();
      } else if (self.menuSelection() === "howToInvest") {
        self.fetchInvestmentDetails();
      }

    });

    self.showChart = function () {
      self.showchartdetails(false);
      /* toggle button variables */
      self.orientationValue = ko.observable("vertical");
      self.lineSeriesValue().splice(0, self.lineSeriesValue().length);
      self.lineGroups().splice(0, self.lineGroups().length);
      self.items().splice(0, self.items().length);
      self.item().splice(0, self.item().length);
      self.graphDate().splice(0, self.graphDate().length);

      const x = self.snapshotdetails().benchmark.length;

      for (let a = 0; a < x; a++) {
        self.item().push(self.snapshotdetails().benchmark[a].priceChange);
          self.graphDate().push(self.snapshotdetails().benchmark[a].date);
      }

      /* chart data */
      self.lineSeriesValue().push({
        name: "benchmark",
        items: self.item(),
        assignedToY2: "on"
      });

      const y = self.snapshotdetails().fundGraph.length;

      for (let b = 0; b < y; b++) {
        self.items().push(self.snapshotdetails().fundGraph[b].priceChange);
      }

      self.lineSeriesValue().push({
        name: "Fund-Graph",
        items: self.items(),
        assignedToY2: "on"
      });

      self.toDate(self.graphDate()[x - 1]);

      self.fromDate(self.graphDate()[0]);

      let i;

      for (i = 0; i <x; i++) {
        self.lineGroups().push(self.graphDate()[i]);
      }

      const converterFactory = oj.Validation.converterFactory("number");

      self.yAxisConverter = ko.observable(converterFactory.createConverter({
        style: "percent"
      }));

      self.lineGroupsValue=ko.observable(self.lineGroups());

      self.showchartdetails(true);
    };

    self.readSnapshot = function () {
      FundInformationModel.readSnapshot(self.schemeCode()).done(function (data) {
        self.snapshotdetails(data.schemeSnapshotDTO);
        self.fundCategory(self.snapshotdetails().fundCategoryName);
        self.weekHigh(self.snapshotdetails().weekHigh);
        self.weekLow(self.snapshotdetails().weekLow);
        self.returnSinceLaunch(self.snapshotdetails().returnSinceLaunch);
        self.date(self.snapshotdetails().date);
        self.latestDividend(self.snapshotdetails().latestDividend);
        self.showSnapshotResults(true);
        self.showInvestmentDetails(false);
        self.showPortfolioDetails(false);
        self.showPerformanceDetails(false);
        self.showChart();
      });
    };

    self.fetchInvestmentDetails = function () {
      FundInformationModel.fetchInvestmentDetails(self.schemeCode()).done(function (data) {
        self.investmentDetails(data.schemeInvestmentDetailDTO);
        self.minInitialInvestment(self.investmentDetails().lumpsumInvestment.minInitialInvestment);
        self.minSubsequentInvestment(self.investmentDetails().lumpsumInvestment.minSubsequentInvestment);
        self.minWithdrawl(self.investmentDetails().lumpsumInvestment.minWithdrwal);
        self.repurchaseAllowed(self.investmentDetails().lumpsumInvestment.repurchaseAllowed);
        self.resellAllowed(self.investmentDetails().lumpsumInvestment.resellAllowed);
        self.repurchaseStartDate(self.investmentDetails().lumpsumInvestment.repurchaseStartDate);
        self.repurchaseEndDate(self.investmentDetails().lumpsumInvestment.repurchaseEndDate);
        self.purchasePricingMethod(self.investmentDetails().lumpsumInvestment.purchasePricingMethod);
        self.purchaseCutOffTime(self.investmentDetails().lumpsumInvestment.purchaseCutOffTime);
        self.redemptionTime(self.investmentDetails().lumpsumInvestment.redemptionTime);
        self.minInvestment(self.investmentDetails().systematicInvestment.minInvestmentAmount.amount);
        self.minNoOfInstallment(self.investmentDetails().systematicInvestment.minNoOfInstallment);
        self.dateAllowed(self.investmentDetails().systematicInvestment.dateAllowed);
        self.minBalance(self.investmentDetails().lumpsumInvestment.minBalance);
        self.recurringTransferAllowed(self.investmentDetails().schemeOtherDetailsDTO.recurringTransferAllowed);
        self.recurringWithdrawlAllowed(self.investmentDetails().schemeOtherDetailsDTO.recurringWithdrawlAllowed);
        self.showInvestmentDetails(true);
        self.showSnapshotResults(false);
        self.showPortfolioDetails(false);
        self.showPerformanceDetails(false);
      });
    };

    self.readSnapshot();

    self.headerText = ko.observableArray([{
        headerText: self.resource.sector,
        field: "sectorName"
      },
      {
        headerText: self.resource.allocation,
        field: "sectorAllocationValue"
      }
    ]);

    self.holdingsText = ko.observableArray([{
        headerText: self.resource.scrip,
        field: "scripName"
      },
      {
        headerText: self.resource.sector,
        field: "sectorName"
      },
      {
        headerText: self.resource.allocation,
        field: "allocation"
      }
    ]);

    self.holdingsTextMobile = ko.observableArray([{
        headerText: self.resource.scrip,
        field: "scripName"
      },
      {
        headerText: self.resource.allocation,
        field: "allocation"
      }
    ]);

    self.toggleListener = function (event) {
      if (event.detail.value === "toggle-sectors") {
        self.toggleTopSectors();
      } else if (event.detail.value === "toggle-holdings") {
        self.toggleTopHoldings();
      }
    };

    self.toggleTopSectors = function () {
      self.showtopHoldings(false);
      self.showtopSectors(true);
    };

    self.toggleTopHoldings = function () {
      self.showtopSectors(false);
      self.showtopHoldings(true);
    };

    self.fetchSchemePortfolio = function () {

      FundInformationModel.fetchSchemePortfolio(self.schemeCode()).done(function (data) {
        let tempData = null,
          id = 1;

        tempData = $.map(data.schemePortfolioDTO, function (v) {
          const newObj = {};

          newObj.id = id;
          newObj.sectorName = v.sectorName;
          newObj.sectorAllocationValue = v.sectorAllocationValue;
          newObj.scripName = v.scripName;
          newObj.allocation = v.allocation;
          newObj.sectorCode = v.sectorCode;
          id = id + 1;

          return newObj;
        });

        self.dataSource(new ArrayDataProvider(tempData, {
          idAttribute: "id"
        }) || []);

        self.topSectorsLoaded(true);
        self.topHoldingsLoaded(true);
        self.showInvestmentDetails(false);
        self.showSnapshotResults(false);
        self.showPerformanceDetails(false);
        self.showPortfolioDetails(true);
      });
    };

    self.performanceText = ko.observableArray([{
        headerText: self.resource.valuesNote,
        field: "fundReturn",
        headerClassName: "bold-text"
      },
      {
        headerText: self.resource.oneWeek,
        field: "oneWeek",
        headerClassName: "bold-text"
      }, {
        headerText: self.resource.oneMonth,
        field: "oneMonth",
        headerClassName: "bold-text"
      }, {
        headerText: self.resource.threeMonth,
        field: "threeMonth",
        headerClassName: "bold-text"
      }, {
        headerText: self.resource.sixMonth,
        field: "sixMonth",
        headerClassName: "bold-text"
      }, {
        headerText: self.resource.oneYear,
        field: "oneYear",
        headerClassName: "bold-text"
      }, {
        headerText: self.resource.threeYear,
        field: "threeYear",
        headerClassName: "bold-text"
      }, {
        headerText: self.resource.fiveYear,
        field: "fiveYear",
        headerClassName: "bold-text"
      }
    ]);

    self.fetchSchemePerformance = function () {
      FundInformationModel.fetchSchemePerformance(self.schemeCode()).done(function (data) {
        let tempData = null;

        tempData = $.map(data.schemePerformanceDetailsDTO, function (v) {
          const newObj = {};

          newObj.id = v.id;
          newObj.fundReturn = v.name;
          newObj.oneWeek = v.schemePerformanceDTO.oneWeek;
          newObj.oneMonth = v.schemePerformanceDTO.oneMonth;
          newObj.threeMonth = v.schemePerformanceDTO.threeMonth;
          newObj.sixMonth = v.schemePerformanceDTO.sixMonth;
          newObj.oneYear = v.schemePerformanceDTO.oneYear;
          newObj.threeYear = v.schemePerformanceDTO.threeYear;
          newObj.fiveYear = v.schemePerformanceDTO.fiveYear;

          return newObj;
        });

        self.dataSource(new ArrayDataProvider(tempData, {
          idAttribute: "name"
        }) || []);

        self.showInvestmentDetails(false);
        self.showPortfolioDetails(false);
        self.showSnapshotResults(false);
        self.performanceDetailsLoaded(true);
        self.showPerformanceDetails(true);
      });
    };
  };
});
