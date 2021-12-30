define([
  "knockout",

  "./model",
  "ojL10n!resources/nls/file-identifier-create",
  "ojs/ojinputtext",
  "ojs/ojselectcombobox",
  "ojs/ojtable",
  "ojs/ojarraytabledatasource",
  "ojs/ojradioset"
], function (ko, FiRegistrationModel, resourceBundle) {
  "use strict";

  return function (rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel.params);
    self.Nls = resourceBundle.fileIdentifierCreate;
    rootParams.baseModel.registerComponent("review-file-identifier-create", "file-upload");

    const getNewKoModel = function () {
      const KoModel = FiRegistrationModel.getNewModel();

      return ko.mapping.fromJS(KoModel);
    };

    rootParams.dashboard.headerName(self.Nls.fIMaintenance);
    self.partyId = ko.observable();
    self.validationTracker = ko.observable();

    let clause = true;

    if (self.fiRegistrationPayload) { clause = false; }

    self.templates = self.templates || ko.observableArray();
    self.debitAccountNumbers = self.debitAccountNumbers || ko.observableArray();
    self.templatesMap = self.templatesMap || {};
    self.isTemplateChanged = self.isTemplateChanged || ko.observable(false);
    self.selectedTemplate = self.selectedTemplate || ko.observable();
    self.isTemplatesLoaded = self.isTemplatesLoaded || ko.observable(false);
    self.isFileFormatTypesLoaded = self.isFileFormatTypesLoaded || ko.observable(false);
    self.isAccountTypesLoaded = self.isAccountTypesLoaded || ko.observable(false);
    self.isFileTypesLoaded = self.isFileTypesLoaded || ko.observable(false);
    self.fileFormatTypesMap = self.fileFormatTypesMap || {};
    self.accountTypesMap = self.accountTypesMap || {};
    self.fileTypesMap = self.fileTypesMap || {};
    self.isDisabled = self.isDisabled || ko.observable(false);
    self.isDebitAccountsLoaded = self.isDebitAccountsLoaded || ko.observable(true);
    self.debitAccountsMap = self.debitAccountsMap || {};
    self.isTemplateValid = self.isTemplateValid || ko.observable(false);
    self.isAccountTypeValid = self.isAccountTypeValid || ko.observable(false);
    self.admin = ko.observable();
    self.fiRegistrationPayload = self.fiRegistrationPayload || getNewKoModel().partyFiRegistrationModel;

    self.headers = [
      self.Nls.fuid,
      self.Nls.review,
      self.Nls.success
    ];

    if (rootParams.rootModel.previousState) {
      const prevData = rootParams.rootModel.previousState;

      self.approvalTypes = prevData.approvalTypes;
      self.isApprovalTypesLoaded = prevData.isApprovalTypesLoaded;
      self.isTransactionTypesLoaded = prevData.isTransactionTypesLoaded;
      self.transactionTypesMap = prevData.transactionTypesMap;
      self.approvalTypesMap = prevData.approvalTypesMap;
      self.partyDetail = prevData.partyDetail;
      self.fiRegistrationPayload = prevData.fiRegistrationPayload;
      self.selectedTemplate = prevData.selectedTemplate;
      self.isAccountTypesLoaded = prevData.isAccountTypesLoaded;
      self.isFileTypesLoaded = prevData.isFileTypesLoaded;
      self.templates = prevData.templates;
      self.debitAccountNumbers = prevData.debitAccountNumbers;
      self.templatesMap = prevData.templatesMap;
      self.isTemplateChanged = prevData.isTemplateChanged;
      self.isTemplatesLoaded = prevData.isTemplatesLoaded;
      self.isFileFormatTypesLoaded = prevData.isFileFormatTypesLoaded;
      self.fileFormatTypesMap = prevData.fileFormatTypesMap;
      self.accountTypesMap = prevData.accountTypesMap;
      self.fileTypesMap = prevData.fileTypesMap;
      self.isDebitAccountsLoaded = prevData.isDebitAccountsLoaded;
      self.debitAccountsMap = prevData.debitAccountsMap;
      self.isTemplateValid = prevData.isTemplateValid;
      self.isAccountTypeValid = prevData.isAccountTypeValid;
      self.admin = prevData.admin;
    }

    if (clause) {
      FiRegistrationModel.getFileTypes().done(function (data) {
        for (let i = 0; i < data.enumRepresentations[0].data.length; i++) {
          self.fileTypesMap[data.enumRepresentations[0].data[i].code] = data.enumRepresentations[0].data[i].description;
        }

        self.isFileTypesLoaded(true);
      });

      FiRegistrationModel.getFileFormatTypes().done(function (data) {
        for (let i = 0; i < data.enumRepresentations[0].data.length; i++) {
          self.fileFormatTypesMap[data.enumRepresentations[0].data[i].code] = data.enumRepresentations[0].data[i].description;
        }

        self.isFileFormatTypesLoaded(true);
      });

      FiRegistrationModel.getAccountingTypes().done(function (data) {
        for (let i = 0; i < data.enumRepresentations[0].data.length; i++) {
          self.accountTypesMap[data.enumRepresentations[0].data[i].code] = data.enumRepresentations[0].data[i].description;
        }

        self.isAccountTypesLoaded(true);
      });

      self.getCorpTemplate = function () {
        FiRegistrationModel.listTemplates().done(function (data) {
          for (let i = 0; i < data.listResponseDTO.length; i++) {
            self.templates.push(data.listResponseDTO[i].templateDTO);
            self.templatesMap[data.listResponseDTO[i].templateDTO.templateId] = data.listResponseDTO[i].templateDTO;
          }

          self.isTemplatesLoaded(true);
        });
      };

      self.getAdminTemplate = function () {
        FiRegistrationModel.listAdminTemplates().done(function (data) {
          for (let i = 0; i < data.listResponseDTO.length; i++) {
            self.templates.push(data.listResponseDTO[i].templateDTO);
            self.templatesMap[data.listResponseDTO[i].templateDTO.templateId] = data.listResponseDTO[i].templateDTO;
          }

          self.isTemplatesLoaded(true);
        });
      };

      if (self.partyDetail) {
        self.getCorpTemplate();
        self.admin(false);
      } else {
        self.getAdminTemplate();
        self.admin(true);
      }

      if (self.partyDetail) {
        FiRegistrationModel.listDebitAccountNumbers(self.partyDetail.party.value()).done(function (data) {
          self.isDebitAccountsLoaded(false);

          for (let i = 0; i < data.accounts[0].accountsList.length; i++) {
            self.debitAccountsMap[data.accounts[0].accountsList[i].accountNumber.value] = data.accounts[0].accountsList[i].accountNumber.displayValue;

            self.debitAccountNumbers.push({
              displayValue: data.accounts[0].accountsList[i].accountNumber.displayValue,
              code: data.accounts[0].accountsList[i].accountNumber.value
            });
          }

          self.isDebitAccountsLoaded(true);
        });
      }
    }

    self.onTemplateChanged = function (event) {
      if (event.detail.value) {
        self.selectedTemplate(self.templatesMap[event.detail.value]);
        self.fiRegistrationPayload.approvalType(null);
        self.isDisabled(false);
        self.isAccountTypeValid(true);

        if (self.selectedTemplate().fiLevelAcct === "Y") {
          self.isTemplateValid(true);
        } else {
          self.isTemplateValid(false);
        }

        if (self.selectedTemplate().accountingType === "SDMC") {
          self.isAccountTypeValid(false);
          self.fiRegistrationPayload.approvalType("F");
          self.isDisabled(true);
        }

        if (self.selectedTemplate().accountingType === "MDMC") {
          self.fiRegistrationPayload.approvalType("R");
          self.isDisabled(true);
        }

        if (self.selectedTemplate().financial === false) {
          self.isAccountTypesLoaded(false);
        } else {
          self.isAccountTypesLoaded(true);
        }

        self.isTemplateChanged(true);
      }
    };

    self.initiate = function () {
      if (!rootParams.baseModel.showComponentValidationErrors(self.validationTracker())) {
        return;
      }

      if (self.fiRegistrationPayload.approvalType() === null) {
        rootParams.baseModel.showMessages(null, [self.Nls.selectAprrovalType], "INFO");

        return;
      }

      self.fiRegistrationPayload.templateId(self.fiRegistrationPayload.templateId() + "");

      if (self.partyDetail) {
        self.fiRegistrationPayload.partyId(self.partyDetail.party.value());
      }

      self.fiRegistrationPayload.approvalType(self.fiRegistrationPayload.approvalType() + "");

      if (self.fiRegistrationPayload.debitAccountNumber()) { self.fiRegistrationPayload.debitAccountNumber(self.fiRegistrationPayload.debitAccountNumber() + ""); }

      self.fiRegistrationPayloadToSend = ko.mapping.toJS(self.fiRegistrationPayload);

      const params = {
        approvalTypes: self.approvalTypes,
        isApprovalTypesLoaded: self.isApprovalTypesLoaded,
        isTransactionTypesLoaded: self.isTransactionTypesLoaded,
        transactionTypesMap: self.transactionTypesMap,
        approvalTypesMap: self.approvalTypesMap,
        mode: "review",
        data: self.fiRegistrationPayloadToSend,
        partyDetail: self.partyDetail,
        fiRegistrationPayload: self.fiRegistrationPayload,
        selectedTemplate: self.selectedTemplate,
        isAccountTypesLoaded: self.isAccountTypesLoaded,
        isFileTypesLoaded: self.isFileTypesLoaded,
        templates: self.templates,
        debitAccountNumbers: self.debitAccountNumbers,
        templatesMap: self.templatesMap,
        isTemplateChanged: self.isTemplateChanged,
        isTemplatesLoaded: self.isTemplatesLoaded,
        isFileFormatTypesLoaded: self.isFileFormatTypesLoaded,
        fileFormatTypesMap: self.fileFormatTypesMap,
        accountTypesMap: self.accountTypesMap,
        fileTypesMap: self.fileTypesMap,
        isDebitAccountsLoaded: self.isDebitAccountsLoaded,
        debitAccountsMap: self.debitAccountsMap,
        isTemplateValid: self.isTemplateValid,
        isAccountTypeValid: self.isAccountTypeValid,
        admin: self.admin,
        Back: "back",
        Confirm: "confirm",
        FiRegistrationModel: FiRegistrationModel

      };

      rootParams.dashboard.loadComponent("review-file-identifier-create", params);
    };

    self.submit = function () {
      let partyId = null;

      if (self.partyDetail) {
        partyId = self.fiRegistrationPayload.partyId();
      } else {
        partyId = "ADMIN";
      }

      const fiRegistrationPayload = ko.toJSON(self.fiRegistrationPayloadToSend);

      FiRegistrationModel.registerFiPayment(fiRegistrationPayload, partyId).done(function (data, status, jqXhr) {
        rootParams.dashboard.loadComponent("confirm-screen", {
          jqXHR: jqXhr,
          transactionName: self.Nls.transactionName
        }, self);
      });
    };

    self.clearData = function () {
      self.fiRegistrationPayload = getNewKoModel().partyFiRegistrationModel;
      self.isTemplateChanged(false);
      self.selectedTemplate(null);
    };

    self.back = function () {
      history.go(-1);
    };

    if (self.partyDetails) {
      if (!self.partyDetail.partyId()) {
        self.clearData();
      }
    }
  };
});