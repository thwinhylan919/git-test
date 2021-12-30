define([
  "knockout",
  "./model",
  "ojL10n!resources/nls/virtual-entity",
  "ojs/ojtrain",
  "ojs/ojvalidationgroup"
], function (ko, VirtualEntityModel, resourceBundle) {
  "use strict";

  return function (params) {
    const self = this;
    let tracker,
      pattern;

    ko.utils.extend(self, params.rootModel || params.rootModel.previousState);
    self.resource = resourceBundle;
    params.dashboard.headerName(self.resource.title);
    params.baseModel.registerElement("confirm-screen");
    params.baseModel.registerComponent("virtual-entity-create", "virtual-account-management");
    params.baseModel.registerComponent("virtual-entity-information", "virtual-account-management");
    params.baseModel.registerComponent("virtual-entity-identification-details", "virtual-account-management");
    params.baseModel.registerComponent("review-virtual-entity", "virtual-account-management");
    self.selectedStepValue = ko.observable("virtual-entity-information");
    self.selectedStepLabel = ko.observable("virtual-entity-information");
    self.fromEntitySearch = ko.observable();
    self.disableTrain = ko.observable(false);
    self.entityHeading = ko.observable();
    self.customerId = ko.observable();
    self.reviewTemplate = ko.observable();
    self.editFromViewScreen = ko.observable(false);
    self.countryOptions = ko.observable([]);
    self.genderOptions = ko.observable();
    self.correspondenceAddress = ko.observableArray();
    self.mailingAddress = ko.observableArray();
    self.checkboxFlag = ko.observable(true);
    self.mailingCheckboxFlag = ko.observable(true);
    self.nationality = ko.observable();
    self.countryOfIncorporation = ko.observable();
    self.createDTO = ko.observableArray([]);
    self.viewMode = ko.observable();
    self.reviewMode = ko.observable();
    self.showAddLandlineLink = ko.observable();
    self.showDeleteLandlineLink = ko.observable();
    self.fromApproval = ko.observable();
    self.realCustomerNo = params.dashboard.userData.userProfile.partyId.value;
    self.realCustomerName = params.dashboard.userData.userProfile.accessibleEntityDTOs[0].partyName;
    self.realEntityAddress = ko.observable();
    self.identificationNo = ko.observable();
    self.individualNationalIdMasked = ko.observable();
    self.identificationNumberValue = ko.observable();
    self.identificationNoDisplay = ko.observable();
    self.limit = "0";
    self.offset = "0";
    self.virtualEntityMask = ko.observable();
    self.virtualEntityMaskPattern = ko.observable();
    self.virtualEntityDisplay = ko.observable();
    self.showTemplates = ko.observable();
    self.taxonomyDefinition = params.dashboard.getTaxonomyDefinition("com.ofss.digx.app.vam.dto.virtualentity.VirtualEntityDTO");

    VirtualEntityModel.getRealEntityAddress().then(function (data) {
      for (let i = 0; i < data.party.addresses.length; i++) {
        if (data.party.addresses[i].type.toLowerCase() === "pst") {
          self.realEntityAddress(data.party.addresses[i].postalAddress);
          break;
        }
      }
    });

    const makeCreateModel = function (source, destination) {
        for (let key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key) && Object.prototype.hasOwnProperty.call(destination, key)) {
            if (typeof destination[key] === "object" && destination[key]) {
              source[key] = makeCreateModel(source[key], destination[key]);
            } else if ((typeof destination[key] === "string" || typeof destination[key] === "number") || (destination[key] || destination[key] === 0)) {
              source[key] = destination[key];
            }

            key = undefined;
          }
        }

        return source;
      },
      fetchCountryListPromise = VirtualEntityModel.fetchCountryList(self.limit, self.offset),
      fetchGenderListPromise = VirtualEntityModel.fetchGenderList(),
      getVirtualEntityModel = function () {
        const KoModel = VirtualEntityModel.getNewModel();

        return ko.mapping.fromJS(KoModel);
      };

    if (params.rootModel.params.editFromViewScreen || params.rootModel.params.editFromReviewScreen) {
      const dto = params.rootModel.params.editFromReviewScreen ? params.rootModel.params.reviewDTO : params.rootModel.params.viewDTO;

      self.modelInstance = ko.mapping.fromJS(makeCreateModel(VirtualEntityModel.getNewModel(), dto));
    } else {
      self.modelInstance = getVirtualEntityModel();
      self.modelInstance.entityType("C");
    }

    const maskPatternMap = {
        n: "[0-9]",
        a: "[a-zA-Z]"
      },
      getRegexForAlphabet = function (alphabet, count) {
        return maskPatternMap[alphabet] + (count > 0 ? "{" + count + "}" : "");
      },

      getPatternFromMask =
      function (mask) {
        let pattern = "",
          prevElement = "",
          currentElement,
          count = 0;

        for (let index = 0; index < mask.length; index++) {
          currentElement = mask[index];

          if (prevElement === "" || prevElement === currentElement) {
            count++;
          } else {
            pattern += getRegexForAlphabet(prevElement, count);
            count = 1;
          }

          prevElement = currentElement;
        }

        pattern += getRegexForAlphabet(currentElement, count);

        return pattern;

      };

    VirtualEntityModel.entityAvailability().then(function (data) {
      if (data && data.virtualEntity && data.virtualEntity.bankParameters) {
        self.virtualEntityDisplay(false);

        self.virtualEntityMask(data.virtualEntity.bankParameters[0].maskingPattern);

        pattern = getPatternFromMask(self.virtualEntityMask());

        self.virtualEntityMaskPattern(pattern);
        ko.tasks.runEarly();
        self.virtualEntityDisplay(true);
      }
    });

    if (params.rootModel.params.checkboxFlag !== undefined) {
      self.checkboxFlag(params.rootModel.params.checkboxFlag);
    }

    if (params.rootModel.params.mailingCheckboxFlag !== undefined) {
      self.mailingCheckboxFlag(params.rootModel.params.mailingCheckboxFlag);
    }

    if (params.rootModel.params.fromApproval) {
      self.fromApproval(true);
    }

    if (params.rootModel.params.data) {
      self.createDTO(params.rootModel.transactionDetails().transactionSnapshot.requestPayload);
    }

    self.editFromViewScreen(!!params.rootModel.params.editFromViewScreen);

    fetchCountryListPromise.then(function (data) {
      if (data.jsonNode && data.jsonNode.data.length > 0 && data.jsonNode.data) {
        self.countryOptions(data.jsonNode.data);
      }
    });

    fetchGenderListPromise.then(function (data) {
      if (data.enumRepresentations && data.enumRepresentations.length > 0 && data.enumRepresentations[0].data) {
        self.genderOptions(data.enumRepresentations[0].data);
      }
    });

    self.entitySelection = function (event) {
      if (event.detail.value) {
        self.showTemplates(false);
        self.modelInstance.virtualEntityId("");
        self.modelInstance.virtualEntityName("");
        ko.tasks.runEarly();
        self.showAddLandlineLink(true);
        self.modelInstance.entityType(event.detail.value);

        if (params.rootModel.previousState) {
          self.modelInstance.entityType(event.detail.value);
        }

        self.showTemplates(true);
      }
    };

    if (params.rootModel.params.editFromReviewScreen) {
      self.selectedStepValue(params.rootModel.params.componentToLoad);

      if (params.rootModel.params.createDTO) {
        self.modelInstance = ko.mapping.fromJS(JSON.parse(params.rootModel.params.createDTO));
      }
    }

    self.stepArray =
      ko.observableArray(
        [{
            label: self.resource.entityInformation,
            id: "virtual-entity-information",
            visited: false,
            disabled: false
          },
          {
            label: self.resource.otherDetails,
            id: "virtual-entity-identification-details",
            visited: false,
            disabled: true
          }
        ]);

    self.updateLabelText = function (event) {
      const train = document.getElementById("train");

      self.selectedStepLabel(train.getStep(event.detail.value).label);
    };

    self.listener = function (event) {
      tracker = document.getElementById("tracker");

      if (!params.baseModel.showComponentValidationErrors(tracker)) {
        event.preventDefault();
      }
    };

    self.navigate = function () {
      const itrain = document.getElementById("train");

      for (let j = 0; j < itrain.steps.length; j++) {
        if (itrain.selectedStep === itrain.steps[j].id) {
          itrain.steps[j].visited = true;
          itrain.steps[j].disabled = false;

          if (j < 2) {
            itrain.steps[j + 1].visited = true;
            itrain.steps[j + 1].disabled = false;
          }

          break;
        }
      }

      ko.tasks.runEarly();

      let loadIndex = 0;

      for (let i = 0; i < self.stepArray().length; i++) {
        if (self.stepArray()[i].id === self.selectedStepValue()) {
          loadIndex = i + 1;
          break;
        }
      }

      self.selectedStepValue(self.stepArray()[loadIndex].id);

    };

    const getQueryAsString = function () {
        const qQuery = {
          criteria: []
        };

        if (self.modelInstance.virtualEntityId()) {
          qQuery.criteria.push({
            operand: "virtualEntityKey.virtualEntityId",
            operator: "CONTAINS",
            value: [self.modelInstance.virtualEntityId()]
          });
        }

        return JSON.stringify(qQuery);
      },
      checkEntityExists = function (virtualEntities) {
        const found = virtualEntities.find(function (entity) {
          return entity.virtualEntityId === self.modelInstance.virtualEntityId();
        });

        return !!found;
      };

    self.nextStep = function () {
      tracker = document.getElementById("tracker");

      if (tracker.valid === "valid") {
        if (!params.rootModel.params.editFromViewScreen) {
          VirtualEntityModel.getEntityList(getQueryAsString()).then(function (response) {
            if (response.virtualEntities.length === 0 || !checkEntityExists(response.virtualEntities)) {
              self.navigate();
            } else {
              params.baseModel.showMessages(null, [self.resource.entityExists], "error");
            }
          }).catch(function () {
            params.baseModel.showMessages(null, [self.resource.entityExists], "error");
          });

        } else {
          self.navigate();
        }
      } else {
        tracker.showMessages();
        tracker.focusOn("@firstInvalidShown");
      }
    };

    self.previousStep = function () {
      const itrain = document.getElementById("train");

      for (let j = 0; j < itrain.steps.length; j++) {
        if (itrain.selectedStep === itrain.steps[j].id) {
          itrain.steps[j].visited = true;
          itrain.steps[j].disabled = false;

          if (j > 0) {
            itrain.steps[j - 1].visited = true;
            itrain.steps[j - 1].disabled = false;
          }

          break;
        }
      }

      ko.tasks.runEarly();

      let loadIndex = 0;

      for (let i = 0; i < self.stepArray().length; i++) {
        if (self.stepArray()[i].id === self.selectedStepValue()) {
          loadIndex = i - 1;
          break;
        }
      }

      self.selectedStepValue(self.stepArray()[loadIndex].id);
    };

    self.backToView = function () {
      params.dashboard.loadComponent("review-virtual-entity", {
        viewMode: true,
        viewDTO: params.rootModel.params.viewDTO,
        backfromCreate: true,
        checkboxFlag: params.rootModel.params.checkboxFlag,
        mailingCheckboxFlag: params.rootModel.params.mailingCheckboxFlag,
        mappedVirtualAccounts: params.rootModel.params.mappedVirtualAccounts
      });
    };
  };
});