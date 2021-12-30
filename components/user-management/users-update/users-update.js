define([
  "ojs/ojcore",
  "knockout",
  "./model",
  "jquery",
  "ojL10n!resources/nls/user-management",
  "ojs/ojinputtext",
  "ojs/ojselectcombobox",
  "ojs/ojdatetimepicker",
  "ojs/ojradioset",
  "ojs/ojvalidationgroup",
  "ojs/ojknockout-validation",
  "ojs/ojcheckboxset",
  "ojs/ojswitch"
], function (oj, ko, UsersUpdateModel, $, resourceBundle) {
  "use strict";

  return function (rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    self.isNewUser = ko.observable(false);
    self.updateReviewFlag = ko.observable(false);
    self.updateConfirmFlag = ko.observable(false);
    self.isDisabled = ko.observable(false);
    self.updateUserData = ko.observable();
    self.userLimitsListLoaded = ko.observable(false);
    self.userLimitsList = ko.observableArray([]);
    self.userLimitsListKey = ko.observable([]);
    self.showChildRole = ko.observable(true);
    self.testhome = ko.observable(false);
    self.homeEntity = ko.observable("");
    self.selectedUserLimit = ko.observable();
    ko.utils.extend(self, rootParams.rootModel);
    self.accessibleEntityArray = ko.observableArray([]);
    self.nls = resourceBundle;
    self.transactionName = ko.observable(rootParams.rootModel.params.transactionName);
    self.transactionName(self.nls.info.transactionNameUpdate);
    self.selectedDeviceList = ko.observableArray();
    self.selectedDeviceListForPushNotification = ko.observableArray();
    self.accessibleEntity = ko.observable("");
    rootParams.dashboard.headerName(self.nls.headers.userManagement);
    rootParams.baseModel.registerElement("modal-window");
    rootParams.baseModel.registerComponent("access-point-mapping", "financial-limits");
    rootParams.baseModel.registerComponent("accessible-entity", "user-management");
    rootParams.baseModel.registerComponent("review-user-update", "user-management");
    self.previousSelectedUserLimit = ko.observable();
    self.limitGroupId = ko.observable();
    self.limitGroupName = ko.observable();
    self.limitGroupDescription = ko.observable();
    self.selectedChildRole = ko.observableArray(rootParams.rootModel.params.userFullData.applicationRoles);
    self.selectedAccessPoint = ko.observableArray(rootParams.rootModel.params.selectedAccessPoint);
    self.limitPackageDetails = ko.observable();
    self.header = self.nls.fieldname.limit;
    self.selectedUserLimitPackages = ko.observableArray();
    self.accessPoint = ko.observableArray([]);
    self.isAccessPointFetched = ko.observable(false);
    self.userPreferenceAccessPointRelationship = ko.observableArray([]);
    self.entityAccessPoint = ko.observable();
    self.accessPointType = ko.observable("INT");
    self.isUserSegmentsFetched = ko.observable(false);
    self.selectedSegmentRoles = ko.observableArray();
    self.isSegmentContainsRole = ko.observable(false);
    self.androidDevice = ko.observable(rootParams.rootModel.params.androidDevice);
    self.iOsDevice = ko.observable(rootParams.rootModel.params.iOsDevice);
    self.androidDeviceForPushNotification = ko.observable(rootParams.rootModel.params.androidDeviceForPushNotification);
    self.iOsDeviceForPushNotification = ko.observable(rootParams.rootModel.params.iOsDeviceForPushNotification);
    self.userFullData = ko.observable(rootParams.rootModel.params.userFullData);
    self.selectedAccessPoint = ko.observable(rootParams.rootModel.params.selectedAccessPoint);
    self.iOsDisabled = ko.observable(rootParams.rootModel.params.iOsDisabled);
    self.androidDisabledForPushNotification = ko.observable(rootParams.rootModel.params.androidDisabledForPushNotification);
    self.iOsDisabledForPushNotification = ko.observable(rootParams.rootModel.params.iOsDisabledForPushNotification);
    self.username = ko.observable(rootParams.rootModel.params.username);
    self.countries = ko.observable(rootParams.rootModel.params.countries);
    self.selectedSegmentCode = ko.observable(rootParams.rootModel.params.selectedSegmentCode);
    self.selectedExtAccessPoint = ko.observableArray([rootParams.rootModel.params.selectedExtAccessPoint]);
    self.androidDisabled = ko.observable(rootParams.rootModel.params.androidDisabled);
    self.childRoleEnumsLoaded = ko.observable(rootParams.rootModel.params.childRoleEnumsLoaded);
    self.childRoleEnums = ko.observableArray(rootParams.rootModel.params.childRoleEnums);
    self.userSegments = ko.observableArray(rootParams.rootModel.params.userSegments);
    self.selectedSegmentName = ko.observable(rootParams.rootModel.params.selectedSegmentName);
    self.hideToolTip = rootParams.rootModel.params.hideToolTip;
    self.showToolTip = rootParams.rootModel.params.showToolTip;

    self.getHomeEntityLimit = function () {
      const assignableEntitiesData = [{
        key: {
          value: self.userFullData().userType.enterpriseRoleId,
          type: "ROLE"
        }
      }];

      UsersUpdateModel.fetchUserLimitOptions(self.userFullData().homeEntity, ko.toJSON(assignableEntitiesData)).done(function (data) {
        let i;

        self.userLimitsList(data.limitPackageDTOList);

        if (self.userFullData().limitPackages !== undefined && self.userFullData().limitPackages.length) {
          for (i = 0; i < self.userFullData().limitPackages.length; i++) {
            if (self.userFullData().limitPackages[i].targetUnit === self.userFullData().homeEntity) {
              for (let m = 0; m < self.userFullData().limitPackages[i].entityLimitPackageMappingDTO.length; m++) {
                self.selectedUserLimitPackages.push({
                  key: {
                    id: self.userFullData().limitPackages[i].entityLimitPackageMappingDTO[m].limitPackage.key.id
                  },
                  accessPointValue: self.userFullData().limitPackages[i].entityLimitPackageMappingDTO[m].limitPackage.accessPointValue,
                  accessPointGroupType: self.userFullData().limitPackages[i].entityLimitPackageMappingDTO[m].limitPackage.accessPointGroupType
                });
              }

              break;
            }
          }
        }

        self.userLimitsListLoaded(true);
      });
    };

    const baseMobileNoValidator = rootParams.baseModel.getValidator("PHONE_NO");
    let phoneNumberValidatorRegEx;

    if (baseMobileNoValidator) {
      if (baseMobileNoValidator[0].type.toLowerCase() === oj.ValidatorFactory.VALIDATOR_TYPE_REGEXP) {
        baseMobileNoValidator[0].options.pattern = "^(\\+)?(\\d{1,4}[- ]?)?(\\d{1,5}[- ]?)?\\d{1,8}$";

        phoneNumberValidatorRegEx = baseMobileNoValidator;
      }
    }

    const validator = oj.Validation.validatorFactory(oj.ValidatorFactory.VALIDATOR_TYPE_REGEXP).
      createValidator(phoneNumberValidatorRegEx[0].options);

    self.phoneNumValidator = {
      validate: function (value) {

        validator.validate(value);

      }
    };

    const searchParameters = {
      accessType: "INT"
    };

    UsersUpdateModel.fetchAccess(searchParameters).done(function (data) {
      for (let i = 0; i < data.accessPointListDTO.length; i++) {
        self.accessPoint().push({
          text: data.accessPointListDTO[i].description,
          value: data.accessPointListDTO[i].id
        });
      }

      self.isAccessPointFetched(true);
    });

    if (self.androidDevice()) {
      self.androidDisabled(false);
    }

    if (self.iOsDevice()) {
      self.iOsDisabled(false);
    }

    if (self.androidDeviceForPushNotification()) {
      self.androidDisabledForPushNotification(false);
    }

    if (self.iOsDeviceForPushNotification()) {
      self.iOsDisabledForPushNotification(false);
    }

    const androidDeviceSubscription = self.androidDevice.subscribe(function () {
      if (!self.androidDevice()) {
        self.selectedDeviceList.push("ANDROID");
      } else {
        self.selectedDeviceList.remove("ANDROID");
      }
    }),
      iosDeviceSubscription = self.iOsDevice.subscribe(function () {
        if (!self.iOsDevice()) {
          self.selectedDeviceList.push("IOS");
        } else {
          self.selectedDeviceList.remove("IOS");
        }
      }),
      androidDeviceForPushNotificationSubscription = self.androidDeviceForPushNotification.subscribe(function () {
        if (!self.androidDeviceForPushNotification()) {
          self.selectedDeviceListForPushNotification.push("ANDROID");
        } else {
          self.selectedDeviceListForPushNotification.remove("ANDROID");
        }
      }),
      iosDeviceForPushNotificationSubscription = self.iOsDeviceForPushNotification.subscribe(function () {
        if (!self.iOsDeviceForPushNotification()) {
          self.selectedDeviceListForPushNotification.push("IOS");
        } else {
          self.selectedDeviceListForPushNotification.remove("IOS");
        }
      });

    self.getHomeEntityLimit();

    if (!self.isNewUser()) {
      self.id = ko.observable(rootParams.id);
    }

    if (self.userFullData().userType.enterpriseRoleId === "retailuser") {
      self.isDisabled(true);

      const searchParameter = {
        selectedUser: self.userFullData().userType.enterpriseRoleId
      };

      UsersUpdateModel.fetchUserSegments(searchParameter).done(function (data) {
        self.userSegments([]);
        self.isUserSegmentsFetched(false);
        self.selectedSegmentName("");
        self.selectedSegmentCode("");

        for (let j = 0; j < data.segmentdtos.length; j++) {
          if (data.segmentdtos[j].code === self.userFullData().segmentCode) {
            self.selectedSegmentName(data.segmentdtos[j].name);
            self.selectedSegmentCode(data.segmentdtos[j].code);

            if (data.segmentdtos[j].roles !== undefined) {
              self.selectedSegmentRoles(data.segmentdtos[j].roles);
              self.isSegmentContainsRole(true);
            }
          }

          self.userSegments().push({
            text: data.segmentdtos[j].name,
            value: data.segmentdtos[j].code,
            roles: data.segmentdtos[j].roles
          });
        }

        self.isUserSegmentsFetched(true);
      });
    }

    self.statusOptionChangeHandler = function (event) {
      if (event.detail.value) {
        self.statusOptionValue(event.detail.value);
      }
    };

    function formatDate(date) {
      const d = rootParams.baseModel.getDate(date);
      let month = "" + (d.getMonth() + 1),
        day = "" + d.getDate();
      const year = d.getFullYear();

      if (month.length < 2) {
        month = "0" + month;
      }

      if (day.length < 2) {
        day = "0" + day;
      }

      return [
        year,
        month,
        day
      ].join("-");
    }

    const today = rootParams.baseModel.getDate();

    today.setFullYear(today.getFullYear() - 18);
    self.maxDate = ko.observable(formatDate(today));
    self.validationTracker = ko.observable();

    self.userLimitChangeHandler = function (event) {
      if (event.detail.value) {
        self.selectedUserLimit(event.detail.value);

        for (let i = 0; i < self.userLimitsList().length; i++) {
          if (event.detail.value === self.userLimitsList()[i].key.id) {
            self.limitGroupName(self.userLimitsList()[i].key.id);
            self.limitGroupId(self.userLimitsList()[i].key.id);
            self.limitGroupDescription(self.userLimitsList()[i].description);
          }
        }
      }
    };

    self.rePopulateEntityList = function () {
      const array = [];

      for (let i = 0; i < rootParams.dashboard.userData.userProfile.accessibleEntityDTOs.length; i++) {
        array.push(rootParams.dashboard.userData.userProfile.accessibleEntityDTOs[i]);
      }

      let index = null;

      for (let j = 0; j < array.length; j++) {
        if (array[j].entityId === self.userFullData().homeEntity) {
          index = j;
        }
      }

      array.splice(index, 1);
      self.entityList(array.slice(0));
      self.entitiesListLoaded(true);
    };

    self.validateAccessibleEntityList = function () {
      let validationSucess = true;

      for (let l = 0; l < self.accessibleEntityArray().length; l++) {
        for (let m = 0; m < self.accessibleEntityArray().length; m++) {
          if (l !== m && validationSucess && (self.accessibleEntityArray()[m].entityId() instanceof Array ? self.accessibleEntityArray()[m].entityId()[0] : self.accessibleEntityArray()[m].entityId()) === (self.accessibleEntityArray()[l].entityId() instanceof Array ? self.accessibleEntityArray()[l].entityId()[0] : self.accessibleEntityArray()[l].entityId())) {
            rootParams.baseModel.showMessages(null, [self.nls.common.duplicateEntity], "ERROR");
            validationSucess = false;
          }
        }
      }

      return validationSucess;
    };

    self.reviewUpdateUser = function () {
      if (!rootParams.baseModel.showComponentValidationErrors(document.getElementById("tracker"))) {
        return;
      }

      if (self.selectedChildRole().length === 0 && (self.selectedSegmentCode() === undefined || self.selectedSegmentCode() === "")) {
        rootParams.baseModel.showMessages(null, [self.nls.info.noRoleSegment], "ERROR");

        return;
      }

      if (!self.validateAccessibleEntityList()) {
        return;
      }

      const data = {
        username: self.userFullData().username ? self.userFullData().username : "",
        firstName: self.userFullData().firstName ? self.userFullData().firstName : "",
        middleName: self.userFullData().middleName ? self.userFullData().middleName : "",
        lastName: self.userFullData().lastName ? self.userFullData().lastName : "",
        dateOfBirth: self.userFullData().dateOfBirth ? self.userFullData().dateOfBirth : "",
        mobileNumber: self.userFullData().mobileNumber ? self.userFullData().mobileNumber : "",
        emailId: self.userFullData().emailId !== "" ? self.userFullData().emailId.toLowerCase() : "",
        employeeType: self.userFullData().employeeType ? self.userFullData().employeeType : "",
        phoneNumber: self.userFullData().phoneNumber ? self.userFullData().phoneNumber : "",
        userType: self.userFullData().userType ? self.userFullData().userType.enterpriseRoleId : "",
        address: {
          line1: self.userFullData().address.line1 ? self.userFullData().address.line1 : "",
          line2: self.userFullData().address.line2 ? self.userFullData().address.line2 : "",
          line3: self.userFullData().address.line3 ? self.userFullData().address.line3 : "",
          line4: self.userFullData().address.line4 ? self.userFullData().address.line4 : "",
          city: self.userFullData().address.city ? self.userFullData().address.city : "",
          state: self.userFullData().address.state ? self.userFullData().address.state : "",
          country: self.userFullData().address.country ? self.userFullData().address.country : "",
          zipCode: self.userFullData().address.zipCode ? self.userFullData().address.zipCode : ""
        },
        partyId: {},
        version: self.userFullData().version,
        accessibleEntity: [],
        accessibleEntities: [{
          entityId: null,
          entityName: null,
          partyName: null,
          userPartyRelationship: {
            determinantValue: null,
            partyId: {
              value: null,
              displayValue: null
            },
            userId: null
          }
        }],
        limitPackages: [{
          targetUnit: null
        }],
        userPartyRelationshipDTOs: [{
          userId: null,
          determinantValue: null,
          partyId: {
            value: null,
            displayValue: null
          }
        }],
        partyName: self.userFullData().partyName ? self.userFullData().partyName : "",
        userAccessPointRelationshipList: self.userPreferenceAccessPointRelationship(),
        segmentCode: self.selectedSegmentCode(),
        userGroups: self.selectedChildRole(),
        title: self.userFullData().title ? self.userFullData().title : "",
        organization: self.userFullData().organization ? self.userFullData().organization : "",
        manager: self.userFullData().manager ? self.userFullData().manager : "",
        employeeNumber: self.userFullData().employeeNumber ? self.userFullData().employeeNumber : "",
        deviceList: self.selectedDeviceList().length !== 0 ? self.selectedDeviceList() : "",
        deregisterIOS: self.iOsDevice(),
        deregisterAndroid: self.androidDevice(),
        deregisterPushAndroid: self.androidDeviceForPushNotification(),
        deregisterPushIOS: self.iOsDeviceForPushNotification(),
        applicationRoles: self.selectedChildRole()
      };

      self.setEntityRelatedFields(data);
      self.updateUserData(data);
      self.rePopulateEntityList();
      self.updateReviewFlag(true);
      rootParams.baseModel.closeNotificationMessages();

      $.extend(self.params, {
        data: data,
        accessibleEntityTemplate: self.accessibleEntityArray,
        limitGroupName: self.limitGroupName
      });
    };

    let relationship_Type;

    self.setEntityRelatedFields = function (data) {
      if (self.userType() === "corporateuser") {
        relationship_Type = "O";
      }

      if (self.userType() === "retailuser") {
        relationship_Type = "I";
      }

      if (self.userType() !== "administrator") {
        data.partyId = {};

        data.partyId = {
          value: self.userFullData().partyId.value,
          displayValue: self.userFullData().partyId.displayValue
        };

        data.userPartyRelationshipDTOs = [];
        data.accessibleEntities = [];

        data.userPartyRelationshipDTOs.push({
          determinantValue: self.userFullData().homeEntity,
          partyId: {
            displayValue: self.userFullData().partyId.displayValue,
            value: self.userFullData().partyId.value
          },
          userId: data.username,
          relationshipType: relationship_Type
        });

        data.accessibleEntities.push({
          entityId: self.userFullData().homeEntity,
          entityName: null,
          partyName: self.userFullData().partyName,
          userPartyRelationship: {
            determinantValue: self.userFullData().homeEntity,
            partyId: {
              displayValue: self.userFullData().partyId.displayValue,
              value: self.userFullData().partyId.value
            },
            userId: data.username,
            relationshipType: relationship_Type
          }
        });

        for (let a = 0; a < self.accessibleEntityArray().length; a++) {
          data.userPartyRelationshipDTOs.push({
            determinantValue: self.accessibleEntityArray()[a].entityId() instanceof Array ? self.accessibleEntityArray()[a].entityId()[0] : self.accessibleEntityArray()[a].entityId(),
            partyId: {
              displayValue: self.accessibleEntityArray()[a].partyInfo.party.displayValue(),
              value: self.accessibleEntityArray()[a].partyInfo.party.value()
            },
            userId: data.username,
            relationshipType: relationship_Type
          });

          data.accessibleEntity.push(self.accessibleEntityArray()[a].entityId() instanceof Array ? self.accessibleEntityArray()[a].entityId()[0] : self.accessibleEntityArray()[a].entityId());

          data.accessibleEntities.push({
            entityId: self.accessibleEntityArray()[a].entityId() instanceof Array ? self.accessibleEntityArray()[a].entityId()[0] : self.accessibleEntityArray()[a].entityId(),
            entityName: self.accessibleEntityArray()[a].entityName(),
            partyName: self.accessibleEntityArray()[a].partyInfo.partyName(),
            userPartyRelationship: {
              determinantValue: self.accessibleEntityArray()[a].entityId() instanceof Array ? self.accessibleEntityArray()[a].entityId()[0] : self.accessibleEntityArray()[a].entityId(),
              partyId: {
                displayValue: self.accessibleEntityArray()[a].partyInfo.party.displayValue(),
                value: self.accessibleEntityArray()[a].partyInfo.party.value()
              },
              userId: data.username,
              relationshipType: relationship_Type
            }
          });
        }

        data.limitPackages = [];

        let tempLimitPackageMappingDTO;

        for (let i = 0; i < self.accessibleEntityArray().length; i++) {
          tempLimitPackageMappingDTO = [];
          self.accessibleEntityArray()[i].isLimitPackageAttached(false);

          for (let p = 0; p < self.accessibleEntityArray()[i].limitPackage().length; p++) {
            if (self.accessibleEntityArray()[i].limitPackage()[p].selectedLimitPackage()) {
              tempLimitPackageMappingDTO.push({
                limitPackage: {
                  accessPointGroupType: self.accessibleEntityArray()[i].limitPackage()[p].isGroup ? "GROUP" : "SINGLE",
                  accessPointValue: self.accessibleEntityArray()[i].limitPackage()[p].accessPoint,
                  key: {
                    id: self.accessibleEntityArray()[i].limitPackage()[p].selectedLimitPackage()
                  }
                }
              });

              self.accessibleEntityArray()[i].isLimitPackageAttached(true);
            }
          }

          data.limitPackages.push({
            targetUnit: self.accessibleEntityArray()[i].entityId(),
            entityLimitPackageMappingDTO: tempLimitPackageMappingDTO
          });
        }

        if (self.limitPackageDetails()) {
          const entityLimitPackageMappingDTO = ko.observableArray([]);

          for (let i = 0; i < self.limitPackageDetails().length; i++) {
            if (self.limitPackageDetails()[i].selectedLimitPackage()) {
              entityLimitPackageMappingDTO.push({
                limitPackage: {
                  accessPointGroupType: self.limitPackageDetails()[i].isGroup ? "GROUP" : "SINGLE",
                  accessPointValue: self.limitPackageDetails()[i].accessPoint,
                  key: {
                    id: self.limitPackageDetails()[i].selectedLimitPackage()
                  }
                }
              });
            }
          }

          data.limitPackages.push({
            targetUnit: self.userFullData().homeEntity,
            entityLimitPackageMappingDTO: entityLimitPackageMappingDTO()
          });
        }

        data.accessibleEntity.push(self.userFullData().homeEntity);
        data.homeEntity = self.userFullData().homeEntity;
        data.homeEntity = self.userFullData().homeEntity;

        if (!data.limitPackages.length) {
          data.limitPackages = null;
        }
      }

      if (self.userType() === "administrator") {
        data.accessibleEntity.push(self.userFullData().homeEntity);

        for (let i = 0; i < self.accessibleEntityArray().length; i++) {
          data.accessibleEntity.push(self.accessibleEntityArray()[i].entityId() instanceof Array ? self.accessibleEntityArray()[i].entityId()[0] : self.accessibleEntityArray()[i].entityId());

          data.accessibleEntities.push({
            entityId: self.accessibleEntityArray()[i].entityId() instanceof Array ? self.accessibleEntityArray()[i].entityId()[0] : self.accessibleEntityArray()[i].entityId(),
            entityName: self.accessibleEntityArray()[i].entityName(),
            partyName: null,
            userPartyRelationship: null
          });
        }

        data.accessibleEntities.push({
          entityId: self.userFullData().homeEntity,
          entityName: null,
          partyName: self.userFullData().partyName,
          userPartyRelationship: null
        });

        data.homeEntity = self.userFullData().homeEntity;
      }
    };

    self.backonEditUser = function () {
      $("#backConfirmationModal").trigger("openModal");
    };

    self.back = function () {
      rootParams.dashboard.loadComponent("user-read", {
        username: self.username(),
        countries: self.countries()
      });
    };

    self.hideModal = function () {
      $("#backConfirmationModal").hide();
    };

    self.backOnReview = function () {
      self.selectedUserLimitPackages.removeAll();

      if (self.limitPackageDetails()) {
        for (let i = 0; i < self.limitPackageDetails().length; i++) {
          if (self.limitPackageDetails()[i].selectedLimitPackage()) {
            self.selectedUserLimitPackages.push({
              key: {
                id: self.limitPackageDetails()[i].selectedLimitPackage()
              },
              accessPointValue: self.limitPackageDetails()[i].accessPoint
            });
          }
        }
      }

      self.updateReviewFlag(false);
    };

    self.populateAccessPointForPayload = function () {
      self.userPreferenceAccessPointRelationship([]);

      if (!self.selectedAccessPoint()) {
        self.selectedAccessPoint([]);
      }

      ko.utils.arrayForEach(self.selectedExtAccessPoint(), function (item) {
        if (item.accessPointId !== undefined) {
          self.userPreferenceAccessPointRelationship.push({
            accessPointId: item.accessPointId,
            userId: null,
            status: item.status,
            determinantValue: item.determinantValue
          });
        }
      });

      ko.utils.arrayForEach(self.accessPoint(), function (item) {
        if (self.selectedAccessPoint().indexOf(item.value) === -1) {
          self.userPreferenceAccessPointRelationship.push({
            accessPointId: item.value,
            userId: null,
            status: false,
            determinantValue: self.userFullData().homeEntity
          });
        } else {
          self.userPreferenceAccessPointRelationship.push({
            accessPointId: item.value,
            userId: null,
            status: true,
            determinantValue: self.userFullData().homeEntity
          });
        }
      });

      ko.utils.arrayForEach(self.accessibleEntityArray(), function (item) {
        let tempAccessPoint = item.selectedAccessPoints;

        if (!item.selectedAccessPoints) {
          tempAccessPoint = [];
        }

        ko.utils.arrayForEach(tempAccessPoint, function (selectedAccessPointItem) {
          self.userPreferenceAccessPointRelationship.push({
            accessPointId: selectedAccessPointItem,
            userId: null,
            status: true,
            determinantValue: item.entityId()
          });
        });

        ko.utils.arrayForEach(item.accessPointList, function (item1) {
          if (tempAccessPoint.indexOf(item1.value) === -1) {
            self.userPreferenceAccessPointRelationship.push({
              accessPointId: item1.value,
              userId: null,
              status: false,
              determinantValue: item.entityId()
            });
          }
        });
      });
    };

    self.updateUser = function () {
      if (!rootParams.baseModel.showComponentValidationErrors(document.getElementById("tracker"))) {
        return;
      }

      self.populateAccessPointForPayload();

      if (self.selectedChildRole().indexOf(self.userFullData().userType.enterpriseRoleId) !== -1) {
        const index = self.selectedChildRole().indexOf(self.userFullData().userType.enterpriseRoleId);

        self.selectedChildRole().splice(index, 1);
      }

      if (typeof self.userFullData().title === "object") {
        self.userFullData().title = self.userFullData().title[0];
      }

      if (typeof self.userFullData().address.country === "object") {
        self.userFullData().address.country = self.userFullData().address.country[0];
      }

      const data = {
        username: self.userFullData().username ? self.userFullData().username : "",
        firstName: self.userFullData().firstName ? self.userFullData().firstName : "",
        middleName: self.userFullData().middleName ? self.userFullData().middleName : "",
        lastName: self.userFullData().lastName ? self.userFullData().lastName : "",
        dateOfBirth: self.userFullData().dateOfBirth ? self.userFullData().dateOfBirth : "",
        mobileNumber: self.userFullData().mobileNumber ? self.userFullData().mobileNumber : "",
        emailId: self.userFullData().emailId !== "" ? self.userFullData().emailId.toLowerCase() : "",
        employeeType: self.userFullData().employeeType ? self.userFullData().employeeType : "",
        phoneNumber: self.userFullData().phoneNumber ? self.userFullData().phoneNumber : "",
        userType: self.userFullData().userType ? self.userFullData().userType.enterpriseRoleId : "",
        address: {
          line1: self.userFullData().address.line1 ? self.userFullData().address.line1 : "",
          line2: self.userFullData().address.line2 ? self.userFullData().address.line2 : "",
          line3: self.userFullData().address.line3 ? self.userFullData().address.line3 : "",
          line4: self.userFullData().address.line4 ? self.userFullData().address.line4 : "",
          city: self.userFullData().address.city ? self.userFullData().address.city : "",
          state: self.userFullData().address.state ? self.userFullData().address.state : "",
          country: self.userFullData().address.country ? self.userFullData().address.country : "",
          zipCode: self.userFullData().address.zipCode ? self.userFullData().address.zipCode : ""
        },
        partyId: {},
        homeEntity: null,
        version: self.userFullData().version,
        accessibleEntity: [],
        accessibleEntities: [{
          entityId: null,
          entityName: null,
          partyName: null,
          userPartyRelationship: {
            determinantValue: null,
            partyId: {
              value: null,
              displayValue: null
            },
            userId: null
          }
        }],
        partyName: self.userFullData().partyName ? self.userFullData().partyName : "",
        userGroups: [self.userFullData().userType.enterpriseRoleId],
        title: self.userFullData().title ? self.userFullData().title : "",
        organization: self.userFullData().organization ? self.userFullData().organization : "",
        manager: self.userFullData().manager ? self.userFullData().manager : "",
        employeeNumber: self.userFullData().employeeNumber ? self.userFullData().employeeNumber : "",
        deviceDeregistrationListOS: self.selectedDeviceList().length !== 0 ? self.selectedDeviceList() : [],
        pushTokenDegistrationListOS: self.selectedDeviceListForPushNotification().length !== 0 ? self.selectedDeviceListForPushNotification() : [],
        userAccessPointRelationshipList: self.userPreferenceAccessPointRelationship(),
        applicationRoles: self.selectedChildRole(),
        segmentCode: self.selectedSegmentCode()
      };

      self.setEntityRelatedFields(data);

      UsersUpdateModel.updateUser(ko.toJSON(data), self.username()).done(function (data, status, jqXhr) {
        self.updateReviewFlag(false);
        self.updateConfirmFlag(true);
        self.updateReviewFlag(false);

        rootParams.dashboard.loadComponent("confirm-screen", {
          jqXHR: jqXhr,
          transactionName: self.transactionName(),
          transactionResponse: data
        });

      });
    };

    self.refresh = ko.observable(true);
    self.userType = ko.observable(self.userFullData().userType.enterpriseRoleId);
    self.entityList = ko.observableArray([]);
    self.entitiesListLoaded = ko.observable(false);

    self.filterEntityList = function () {
      let entityListTemp = self.entityList();

      if (self.accessibleEntityArray().length !== 0) {
        entityListTemp = $.map(entityListTemp, function (node) {
          let flag = false;

          for (let g = 0; g < self.accessibleEntityArray().length; g++) {
            if ((self.accessibleEntityArray()[g].entityId() instanceof Array ? self.accessibleEntityArray()[g].entityId()[0] : self.accessibleEntityArray()[g].entityId()) === node.entityId) {
              flag = true;
              break;
            }
          }

          if (flag === false) {
            return node;
          }
        });
      }

      self.entityList(entityListTemp);
    };

    self.addAccessibleEntity = function (arg) {
      arg = arg ? arg : [];

      if ((arg.entityId === null || arg.entityId === undefined) && arg.length === 0) {
        self.filterEntityList();
      }

      self.partyInfo = {
        partyFirstName: ko.observable(),
        partyLastName: ko.observable(),
        userType: "CUSTOMER",
        partyName: arg.partyName ? ko.observable(arg.partyName) : ko.observable(),
        partyDetailsFetched: ko.observable(true),
        additionalDetails: ko.observable(),
        userTypeLabel: ko.observable(),
        party: {
          value: arg.value ? ko.observable(arg.value) : ko.observable(),
          displayValue: arg.displayValue ? ko.observable(arg.displayValue) : ko.observable()
        }
      };

      self.accessibleEntityArray.push({
        entityId: arg.entityId ? ko.observable(arg.entityId) : ko.observable(),
        entityName: arg.entityName ? ko.observable(arg.entityName) : ko.observable(),
        entityList: self.entityList,
        partyInfo: self.partyInfo,
        limitPackage: arg.limitPackage ? ko.observableArray(arg.limitPackage) : ko.observableArray(),
        childRoles: ko.observableArray([]),
        entityChange: arg.entityId ? ko.observable(true) : ko.observable(false),
        entityUserLimitListLoaded: ko.observable(false),
        entityUserLimit: ko.observable(),
        userType: self.userType(),
        limitPackageName: arg.limitPackageName ? ko.observable(arg.limitPackageName) : ko.observable(),
        entitiesListLoaded: self.entitiesListLoaded,
        accessibleEntitySet: arg.entityId ? ko.observable(true) : ko.observable(false),
        accessPointList: self.accessPoint(),
        isLimitPackageAttached: ko.observable(false),
        selectedAccessPoints: arg.selectedAccessPoints
      });
    };

    self.prepareAccessibleEntity = function () {
      const arg = [];

      if (self.userType() !== "administrator") {
        let req_array = self.userFullData().accessibleEntities;

        req_array = $.map(req_array, function (node) {
          node.limitPackage = [];

          if (self.userFullData().limitPackages) {
            for (let g = 0; g < self.userFullData().limitPackages.length; g++) {
              if (self.userFullData().limitPackages[g].targetUnit === node.entityId) {
                for (let m = 0; m < self.userFullData().limitPackages[g].entityLimitPackageMappingDTO.length; m++) {
                  node.limitPackage.push({
                    limitPackage: {
                      key: {
                        id: self.userFullData().limitPackages[g].entityLimitPackageMappingDTO[m].limitPackage.key.id
                      }
                    },
                    accessPointValue: self.userFullData().limitPackages[g].entityLimitPackageMappingDTO[m].limitPackage.accessPointValue,
                    accessPointGroupType: self.userFullData().limitPackages[g].entityLimitPackageMappingDTO[m].limitPackage.accessPointGroupType
                  });

                  node.limitPackageName = self.userFullData().limitPackages[g].entityLimitPackageMappingDTO[m].limitPackage.key.id;
                }
              }
            }
          }

          return node;
        });

        for (let k = 0; k < req_array.length; k++) {
          if (req_array[k].entityId !== self.userFullData().homeEntity) {
            arg.entityId = req_array[k].entityId;
            arg.entityName = req_array[k].entityName;
            arg.displayValue = req_array[k].userPartyRelationship.partyId.displayValue;
            arg.value = req_array[k].userPartyRelationship.partyId.value;
            arg.limitPackage = req_array[k].limitPackage;
            arg.limitPackageName = req_array[k].limitPackageName;
            arg.partyName = req_array[k].partyName;
            arg.selectedAccessPoints = req_array[k].selectedAccessPoints;
            self.addAccessibleEntity(arg);
          }
        }
      } else {
        for (let index = 0; index < self.userFullData().accessibleEntities.length; index++) {
          if (self.userFullData().accessibleEntities[index].entityId !== self.userFullData().homeEntity) {
            arg.entityId = self.userFullData().accessibleEntities[index].entityId;
            arg.entityName = self.userFullData().accessibleEntities[index].entityName;
            arg.selectedAccessPoints = self.userFullData().accessibleEntities[index].selectedAccessPoints;
            self.addAccessibleEntity(arg);
          }
        }
      }
    };

    const entityNameList = [];

    for (let c = 0; c < rootParams.dashboard.userData.userProfile.accessibleEntityDTOs.length; c++) {
      entityNameList[rootParams.dashboard.userData.userProfile.accessibleEntityDTOs[c].entityId] = rootParams.dashboard.userData.userProfile.accessibleEntityDTOs[c].entityName;
    }

    self.setEntityList = function () {
      const array = [];

      for (let i = 0; i < rootParams.dashboard.userData.userProfile.accessibleEntityDTOs.length; i++) {
        array.push(rootParams.dashboard.userData.userProfile.accessibleEntityDTOs[i]);
      }

      let index = null;

      for (let j = 0; j < array.length; j++) {
        if (array[j].entityId === self.userFullData().homeEntity) {
          index = j;
        }
      }

      array.splice(index, 1);
      self.entityList(array.slice(0));
      self.prepareAccessibleEntity();
      self.entitiesListLoaded(true);
    };

    self.setEntityList();

    self.deleteAccessibleEntity = function (index) {
      if (self.accessibleEntityArray()[index].entityId() instanceof Array) {
        self.entityList().push({
          entityId: self.accessibleEntityArray()[index].entityId()[0],
          entityName: entityNameList[self.accessibleEntityArray()[index].entityId()[0]]
        });
      } else if (self.accessibleEntityArray()[index].entityId()) {
        self.filterEntityList();

        self.entityList().push({
          entityId: self.accessibleEntityArray()[index].entityId(),
          entityName: entityNameList[self.accessibleEntityArray()[index].entityId()]
        });
      }

      self.accessibleEntityArray().splice(index, 1);
      self.tempArray = ko.observableArray(self.accessibleEntityArray.slice(0));
      self.accessibleEntityArray.removeAll();
      self.accessibleEntityArray(self.tempArray());
      self.refresh(false);
      self.refresh(true);
    };

    self.disableEntity = function () {
      if (self.accessibleEntityArray().length === 0) {
        return false;
      }

      return !self.accessibleEntityArray()[self.accessibleEntityArray().length - 1].accessibleEntitySet();
    };

    self.onselectUserSegment = function (event) {
      const value = event.detail.value;

      self.isSegmentContainsRole(false);
      self.selectedSegmentRoles([]);
      self.selectedSegmentName("");

      ko.utils.arrayForEach(self.userSegments(), function (item) {
        if (item.value === value) {
          self.selectedSegmentRoles(item.roles);
          self.selectedSegmentName(item.text);

          if (item.roles !== undefined) {
            self.isSegmentContainsRole(true);
          }
        }
      });
    };

    self.dispose = function () {
      androidDeviceSubscription.dispose();
      iosDeviceSubscription.dispose();
      androidDeviceForPushNotificationSubscription.dispose();
      iosDeviceForPushNotificationSubscription.dispose();
    };
  };
});
