/**
 * New Financial Enumerations Maintenance.
 *
 * @module origination-maintenance
 * @requires {ojcore} oj
 * @requires {knockout} ko
 * @requires {jquery} $
 * @requires {object} financialTypeMaintenanceModel
 * @requires {object} ResourceBundle
 */
define([
  "ojs/ojcore",
  "knockout",
  "./model",
  "ojL10n!resources/nls/maintenance-base",
  "ojs/ojknockout-validation",
  "ojs/ojbutton",
  "ojs/ojvalidationgroup",
  "ojs/ojlistviewdnd",
  "ojs/ojknockout",
  "ojs/ojnavigationlist",
  "ojs/ojtable",
  "ojs/ojarraydataprovider",
  "promise"
], function(oj, ko, financialTypeMaintenanceModel, ResourceBundle) {
  "use strict";

  return function(rootParams) {
    const self = this;

    self.resource = ResourceBundle;
    self.selectedTab = ko.observable(0);
    self.isInitializeModel = ko.observable(true);
    self.masterTableDataLoaded = ko.observable(false);
    self.masterTableDataProvider = ko.observableArray();
    self.selectedValuesTableDataProvider = ko.observableArray();
    self.selectedValuesTableDataLoaded = ko.observable(false);
    self.selectedValuesTableSelection = [];
    self.selectedItem = ko.observable("income-maintenance");
    self.masterTableSelection = [];
    self.masterTableData = ko.observableArray();
    self.mstTableDataProvider = ko.observableArray([]);
    self.selTableDataProvider = ko.observableArray([]);

    self.masterColumnArray = ko.observableArray([{
      headerText: self.resource.masterSet,
      field: "type"
    }]);

    self.selectedValuesColumnArray = ko.observableArray([{
      headerText: self.resource.selectedValuesTable,
      field: "type"
    }]);

    ko.utils.extend(self, rootParams.rootModel.previousState || rootParams.rootModel);

    /**
     * This function will populate the existing values.
     *
     * @memberOf financial-type-maintenance
     * @function initializeModel
     * @returns {void}
     */
    function initializeModel() {
      financialTypeMaintenanceModel.fetchIncomeTypes().then(function(data) {
        for (let i = 0; i < data.financialIncometype.length; i++) {
          self.tabledata()[0].selectedArray.push({
            code: data.financialIncometype[i].code,
            type: data.financialIncometype[i].description
          });

          self.tabledata()[0].initialSelectedArray.push({
            code: data.financialIncometype[i].code,
            type: data.financialIncometype[i].description
          });
        }
      });

      financialTypeMaintenanceModel.fetchLiabilityTypes().then(function(data) {
        for (let i = 0; i < data.financialLiabilityType.length; i++) {
          self.tabledata()[1].selectedArray.push({
            code: data.financialLiabilityType[i].code,
            type: data.financialLiabilityType[i].description
          });

          self.tabledata()[1].initialSelectedArray.push({
            code: data.financialLiabilityType[i].code,
            type: data.financialLiabilityType[i].description
          });
        }
      });

      financialTypeMaintenanceModel.fetchAssetTypes().then(function(data) {
        for (let i = 0; i < data.financialAssetType.length; i++) {
          self.tabledata()[2].selectedArray.push({
            code: data.financialAssetType[i].code,
            type: data.financialAssetType[i].description
          });

          self.tabledata()[2].initialSelectedArray.push({
            code: data.financialAssetType[i].code,
            type: data.financialAssetType[i].description
          });
        }
      });

      financialTypeMaintenanceModel.fetchExpenseTypes().then(function(data) {
        for (let i = 0; i < data.financialExpensetype.length; i++) {
          self.tabledata()[3].selectedArray.push({
            code: data.financialExpensetype[i].code,
            type: data.financialExpensetype[i].description
          });

          self.tabledata()[3].initialSelectedArray.push({
            code: data.financialExpensetype[i].code,
            type: data.financialExpensetype[i].description
          });
        }
      });

      financialTypeMaintenanceModel.fetchAccommodationTypes().then(function(data) {
        for (let i = 0; i < data.accommodationType.length; i++) {
          self.tabledata()[4].selectedArray.push({
            code: data.accommodationType[i].code,
            type: data.accommodationType[i].description
          });

          self.tabledata()[4].initialSelectedArray.push({
            code: data.accommodationType[i].code,
            type: data.accommodationType[i].description
          });
        }
      });

      self.isInitializeModel(false);
    }

    if (self.isInitializeModel() && !self.isBackFromReview()) {
      initializeModel();
    }

    /**
     * This function will filter the master values for each of the financial types.
     *
     * @memberOf financial-type-maintenance
     * @function filterMasterData
     * @param {string} tab  - Represents the index of the selected financial type.
     * @returns {void}
     */
    function filterMasterData(tab) {
      for (let i = self.tabledata()[tab].masterArray().length - 1; i >= 0; i--) {
        for (let j = self.tabledata()[tab].selectedArray().length - 1; j >= 0; j--) {
          if (self.tabledata()[tab].masterArray()[i].code === self.tabledata()[tab].selectedArray()[j].code) {
            self.tabledata()[tab].masterArray.splice(i, 1);
            break;
          }
        }
      }

      self.masterTableDataLoaded(false);
      self.selectedValuesTableDataLoaded(false);
      ko.tasks.runEarly();
      self.selTableDataProvider(self.tabledata()[tab].selectedArray());
      self.mstTableDataProvider(self.tabledata()[tab].masterArray());
      self.masterTableDataLoaded(true);
      self.selectedValuesTableDataLoaded(true);
    }

    /**
     * This function will load the master values for each of the financial types.
     *
     * @memberOf financial-type-maintenance
     * @function loadMasterData
     * @param {Object} data  - Represents the data to load.
     * @param {string} index  - Represents the index of the selected financial type.
     * @returns {void}
     */
    function loadMasterData(data, index) {
      self.masterTableDataLoaded(false);
      self.selectedValuesTableDataLoaded(false);
      ko.tasks.runEarly();

      for (let i = 0; i < data.length; i++) {
        self.tabledata()[index].masterArray.push({
          code: data[i].code,
          type: data[i].description
        });
      }

      self.selectedTab(index);
      self.tabledata()[index].initialMasterCount(data.length);
      self.mstTableDataProvider(self.tabledata()[index].masterArray());
      self.selTableDataProvider(self.tabledata()[index].selectedArray());
      self.masterTableDataLoaded(true);
      self.selectedValuesTableDataLoaded(true);
    }

    if (length === 0 && !self.isBackFromReview()) {
      financialTypeMaintenanceModel.fetchIncomeMaster().then(function(response) {
        loadMasterData(response.enumRepresentations[0].data, 0);

        if (self.tabledata()[0].selectedArray().length) {
          filterMasterData(0);
        }

        self.tabledata()[0].initialSelectedCount(self.tabledata()[0].initialSelectedArray().length);
      });
    } else {
      self.masterTableDataLoaded(false);
      self.selectedValuesTableDataLoaded(false);
      self.tabledata()[0].initialSelectedCount(self.tabledata()[0].initialSelectedArray().length);
      self.mstTableDataProvider(self.tabledata()[0].masterArray());
      self.selTableDataProvider(self.tabledata()[0].selectedArray());
      self.masterTableDataLoaded(true);
      self.selectedValuesTableDataLoaded(true);
    }

    self.loadStage = function(data) {
      if (data.id === "income-maintenance") {
        self.tabledata()[0].initialSelectedCount(self.tabledata()[0].initialSelectedArray().length);

        if (self.tabledata()[0].masterArray().length) {
          self.masterTableDataLoaded(false);
          self.selectedValuesTableDataLoaded(false);
          ko.tasks.runEarly();
          self.selectedTab(0);
          self.selTableDataProvider(self.tabledata()[0].selectedArray());
          self.mstTableDataProvider(self.tabledata()[0].masterArray());
          self.masterTableDataLoaded(true);
          self.selectedValuesTableDataLoaded(true);
        } else {
          self.selectedTab(0);

          financialTypeMaintenanceModel.fetchIncomeMaster().then(function(response) {
            loadMasterData(response.enumRepresentations[0].data, 0);

            if (self.tabledata()[0].selectedArray().length) {
              filterMasterData(0);
            }
          });
        }
      } else if (data.id === "liability-maintenance") {
        self.tabledata()[1].initialSelectedCount(self.tabledata()[1].initialSelectedArray().length);

        if (self.tabledata()[1].masterArray().length) {
          self.masterTableDataLoaded(false);
          self.selectedValuesTableDataLoaded(false);
          ko.tasks.runEarly();
          self.selectedTab(1);
          self.selTableDataProvider(self.tabledata()[1].selectedArray());
          self.mstTableDataProvider(self.tabledata()[1].masterArray());
          self.masterTableDataLoaded(true);
          self.selectedValuesTableDataLoaded(true);
        } else {
          self.selectedTab(1);

          financialTypeMaintenanceModel.fetchLiabilityMaster().then(function(response) {
            loadMasterData(response.enumRepresentations[0].data, 1);

            if (self.tabledata()[1].selectedArray().length) {
              filterMasterData(1);
            }
          });
        }
      } else if (data.id === "asset-maintenance") {
        self.tabledata()[2].initialSelectedCount(self.tabledata()[2].initialSelectedArray().length);

        if (self.tabledata()[2].masterArray().length) {
          self.masterTableDataLoaded(false);
          self.selectedValuesTableDataLoaded(false);
          ko.tasks.runEarly();
          self.selTableDataProvider(self.tabledata()[2].selectedArray());
          self.mstTableDataProvider(self.tabledata()[2].masterArray());
          self.masterTableDataLoaded(true);
          self.selectedValuesTableDataLoaded(true);
        } else {
          self.selectedTab(2);

          financialTypeMaintenanceModel.fetchAssetMaster().then(function(response) {
            loadMasterData(response.enumRepresentations[0].data, 2);

            if (self.tabledata()[2].selectedArray().length) {
              filterMasterData(2);
            }
          });
        }
      } else if (data.id === "expense-maintenance") {
        self.tabledata()[3].initialSelectedCount(self.tabledata()[3].initialSelectedArray().length);

        if (self.tabledata()[3].masterArray().length) {
          self.masterTableDataLoaded(false);
          self.selectedValuesTableDataLoaded(false);
          ko.tasks.runEarly();
          self.selTableDataProvider(self.tabledata()[3].selectedArray());
          self.mstTableDataProvider(self.tabledata()[3].masterArray());
          self.masterTableDataLoaded(true);
          self.selectedValuesTableDataLoaded(true);
        } else {
          self.selectedTab(3);

          financialTypeMaintenanceModel.fetchExpenseMaster().then(function(response) {
            loadMasterData(response.enumRepresentations[0].data, 3);

            if (self.tabledata()[3].selectedArray().length) {
              filterMasterData(3);
            }
          });
        }
      } else if (data.id === "accommodation-maintenance") {
        self.tabledata()[4].initialSelectedCount(self.tabledata()[4].initialSelectedArray().length);

        if (self.tabledata()[4].masterArray().length) {
          self.masterTableDataLoaded(false);
          self.selectedValuesTableDataLoaded(false);
          ko.tasks.runEarly();
          self.selTableDataProvider(self.tabledata()[4].selectedArray());
          self.mstTableDataProvider(self.tabledata()[4].masterArray());
          self.masterTableDataLoaded(true);
          self.selectedValuesTableDataLoaded(true);
        } else {
          self.selectedTab(4);

          financialTypeMaintenanceModel.fetchAccommodationMaster().then(function(response) {
            loadMasterData(response.enumRepresentations[0].data, 4);

            if (self.tabledata()[4].selectedArray().length) {
              filterMasterData(4);
            }
          });
        }
      }
    };

    self.masterTableHandleDrop = function(event, context) {
      let data, i;

      event.preventDefault();
      data = event.dataTransfer.getData("application/ojtablerows+json");

      if (data !== null) {
        data = JSON.parse(data);

        for (i = data.length - 1; i >= 0; i--) {
          self.tabledata()[self.selectedTab()].masterArray.splice(context.rowIndex, 0, data[i].data);
        }

        for (i = 0; i < data.length; i++) {
          self.tabledata()[self.selectedTab()].selectedArray.splice(data[i].index, 1);
        }

        self.tabledata()[self.selectedTab()].masterArray.valueHasMutated();
        self.tabledata()[self.selectedTab()].selectedArray.valueHasMutated();
        self.masterTableDataLoaded(false);
        self.selectedValuesTableDataLoaded(false);
        ko.tasks.runEarly();
        self.mstTableDataProvider(self.tabledata()[self.selectedTab()].masterArray());
        self.selTableDataProvider(self.tabledata()[self.selectedTab()].selectedArray());
        self.masterTableDataLoaded(true);
        self.selectedValuesTableDataLoaded(true);
      }
    };

    self.selectedValuesTableHandleDrop = function(event, context) {
      let data, i;

      event.preventDefault();
      data = event.dataTransfer.getData("application/ojtablerows+json");

      if (data !== null) {
        data = JSON.parse(data);

        for (i = data.length - 1; i >= 0; i--) {
          self.tabledata()[self.selectedTab()].selectedArray.splice(context.rowIndex, 0, data[i].data);
        }

        self.tabledata()[self.selectedTab()].initialSelectedCount(self.tabledata()[self.selectedTab()].selectedArray().length);

        for (i = 0; i < data.length; i++) {
          self.tabledata()[self.selectedTab()].masterArray.splice(data[i].index, 1);
        }

        self.tabledata()[self.selectedTab()].masterArray.valueHasMutated();
        self.tabledata()[self.selectedTab()].selectedArray.valueHasMutated();
        self.masterTableDataLoaded(false);
        self.selectedValuesTableDataLoaded(false);
        ko.tasks.runEarly();
        self.mstTableDataProvider(self.tabledata()[self.selectedTab()].masterArray());
        self.selTableDataProvider(self.tabledata()[self.selectedTab()].selectedArray());
        self.masterTableDataLoaded(true);
        self.selectedValuesTableDataLoaded(true);
      }
    };

    self.masterTableHandleDragEnd = function(event) {
      if (event.dataTransfer.dropEffect !== "none") {
        for (let i = 0; i < self.masterTableSelection.length; i++) {
          const start = self.masterTableSelection[i].startIndex.row,
            end = self.masterTableSelection[i].endIndex.row;

          self.tabledata()[self.selectedTab()].masterArray.splice(start, end, end - start + 1);
        }

        self.tabledata()[self.selectedTab()].masterArray.valueHasMutated();
        self.masterTableDataLoaded(false);
        ko.tasks.runEarly();
        self.mstTableDataProvider(self.tabledata()[self.selectedTab()].masterArray());
        self.masterTableDataLoaded(true);
      }
    };

    self.selectedValuesTableHandleDragEnd = function(event) {
      if (event.dataTransfer.dropEffect !== "none") {
        for (let i = 0; i < self.selectedValuesTableSelection.length; i++) {
          const start = self.selectedValuesTableSelection[i].startIndex.row,
            end = self.selectedValuesTableSelection[i].endIndex.row;

          self.tabledata()[self.selectedTab()].selectedArray.splice(start, end, end - start + 1);
        }

        self.tabledata()[self.selectedTab()].selectedArray.valueHasMutated();
        self.selectedValuesTableDataLoaded(false);
        ko.tasks.runEarly();
        self.mstTableDataProvider(self.tabledata()[self.selectedTab()].selectedArray());
        self.selectedValuesTableDataLoaded(true);
      }
    };

    self.masterTableDataProvider = new oj.ArrayDataProvider(self.mstTableDataProvider, {
      keyAttributes: "code"
    });

    self.selectedValuesTableDataProvider = new oj.ArrayDataProvider(self.selTableDataProvider, {
      keyAttributes: "code"
    });
  };
});
