define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/review-virtual-entity",
  "ojs/ojbutton"
], function (oj, ko, $, VirtualEntityModel, resourceBundle) {
  "use strict";

  return function (params) {
    const self = this;
    let realEntityAddress = null;

    ko.utils.extend(self, params.rootModel || params.rootModel.previousState);
    self.resource = resourceBundle;
    self.fromReview = ko.observable(false);
    self.templateLoaded = ko.observableArray(false);
    params.dashboard.headerName(self.resource.title);
    params.baseModel.registerElement("confirm-screen");
    params.baseModel.registerElement("modal-window");
    params.baseModel.registerComponent("virtual-entity-create", "virtual-account-management");
    params.baseModel.registerTransaction("virtual-account", "virtual-account-management");
    params.baseModel.registerComponent("virtual-entity-information", "virtual-account-management");
    params.baseModel.registerComponent("virtual-entity-identification-details", "virtual-account-management");
    self.showViewFlag = ko.observable(params.rootModel.params.isViewFlag ? params.rootModel.params.isViewFlag : false);
    self.feedbackReviewHeader = ko.observable(true);
    self.viewHeader = ko.observable();
    self.realEntityAddress = ko.observable();
    self.reviewTemplate = ko.observable(true);
    self.transactionName = ko.observable();
    self.countryOptions = ko.observable();
    self.genderOptions = ko.observable();
    self.gender = ko.observable();
    self.nationality = ko.observable();
    self.countryOfIncorporation = ko.observable();
    self.correspondenceCountry = ko.observable();
    self.mailingCountry = ko.observable();
    self.identificationType = ko.observable();
    self.corporateType = ko.observable();
    self.preferredMode = ko.observable();
    self.keyId = params.rootModel.params.keyId;
    self.realCustomerNo = params.rootModel.params.realCustomerNo;
    self.realCustomerName = params.dashboard.userData.userProfile.accessibleEntityDTOs[0].partyName;
    self.recordStatus = ko.observable("C");
    self.viewMode = ko.observable(false);
    self.reviewMode = ko.observable(false);
    self.showAddLandlineLink = ko.observable();
    self.showAddWorkphoneLink = ko.observable();
    self.showDeleteLandlineLink = ko.observable();
    self.showDeleteWorkphoneLink = ko.observable();
    self.correspondenceAddress = ko.observableArray([]);
    self.mailingAddress = ko.observableArray([]);
    self.fromApproval = ko.observable();
    self.checkZeroBalance = ko.observable();
    self.checkboxFlag = ko.observable(!!params.rootModel.params.checkboxFlag);
    self.mailingCheckboxFlag = ko.observable(!!params.rootModel.params.mailingCheckboxFlag);
    self.corporateTypeOptions = ko.observableArray();
    self.identificationTypeList = ko.observableArray();
    self.identificationNo = ko.observable();
    self.identificationNoDisplay = ko.observable();
    self.individualNationalIdMasked = ko.observable();
    self.statementPreferences = ko.observable();
    self.frequency = ko.observable();
    self.dueOn = ko.observable();
    self.frequencyOptions = ko.observableArray();
    self.dueOnOptions = ko.observableArray();
    self.limit = "0";
    self.offset = "0";
    self.viewModel = null;

    VirtualEntityModel.getRealEntityAddress().then(function (data) {
      for (let i = 0; i < data.party.addresses.length; i++) {
        if (data.party.addresses[i].type.toLowerCase() === "pst") {
          realEntityAddress = data.party.addresses[i].postalAddress;
          break;
        }
      }
    });

    const copyFromModel = function (source, destination) {
        for (let key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            if (!Object.prototype.hasOwnProperty.call(destination, key)) {
              destination[key] = source[key];
            } else if (typeof source[key] === "object" && (destination[key] || destination[key] === 0)) {
              destination[key] = copyFromModel(source[key], destination[key]);
            } else if (!destination[key]) {
              destination[key] = source[key];
            }

            key = undefined;
          }
        }

        return destination;
      },
      afterViewModelCreated = function () {
        if (params.rootModel.params.editFromViewScreen) {
          self.editFromViewScreen = params.rootModel.params.editFromViewScreen;
          self.viewHeader(true);
          self.feedbackReviewHeader(false);
        }

        if (params.rootModel.params.data) {
          self.fromApproval(true);
          self.viewMode(false);
          self.reviewMode(false);
        } else {
          self.fromApproval(false);
        }

        VirtualEntityModel.fetchCountryList(self.limit, self.offset).then(function (data) {
          if (data.jsonNode && data.jsonNode.data && data.jsonNode.data.length > 0) {
            self.countryOptions(data.jsonNode.data);
          }

          if (params.rootModel.params.viewDTO || params.rootModel.params.reviewDTO || params.rootModel.params.data) {
            for (let i = 0; i < self.countryOptions().length; i++) {
              if (self.viewModel.entityType() === "I") {
                if (self.countryOptions()[i].countryCode === self.viewModel.individualDetails.nationality()) {
                  self.nationality(self.countryOptions()[i].description);
                }
              } else if (self.viewModel.entityType() === "C") {
                if (self.countryOptions()[i].countryCode === self.viewModel.corporateDetails.countryOfIncorporation()) {
                  self.countryOfIncorporation(self.countryOptions()[i].description);
                }
              }

              if (self.countryOptions()[i].countryCode === self.viewModel.address.country()) {
                self.correspondenceCountry(self.countryOptions()[i].description);
              }

              if (self.countryOptions()[i].countryCode === self.viewModel.mailingAddress.country()) {
                self.mailingCountry(self.countryOptions()[i].description);
              }
            }
          }
        });

        if (self.viewModel.entityType() === "I") {
          VirtualEntityModel.fetchGenderList().then(function (data) {
            if (data.enumRepresentations && data.enumRepresentations.length > 0 && data.enumRepresentations[0].data) {
              self.genderOptions(data.enumRepresentations[0].data);
            }

            for (let i = 0; i < self.genderOptions().length; i++) {
              if (self.genderOptions()[i].code === self.viewModel.individualDetails.gender()) {
                self.gender(self.genderOptions()[i].description);
                break;
              }
            }
          });
        }

        VirtualEntityModel.fetchIdentificationTypeList().then(function (data) {
          if (data.jsonNode && data.jsonNode.data.length > 0 && data.jsonNode.data) {
            self.identificationTypeList(data.jsonNode.data);

            if (self.viewModel.identificationType()) {
              for (let j = 0; j < self.identificationTypeList().length; j++) {
                if (self.identificationTypeList()[j].identificationType === self.viewModel.identificationType()) {
                  self.identificationType(self.identificationTypeList()[j].description);
                }
              }
            } else {
              self.identificationType(null);
            }
          }
        });

        self.corporateTypes = function () {

          const corporateTypesResponse = [{
              code: "C",
              description: self.resource.corporation
            },
            {
              code: "CO",
              description: self.resource.cooperative
            },
            {
              code: "P",
              description: self.resource.partnership
            },
            {
              code: "SP",
              description: self.resource.soleProprietorship
            }
          ];

          for (let i = 0; i < corporateTypesResponse.length; i++) {
            self.corporateTypeOptions.push({
              code: corporateTypesResponse[i].code,
              description: corporateTypesResponse[i].description
            });
          }

          if (self.viewModel.entityType() === "C") {
            for (let i = 0; i < self.corporateTypeOptions().length; i++) {
              if (self.corporateTypeOptions()[i].code === self.viewModel.corporateDetails.type()) {
                self.corporateType(self.corporateTypeOptions()[i].description);
                break;
              }
            }
          }

        };

        self.corporateTypes();

        self.displayDueOn = function (selectedDueOnCode) {

          if (selectedDueOnCode === "W") {
            const listOfDays = oj.LocaleData.getDayNames();

            listOfDays.push(listOfDays.shift());
            self.dueOn(listOfDays[self.viewModel.statementPreferences.dueOn() - 1]);
          } else if (selectedDueOnCode === "Y") {
            const listOfMonths = oj.LocaleData.getMonthNames();

            self.dueOn(listOfMonths[self.viewModel.statementPreferences.dueOn() - 1]);
          } else {
            self.dueOn(self.viewModel.statementPreferences.dueOn());
          }

        };

        self.frequencyTypes = function () {

          const frequencyTypesResponse = [{
              code: "D",
              description: self.resource.daily
            }, {
              code: "W",
              description: self.resource.weekly
            }, {
              code: "M",
              description: self.resource.monthly
            },
            {
              code: "Q",
              description: self.resource.quarterly
            },
            {
              code: "H",
              description: self.resource.halfYearly
            },
            {
              code: "Y",
              description: self.resource.yearly
            }
          ];

          for (let i = 0; i < frequencyTypesResponse.length; i++) {
            self.frequencyOptions.push({
              code: frequencyTypesResponse[i].code,
              description: frequencyTypesResponse[i].description
            });
          }

          for (let j = 0; j < self.frequencyOptions().length; j++) {
            if (self.frequencyOptions()[j].code === self.viewModel.statementPreferences.frequency()) {
              self.frequency(self.frequencyOptions()[j].description);
              self.displayDueOn(self.frequencyOptions()[j].code);
            }
          }

        };

        self.frequencyTypes();

        if (self.viewModel.statementPreferences.statementType()) {
          self.statementPreferences(self.viewModel.statementPreferences.statementType() === "C" ? self.resource.consolidated : self.resource.accountLevel);
        }

        if (self.viewModel.entityType() === "C") {
          self.preferredMode(self.viewModel.corporateDetails.preferredModeOfCommunication() === "M" ? self.resource.mobile : self.resource.email);
        } else {
          self.preferredMode(self.viewModel.individualDetails.preferredModeOfCommunication() === "M" ? self.resource.mobile : self.resource.email);
        }

        self.componentsToLoad = [{
            label: self.resource.entityInformation,
            id: "virtual-entity-information"
          },
          {
            label: self.resource.otherDetails,
            id: "virtual-entity-identification-details"
          }
        ];

        self.backToCreate = function () {
          params.dashboard.loadComponent("virtual-entity-create", {
            viewDTO: params.rootModel.params.viewDTO,
            reviewTemplate: false,
            reviewToCreate: true
          });
        };

        self.edit = function (event) {
          self.reviewTemplate(false);

          params.dashboard.loadComponent("virtual-entity-create", {
            componentToLoad: event.id,
            editFromReviewScreen: true,
            checkboxFlag: self.checkboxFlag(),
            mailingCheckboxFlag: self.mailingCheckboxFlag(),
            mappedVirtualAccounts: params.rootModel.params.mappedVirtualAccounts,
            viewDTO: params.rootModel.params.viewDTO,
            reviewDTO: params.rootModel.params.reviewDTO,
            realEntityAddress: params.rootModel.params.realEntityAddress || realEntityAddress,
            editFromViewScreen: params.rootModel.params.editFromViewScreen
          });
        };

        self.loadCreate = function () {
          self.reviewTemplate(false);

          params.dashboard.loadComponent("virtual-entity-create", {
            componentToLoad: "virtual-entity-information",
            editFromReviewScreen: true,
            checkboxFlag: self.checkboxFlag(),
            mailingCheckboxFlag: self.mailingCheckboxFlag(),
            viewDTO: params.rootModel.params.viewDTO,
            reviewDTO: params.rootModel.params.reviewDTO,
            realEntityAddress: params.rootModel.params.realEntityAddress,
            mappedVirtualAccounts: params.rootModel.params.mappedVirtualAccounts,
            editFromViewScreen: params.rootModel.params.editFromViewScreen
          });
        };

        self.editViewDetails = function () {
          self.reviewTemplate(false);

          params.dashboard.loadComponent("virtual-entity-create", {
            editFromViewScreen: true,
            viewDTO: params.rootModel.params.viewDTO,
            checkboxFlag: self.checkboxFlag(),
            mailingCheckboxFlag: self.mailingCheckboxFlag(),
            mappedVirtualAccounts: params.rootModel.params.mappedVirtualAccounts
          });
        };

        self.confirm = function () {
          const payload = params.rootModel.params.reviewDTO,
            confirmScreenCreateMessage = function () {
              return resourceBundle.entityCreateMessage;
            },
            confirmScreenUpdateMessage = function () {
              return resourceBundle.entityUpdateMessage;
            },
            isApproval = function (data) {
              if (data.status && data.status.message.code === "DIGX_APPROVAL_REQUIRED") {
                return;
              }

              return params.rootModel.params.editFromViewScreen ? confirmScreenUpdateMessage : confirmScreenCreateMessage;
            };

          if (payload.entityType === "C") {
            delete payload.individualDetails;
          } else {
            payload.mailingAddress = payload.address;
            delete payload.corporateDetails;
          }

          if (params.rootModel.params.editFromViewScreen) {
            VirtualEntityModel.updateVirtualEntity(JSON.stringify(payload), payload.virtualEntityId).then(function (data) {
              if (data.status && data.status.result === "FAILURE") {
                params.baseModel.showMessages(null, [data.jsonNode.messages.codes[0].desc], "error");
              } else {
                params.dashboard.loadComponent("confirm-screen", {
                  transactionResponse: data,
                  transactionName: self.resource.title,
                  confirmScreenExtensions: {
                    confirmScreenMsgEval: isApproval(data),
                    customResource: resourceBundle,
                    confirmScreenDetails: [{
                      virtualEntityId: payload.virtualEntityId,
                      virtualEntityName: payload.virtualEntityName,
                      entityType: payload.entityType === "C" ? self.resource.corporate : self.resource.individual
                    }],
                    isSet: true,
                    template: "confirm-screen/virtual-entity-update-confirmation"
                  }
                });
              }
            });

          } else {
            VirtualEntityModel.createVirtualEntity(JSON.stringify(payload)).then(function (data) {
              if (data.status && data.status.result === "FAILURE") {
                params.baseModel.showMessages(null, [data.jsonNode.messages.codes[0].desc], "error");
              } else {
                params.dashboard.loadComponent("confirm-screen", {
                  transactionResponse: data,
                  transactionName: self.resource.title,
                  confirmScreenExtensions: {
                    confirmScreenMsgEval: isApproval(data),
                    customResource: resourceBundle,
                    confirmScreenDetails: [{
                      virtualEntityId: payload.virtualEntityId,
                      virtualEntityName: payload.virtualEntityName,
                      entityType: payload.entityType === "C" ? self.resource.corporate : self.resource.individual
                    }],
                    isSet: true,
                    template: "confirm-screen/virtual-entity-create-confirmation"
                  }
                });
              }
            });

          }
        };

        self.doNotDelete = function () {
          $("#virtualEntityDelete").trigger("closeModal");
        };

        self.modalDisplay = function () {
          if (self.checkZeroBalance() !== 0) {
            self.confirmZeroBalance();
          } else {
            $("#virtualEntityDelete").trigger("openModal");
          }
        };

        self.deleteConfirm = function () {
          $("#virtualEntityDelete").trigger("openModal");
        };

        self.deleteVirtualEntity = function () {
          const confirmScreenDeleteMessage = function () {
              return self.resource.entityDeleteMessage;
            },
            isApproval = function (data) {
              if (data.status && data.status.message.code === "DIGX_APPROVAL_REQUIRED") {
                return;
              }

              return confirmScreenDeleteMessage;
            };

          VirtualEntityModel.deleteVirtualEntity(self.viewModel.virtualEntityId()).then(function (data) {
            if (data.status && data.status.result === "FAILURE") {
              params.baseModel.showMessages(null, [data.jsonNode.messages.codes[0].desc], "error");
              $("#virtualEntityDelete").trigger("closeModal");
            } else {
              params.dashboard.loadComponent("confirm-screen", {
                transactionResponse: data,
                transactionName: self.resource.title,
                confirmScreenExtensions: {
                  confirmScreenMsgEval: isApproval(data),
                  customResource: resourceBundle,
                  confirmScreenDetails: [{
                    virtualEntityId: self.viewModel.virtualEntityId(),
                    virtualEntityName: self.viewModel.virtualEntityName(),
                    entityType: self.viewModel.entityType() === "C" ? self.resource.corporate : self.resource.individual
                  }],
                  isSet: true,
                  template: "confirm-screen/virtual-entity-delete-confirmation"
                }
              });
            }
          }).catch(function () {
            self.doNotDelete();
          });

        };
      };

    if (params.rootModel.params.viewMode) {
      if (params.rootModel.params.viewDTO) {
        self.recordStatus(params.rootModel.params.viewDTO.status);
        self.viewModel = ko.mapping.fromJS(copyFromModel(VirtualEntityModel.virtualEntityViewModel(), JSON.parse(JSON.stringify(params.rootModel.params.viewDTO))));
        afterViewModelCreated();
      }

      self.reviewMode(false);
      self.viewMode(true);
    } else if (params.rootModel.params.reviewMode) {
      self.viewMode(false);
      self.reviewMode(true);
      self.viewModel = ko.mapping.fromJS(copyFromModel(VirtualEntityModel.virtualEntityViewModel(), JSON.parse(JSON.stringify(params.rootModel.params.reviewDTO))));
      afterViewModelCreated();
    } else if (params.rootModel.params.data) {
      if (params.rootModel.params.taskCode === "VAME_M_DVE") {
        VirtualEntityModel.readEntity(params.rootModel.params.data.virtualEntity.virtualEntityId).then(function (response) {
          self.viewModel = ko.mapping.fromJS(copyFromModel(VirtualEntityModel.virtualEntityViewModel(), response.virtualEntity));
          afterViewModelCreated();
        });
      } else {
        self.viewModel = ko.mapping.fromJS(copyFromModel(VirtualEntityModel.virtualEntityViewModel(), JSON.parse(JSON.stringify(params.rootModel.params.data))));
        afterViewModelCreated();
      }
    }
  };
});