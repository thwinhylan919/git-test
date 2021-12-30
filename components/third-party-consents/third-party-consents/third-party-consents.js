define([

  "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/third-party-consents",
  "promise",
  "ojs/ojinputtext",
  "ojs/ojbutton",
  "ojs/ojtable",
  "ojs/ojdialog",
  "ojs/ojlistview",
  "ojs/ojpagingcontrol",
  "ojs/ojcollapsible",
  "ojs/ojswitch",
  "ojs/ojnavigationlist"
], function(ko, $, ThirdPartyConsentModel, resourceBundle, Promise) {
  "use strict";

  return function(params) {
    const self = this;

    ko.utils.extend(self, params.rootModel);
    self.nls = resourceBundle;
    self.accessPointTabs = [];
    self.selectedAccessPointTab = ko.observable();
    self.dataLoaded = ko.observable(false);
    self.applicationAccess = ko.observable(true);
    self.accessPointNotFound = ko.observable(false);
    self.displayAccounts = ko.observable(true);
    self.displayAccessPoints = ko.observable(true);
    $("#optionset").css("display", "block");

    self.applicationAccessStatus = ko.computed(function() {
      if (self.applicationAccess())
        {return self.nls.labels.granted;}

      return self.nls.labels.revoked;
    });

    self.disabled = ko.observable(true);
    self.accountTabLoaded = ko.observable(false);
    self.accountTab = ko.observableArray([]);
    self.accessPointSetupExists = ko.observable(false);
    self.confirmScreen = ko.observable(false);
    self.selectedAccountTab = ko.observable();
    self.prevAccountTab = "";
    params.baseModel.registerElement("confirm-screen");
    params.baseModel.registerElement("page-section");
    params.dashboard.headerName(self.nls.labels.headerName);
    params.baseModel.registerElement("nav-bar");
    self.selectedAccessPointName = ko.observable();
    self.httpStatus = ko.observable();
    self.transactionStatus = ko.observable();

    let payload = [],
      userPreferencePayload = {};

    self.dataSource = {};
    self.accounts = {};
    self.accountTypes = ["CSA", "TRD", "LON"];
    self.reviewTransactionName = {};
    self.reviewTransactionName.header = self.nls.generic.common.review;
    self.reviewTransactionName.reviewHeader = self.nls.labels.confirmMessage;

    self.accessPointUIOptions = {
      fullWidth:false,
      defaultOption: self.selectedAccessPointTab

    };

    if (params.baseModel.small()) {
      self.accessPointUIOptions.type = "start";
    }

    const accessPointDispose = self.selectedAccessPointTab.subscribe(function(currentTabId) {
      self.selectedAccessPointTab(currentTabId);
      self.selectedAccessPointName(currentTabId);

      ko.utils.arrayForEach(self.accountTypes, function(accountType) {
        if (self.dataSource[accountType])
          {self.dataSource[accountType].accountAccessId = null;}
      });

      self.accessPointSetupExists(false);
      self.accountTab([]);
      self.setAccessPointSetup();
      self.accountTabLoaded(false);
      self.confirmScreen(false);

      const tempArray = ko.utils.arrayFilter(self.accessPointTabs, function(accessPoint) {
        return accessPoint.id === self.selectedAccessPointTab();
      });

      self.applicationAccess(tempArray[0].status);
      self.disabled(true);

      if (params.baseModel.small()) {
        self.displayAccounts(true);
        self.displayAccessPoints(false);
      }
    });

    if (params.baseModel.small()) {
      self.displayAccounts(false);
      self.displayAccessPoints(true);
    }

    params.baseModel.registerComponent("account-access", "third-party-consents");

    const getNewKoModel = function() {
        const KoModel = ThirdPartyConsentModel.getNewModel();

        return ko.mapping.fromJS(KoModel);
      },
      accessPointPromise = new Promise(function(resolve) {
        ThirdPartyConsentModel.fetchPreferences().then(function(data) {
          const batchRequestDetails = [];

          delete data.status;
          userPreferencePayload = data;

          ko.utils.arrayForEach(data.userAccessPointRelationship, function(relation) {
            const newObj = {
              id: relation.accessPointId,
              status: relation.status
            };

            self.accessPointTabs.push(newObj);

            batchRequestDetails.push({
              methodType: "GET",
              uri: {
                value: "/accessPoints/{accessPointId}",
                params: {
                  accessPointId: relation.accessPointId
                }
              },
              headers: {
                "Content-Id": relation.accessPointId,
                "Content-Type": "application/json"
              }
            });
          });

          ThirdPartyConsentModel.fireBatch({
            batchDetailRequestList: batchRequestDetails
          }).then(function(data) {
            const tempArray = [];

            ko.utils.arrayForEach(data.batchDetailResponseDTOList, function(object) {
              const filter = JSON.parse(object.responseText).accessPointDTO;

              for (let i = 0; i < self.accessPointTabs.length; i++) {
                if (filter.id === self.accessPointTabs[i].id && filter.type === "EXT") {
                  const newObj = {};

                  newObj.name = filter.description;
                  newObj.contentId = filter.imgRefno.value;
                  newObj.id = filter.id;
                  newObj.status = self.accessPointTabs[i].status;
                  tempArray.push(newObj);
                }
              }
            });

            self.accessPointTabs = tempArray;

            if (self.accessPointTabs.length < 1) {
              self.accessPointNotFound(true);
            }

            if (params.baseModel.large())
              {self.selectedAccessPointTab(self.accessPointTabs[0].id);}

            self.applicationAccess(self.accessPointTabs[0].status);
            self.fetchLogo(resolve);
          });
        });
      });

    self.fetchLogo = function(resolve) {
      const batchRequestDetails = [];

      ko.utils.arrayForEach(self.accessPointTabs, function(tab) {
        if (tab.contentId) {
          batchRequestDetails.push({
            methodType: "GET",
            uri: {
              value: "/contents/{contentId}",
              params: {
                contentId: tab.contentId
              }
            },
            headers: {
              "Content-Id": tab.contentId,
              "Content-Type": "application/json"
            }
          });
        }
      });

      if (batchRequestDetails.length > 0) {
        ThirdPartyConsentModel.fireBatch({
          batchDetailRequestList: batchRequestDetails
        }).then(function(data) {
          ko.utils.arrayForEach(data.batchDetailResponseDTOList, function(object) {
            const filter = JSON.parse(object.responseText).contentDTOList[0];

            ko.utils.arrayForEach(self.accessPointTabs, function(tab) {
              if (tab.contentId === filter.contentId.value) {
                tab.imageSrc = "data:" + $.parseHTML(filter.mimeType)[0].data + ";base64," + filter.content;
                tab.imageStyle = "third-party-consents__access-point-logo";
              }
            });
          });

          resolve();
        });
      }
    };

    self.setAccessPointSetup = function() {
      ThirdPartyConsentModel.fetchAccounts(self.selectedAccessPointTab()).then(function(data) {
        let fetchedAccounts = null;

        if (data.accounts) {
          fetchedAccounts = data.accounts[0];
        } else {
          fetchedAccounts = data.responseJSON.accounts[0];
        }

        ko.utils.arrayForEach(self.accountTypes, function(filter) {
          const tempArray = ko.utils.arrayFilter(fetchedAccounts.accountsList, function(account) {
              return account.accountType === filter;
            }),
            newObj = {
              id: filter
            };

          self.accounts[filter] = {
            accountList: tempArray
          };

          if (filter === "CSA") {
            newObj.name = self.nls.labels.currentAndSavings;
          } else if (filter === "TRD") {
            newObj.name = self.nls.labels.termDeposits;
          } else if (filter === "LON") {
            newObj.name = self.nls.labels.loan;
          }

          self.accountTab().push(newObj);
        });

        self.selectedAccountTab(self.accountTab()[0].id);
        self.prevAccountTab = self.selectedAccountTab();

        if (fetchedAccounts.setupInformation === "SETUP_EXISTS" && fetchedAccounts.accessLevel === "ACCESSPOINT") {
          self.accessPointSetupExists(true);

          ThirdPartyConsentModel.fetchSetup(self.selectedAccessPointTab()).then(function(data) {
            ko.utils.arrayForEach(data.accessPointAccountDTOs, function(accountAccess) {
              self.accounts[accountAccess.accountType].accountAcceessId = accountAccess.accountAccessId;

              ko.utils.arrayForEach(accountAccess.accountExclusionDTOs, function(exclusionDTO) {
                for (let i = 0; i < self.accounts[accountAccess.accountType].accountList.length; i++) {
                  const accountNumber = self.accounts[accountAccess.accountType].accountList[i].accountNumber.value;

                  if (accountNumber === exclusionDTO.accountNumber.value) {
                    self.accounts[accountAccess.accountType].accountList[i].accountExclusionId = exclusionDTO.accountExclusionId;
                  }
                }
              });
            });

            if (self.accessPointSetupExists())
              {self.accountTabLoaded(true);}
          });
        }

        self.dataLoaded(true);

        if (!self.accessPointSetupExists())
          {self.accountTabLoaded(true);}
      });
    };

    Promise.all([accessPointPromise]).then(function() {
      if (params.baseModel.large())
        {self.setAccessPointSetup();}
      else
        {self.dataLoaded(true);}
    });

    self.preparePayload = function() {
      payload = [];

      let currentDatasourceObject;

for(currentDatasourceObject in self.dataSource) {
        if (Object.prototype.hasOwnProperty.call(self.dataSource, currentDatasourceObject)) {
          const thirdPartyInstance = getNewKoModel().accountAccessModel;

          thirdPartyInstance.accessPointId(self.selectedAccessPointTab());
          thirdPartyInstance.accountType(currentDatasourceObject);
          thirdPartyInstance.accessLevel("ACCESSPOINT");
          thirdPartyInstance.accessStatus(false);
          thirdPartyInstance.accountAccessId(self.dataSource[currentDatasourceObject].accountAccessId);

          const accountArray = ko.utils.arrayFilter(self.dataSource[currentDatasourceObject].accounts, function(accounts) {
            return accounts.checked().length > 0;
          });

          ko.utils.arrayForEach(accountArray, function(account) {
            const accountExclusionDTO = {
              accountNumber: account.accountNumber,
              taskIds: [],
              accountExclusionId: account.accountExclusionId
            };

            ko.utils.arrayForEach(account.tasks(), function(task) {
              const childTaskArray = ko.utils.arrayFilter(task.childTasks(), function(childTask) {
                return childTask.checked().length > 0;
              });

              ko.utils.arrayForEach(childTaskArray, function(childTask) {
                accountExclusionDTO.taskIds.push(childTask.id);
              });
            });

            thirdPartyInstance.accountExclusionDTOs().push(accountExclusionDTO);
          });

          payload.push(thirdPartyInstance);
        }
      }
    };

    self.prepareUserPreferencePayload = function() {
      for (let i = 0; i < userPreferencePayload.userAccessPointRelationship.length; i++) {
        if (userPreferencePayload.userAccessPointRelationship[i].accessPointId === self.selectedAccessPointTab()) {
          userPreferencePayload.userAccessPointRelationship[i].status = self.applicationAccess();
          break;
        }
      }
    };

    self.back = function() {
      self.disabled(true);
    };

    self.confirm = function() {
      self.preparePayload();
      self.prepareUserPreferencePayload();

      let methodType = "POST",
        transactionName = self.nls.labels.createThirdPartyConsent;

      if (self.accessPointSetupExists()) {
        methodType = "PUT";
        transactionName = self.nls.labels.updateThirdPartyConsent;
      }

      const batchRequestDetails = [];

      batchRequestDetails.push({
        methodType: "PUT",
        uri: {
          value: "/me/preferences"
        },
        payload: JSON.stringify(userPreferencePayload),
        headers: {
          "Content-Id": 0,
          "Content-Type": "application/json"
        }
      });

      if (self.applicationAccess()) {
        batchRequestDetails.push({
          methodType: methodType,
          uri: {
            value: "/me/accessPointAccount"
          },
          payload: ko.toJSON({
            accessPointAccountDTOs: payload
          }),
          headers: {
            "Content-Id": 1,
            "Content-Type": "application/json"
          }
        });
      }

      ThirdPartyConsentModel.fireBatch({
        batchDetailRequestList: batchRequestDetails
      }).then(function(data, status, jqXhr) {
        self.httpStatus(jqXhr.status);
        self.transactionStatus(data.status);

        const confirmScreenDetailsArray = [{
          label: self.nls.labels.statusLabel,
          value: self.nls.status.success
        }, {
          label: self.nls.labels.message,
          value: self.nls.messages.successMessage
        }];

        params.dashboard.loadComponent("confirm-screen", {
          jqXHR: jqXhr,
          transactionName: transactionName,
          confirmScreenExtensions: {
            successMessage: self.nls.messages.successMessage,
            isSet: true,
            confirmScreenDetails: confirmScreenDetailsArray,
            eReceiptRequired: false,
            template: "confirm-screen/third-party-consents"
          }
        }, self);
      });
    };

    self.editAccountAccess = function() {
      self.disabled(false);
      self.confirmScreen(false);
    };

    self.saveAccountAccess = function() {
      self.disabled(true);
      self.confirmScreen(true);
    };

    self.dispose = function() {
      self.applicationAccessStatus.dispose();
      accessPointDispose.dispose();
    };
  };
});