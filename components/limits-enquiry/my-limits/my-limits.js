define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/user-limit",
  "ojs/ojknockout-validation",
  "ojs/ojradioset",
  "ojs/ojnavigationlist",
  "ojs/ojpopup",
  "promise"
], function (oj, ko, $, MyLimitModel, resourceBundle) {
  "use strict";

  return function (rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    self.loadNextComponent = rootParams.rootModel.params.loadNextComponent;
    self.nls = resourceBundle;
    rootParams.baseModel.registerComponent("my-target-linkages", "limits-enquiry");
    rootParams.baseModel.registerElement("nav-bar");
    rootParams.baseModel.registerComponent("user-login-configuration-header", "user-login-configuration");
    self.selectedTabData = null;
    self.taskCodeList = ko.observableArray();
    self.arrayOfLimitsLinkages = ko.observableArray();
    self.arrayOfLimitsLinkagesForGraph = ko.observableArray();
    self.taskCodeListFetch = ko.observable(false);
    self.effectiveSameDayFlag = ko.observable(false);
    self.isRetailUser = ko.observable(false);
    self.customPackageFlagforGroup = ko.observable(false);
    self.customPackageFlagforSingle = ko.observable(false);
    self.customPackageFlagforGlobal = ko.observable(false);
    self.showConfirm = ko.observable(false);
    self.isDataLoaded = ko.observable(false);
    self.existingLimitPackage = ko.observable();
    self.showSubmit = ko.observable(false);
    self.showNavigation = ko.observable(false);
    rootParams.dashboard.headerName(self.nls.limitsInquiry.header.myLimits);
    self.saveLimit = ko.observable(false);
    self.showEditLimit = ko.observable(false);
    self.selectedTransactionType = ko.observable();
    self.selectedChannelIndex = ko.observable();
    self.selectedChannelType = ko.observable();
    rootParams.baseModel.registerElement("action-header");
    rootParams.baseModel.registerElement("page-section");
    self.limitsHeader = ko.observable(self.selectedTransactionType());
    self.dataLoaded = ko.observable(false);
    self.showGraph = ko.observable(false);
    self.showGroupInfo = ko.observable(false);
    rootParams.baseModel.registerComponent("limits-graph", "limits-enquiry");
    self.assignedLimitDataArray = ko.observableArray();
    self.loadAccessPointList = ko.observable(false);
    self.selectedChannelTypeName = ko.observable();
    self.graphData = ko.observable();
    self.graphDataForNotEffectiveToday = ko.observable();
    self.flag = ko.observable(true);
    self.hoverText = ko.observable();
    self.tabs = ko.observableArray();
    self.isAdminUser = ko.observable(false);

    const userId = rootParams.rootModel.username ? rootParams.rootModel.username() : null;

    rootParams.baseModel.registerComponent("transaction-group-read", "transaction-group");
    rootParams.baseModel.registerComponent("access-point-group-view", "access-point");

    self.transactionGroupDetails = ko.observable({
      transactionGroupDescription: "",
      taskList: []
    });

    self.channelGroupDetails = ko.observable({
      channelGroupDescription: "",
      channelGroupList: []
    });

    self.selectedChannelGroup = ko.observable();
    self.dataForPayloadSingle = ko.observable();
    self.dataForPayloadGroup = ko.observable();
    self.dataForPayloadGlobal = ko.observable();
    self.addLimit = ko.observable();
    self.addNewTLL = ko.observable();

    self.selectedChannelIndexSubscribeFunc = function () {
      if (self.selectedChannelIndex()) {
        for (let w = 0; w < self.channelList().length; w++) {
          if (self.selectedChannelIndex() === self.channelList()[w].id) {
            self.selectedChannelType(self.selectedChannelIndex());
            self.selectedChannelTypeName(self.channelList()[w].description);
            break;
          }
        }

        self.assignedLimitDataArray.removeAll();
        self.accessPointMapping.removeAll();
        self.accessPointGroupMapping.removeAll();
        self.accessPointConsolidatedMapping.removeAll();
        self.targetLinkages.removeAll();
        self.arrayOfLimitsLinkages.removeAll();
        self.showGroupInfo(false);
        self.showGroupInfo(false);
        self.showNavigation(false);
        self.showGraph(false);
        self.dataLoaded(false);
        ko.tasks.runEarly();
        self.fetchData();
      }
    };

    self.selectedChannelIndex.subscribe(function () {
      self.selectedChannelIndexSubscribeFunc();
    });

    self.channelList = ko.observableArray();

    self.fetchChannels = function () {
      if (!self.channelList().length > 0) {
        MyLimitModel.listAccessPoint().then(function (data) {
          self.channelList(data.accessPointListDTO);

          for (let i = 0; i < data.accessPointListDTO.length; i++) {
            if (data.accessPointListDTO[i].currentLoggedIn === true) {
              self.selectedChannelIndex(data.accessPointListDTO[i].id);
            }
          }

          self.loadAccessPointList(false);
          ko.tasks.runEarly();

          self.loadAccessPointList(true);
          ko.tasks.runEarly();
        });
      }
    };

    self.fetchChannels();
    self.showTransactionGroupInfo = ko.observable(false);
    self.showChannelGroupInfo = ko.observable(false);

    self.showGroupInformation = function () {
      if (self.menuLimitSelection() === "TGL") {
        self.transactionGroupDetails.transactionGroupDescription = "";
        self.transactionGroupDetails.taskList = [];

        MyLimitModel.readTransactionGroup(self.selectedTransactionData().periodicLimitDaily.targetValue).then(function (data) {
          self.transactionGroupDetails().transactionGroupDescription = data.taskGroupDTO.description;

          for (let a = 0; a < data.taskGroupDTO.taskDTOs.length; a++) {
            self.transactionGroupDetails().taskList.push(data.taskGroupDTO.taskDTOs[a]);
          }

          self.showTransactionGroupInfo(true);
          ko.tasks.runEarly();
        });
      } else {
        self.channelGroupDetails.channelGroupDescription = "";
        self.channelGroupDetails.channelGroupList = [];

        MyLimitModel.getAccessPointGroup(self.selectedChannelGroup()).then(function (data) {
          self.channelGroupDetails().channelGroupDescription = data.accessPointGroupDTO.description;

          for (let a = 0; a < data.accessPointGroupDTO.accessPoints.length; a++) {
            for (let b = 0; b < self.channelList().length; b++) {
              if (self.channelList()[b].id === data.accessPointGroupDTO.accessPoints[a].id) {
                self.channelGroupDetails().channelGroupList.push({
                  id: self.channelList()[b].id,
                  description: data.accessPointGroupDTO.accessPoints[a].description
                });

                break;
              }
            }
          }

          self.showChannelGroupInfo(true);
          ko.tasks.runEarly();
        });
      }
    };

    /**
     * This function will display the transactionGroup view.
     *
     * @memberOf forex-deal-create
     * @function groupViewPopUp
     * @param {Object} data  - An object containing the current event of field.
     * @returns {void}
     */
    self.groupViewPopUp = function () {
      let popup = null;

      if (self.menuLimitSelection() === "TGL") {
        popup = document.querySelector("#transactionGroupView-popup");
      } else {
        popup = document.querySelector("#channelGroupView-popup");
      }

      if (popup.isOpen()) {
        popup.close();
      } else {
        popup.open("#group-view");
      }
    };

    self.channelPopup = function () {
      const popup1 = document.querySelector("#channel-popup");

      if (popup1.isOpen()) {
        popup1.close();
      } else {
        popup1.open("#channel-disclaimer");
      }
    };

    self.editModeData = ko.observable();

    self.editLimit = function () {
      self.editModeData(self.selectedTransactionData());
      self.showEditLimit(true);
      ko.tasks.runEarly();
      $("#editLimitViewModal").trigger("openModal");
    };

    self.closeEdit = function () {
      $("#editLimitViewModal").trigger("closeModal");
      self.showEditLimit(false);
      ko.tasks.runEarly();
    };

    self.menuCountLimitOptions = ko.observableArray();
    self.selectedTransactionData = ko.observable();
    self.selectedTransactionDataForGraph = ko.observable();
    self.selectedTransactionName = ko.observable();
    self.menuLimitSelection = ko.observable();

    self.selectedTransactionTypeSubscribeFunc = function (value) {
      for (let a = 0; a < self.taskCodeList().length; a++) {
        if (self.taskCodeList()[a].id === value) {
          self.selectedTransactionName(rootParams.baseModel.format(self.nls.limitsInquiry.limits, {
            taskName: self.taskCodeList()[a].name
          }));

          break;
        }
      }

      self.limitsHeader(self.selectedTransactionName());

      if (self.tabs() && self.tabs().length > 0) {
        for (let j = 0; j < self.tabs().length; j++) {
          if (self.tabs()[j].id === "TL") {
            self.tabs()[j].label = self.selectedTransactionName();
            break;
          }
        }
      }

      self.menuCountLimitOptions.removeAll();

      for (let j = 0; j < self.tabs().length; j++) {
        self.menuCountLimitOptions.push({
          label: self.tabs()[j].label,
          icon: self.tabs()[j].icon,
          id: self.tabs()[j].id
        });
      }

      self.menuLimitSelection("");

      self.uiLimitOptions = {
        menuFloat: "left",
        fullWidth: false,
        iconAvailable: true,
        defaultOption: self.menuLimitSelection,
        type: "start"
      };

      self.graphData(null);

      for (let z = 0; z < self.arrayOfLimitsLinkages().length; z++) {
        if (self.selectedTransactionType() === self.arrayOfLimitsLinkages()[z].targetName) {
          self.graphData(self.arrayOfLimitsLinkages()[z]);
          self.graphDataForNotEffectiveToday(self.arrayOfLimitsLinkagesForGraph()[z]);
        }
      }
    };

    self.selectedTransactionType.subscribe(function (value) {
      self.selectedTransactionTypeSubscribeFunc(value);
    });

    self.floatingEnabled = ko.observable();

    self.floatingMenuSelection = function () {
      $("#panelLimits")[0].dispatchEvent(new CustomEvent("openFloatingPanel"));
      self.floatingEnabled(true);
    };

    self.setMenuData = function (value) {
      if (self.floatingEnabled()) {
        $("#panelLimits")[0].dispatchEvent(new CustomEvent("closeFloatingPanel"));
        self.floatingEnabled(false);
      }

      self.menuLimitSelection(value);
    };

    self.menuLimitSelection.subscribe(function (newValue) {
      if (newValue) {
        self.showNavigation(false);
        self.showGroupInfo(false);
        self.showGraph(false);
        ko.tasks.runEarly();
        self.selectedTransactionData(null);

        if (self.graphData() !== null) {
          if (newValue === "TL") {
            if (self.graphData().transactionCustomLimit !== "") {
              self.selectedTransactionData(self.graphData().transactionCustomLimit);
              self.selectedTransactionDataForGraph(self.graphDataForNotEffectiveToday().transactionCustomLimit);
            } else {
              self.selectedTransactionData(self.graphData().transactionLimit);
              self.selectedTransactionDataForGraph(self.graphDataForNotEffectiveToday().transactionLimit);
            }
          } else if (newValue === "TGL") {
            if (self.graphData().transactionGroupCustomLimit !== "") {
              self.selectedTransactionData(self.graphData().transactionGroupCustomLimit);
              self.selectedTransactionDataForGraph(self.graphDataForNotEffectiveToday().transactionGroupCustomLimit);
            } else {
              self.selectedTransactionData(self.graphData().transactionGroupLimit);
              self.selectedTransactionDataForGraph(self.graphDataForNotEffectiveToday().transactionGroupLimit);
            }

            self.hoverText(self.nls.limitsInquiry.messages.transactionGroup);

            if (self.selectedTransactionData()) {
              self.showGroupInformation();
              self.showGroupInfo(true);
            }
          } else if (newValue === "CGL") {
            if (self.graphData().channelGroupCustomLimit !== "") {
              self.selectedTransactionData(self.graphData().channelGroupCustomLimit);
              self.selectedTransactionDataForGraph(self.graphDataForNotEffectiveToday().channelGroupCustomLimit);
            } else {
              self.selectedTransactionData(self.graphData().channelGroupLimit);
              self.selectedTransactionDataForGraph(self.graphDataForNotEffectiveToday().channelGroupLimit);
            }

            self.hoverText(self.nls.limitsInquiry.messages.channelGroup);

            if (self.selectedTransactionData()) {
              self.showGroupInformation();
              self.showGroupInfo(true);
            }
          } else if (newValue === "CTGL") {
            if (self.graphData().channelTransactionGroupCustomLimit !== "") {
              self.selectedTransactionData(self.graphData().channelTransactionGroupCustomLimit);
              self.selectedTransactionDataForGraph(self.graphDataForNotEffectiveToday().channelTransactionGroupCustomLimit);
            } else {
              self.selectedTransactionData(self.graphData().channelTransactionGroupLimit);
              self.selectedTransactionDataForGraph(self.graphDataForNotEffectiveToday().channelTransactionGroupLimit);
            }
          } else if (newValue === "COL") {
            if (self.graphData().consolidatedCustomLimit !== "") {
              self.selectedTransactionData(self.graphData().consolidatedCustomLimit);
              self.selectedTransactionDataForGraph(self.graphDataForNotEffectiveToday().consolidatedCustomLimit);
            } else {
              self.selectedTransactionData(self.graphData().consolidatedLimit);
              self.selectedTransactionDataForGraph(self.graphDataForNotEffectiveToday().consolidatedLimit);
            }
          } else if (newValue === "COTGL") {
            if (self.graphData().consolidatedtransactionGroupCustomLimit !== "") {
              self.selectedTransactionData(self.graphData().consolidatedtransactionGroupCustomLimit);
              self.selectedTransactionDataForGraph(self.graphDataForNotEffectiveToday().consolidatedtransactionGroupCustomLimit);
            } else {
              self.selectedTransactionData(self.graphData().consolidatedtransactionGroupLimit);
              self.selectedTransactionDataForGraph(self.graphDataForNotEffectiveToday().consolidatedtransactionGroupLimit);
            }
          }

          for (let q = 0; q < self.tabs().length; q++) {
            if (self.tabs()[q].id === newValue) {
              self.limitsHeader(self.tabs()[q].label);
              break;
            }
          }

          self.showNavigation(true);
          self.showGraph(true);
          ko.tasks.runEarly();
        }
      } else {
        self.menuLimitSelection("TL");
      }
    });

    let entityType = "PARTY";

    rootParams.dashboard.headerName(self.nls.limitsInquiry.header.myLimits);

    if (rootParams.dashboard.userData.userProfile.roles) {
      ko.utils.arrayForEach(rootParams.dashboard.userData.userProfile.roles, function (role) {
        if (role.toLowerCase() === "retailuser") {
          self.isRetailUser(true);
        }

        if (role.toLowerCase() === "administrator") {
          self.isAdminUser(true);
        }
      });
    }

    if (rootParams.rootModel.userFullData && rootParams.rootModel.userFullData() && rootParams.rootModel.userFullData().userGroups.includes("retailuser")) {
      self.isRetailUser(true);
    }

    let baseAssignedLimitUrl = null,
      baseCustomLimitUrl = null,
      baseLimitUtilizationUrl = null;

    if (self.isAdminUser()) {
      baseAssignedLimitUrl = "users/assignedLimitPackage/{userId}?accessPointValue={accessPointValue}&accessPointGroupType={accessPointGroupType}";
      baseCustomLimitUrl = "users/customLimitPackage/{userId}";
      baseLimitUtilizationUrl = "financialLimitUtilization/{userId}?entityType={entityType}&limitType={limitType}&accessPointValue={accessPointValue}&accessPointGroupType={accessPointGroupType}";
    } else {
      baseAssignedLimitUrl = "me/assignedLimitPackage?accessPointValue={accessPointValue}&accessPointGroupType={accessPointGroupType}";
      baseCustomLimitUrl = "me/customLimitPackage";
      baseLimitUtilizationUrl = "financialLimitUtilization?entityType={entityType}&limitType={limitType}&accessPointValue={accessPointValue}&accessPointGroupType={accessPointGroupType}";
    }

    self.accessPointMapping = ko.observableArray();
    self.accessPointGroupMapping = ko.observableArray();
    self.accessPointConsolidatedMapping = ko.observableArray();

    self.filteredTaskGroupData = function (targetData, taskData, accessPointGroupType) {
      for (let k = 0; k < targetData.length; k++) {
        if (targetData[k].target.type.id === "TASK_GROUP") {
          for (let m = 0; m < taskData.length; m++) {
            if (targetData[k].target.value === taskData[m].id) {
              if (accessPointGroupType === "SINGLE") {
                self.accessPointMapping.push({
                  taskList: taskData[m].taskDTOs,
                  taskGroupName: k,
                  taskGroupId: targetData[k].target.value
                });
              } else if (accessPointGroupType === "GLOBAL") {
                self.accessPointConsolidatedMapping.push({
                  taskList: taskData[m].taskDTOs,
                  taskGroupName: k,
                  taskGroupId: targetData[k].target.value
                });
              } else {
                self.accessPointGroupMapping.push({
                  taskList: taskData[m].taskDTOs,
                  taskGroupName: k,
                  taskGroupId: targetData[k].target.value
                });
              }

              break;
            }
          }
        }
      }
    };

    self.targetLinkages = ko.observableArray();

    self.setAssignedLimitPackage = function (assignedData) {
      if (assignedData.accessPointGroupType === "SINGLE") {
        self.targetLinkages.removeAll();
        self.targetLinkages(assignedData.targetLimitLinkages);

        if (self.targetLinkages().length > 0) {
          ko.utils.arrayForEach(self.targetLinkages(), function (limitPackageData) {
            if (limitPackageData.target.type.id === "TASK") {
              const setRequiredLimitData = self.assignLimitPackage(limitPackageData);

              self.setTarget(limitPackageData, limitPackageData.target.value, setRequiredLimitData, null, null, null, null, null);
            }
          });

          ko.utils.arrayForEach(self.accessPointMapping(), function (accessPointMappingData) {
            for (let q = 0; q < accessPointMappingData.taskList.length; q++) {
              const setRequiredLimitData = self.assignLimitPackage(self.targetLinkages()[accessPointMappingData.taskGroupName]);

              self.setTarget(self.targetLinkages()[accessPointMappingData.taskGroupName], accessPointMappingData.taskList[q].id, null, setRequiredLimitData, null, null, null, null);
            }
          });
        }
      } else if (assignedData.accessPointGroupType === "GLOBAL") {
        self.targetLinkages.removeAll();
        self.targetLinkages(assignedData.targetLimitLinkages);

        if (self.targetLinkages().length > 0) {
          ko.utils.arrayForEach(self.targetLinkages(), function (limitPackageData) {
            if (limitPackageData.target.type.id === "TASK") {
              const setRequiredLimitData = self.assignLimitPackage(limitPackageData);

              self.setTarget(limitPackageData, limitPackageData.target.value, null, null, null, null, setRequiredLimitData, null);
            }
          });

          ko.utils.arrayForEach(self.accessPointConsolidatedMapping(), function (accessPointMappingData) {
            for (let q = 0; q < accessPointMappingData.taskList.length; q++) {
              const setRequiredLimitData = self.assignLimitPackage(self.targetLinkages()[accessPointMappingData.taskGroupName]);

              self.setTarget(self.targetLinkages()[accessPointMappingData.taskGroupName], accessPointMappingData.taskList[q].id, null, null, null, null, null, setRequiredLimitData);
            }
          });
        }
      } else {
        self.selectedChannelGroup(assignedData.accessPointValue);
        self.targetLinkages.removeAll();
        self.targetLinkages(assignedData.targetLimitLinkages);

        if (self.targetLinkages().length > 0) {
          ko.utils.arrayForEach(self.targetLinkages(), function (limitPackageData) {
            if (limitPackageData.target.type.id === "TASK") {
              const setRequiredLimitData = self.assignLimitPackage(limitPackageData);

              self.setTarget(limitPackageData, limitPackageData.target.value, null, null, setRequiredLimitData, null, null, null);
            }
          });

          ko.utils.arrayForEach(self.accessPointGroupMapping(), function (accessPointMappingData) {
            for (let q = 0; q < accessPointMappingData.taskList.length; q++) {
              const setRequiredLimitData = self.assignLimitPackage(self.targetLinkages()[accessPointMappingData.taskGroupName]);

              self.setTarget(self.targetLinkages()[accessPointMappingData.taskGroupName], accessPointMappingData.taskList[q].id, null, null, null, setRequiredLimitData, null, null);
            }
          });
        }
      }
    };

    self.setCustomData = function (customData) {
      const data = {
        maxAmountDaily: null,
        maxCountDaily: null,
        maxAmountMonthly: null,
        maxCountMonthly: null
      };

      if (customData.periodicLimitDaily) {
        data.maxAmountDaily = customData.periodicLimitDaily.maxAmount ? customData.periodicLimitDaily.maxAmount : null;
        data.maxCountDaily = customData.periodicLimitDaily.maxCount ? customData.periodicLimitDaily.maxCount : null;
        data.effectiveTomorrowAmountDaily = customData.periodicLimitDaily.effectiveTomorrowAmount ? customData.periodicLimitDaily.effectiveTomorrowAmount : null;
        data.effectiveTomorrowCountDaily = customData.periodicLimitDaily.effectiveTomorrowCount ? customData.periodicLimitDaily.effectiveTomorrowCount : null;

      }

      if (customData.periodicLimitMonthly) {
        data.maxAmountMonthly = customData.periodicLimitMonthly.maxAmount ? customData.periodicLimitMonthly.maxAmount : null;
        data.maxCountMonthly = customData.periodicLimitMonthly.maxCount ? customData.periodicLimitMonthly.maxCount : null;
        data.effectiveTomorrowAmountMonthly = customData.periodicLimitMonthly.effectiveTomorrowAmount ? customData.periodicLimitMonthly.effectiveTomorrowAmount : null;
        data.effectiveTomorrowCountMonthly = customData.periodicLimitMonthly.effectiveTomorrowCount ? customData.periodicLimitMonthly.effectiveTomorrowCount : null;
      }

      return data;
    };

    self.setCustomTarget = function (targetName, transactionCustomLimit, transactionGroupCustomLimit, channelGroupCustomLimit, channelTransactionGroupCustomLimit, consolidatedCustomLimit, consolidatedtransactionGroupCustomLimit) {
      const index = self.checkIfExist(targetName);
      let tempData = null,
        selectedField = null;

      if (index !== null) {
        if (self.arrayOfLimitsLinkages()[index].transactionLimit !== "" && transactionCustomLimit) {
          tempData = self.setCustomData(transactionCustomLimit);
          selectedField = self.arrayOfLimitsLinkages()[index].transactionLimit;
        } else if (self.arrayOfLimitsLinkages()[index].transactionGroupLimit !== "" && transactionGroupCustomLimit) {
          tempData = self.setCustomData(transactionGroupCustomLimit);
          selectedField = self.arrayOfLimitsLinkages()[index].transactionGroupLimit;
        } else if (self.arrayOfLimitsLinkages()[index].channelGroupLimit !== "" && channelGroupCustomLimit) {
          tempData = self.setCustomData(channelGroupCustomLimit);
          selectedField = self.arrayOfLimitsLinkages()[index].channelGroupLimit;
        } else if (self.arrayOfLimitsLinkages()[index].channelTransactionGroupLimit !== "" && channelTransactionGroupCustomLimit) {
          tempData = self.setCustomData(channelTransactionGroupCustomLimit);
          selectedField = self.arrayOfLimitsLinkages()[index].channelTransactionGroupLimit;
        } else if (self.arrayOfLimitsLinkages()[index].consolidatedLimit !== "" && consolidatedCustomLimit) {
          tempData = self.setCustomData(consolidatedCustomLimit);
          selectedField = self.arrayOfLimitsLinkages()[index].consolidatedLimit;
        } else if (self.arrayOfLimitsLinkages()[index].consolidatedtransactionGroupLimit !== "" && consolidatedtransactionGroupCustomLimit) {
          tempData = self.setCustomData(consolidatedtransactionGroupCustomLimit);
          selectedField = self.arrayOfLimitsLinkages()[index].consolidatedtransactionGroupLimit;
        }

        if (selectedField) {
          if (selectedField.periodicLimitDaily) {
            selectedField.periodicLimitDaily.maxAmount = tempData.maxAmountDaily && tempData.maxAmountDaily < selectedField.periodicLimitDaily.maxAmount ? tempData.maxAmountDaily : selectedField.periodicLimitDaily.maxAmount;
            selectedField.periodicLimitDaily.maxCount = tempData.maxCountDaily && tempData.maxCountDaily < selectedField.periodicLimitDaily.maxCount ? tempData.maxCountDaily : selectedField.periodicLimitDaily.maxCount;
            selectedField.periodicLimitDaily.effectiveTomorrowCount = tempData.effectiveTomorrowCountDaily ? tempData.effectiveTomorrowCountDaily : "";
            selectedField.periodicLimitDaily.effectiveTomorrowAmount = tempData.effectiveTomorrowAmountDaily ? tempData.effectiveTomorrowAmountDaily : "";
          }

          if (selectedField.periodicLimitMonthly) {
            selectedField.periodicLimitMonthly.maxAmount = tempData.maxAmountMonthly && tempData.maxAmountMonthly < selectedField.periodicLimitMonthly.maxAmount ? tempData.maxAmountMonthly : selectedField.periodicLimitMonthly.maxAmount;
            selectedField.periodicLimitMonthly.maxCount = tempData.maxCountMonthly && tempData.maxCountMonthly < selectedField.periodicLimitMonthly.maxCount ? tempData.maxCountMonthly : selectedField.periodicLimitMonthly.maxCount;
            selectedField.periodicLimitMonthly.effectiveTomorrowCount = tempData.effectiveTomorrowCountMonthly ? tempData.effectiveTomorrowCountMonthly : "";
            selectedField.periodicLimitMonthly.effectiveTomorrowAmount = tempData.effectiveTomorrowAmountMonthly ? tempData.effectiveTomorrowAmountMonthly : "";
          }

          self.arrayOfLimitsLinkages()[index].isCustomData = true;
        }
      }
    };

    self.setTarget = function (limitPackageData, targetName, transactionLimit, transactionGroupLimit, channelGroupLimit, channelTransactionGroupLimit, consolidatedLimit, consolidatedtransactionGroupLimit) {
      const index = self.checkIfExist(targetName);

      if (index !== null) {
        if (transactionLimit) {
          self.arrayOfLimitsLinkages()[index].transactionLimit = transactionLimit;
        } else if (transactionGroupLimit) {
          self.arrayOfLimitsLinkages()[index].transactionGroupLimit = transactionGroupLimit;
        } else if (channelGroupLimit) {
          self.arrayOfLimitsLinkages()[index].channelGroupLimit = channelGroupLimit;
        } else if (channelTransactionGroupLimit) {
          self.arrayOfLimitsLinkages()[index].channelTransactionGroupLimit = channelTransactionGroupLimit;
        } else if (consolidatedLimit) {
          self.arrayOfLimitsLinkages()[index].consolidatedLimit = consolidatedLimit;
        } else if (consolidatedtransactionGroupLimit) {
          self.arrayOfLimitsLinkages()[index].consolidatedtransactionGroupLimit = consolidatedtransactionGroupLimit;
        }
      } else {
        const limitData = {
          targetId: "",
          targetName: "",
          userType: "",
          isDataSaved: true,
          isCustomData: false,
          transactionLimit: transactionLimit ? transactionLimit : "",
          transactionGroupLimit: transactionGroupLimit ? transactionGroupLimit : "",
          channelGroupLimit: channelGroupLimit ? channelGroupLimit : "",
          channelTransactionGroupLimit: channelTransactionGroupLimit ? channelTransactionGroupLimit : "",
          transactionCustomLimit: "",
          transactionGroupCustomLimit: "",
          channelGroupCustomLimit: "",
          channelTransactionGroupCustomLimit: "",
          consolidatedLimit: consolidatedLimit ? consolidatedLimit : "",
          consolidatedtransactionGroupLimit: consolidatedtransactionGroupLimit ? consolidatedtransactionGroupLimit : "",
          consolidatedCustomLimit: "",
          consolidatedtransactionGroupCustomLimit: ""
        };

        limitData.targetId = limitPackageData.target.value;
        limitData.userType = limitPackageData.limits[0].owner;
        limitData.targetName = targetName;
        limitData.targetType = limitPackageData.target.type.name;
        self.arrayOfLimitsLinkages.push(limitData);
      }
    };

    self.assignLimitPackage = function (targetLimitData) {
      let transactionalLimitData,
        dailyPeriodicLimitData,
        monthlyPeriodicLimitData;

      ko.utils.arrayForEach(targetLimitData.limits, function (targetLimits) {
        if (targetLimits.limitType === "TXN") {
          transactionalLimitData = {
            targetId: targetLimitData.target.id,
            limitType: targetLimits.limitType,
            limitId: targetLimits.limitId,
            limitName: targetLimits.limitName,
            limitDesc: targetLimits.limitDescription,
            maxAmount: targetLimits.amountRange.maxTransaction.amount,
            maxCurrency: targetLimits.amountRange.maxTransaction.currency,
            miniAmount: targetLimits.amountRange.minTransaction.amount,
            miniCurrency: targetLimits.amountRange.minTransaction.currency
          };
        }

        if (targetLimits.limitType === "PER") {
          switch (targetLimits.periodicity) {
            case "DAILY":
              dailyPeriodicLimitData = {
                targetId: targetLimitData.target.id,
                targetValue: targetLimitData.target.value,
                targetType: targetLimitData.target.type.id,
                limitType: targetLimits.limitType,
                limitId: targetLimits.limitId,
                limitName: targetLimits.limitName,
                limitDesc: targetLimits.limitDescription,
                periodicity: targetLimits.periodicity,
                maxAmount: targetLimitData.effectiveDate === self.tomorrowDate() ? "" : targetLimits.maxAmount.amount,
                maxCurrency: targetLimits.maxAmount.currency,
                maxCount: targetLimitData.effectiveDate === self.tomorrowDate() ? "" : targetLimits.maxCount,
                bankAllocatedCount: targetLimits.maxCount,
                bankAllocatedAmount: targetLimits.maxAmount.amount,
                bankAllocatedCurrency: targetLimits.maxAmount.currency,
                utilizedDailyCount: 0,
                utilizedDailyAmount: 0,
                utilizedDailyCurrency: "",
                effectiveTomorrowCount: targetLimitData.effectiveDate === self.tomorrowDate() ? targetLimits.maxCount : "",
                effectiveTomorrowAmount: targetLimitData.effectiveDate === self.tomorrowDate() ? targetLimits.maxAmount.amount : ""

              };

              break;
            case "MONTHLY":
              monthlyPeriodicLimitData = {
                targetId: targetLimitData.target.id,
                targetValue: targetLimitData.target.value,
                targetType: targetLimitData.target.type.id,
                limitType: targetLimits.limitType,
                limitId: targetLimits.limitId,
                limitName: targetLimits.limitName,
                limitDesc: targetLimits.limitDescription,
                periodicity: targetLimits.periodicity,
                maxAmount: targetLimitData.effectiveDate === self.tomorrowDate() ? "" : targetLimits.maxAmount.amount,
                maxCurrency: targetLimits.maxAmount.currency,
                maxCount: targetLimitData.effectiveDate === self.tomorrowDate() ? "" : targetLimits.maxCount,
                bankAllocatedCount: targetLimits.maxCount,
                bankAllocatedAmount: targetLimits.maxAmount.amount,
                bankAllocatedCurrency: targetLimits.maxAmount.currency,
                utilizedMonthlyCount: 0,
                utilizedMonthlyAmount: 0,
                utilizedMonthlyCurrency: "",
                effectiveTomorrowCount: targetLimitData.effectiveDate === self.tomorrowDate() ? targetLimits.maxCount : "",
                effectiveTomorrowAmount: targetLimitData.effectiveDate === self.tomorrowDate() ? targetLimits.maxAmount.amount : ""

              };

              break;
          }
        }
      });

      const setRequiredLimitData = {
        transactionalLimitData: transactionalLimitData,
        periodicLimitDaily: dailyPeriodicLimitData,
        periodicLimitMonthly: monthlyPeriodicLimitData
      };

      return setRequiredLimitData;
    };

    self.checkIfExist = function (taskGroupId) {
      let getById = null;

      for (let t = 0; t < self.arrayOfLimitsLinkages().length; t++) {
        if (self.arrayOfLimitsLinkages()[t].targetName === taskGroupId) {
          getById = t;
          break;
        }
      }

      return getById;
    };

    self.accessPointsUtilizationData = function (limitTypeAndPeriodicity, utilizedData) {
      let tempData = null;

      for (let t = 0; t < self.accessPointMapping().length; t++) {
        if (self.accessPointMapping()[t].taskGroupId === utilizedData.utilizationId) {
          for (let u = 0; u < self.accessPointMapping()[t].taskList.length; u++) {
            tempData = self.setUtilizationData(self.accessPointMapping()[t].taskList[u].id, utilizedData);

            let selectedField = null;

            if (self.arrayOfLimitsLinkages()[tempData.index].transactionGroupLimit !== "") {
              selectedField = self.arrayOfLimitsLinkages()[tempData.index].transactionGroupLimit;
            }

            if (self.arrayOfLimitsLinkages()[tempData.index].transactionGroupCustomLimit !== "") {
              selectedField = self.arrayOfLimitsLinkages()[tempData.index].transactionGroupCustomLimit;
            }

            if (selectedField && selectedField.periodicLimitDaily && limitTypeAndPeriodicity === "DAILY") {
              selectedField.periodicLimitDaily.utilizedDailyCount = tempData.utilizedCount;
              selectedField.periodicLimitDaily.utilizedDailyAmount = tempData.utilizedAmount;
              selectedField.periodicLimitDaily.utilizedDailyCurrency = tempData.utilizedCurrency;
            } else if (selectedField && selectedField.periodicLimitMonthly && limitTypeAndPeriodicity === "MONTHLY") {
              selectedField.periodicLimitMonthly.utilizedMonthlyCount = tempData.utilizedCount;
              selectedField.periodicLimitMonthly.utilizedMonthlyAmount = tempData.utilizedAmount;
              selectedField.periodicLimitMonthly.utilizedMonthlyCurrency = tempData.utilizedCurrency;
            }
          }

          break;
        }
      }
    };

    self.accessPointsGroupsUtilizationData = function (limitTypeAndPeriodicity, utilizedData) {
      let tempData = null;

      for (let t = 0; t < self.accessPointGroupMapping().length; t++) {
        if (self.accessPointGroupMapping()[t].taskGroupId === utilizedData.utilizationId) {
          for (let u = 0; u < self.accessPointGroupMapping()[t].taskList.length; u++) {
            tempData = self.setUtilizationData(self.accessPointGroupMapping()[t].taskList[u].id, utilizedData);

            let selectedField = null;

            if (self.arrayOfLimitsLinkages()[tempData.index].channelTransactionGroupLimit !== "") {
              selectedField = self.arrayOfLimitsLinkages()[tempData.index].channelTransactionGroupLimit;
            }

            if (self.arrayOfLimitsLinkages()[tempData.index].channelTransactionGroupCustomLimit !== "") {
              selectedField = self.arrayOfLimitsLinkages()[tempData.index].channelTransactionGroupCustomLimit;
            }

            if (selectedField && selectedField.periodicLimitDaily && limitTypeAndPeriodicity === "DAILY") {
              selectedField.periodicLimitDaily.utilizedDailyCount = tempData.utilizedCount;
              selectedField.periodicLimitDaily.utilizedDailyAmount = tempData.utilizedAmount;
              selectedField.periodicLimitDaily.utilizedDailyCurrency = tempData.utilizedCurrency;
            } else if (selectedField && selectedField.periodicLimitMonthly && limitTypeAndPeriodicity === "MONTHLY") {
              selectedField.periodicLimitMonthly.utilizedMonthlyCount = tempData.utilizedCount;
              selectedField.periodicLimitMonthly.utilizedMonthlyAmount = tempData.utilizedAmount;
              selectedField.periodicLimitMonthly.utilizedMonthlyCurrency = tempData.utilizedCurrency;
            }
          }

          break;
        }
      }
    };

    self.consolidatedUtilizationData = function (limitTypeAndPeriodicity, utilizedData) {
      let tempData = null;

      for (let t1 = 0; t1 < self.accessPointConsolidatedMapping().length; t1++) {
        if (self.accessPointConsolidatedMapping()[t1].taskGroupId === utilizedData.utilizationId) {
          for (let u1 = 0; u1 < self.accessPointConsolidatedMapping()[t1].taskList.length; u1++) {
            tempData = self.setUtilizationData(self.accessPointConsolidatedMapping()[t1].taskList[u1].id, utilizedData);

            let selectedField = null;

            if (self.arrayOfLimitsLinkages()[tempData.index].consolidatedtransactionGroupLimit !== "") {
              selectedField = self.arrayOfLimitsLinkages()[tempData.index].consolidatedtransactionGroupLimit;
            }

            if (self.arrayOfLimitsLinkages()[tempData.index].consolidatedtransactionGroupCustomLimit !== "") {
              selectedField = self.arrayOfLimitsLinkages()[tempData.index].consolidatedtransactionGroupCustomLimit;
            }

            if (selectedField && selectedField.periodicLimitDaily && limitTypeAndPeriodicity === "DAILY") {
              selectedField.periodicLimitDaily.utilizedDailyCount = tempData.utilizedCount;
              selectedField.periodicLimitDaily.utilizedDailyAmount = tempData.utilizedAmount;
              selectedField.periodicLimitDaily.utilizedDailyCurrency = tempData.utilizedCurrency;
            } else if (selectedField && selectedField.periodicLimitMonthly && limitTypeAndPeriodicity === "MONTHLY") {
              selectedField.periodicLimitMonthly.utilizedMonthlyCount = tempData.utilizedCount;
              selectedField.periodicLimitMonthly.utilizedMonthlyAmount = tempData.utilizedAmount;
              selectedField.periodicLimitMonthly.utilizedMonthlyCurrency = tempData.utilizedCurrency;
            }
          }

          break;
        }
      }
    };

    self.dailyMonthlyUtilizationData = function (utilizationData) {
      ko.utils.arrayForEach(utilizationData, function (utilizedData) {
        const limitTypeAndPeriodicity = utilizedData.limitType.split("#")[1],
          tempData = self.setUtilizationData(utilizedData.utilizationId, utilizedData);

        if (tempData.index !== undefined) {
          let selectedField = null;

          if (utilizedData.accessPointGroupType === "SINGLE" && self.arrayOfLimitsLinkages()[tempData.index].transactionLimit !== "") {
            selectedField = self.arrayOfLimitsLinkages()[tempData.index].transactionLimit;
          } else if (utilizedData.accessPointGroupType === "SINGLE" && self.arrayOfLimitsLinkages()[tempData.index].transactionCustomLimit !== "") {
            selectedField = self.arrayOfLimitsLinkages()[tempData.index].transactionCustomLimit;
          } else if (utilizedData.accessPointGroupType === "GLOBAL" && self.arrayOfLimitsLinkages()[tempData.index].consolidatedLimit !== "") {
            selectedField = self.arrayOfLimitsLinkages()[tempData.index].consolidatedLimit;
          } else if (utilizedData.accessPointGroupType === "GLOBAL" && self.arrayOfLimitsLinkages()[tempData.index].consolidatedCustomLimit !== "") {
            selectedField = self.arrayOfLimitsLinkages()[tempData.index].consolidatedCustomLimit;
          } else if (utilizedData.accessPointGroupType === "GROUP" && self.arrayOfLimitsLinkages()[tempData.index].channelGroupLimit !== "") {
            selectedField = self.arrayOfLimitsLinkages()[tempData.index].channelGroupLimit;
          } else if (utilizedData.accessPointGroupType === "GROUP" && self.arrayOfLimitsLinkages()[tempData.index].channelGroupCustomLimit !== "") {
            selectedField = self.arrayOfLimitsLinkages()[tempData.index].channelGroupCustomLimit;
          }

          if (selectedField && selectedField.periodicLimitDaily && limitTypeAndPeriodicity === "DAILY") {
            selectedField.periodicLimitDaily.utilizedDailyCount = tempData.utilizedCount;
            selectedField.periodicLimitDaily.utilizedDailyAmount = tempData.utilizedAmount;
            selectedField.periodicLimitDaily.utilizedDailyCurrency = tempData.utilizedCurrency;
          } else if (selectedField && selectedField.periodicLimitMonthly && limitTypeAndPeriodicity === "MONTHLY") {
            selectedField.periodicLimitMonthly.utilizedMonthlyCount = tempData.utilizedCount;
            selectedField.periodicLimitMonthly.utilizedMonthlyAmount = tempData.utilizedAmount;
            selectedField.periodicLimitMonthly.utilizedMonthlyCurrency = tempData.utilizedCurrency;
          }
        } else if (utilizedData.accessPointGroupType === "SINGLE") {
          self.accessPointsUtilizationData(limitTypeAndPeriodicity, utilizedData);
        } else if (utilizedData.accessPointGroupType === "GLOBAL") {
          self.consolidatedUtilizationData(limitTypeAndPeriodicity, utilizedData);
        } else {
          self.accessPointsGroupsUtilizationData(limitTypeAndPeriodicity, utilizedData);
        }
      });
    };

    self.setUtilizationData = function (targetId, utilizedData) {
      let utilizedCount,
        utilizedAmount,
        utilizedCurrency,
        index;

      for (let t = 0; t < self.arrayOfLimitsLinkages().length; t++) {
        if (self.arrayOfLimitsLinkages()[t].targetName === targetId) {
          utilizedCount = utilizedData.count ? utilizedData.count : 0;
          utilizedAmount = utilizedData.amount.amount ? utilizedData.amount.amount : 0;
          utilizedCurrency = utilizedData.amount.currency ? utilizedData.amount.currency : "";
          index = t;
          break;
        }
      }

      const setRequiredUtilizedData = {
        utilizedCount: utilizedCount,
        utilizedAmount: utilizedAmount,
        utilizedCurrency: utilizedCurrency,
        index: index
      };

      return setRequiredUtilizedData;
    };

    self.filteredCustomPackageData = function (assignedData) {
      if (assignedData.accessPointGroupType === "SINGLE") {
        self.targetLinkages.removeAll();
        self.targetLinkages(assignedData.targetLimitLinkages);

        if (self.targetLinkages().length > 0) {
          ko.utils.arrayForEach(self.targetLinkages(), function (limitPackageData) {
            if (limitPackageData.target.type.id === "TASK" && (!(limitPackageData.expiryDate && limitPackageData.expiryDate <= self.todayDate()) || (limitPackageData.effectiveDate === self.tomorrowDate()))) {
              const setRequiredLimitData = self.assignLimitPackage(limitPackageData);

              self.setCustomTarget(limitPackageData.target.value, setRequiredLimitData, null, null, null, null, null);
            }
          });

          ko.utils.arrayForEach(self.accessPointMapping(), function (accessPointMappingData) {
            for (let e = 0; e < self.targetLinkages().length; e++) {
              if (self.targetLinkages()[e].target.value === accessPointMappingData.taskGroupId && (!(self.targetLinkages()[e].expiryDate && self.targetLinkages()[e].expiryDate <= self.todayDate()) || (self.targetLinkages()[e].effectiveDate === self.tomorrowDate()))) {
                for (let q = 0; q < accessPointMappingData.taskList.length; q++) {
                  const setRequiredLimitData = self.assignLimitPackage(self.targetLinkages()[e]);

                  self.setCustomTarget(accessPointMappingData.taskList[q].id, null, setRequiredLimitData, null, null, null, null);
                }
              }
            }
          });
        }
      } else if (assignedData.accessPointGroupType === "GROUP") {
        self.targetLinkages.removeAll();
        self.targetLinkages(assignedData.targetLimitLinkages);

        if (self.targetLinkages().length > 0) {
          ko.utils.arrayForEach(self.targetLinkages(), function (limitPackageData) {
            if (limitPackageData.target.type.id === "TASK" && (!(limitPackageData.expiryDate && limitPackageData.expiryDate <= self.todayDate()) || (limitPackageData.effectiveDate === self.tomorrowDate()))) {
              const setRequiredLimitData = self.assignLimitPackage(limitPackageData);

              self.setCustomTarget(limitPackageData.target.value, null, null, setRequiredLimitData, null, null, null);
            }
          });

          ko.utils.arrayForEach(self.accessPointGroupMapping(), function (accessPointMappingData) {
            for (let e = 0; e < self.targetLinkages().length; e++) {
              if (self.targetLinkages()[e].target.value === accessPointMappingData.taskGroupId && (!(self.targetLinkages()[e].expiryDate && self.targetLinkages()[e].expiryDate <= self.todayDate()) || (self.targetLinkages()[e].effectiveDate === self.tomorrowDate()))) {
                for (let q = 0; q < accessPointMappingData.taskList.length; q++) {
                  const setRequiredLimitData = self.assignLimitPackage(self.targetLinkages()[e]);

                  self.setCustomTarget(accessPointMappingData.taskList[q].id, null, null, null, setRequiredLimitData, null, null);
                }
              }
            }
          });
        }
      } else if (assignedData.accessPointGroupType === "GLOBAL") {
        self.targetLinkages.removeAll();
        self.targetLinkages(assignedData.targetLimitLinkages);

        if (self.targetLinkages().length > 0) {
          ko.utils.arrayForEach(self.targetLinkages(), function (limitPackageData) {
            if (limitPackageData.target.type.id === "TASK" && (!(limitPackageData.expiryDate && limitPackageData.expiryDate <= self.todayDate()) || (limitPackageData.effectiveDate === self.tomorrowDate()))) {
              const setRequiredLimitData = self.assignLimitPackage(limitPackageData);

              self.setCustomTarget(limitPackageData.target.value, null, null, null, null, setRequiredLimitData, null);
            }
          });

          ko.utils.arrayForEach(self.accessPointConsolidatedMapping(), function (accessPointMappingData) {
            for (let e = 0; e < self.targetLinkages().length; e++) {
              if (self.targetLinkages()[e].target.value === accessPointMappingData.taskGroupId && (!(self.targetLinkages()[e].expiryDate && self.targetLinkages()[e].expiryDate <= self.todayDate()) || (self.targetLinkages()[e].effectiveDate === self.tomorrowDate()))) {
                for (let q = 0; q < accessPointMappingData.taskList.length; q++) {
                  const setRequiredLimitData = self.assignLimitPackage(self.targetLinkages()[e]);

                  self.setCustomTarget(accessPointMappingData.taskList[q].id, null, null, null, null, null, setRequiredLimitData);
                }
              }
            }
          });
        }
      }
    };

    self.showLimitPackageType = ko.observable(false);

    self.fetchData = function () {
      Promise.all([MyLimitModel.searchTransactionGroup("limit"),
          MyLimitModel.fetchAssignedLimitPackages(baseAssignedLimitUrl, userId, self.selectedChannelType(), "SINGLE"),
          MyLimitModel.fetchUtilizationLimit(baseLimitUtilizationUrl, userId, entityType, self.selectedChannelType(), "SINGLE", "PER#DAILY"),
          MyLimitModel.fetchUtilizationLimit(baseLimitUtilizationUrl, userId, entityType, self.selectedChannelType(), "SINGLE", "PER#MONTHLY"),
          MyLimitModel.fetchCustomLimitPackages(baseCustomLimitUrl, userId, self.selectedChannelType(), "SINGLE")
        ])
        .then(function (data) {
          const TaskGroups = data[0],
            Assigned = data[1],
            UtilizedDaily = data[2],
            UtilizedMonthly = data[3],
            Custom = data[4];

          ko.utils.arrayForEach(Assigned.limitPackageDTOList, function (target) {
            self.filteredTaskGroupData(target.targetLimitLinkages, TaskGroups.taskGroupDTOlist, target.accessPointGroupType);
          });

          self.tabs.removeAll();

          ko.utils.arrayForEach(Assigned.limitPackageDTOList, function (target) {
            if (target.accessPointGroupType === "SINGLE") {
              self.tabs.push({
                label: self.selectedTransactionName(),
                icon: "icon-2x icon-approvals",
                id: "TL"
              }, {
                label: self.nls.limitsInquiry.messages.transactionGroupLimits,
                icon: "icon-2x icon-approvals",
                id: "TGL"

              });
            }

            if (target.accessPointGroupType === "GROUP") {
              self.tabs.push({
                label: self.nls.limitsInquiry.messages.channelGroupLimits,
                icon: "icon-2x icon-approvals",
                id: "CGL"
              }, {
                label: self.nls.limitsInquiry.messages.channelTransactionGroupLimits,
                icon: "icon-2x icon-approvals",
                id: "CTGL"
              });
            }

            if (target.accessPointGroupType === "GLOBAL") {
              self.tabs.push({
                label: self.nls.limitsInquiry.messages.consolidateLimits,
                icon: "icon-2x icon-approvals",
                id: "COL"
              }, {
                label: self.nls.limitsInquiry.messages.consolidateTransactionGroupLimits,
                icon: "icon-2x icon-approvals",
                id: "COTGL"
              });
            }
          });

          self.menuCountLimitOptions.removeAll();

          for (let j = 0; j < self.tabs().length; j++) {
            self.menuCountLimitOptions.push({
              label: self.tabs()[j].label,
              icon: self.tabs()[j].icon,
              id: self.tabs()[j].id
            });
          }

          self.showLimitPackageType(true);

          ko.utils.arrayForEach(Assigned.limitPackageDTOList, function (target) {
            self.setAssignedLimitPackage(target);
          });

          self.customPackageFlagforSingle(false);
          self.customPackageFlagforGroup(false);
          self.customPackageFlagforGlobal(false);
          self.dataForPayloadSingle();
          self.dataForPayloadGroup();
          self.dataForPayloadGlobal();

          if (self.isRetailUser()) {
            if (Custom.limitPackageDTOList.length) {
              ko.utils.arrayForEach(Custom.limitPackageDTOList, function (target) {
                if (target.accessPointGroupType === "SINGLE") {
                  self.dataForPayloadSingle(target);
                  self.customPackageFlagforSingle(true);
                }

                if (target.accessPointGroupType === "GROUP") {
                  self.dataForPayloadGroup(target);
                  self.customPackageFlagforGroup(true);
                }

                if (target.accessPointGroupType === "GLOBAL") {
                  self.dataForPayloadGlobal(target);
                  self.customPackageFlagforGlobal(true);
                }
              });

              ko.utils.arrayForEach(Custom.limitPackageDTOList, function (target) {
                self.filteredCustomPackageData(target);
              });
            }
          }

          if (UtilizedDaily.limitUtilizationDTOs) {
            self.dailyMonthlyUtilizationData(UtilizedDaily.limitUtilizationDTOs);
          }

          if (UtilizedMonthly.limitUtilizationDTOs) {
            self.dailyMonthlyUtilizationData(UtilizedMonthly.limitUtilizationDTOs);
          }

          if (!self.taskCodeList().length > 0) {
            self.getTaskList();
          } else {
            self.selectedTransactionType(self.taskCodeList()[0].id);
            self.selectedTransactionTypeSubscribeFunc(self.selectedTransactionType());
            self.dataLoaded(true);
          }

          self.arrayOfLimitsLinkagesForGraph(JSON.parse(JSON.stringify(self.arrayOfLimitsLinkages())));
        });
    };

    if (!self.isRetailUser()) {
      self.menuOptions = ko.observableArray();
      self.menuSelection = ko.observable();
      self.selectedTabData = "user";
      self.menuSelection("user");
      entityType = "USER";

      const flag = rootParams.rootModel.typeOfWidget ? rootParams.rootModel.typeOfWidget === "PARTY" : false;

      if (flag) {
        self.selectedTabData = "party";
        self.menuSelection("party");
        entityType = "PARTY";
        baseAssignedLimitUrl = "me/party/assignedLimitPackage?accessPointValue={accessPointValue}&accessPointGroupType={accessPointGroupType}";
      }

      self.menuOptions.push({
        id: "user",
        label: self.nls.limitsInquiry.messages.analysis_title
      });

      self.menuOptions.push({
        id: "party",
        label: self.nls.limitsInquiry.messages.party_limit
      });

      self.uiOptions = {
        menuFloat: "left",
        fullWidth: false,
        defaultOption: self.menuSelection
      };

      self.uiMobileOptions = {
        menuFloat: "left",
        fullWidth: true,
        defaultOption: self.menuSelection
      };

      self.menuSelection.subscribe(function (value) {
        if (value === "user") {
          entityType = "USER";

          if (self.isAdminUser()) {
            baseAssignedLimitUrl = "users/assignedLimitPackage/{userId}?accessPointValue={accessPointValue}&accessPointGroupType={accessPointGroupType}";
          } else {
            baseAssignedLimitUrl = "me/assignedLimitPackage?accessPointValue={accessPointValue}&accessPointGroupType={accessPointGroupType}";
          }

          if (self.selectedTabData === "party") {
            self.assignedLimitDataArray.removeAll();
            self.accessPointMapping.removeAll();
            self.accessPointGroupMapping.removeAll();
            self.accessPointConsolidatedMapping.removeAll();
            self.targetLinkages.removeAll();
            self.arrayOfLimitsLinkages.removeAll();
            self.showGroupInfo(false);
            self.showGroupInfo(false);
            self.showNavigation(false);
            self.showGraph(false);
            self.dataLoaded(false);
            ko.tasks.runEarly();
            self.fetchChannels();
            self.selectedChannelIndexSubscribeFunc();
          }

          self.selectedTabData = "user";
        } else {
          entityType = "PARTY";
          baseAssignedLimitUrl = "me/party/assignedLimitPackage?accessPointValue={accessPointValue}&accessPointGroupType={accessPointGroupType}";

          if (self.selectedTabData === "user") {
            self.assignedLimitDataArray.removeAll();
            self.accessPointMapping.removeAll();
            self.accessPointGroupMapping.removeAll();
            self.accessPointConsolidatedMapping.removeAll();
            self.targetLinkages.removeAll();
            self.arrayOfLimitsLinkages.removeAll();
            self.showGroupInfo(false);
            self.showGroupInfo(false);
            self.showNavigation(false);
            self.showGraph(false);
            self.dataLoaded(false);
            ko.tasks.runEarly();
            self.fetchChannels();
            self.selectedChannelIndexSubscribeFunc();
          }

          self.selectedTabData = "party";
        }
      });
    }

    self.todayDate = ko.observable(oj.IntlConverterUtils.dateToLocalIso(rootParams.baseModel.getDate()));

    const dateTommorow = rootParams.baseModel.getDate();

    dateTommorow.setDate(dateTommorow.getDate() + 1);
    self.tomorrowDate = ko.observable(oj.IntlConverterUtils.dateToLocalIso(dateTommorow));
    self.validationTracker = ko.observable();

    self.getNewKoModel = function () {
      const KoModel = MyLimitModel.getNewModel();

      return KoModel;
    };

    self.payload = ko.observable(self.getNewKoModel().package);

    self.getTaskList = function () {
      MyLimitModel.getTransactionName().done(function (data) {
        self.taskCodeList(data.taskList);
        self.dataLoaded(true);
        ko.tasks.runEarly();
        self.selectedTransactionType(self.taskCodeList()[0].id);
      });
    };

    MyLimitModel.fetchEffectiveTodayDetails().done(function (data) {
      self.effectiveSameDayFlag(data.isEffectiveSameDay);
    });

    if (self.effectiveSameDayFlag() === "Y") {
      const date = rootParams.baseModel.getDate();

      date.setDate(date.getDate() + 1);
      self.tomorrowDate = ko.observable(date);
    }

    const myLimitPayload = function () {
      self.payload().currency = "";
      self.payload().accessPointValue = self.selectedChannelType();

      if (self.existingLimitPackage()) {
        self.payload().key.id = self.existingLimitPackage().key.id;
        self.payload().description = self.existingLimitPackage().description;
        self.payload().currency = self.existingLimitPackage().currency;
        self.payload().owner.key.value = self.existingLimitPackage().owner.key.value;
        self.payload().owner.key.type = self.existingLimitPackage().owner.key.type;

        ko.utils.arrayForEach(self.existingLimitPackage().assignableToList, function (assignableToList) {
          let assignableToListIndex = 0;

          self.payload().assignableToList[assignableToListIndex].key.type = assignableToList.key.type;
          self.payload().assignableToList[assignableToListIndex].key.value = assignableToList.key.value;
          assignableToListIndex = assignableToListIndex + 1;
        });
      }

      const targetLinkagesPayload = [];
      let countFortargetLinkages = 0;

      ko.utils.arrayForEach(self.arrayOfLimitsLinkages(), function (targetLinkages) {
        const PeriodicUpdateDaily = self.getNewKoModel().PeriodicLimitModel,
          PeriodicUpdateMonthly = self.getNewKoModel().PeriodicLimitModel,
          targetLimitLinkage = {
            target: {
              id: "",
              value: "",
              type: {
                id: "",
                name: ""
              }
            }
          };
        let selectedOption;
        const limitsArray = [];
        let count = 0;

        self.selectedOption = ko.observable();
        targetLimitLinkage.target.value = targetLinkages.targetName;

        if (self.menuLimitSelection() === "TL") {
          selectedOption = targetLinkages.transactionLimit;
          self.payload().accessPointGroupType = "SINGLE";
          self.payload().accessPointValue = self.selectedChannelType();
        } else if (self.menuLimitSelection() === "TGL") {
          selectedOption = targetLinkages.transactionGroupLimit;
          self.payload().accessPointGroupType = "SINGLE";
          self.payload().accessPointValue = self.selectedChannelType();
        } else if (self.menuLimitSelection() === "CGL") {
          selectedOption = targetLinkages.channelGroupLimit;
          self.payload().accessPointGroupType = "GROUP";
          self.payload().accessPointValue = self.selectedChannelGroup();
        } else if (self.menuLimitSelection() === "CTGL") {
          selectedOption = targetLinkages.channelTransactionGroupLimit;
          self.payload().accessPointGroupType = "GROUP";
          self.payload().accessPointValue = self.selectedChannelGroup();
        } else if (self.menuLimitSelection() === "COL") {
          selectedOption = targetLinkages.consolidatedLimit;
          self.payload().accessPointGroupType = "GLOBAL";
          self.payload().accessPointValue = "GLOBAL";
        } else if (self.menuLimitSelection() === "COTGL") {
          selectedOption = targetLinkages.consolidatedtransactionGroupLimit;
          self.payload().accessPointGroupType = "GLOBAL";
          self.payload().accessPointValue = "GLOBAL";
        }

        if (selectedOption.isDailyModified === true && selectedOption.periodicLimitDaily) {
          targetLimitLinkage.target.value = selectedOption.periodicLimitDaily.targetValue;
          targetLimitLinkage.target.id = selectedOption.periodicLimitDaily.targetId;
          targetLimitLinkage.target.type.id = selectedOption.periodicLimitDaily.targetType;
          PeriodicUpdateDaily.limitId = "";
          PeriodicUpdateDaily.limitDescription = "";
          PeriodicUpdateDaily.limitName = "";
          PeriodicUpdateDaily.limitType = selectedOption.periodicLimitDaily.limitType;
          PeriodicUpdateDaily.periodicity = selectedOption.periodicLimitDaily.periodicity;
          PeriodicUpdateDaily.maxCount = self.effectiveSameDayFlag() === "Y" ? selectedOption.periodicLimitDaily.maxCount : selectedOption.periodicLimitDaily.effectiveTomorrowCount ? selectedOption.periodicLimitDaily.effectiveTomorrowCount : selectedOption.periodicLimitDaily.maxCount;
          PeriodicUpdateDaily.maxAmount.amount = self.effectiveSameDayFlag() === "Y" ? selectedOption.periodicLimitDaily.maxAmount : selectedOption.periodicLimitDaily.effectiveTomorrowAmount ? selectedOption.periodicLimitDaily.effectiveTomorrowAmount : selectedOption.periodicLimitDaily.maxAmount;
          PeriodicUpdateDaily.maxAmount.currency = selectedOption.periodicLimitDaily.maxCurrency;
          PeriodicUpdateDaily.owner.type = "USER";
          PeriodicUpdateDaily.owner.value = "";
          self.payload().currency = self.payload().currency ? self.payload().currency : selectedOption.periodicLimitDaily.maxCurrency;
          limitsArray[count] = PeriodicUpdateDaily;
          count++;
        }

        if (selectedOption.isMonthlyModified === true && selectedOption.periodicLimitMonthly) {
          targetLimitLinkage.target.value = selectedOption.periodicLimitMonthly.targetValue;
          targetLimitLinkage.target.id = selectedOption.periodicLimitMonthly.targetId;
          targetLimitLinkage.target.type.id = selectedOption.periodicLimitMonthly.targetType;
          PeriodicUpdateMonthly.limitId = "";
          PeriodicUpdateMonthly.limitDescription = "";
          PeriodicUpdateMonthly.limitName = "";
          PeriodicUpdateMonthly.limitType = selectedOption.periodicLimitMonthly.limitType;
          PeriodicUpdateMonthly.periodicity = selectedOption.periodicLimitMonthly.periodicity;
          PeriodicUpdateMonthly.maxCount = self.effectiveSameDayFlag() === "Y" ? selectedOption.periodicLimitMonthly.maxCount : selectedOption.periodicLimitMonthly.effectiveTomorrowCount ? selectedOption.periodicLimitMonthly.effectiveTomorrowCount : selectedOption.periodicLimitMonthly.maxCount;
          PeriodicUpdateMonthly.maxAmount.amount = self.effectiveSameDayFlag() === "Y" ? selectedOption.periodicLimitMonthly.maxAmount : selectedOption.periodicLimitMonthly.effectiveTomorrowAmount ? selectedOption.periodicLimitMonthly.effectiveTomorrowAmount : selectedOption.periodicLimitMonthly.maxAmount;
          PeriodicUpdateMonthly.maxAmount.currency = selectedOption.periodicLimitMonthly.maxCurrency;
          PeriodicUpdateMonthly.owner.type = "USER";
          PeriodicUpdateMonthly.owner.value = "";
          self.payload().currency = self.payload().currency ? self.payload().currency : selectedOption.periodicLimitMonthly.maxCurrency;
          limitsArray[count] = PeriodicUpdateMonthly;
          count++;
        }

        targetLimitLinkage.limits = limitsArray;

        if (targetLimitLinkage.limits.length > 0) {
          targetLinkagesPayload[countFortargetLinkages] = targetLimitLinkage;
          countFortargetLinkages++;
        }
      });

      self.payload().targetLimitLinkages = targetLinkagesPayload;

      if (self.payload().accessPointGroupType === "SINGLE") {
        if (self.customPackageFlagforSingle()) {
          self.dataForPayloadSingle().targetLimitLinkages = self.payload().targetLimitLinkages;
        }
      }

      if (self.payload().accessPointGroupType === "GLOBAL") {
        if (self.customPackageFlagforGlobal()) {
          self.dataForPayloadGlobal().targetLimitLinkages = self.payload().targetLimitLinkages;
        }
      }

      if (self.payload().accessPointGroupType === "GROUP") {
        if (self.customPackageFlagforGroup()) {
          self.dataForPayloadGroup().targetLimitLinkages = self.payload().targetLimitLinkages;
        }
      }

      return self.payload();
    };

    self.saveMyLimits = function () {
      if (!rootParams.baseModel.showComponentValidationErrors(self.validationTracker())) {
        return;
      }

      myLimitPayload();

      if (self.payload().accessPointGroupType === "SINGLE") {
        if (self.customPackageFlagforSingle()) {
          MyLimitModel.updateUserLimit(ko.mapping.toJSON(self.dataForPayloadSingle())).done(function () {
            rootParams.baseModel.showMessages(null, [self.nls.limitsInquiry.messages.limitsUpdated], "CONFIRMATION");
            self.showGraph(false);
            ko.tasks.runEarly();
            self.showGraph(true);
            ko.tasks.runEarly();
          });
        } else {
          MyLimitModel.createCustomLimitPackages(ko.mapping.toJSON(self.payload())).done(function (data) {
            rootParams.baseModel.showMessages(null, [self.nls.limitsInquiry.messages.limitsUpdated], "CONFIRMATION");
            self.dataForPayloadSingle(data.limitPackageDTO);
            self.showGraph(false);
            ko.tasks.runEarly();
            self.showGraph(true);
            ko.tasks.runEarly();
            self.customPackageFlagforSingle(true);
          });
        }
      } else if (self.payload().accessPointGroupType === "GROUP") {
        if (self.customPackageFlagforGroup()) {
          MyLimitModel.updateUserLimit(ko.mapping.toJSON(self.dataForPayloadGroup())).done(function () {
            rootParams.baseModel.showMessages(null, [self.nls.limitsInquiry.messages.limitsUpdated], "CONFIRMATION");
            self.showGraph(false);
            ko.tasks.runEarly();
            self.showGraph(true);
            ko.tasks.runEarly();
          });
        } else {
          MyLimitModel.createCustomLimitPackages(ko.mapping.toJSON(self.payload())).done(function (data) {
            rootParams.baseModel.showMessages(null, [self.nls.limitsInquiry.messages.limitsUpdated], "CONFIRMATION");
            self.dataForPayloadGroup(data.limitPackageDTO);
            self.showGraph(false);
            ko.tasks.runEarly();
            self.showGraph(true);
            ko.tasks.runEarly();
            self.customPackageFlagforGroup(true);
          });
        }
      } else if (self.payload().accessPointGroupType === "GLOBAL") {
        if (self.customPackageFlagforGlobal()) {
          MyLimitModel.updateUserLimit(ko.mapping.toJSON(self.dataForPayloadGlobal())).done(function () {
            rootParams.baseModel.showMessages(null, [self.nls.limitsInquiry.messages.limitsUpdated], "CONFIRMATION");
            self.showGraph(false);
            ko.tasks.runEarly();
            self.showGraph(true);
            ko.tasks.runEarly();
          });
        } else {
          MyLimitModel.createCustomLimitPackages(ko.mapping.toJSON(self.payload())).done(function (data) {
            rootParams.baseModel.showMessages(null, [self.nls.limitsInquiry.messages.limitsUpdated], "CONFIRMATION");
            self.dataForPayloadGlobal(data.limitPackageDTO);
            self.showGraph(false);
            ko.tasks.runEarly();
            self.showGraph(true);
            ko.tasks.runEarly();
            self.customPackageFlagforGlobal(true);
          });
        }
      }
    };

    self.closeSwitchDialog = function () {
      $("#confirmDialog").hide();
    };
  };
});