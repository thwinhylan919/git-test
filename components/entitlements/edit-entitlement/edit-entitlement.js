define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",

  "ojL10n!resources/nls/authorization",
  "ojs/ojcheckboxset",
  "ojs/ojselectcombobox",
  "ojs/ojnavigationlist",
  "promise"
], function(oj, ko, $, EntitlementEditModel, resourceBundle) {
  "use strict";

  return function(rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    self.nls = resourceBundle;
    rootParams.baseModel.registerElement("nav-bar");
    rootParams.baseModel.registerComponent("review-edit-entitlement", "entitlements");
    rootParams.baseModel.registerComponent("entitlements-base", "entitlements");
    rootParams.dashboard.headerName(self.nls.headings.entitlement);
    self.editData = ko.observableArray(self.params.data);
    self.menuSelection = ko.observable(self.params.data[0].entitlementId.split( "_" )[ self.params.data[0].entitlementId.split( "_" ).length - 1 ]);
    self.entitleName = ko.observable(self.params.data[0].entitlementName);
    self.menuOptions = ko.observableArray();
    self.module = ko.observable(self.params.module);
    self.category = ko.observable(self.params.category);
    self.resourceList = ko.observableArray();
    self.selectedResourceType = ko.observable("SVC");
    self.selectedResources = ko.observableArray();
    self.resourceLoaded = ko.observable(false);
    self.isResourcesFetched = ko.observable(false);
    self.resourcesSVC = ko.observableArray();
    self.resourcesUCN = ko.observableArray();
    self.addedResources = ko.observable();
    self.statusDatasource = null;

    const entitlementMap = {};
    let resourceListPRM = [],
      resourceListAPR = [],
      resourceListVIW = [],
      resourceListUIPRM = [],
      resourceListUIAPR = [],
      resourceListUIVIW = [];
    const batchRequest = [];
    let resPresent = 0;

    /** This function remove.
     *
     * @memberOf edit-entitlement
     * @function remove
     * @param {Object} array   - Base array.
     * @param {Object} array2   - Deletion array.
     *  @returns {void}
     */
    function remove(array, array2) {
      return array.filter(function(ele) {
        return array2.indexOf(ele) === -1;
      });
    }

    self.uiOptions = {
      menuFloat: "right",
      fullWidth: false,
      defaultOption: self.menuSelection
    };

    for (let k = 0; k < self.editData().length; k++) {
      self.menuOptions.push({
        id: self.editData()[k].entitlementId.split("_")[1],
        label: self.editData()[k].entitlementId.split("_")[1]
      });
    }

    EntitlementEditModel.fetchResourceName().done(function(data) {
      if (data.resources) {
        for (let i = 0; i < data.resources.length; i++) {
          if (data.resources[i].resourceType === "SVC") {
            self.resourcesSVC().push({
              text: data.resources[i].resourceName,
              value: data.resources[i].resourceName
            });

            self.isResourcesFetched(true);
          } else if (data.resources[i].resourceType === "UCN") {
            self.resourcesUCN().push({
              text: data.resources[i].resourceName,
              value: data.resources[i].resourceName
            });

            self.isResourcesFetched(true);
          }
        }
      }
    });

    let i = 1;

    if (self.params.loaded === 0) {
      ko.utils.arrayForEach(self.editData(), function(item) {
        const actionType = item.entitlementId.split("_")[1];

        ko.utils.arrayForEach(item.resourceDTOs, function(item1) {
          if (item1.resourceType === "SVC") {
            if (actionType === "Perform") {
              entitlementMap.PRM = i;

              resourceListPRM.push({
                id: item1.resourceName,
                text: item1.resourceName
              });
            } else if (actionType === "View") {
              entitlementMap.VIW = i;

              resourceListVIW.push({
                id: item1.resourceName,
                text: item1.resourceName
              });
            } else {
              entitlementMap.APR = i;

              resourceListAPR.push({
                id: item1.resourceName,
                text: item1.resourceName
              });
            }
          } else if (item1.resourceType === "UCN") {
            if (actionType === "Perform") {
              entitlementMap.PRM = i;

              resourceListUIPRM.push({
                id: item1.resourceName,
                text: item1.resourceName
              });
            } else if (actionType === "View") {
              entitlementMap.VIW = i;

              resourceListUIVIW.push({
                id: item1.resourceName,
                text: item1.resourceName
              });
            } else {
              entitlementMap.APR = i;

              resourceListUIAPR.push({
                id: item1.resourceName,
                text: item1.resourceName
              });
            }
          }

          if (entitlementMap.PRM === 1)
            {self.resourceList(resourceListPRM);}
          else if (entitlementMap.APR === 1)
            {self.resourceList(resourceListAPR);}
          else
            {self.resourceList(resourceListVIW);}

          self.resourceLoaded(true);
        });

        i++;
      });
    } else {
      resourceListVIW = self.params.resourceListVIW;
      resourceListPRM = self.params.resourceListPRM;
      resourceListAPR = self.params.resourceListAPR;
      resourceListUIVIW = self.params.resourceListUIVIW;
      resourceListUIPRM = self.params.resourceListUIPRM;
      resourceListUIAPR = self.params.resourceListUIAPR;
      entitlementMap.APR = self.params.apr;
      entitlementMap.VIW = self.params.viw;
      entitlementMap.PRM = self.params.prm;

      if (entitlementMap.PRM === 1)
        {self.resourceList(resourceListPRM);}
      else if (entitlementMap.APR === 1)
        {self.resourceList(resourceListAPR);}
      else
        {self.resourceList(resourceListVIW);}

      self.resourceLoaded(true);
    }

    self.buttonChange = function(event) {
      self.resourceList([]);
      self.selectedResources([]);
      self.resourceLoaded(false);
      ko.tasks.runEarly();

      if (event.detail.value === "SVC") {
        self.resourceList(resourceListPRM);
      } else {
        self.resourceList(resourceListUIPRM);
      }

      self.menuSelection("Perform");
      self.resourceLoaded(true);
    };

    const menuSelectionSubscription = self.menuSelection.subscribe(function(newValue) {
      self.selectedResources([]);
      self.resourceList([]);
      self.resourceLoaded(false);
      ko.tasks.runEarly();

      if (self.selectedResourceType() === "SVC") {
        if (newValue === "Perform") {
          self.resourceList(resourceListPRM);
        } else if (newValue === "View") {
          self.resourceList(resourceListVIW);
        } else {
          self.resourceList(resourceListAPR);
        }
      } else if (self.selectedResourceType() === "UCN") {
        if (newValue === "Perform") {
          self.resourceList(resourceListUIPRM);
        } else if (newValue === "View") {
          self.resourceList(resourceListUIVIW);
        } else {
          self.resourceList(resourceListUIAPR);
        }
      }

      self.resourceLoaded(true);
      ko.tasks.runEarly();
    });

    self.dispose = function() {
      menuSelectionSubscription.dispose();
    };

    self.deleteResourceClicked = function() {
      if(self.selectedResources().length>0){
        $("#deleteConfirmationModal").trigger("openModal");
      }
    };

    self.deleteResource = function() {
      self.resourceList([]);
      self.resourceLoaded(false);
      ko.tasks.runEarly();
      resourceListPRM = remove(resourceListPRM, self.selectedResources());

      if (self.selectedResourceType() === "SVC") {
        if (self.menuSelection() === "Perform") {
          resourceListPRM = remove(resourceListPRM, self.selectedResources());
          self.resourceList(resourceListPRM);
        } else if (self.menuSelection() === "Approve") {
          resourceListAPR = remove(resourceListAPR, self.selectedResources());
          self.resourceList(resourceListAPR);
        } else {
          resourceListVIW = remove(resourceListVIW, self.selectedResources());
          self.resourceList(resourceListVIW);
        }
      } else if (self.selectedResourceType() === "UCN") {
        if (self.menuSelection() === "Perform") {
          resourceListUIPRM = remove(resourceListUIPRM, self.selectedResources());
          self.resourceList(resourceListUIPRM);
        } else if (self.menuSelection() === "View") {
          resourceListUIVIW = remove(resourceListUIVIW, self.selectedResources());
          self.resourceList(resourceListUIVIW);
        } else {
          resourceListUIAPR = remove(resourceListUIAPR, self.selectedResources());
          self.resourceList(resourceListUIAPR);
        }
      }

      self.resourceLoaded(true);
      self.selectedResources([]);
      $("#deleteConfirmationModal").hide();
      ko.tasks.runEarly();
    };

    self.hideModal = function() {
      $("#deleteConfirmationModal").hide();
    };

    self.addResources = function() {
      if (self.addedResources() !== undefined && self.addedResources() !=="") {
        resPresent = 0;

        if(self.resourceList().indexOf(self.addedResources()) >=0 ){
          resPresent++;
        }

        if (resPresent === 0) {
          self.resourceList([]);
          self.resourceLoaded(false);
          ko.tasks.runEarly();

          if (self.selectedResourceType() === "SVC") {
            if (self.menuSelection() === "Perform") {
              resourceListPRM.push({
                id: self.addedResources(),
                text: self.addedResources()
              });

              self.resourceList(resourceListPRM);
            } else if (self.menuSelection() === "Approve") {
              resourceListAPR.push({
                id: self.addedResources(),
                text: self.addedResources()
              });

              self.resourceList(resourceListAPR);
            } else {
              resourceListVIW.push({
                id: self.addedResources(),
                text: self.addedResources()
              });

              self.resourceList(resourceListVIW);
            }
          } else if (self.selectedResourceType() === "UCN") {
            if (self.menuSelection() === "Perform") {
              resourceListUIPRM.push({
                id: self.addedResources(),
                text: self.addedResources()
              });

              self.resourceList(resourceListUIPRM);
            } else if (self.menuSelection() === "View") {
              resourceListUIVIW.push({
                id: self.addedResources(),
                text: self.addedResources()
              });

              self.resourceList(resourceListUIVIW);
            } else {
              resourceListUIAPR.push({
                id: self.addedResources(),
                text: self.addedResources()
              });

              self.resourceList(resourceListUIAPR);
            }
          }

          self.resourceLoaded(true);
          ko.tasks.runEarly();
        } else {
          rootParams.baseModel.showMessages(null, [self.nls.information.resourcePresent], "INFO");
        }

      self.addedResources("");
      } else {
        rootParams.baseModel.showMessages(null, [self.nls.information.noRes], "INFO");
      }
    };

    self.createBatchData = function(resourceList, indexOfActionType, action) {
      let payload = {};

      if (indexOfActionType) {
        indexOfActionType--;
        payload.version = self.editData()[indexOfActionType].version;
        payload.entitlementId = self.editData()[indexOfActionType].entitlementId;
        payload.entitlementName = self.editData()[indexOfActionType].entitlementName;
        payload.entitlementDisplayName = self.editData()[indexOfActionType].entitlementDisplayName;
        payload.entitlementDescription = self.editData()[indexOfActionType].entitlementDescription;
        payload.resourceDTOs = [];

        for (let i = 0; i < resourceList.length; i++) {
          const resource = {
            resourceName: resourceList[i].text,
            actionTypes: [action]
          };

          payload.resourceDTOs.push(resource);
        }

        payload = ko.toJSON(payload);

        batchRequest.push({
          methodType: "PUT",
          uri: {
            value: "/entitlements/{id}",
            params: {
              id: self.editData()[indexOfActionType].entitlementId
            }
          },
          payload: payload,
          headers: {
            "Content-Id": indexOfActionType,
            "Content-Type": "application/json"
          }
        });
      }
    };

    self.confirm = function() {
      self.createBatchData(resourceListAPR.concat(resourceListUIAPR), entitlementMap.APR, "APR");
      self.createBatchData(resourceListPRM.concat(resourceListUIPRM), entitlementMap.PRM, "PRM");
      self.createBatchData(resourceListVIW.concat(resourceListUIVIW), entitlementMap.VIW, "VIW");

      EntitlementEditModel.fireBatch({
        batchDetailRequestList: batchRequest
      }).done(function(data, status, jqXhr) {
        const statusArray = [];
        let isFailure = null,
          isSuccess = null;

        for (i = 0; i < data.batchDetailResponseDTOList.length; i++) {
          const transaction = {},
            index = data.batchDetailResponseDTOList[i].sequenceId,
            responseObj = data.batchDetailResponseDTOList[i].responseObj;

          transaction.id = index;
          transaction.name = self.editData()[index].entitlementName +"-"+ self.editData()[index].entitlementId.split("_")[1];

          if (data.batchDetailResponseDTOList[i].status !== 200) {
            transaction.status = "dashboard/cancellation.svg";
            isFailure = index;
          } else {
            transaction.status = "dashboard/confirmation.svg";
            isSuccess = index;
          }

          transaction.reason = responseObj.status ? responseObj.status.message.detail : null || (responseObj.message && responseObj.message.validationError ? responseObj.message.validationError[0].errorMessage : responseObj.message ? responseObj.message.title || responseObj.message.detail : responseObj.status.result);

          if (!transaction.reason) {transaction.reason = self.nls.common.completed;}

          statusArray.push(transaction);
        }

        const statusDatasource = new oj.ArrayTableDataSource(statusArray, {
          idAttribute: "id"
        });

        rootParams.dashboard.loadComponent("confirm-screen", {
          jqXHR: jqXhr,
          transactionName: self.nls.headings.entitlement,
          confirmScreenExtensions: {
            confirmScreenMsgEval: function(data) {
              if (isFailure && data.sequenceId === isFailure) {
                return self.nls.entitlement.error;
              } else if (!isFailure && data.sequenceId === isSuccess) {
                return self.nls.entitlement.success;
              }

              return null;
            },
            isSet: true,
            template: "confirm-screen/entitlement",
            data: statusDatasource,
            resourceBundle: resourceBundle
          }
        }, self);
      });
    };

    self.save = function() {
      const params = {
        resourceListVIW: resourceListVIW,
        resourceListPRM: resourceListPRM,
        resourceListAPR: resourceListAPR,
        resourceListUIVIW: resourceListUIVIW,
        resourceListUIPRM: resourceListUIPRM,
        resourceListUIAPR: resourceListUIAPR,
        apr: entitlementMap.APR,
        viw: entitlementMap.VIW,
        prm: entitlementMap.PRM,
        category: self.category(),
        module: self.module(),
        entdispName: self.entitleName(),
        confirm: self.confirm,
        data: self.editData(),
        menuOptions: self.menuOptions
      };

      rootParams.dashboard.loadComponent("review-edit-entitlement", params);
    };

    self.back = function() {
      rootParams.dashboard.loadComponent("entitlements-base", {});
    };
  };
});
