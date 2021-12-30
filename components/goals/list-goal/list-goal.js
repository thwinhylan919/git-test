define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/list-goal",
  "ojs/ojlistview",
  "ojs/ojarraytabledatasource",
  "ojs/ojknockout-validation",
  "ojs/ojbutton"
], function(oj, ko, $, PFMmodel, ResourceBundle) {
  "use strict";

  return function(Params) {
    const self = this,
      contentMap = {};

    ko.utils.extend(self, Params.rootModel);
    self.resource = ResourceBundle;
    self.isActive = self.params.isActive === "No" ? ko.observable(false) : ko.observable(true) ;
    self.goalsDatasource = null;
    self.tempGoalData = ko.observable();
    self.selectedMenuItem = ko.observable();
    self.loadGoals = ko.observable(false);
    self.finalAmountRedeemed = ko.observable();
    self.goalsDatasourceForCreate = ko.observable(null);
    Params.baseModel.registerComponent("manage-goal", "goals");
    Params.baseModel.registerComponent("closed-goal", "goals");
    Params.baseModel.registerComponent("goal-data-card", "goals");
    Params.baseModel.registerComponent("goal-category-select", "goals");
    Params.baseModel.registerComponent("percentage-graph", "personal-finance-management");
    Params.baseModel.registerElement("floating-panel");

    if (!Params.dashboard.isDashboard()) {
      if (self.isActive()) {
        Params.dashboard.headerName(self.resource.common.header);
      } else {
        Params.dashboard.headerName(self.resource.common.closedheader);
      }
    }

    self.baseCurrency = ko.observable();

    self.backFromClosedGoals = function() {
      history.back();
    };

    self.viewClosedGoals = function() {
      Params.dashboard.loadComponent("closed-goal", {});
    };

    self.openGoalCalculator = function(calculationFlag) {
      Params.dashboard.loadComponent("goal-category-select", calculationFlag);
    };

    self.launcherId = "";

    self.openMenu = function(event) {
      const launcherId = event.currentTarget.attributes.id.nodeValue;

      self.launcherId = launcherId;

      const menuVisible = $("#" + launcherId + "-container")[0].style.display === "block";

      if (!menuVisible) {
        try {
          setTimeout(self.open, 0.1);
        } catch (e) {
          $("#" + launcherId + "-container")[0].style.display = "block";
        }
      } else {
        $("#" + launcherId + "-container")[0].style.display = "none";
      }
    };

    self.open = function() {
      $("#" + self.launcherId + "-container").ojMenu("open", event);
    };

    self.menuItemSelect = function(event, ui) {
      self.selectedMenuItem(ui.item[0].id);
    };

    self.showFloatingPanel = function() {
      $("#goalMenu")[0].dispatchEvent(new CustomEvent("openFloatingPanel"));
    };

    const payLoad = {
        batchDetailRequestList: []
      },
      barTooltip = document.createElement("div");

    self.goalTooltipCallback = function(dataContext) {
      const achieved = Params.baseModel.formatCurrency(Number(dataContext.label.replace(/[,]/g, "")), self.baseCurrency());

      if (achieved && achieved !== "") {
        require(["text!../partials/pfm/goals/goal-progress-tool-tip.html"], function(barTooltipLocal) {
          const tooltip = {
            title: Params.baseModel.format(self.resource.goals.achievedTitle, {
              value: achieved
            }),
            achievedTitle: Params.baseModel.format(self.resource.goals.achievedTitle, {
              value: achieved
            })
          };

          $(barTooltip).html(barTooltipLocal);
          ko.cleanNode(barTooltip);
          ko.applyBindings(tooltip, barTooltip);
        });

        return barTooltip;
      }
    };

    PFMmodel.fetchBankConfig().done(function(bankConfig) {
      self.baseCurrency(bankConfig.bankConfigurationDTO.localCurrency);

      if (self.isActive()) {
        PFMmodel.getGoalsList(Params.dashboard.isDashboard()).done(function(data) {
          if (data && data.goalDTO) {
            for (let i = 0; i < data.goalDTO.length; i++) {
              if ((data.goalDTO[i].contentId && data.goalDTO[i].contentId.value) || (data.goalDTO[i].categoryContentId && data.goalDTO[i].categoryContentId.value)) {
                let id;

                if (data.goalDTO[i].contentId && data.goalDTO[i].contentId.value) {
                  id = data.goalDTO[i].contentId.value;
                } else {
                  id = data.goalDTO[i].categoryContentId.value;
                }

                const contentURL = {
                    value: "/contents/{id}",
                    params: {
                      id: id
                    }
                  },
                  obj = {
                    methodType: "GET",
                    uri: contentURL,
                    headers: {
                      "Content-Id": i + 1,
                      "Content-Type": "application/json"
                    }
                  };

                payLoad.batchDetailRequestList.push(obj);
              }
            }

            if (data.goalDTO.length > 0) {
              PFMmodel.fireBatch(payLoad).done(function(batchData) {
                if (batchData && batchData.batchDetailResponseDTOList) {
                  for (let j = 0; j < batchData.batchDetailResponseDTOList.length; j++) {
                    const batchResponse = JSON.parse(batchData.batchDetailResponseDTOList[j].responseText);

                    if (batchResponse.contentDTOList) {
                      contentMap[batchResponse.contentDTOList[0].contentId.value] = batchResponse.contentDTOList[0].content;
                    }
                  }
                }

                for (let i = 0; i < data.goalDTO.length; i++) {
                  if ((data.goalDTO[i].contentId && data.goalDTO[i].contentId.value) || (data.goalDTO[i].categoryContentId && data.goalDTO[i].categoryContentId.value)) {
                    if (data.goalDTO[i].contentId && data.goalDTO[i].contentId.value) {
                      data.goalDTO[i].content = contentMap[data.goalDTO[i].contentId.value];
                    } else {
                      data.goalDTO[i].content = contentMap[data.goalDTO[i].categoryContentId.value];
                    }
                  }
                }

                const goaldata = data.goalDTO;

                self.tempGoalData(goaldata);

                const array = $.map(goaldata, function(u) {
                  if (u.targetAmount.amount !== 0) {
                    u.percentAchieved = (Math.round(u.availableBalance.amount / u.targetAmount.amount * 100 * 100) / 100).toFixed(2);
                  } else {
                    u.percentAchieved = 0;
                  }

                  const obj = {
                    id: u.id ? u.id : "-",
                    name: u.name ? u.name : "-",
                    subCategoryName: u.subCategoryName ? u.subCategoryName : "-",
                    categoryName: u.categoryName ? u.categoryName.toLowerCase() : "-",
                    percentAchieved: u.percentAchieved ? u.percentAchieved < 100 ? u.percentAchieved : 100 : "-",
                    maturityDate: u.tenure.date ? u.tenure.date : "-",
                    targetAmount: u.targetAmount.amount ? u.targetAmount.amount : "00.0",
                    content: u.content ? u.content : "-",
                    contentId: u.contentId ? u.contentId : "-",
                    data: u,
                    isActive: true,
                    urlForCard: u.categoryName ? "goals/categories/" + u.categoryName + ".png" : "-",
                    thresholdValues: [{
                        max: Math.round(u.targetAmount.amount / 2),
                        color: "#D54215"
                      },
                      {
                        color: "#2E7D32"
                      }
                    ]
                  };

                  return obj;
                });

                function SortByDate(a, b) {
                  const aName = a.maturityDate,
                    bName = b.maturityDate;

                  return aName < bName ? -1 : aName > bName ? 1 : 0;
                }

                array.sort(SortByDate);

                self.goalsDatasource = new oj.ArrayTableDataSource(array, {
                  idAttribute: "id"
                });

                self.loadGoals(true);
              });
            } else {
              self.goalsDatasource = new oj.ArrayTableDataSource([], {
                idAttribute: "id"
              });

              self.loadGoals(true);
            }
          }
        });
      } else {
        PFMmodel.getinActiveGoalsList().done(function(data) {
          const goaldata = data.goalDTO;

          if (data && data.goalDTO) {
            for (let i = 0; i < data.goalDTO.length; i++) {
              if ((data.goalDTO[i].contentId && data.goalDTO[i].contentId.value) || (data.goalDTO[i].categoryContentId && data.goalDTO[i].categoryContentId.value)) {
                let id;

                if (data.goalDTO[i].contentId && data.goalDTO[i].contentId.value) {
                  id = data.goalDTO[i].contentId.value;
                } else {
                  id = data.goalDTO[i].categoryContentId.value;
                }

                const contentURL = {
                    value: "/contents/{id}",
                    params: {
                      id: id
                    }
                  },
                  obj = {
                    methodType: "GET",
                    uri: contentURL,
                    headers: {
                      "Content-Id": i + 1,
                      "Content-Type": "application/json"
                    }
                  };

                payLoad.batchDetailRequestList.push(obj);
              }
            }

            if (data.goalDTO.length > 0) {
              PFMmodel.fireBatch(payLoad).done(function(batchData) {
                if (batchData && batchData.batchDetailResponseDTOList) {
                  for (let j = 0; j < batchData.batchDetailResponseDTOList.length; j++) {
                    const batchResponse = JSON.parse(batchData.batchDetailResponseDTOList[j].responseText);

                    if (batchResponse.contentDTOList) {
                      contentMap[batchResponse.contentDTOList[0].contentId.value] = batchResponse.contentDTOList[0].content;
                    }
                  }
                }

                for (let i = 0; i < data.goalDTO.length; i++) {
                  if ((data.goalDTO[i].contentId && data.goalDTO[i].contentId.value) || (data.goalDTO[i].categoryContentId && data.goalDTO[i].categoryContentId.value)) {
                    if (data.goalDTO[i].contentId && data.goalDTO[i].contentId.value) {
                      data.goalDTO[i].content = contentMap[data.goalDTO[i].contentId.value];
                    } else {
                      data.goalDTO[i].content = contentMap[data.goalDTO[i].categoryContentId.value];
                    }
                  }
                }

                self.tempGoalData(goaldata);

                const array = $.map(goaldata, function(u) {
                  if (u.targetAmount.amount !== 0) {
                    u.percentAchieved = (Math.round(u.closingAmount.amount / u.targetAmount.amount * 100 * 100) / 100).toFixed(2);
                  } else {
                    u.percentAchieved = 0;
                  }

                  const obj = {
                    id: u.id ? u.id : "-",
                    name: u.name ? u.name : "-",
                    subCategoryName: u.subCategoryName ? u.subCategoryName : "-",
                    categoryName: u.categoryName ? u.categoryName.toLowerCase() : "-",
                    percentAchieved: u.percentAchieved ? u.percentAchieved < 100 ? u.percentAchieved : 100 : "-",
                    closingAmount: u.closingAmount.amount ? u.closingAmount.amount : "0.00",
                    content: u.content ? u.content : "-",
                    closingDate: u.closingDate ? u.closingDate : "-",
                    data: u,
                    isActive: false
                  };

                  return obj;
                });

                function SortByDate(a, b) {
                  const aName = a.closingDate,
                    bName = b.closingDate;

                  return aName < bName ? -1 : aName > bName ? 1 : 0;
                }

                array.sort(SortByDate);

                self.goalsDatasource = new oj.ArrayTableDataSource(array, {
                  idAttribute: "id"
                });

                self.loadGoals(true);
              });
            } else {
              self.goalsDatasource = new oj.ArrayTableDataSource([], {
                idAttribute: "id"
              });

              self.loadGoals(true);
            }
          }
        });
      }
    });
  };
});