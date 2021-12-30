define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "ojL10n!resources/nls/user-map"
], function (oj, ko, $, resourceBundle) {
  "use strict";

  return function (rootParams) {
    const self = this;

    self.Nls = resourceBundle.userMap;
    ko.utils.extend(self, rootParams.rootModel.params);
    rootParams.dashboard.headerName(self.Nls.userfimap);

    const mappedUsers = rootParams.rootModel.params.data.fileIdentifers();

    self.fileIdentifierList = ko.observableArray(rootParams.rootModel.params.fileIdentifierList);
    self.approvalTypesMap = rootParams.rootModel.params.approvalTypesMap;
    self.transactionTypesMap = rootParams.rootModel.params.transactionTypesMap;
    self.confirm = rootParams.rootModel.params.confirm;
    self.back = rootParams.rootModel.params.back;
    self.partyDetails = ko.observable(rootParams.rootModel.params.partyDetails);
    self.selectedUser = ko.observable(rootParams.rootModel.params.selectedUser);
    self.datasource = ko.observable();

    for (let i = 0; i < self.fileIdentifierList().length; i++) {
      const data = self.fileIdentifierList()[i];

      data.approvalDesc = self.approvalTypesMap[data.approvalType];

      if (data.fileTemplateDTO) {
        data.transactionDesc = self.transactionTypesMap[data.fileTemplateDTO.transaction];
      }

      data.description = data.fileIdentifier + "-" + data.description;

      for (let j = 0; j < mappedUsers.length; j++) {
        if (mappedUsers[j].fileIdentifier === data.fileIdentifier) {
          data.isMapped = ko.observable(true);

          if (mappedUsers[j].sensitiveCheck) {
            data.sensitiveCheck = true;
          }

          break;
        } else {
          data.isMapped = ko.observable(false);
        }
      }

      self.fileIdentifierList[i] = data;
    }

    self.datasource(new oj.ArrayTableDataSource(self.fileIdentifierList, {
      idAttribute: "fileIdentifier"
    }));

    self.back = function () {
      history.go(-1);
    };

    self.renderCheckBox = function (context) {
      const checkBoxRv = $(document.createElement("input")),
        labelRv = $(document.createElement("label"));

      checkBoxRv.attr("type", "checkbox");
      checkBoxRv.attr("value", context.row.fileIdentifier);
      checkBoxRv.attr("name", "selectionRv");
      labelRv.attr("class", "oj-checkbox-label hide-label");
      checkBoxRv.attr("id", context.row.fileIdentifier + "_labelIDRv");
      labelRv.attr("for", context.row.fileIdentifier + "_labelIDRv");
      labelRv.text(self.Nls.childCheckBox);
      checkBoxRv.prop("disabled", true);

      if (context.row.isMapped()) {
        checkBoxRv.prop("checked", true);
      }

      $(context.cellContext.parentElement).append(checkBoxRv);
      $(context.cellContext.parentElement).append(labelRv);
    };

    self.renderHeaderCheckBox = function (context) {
      const checkBoxRv = $(document.createElement("input")),
        labelRv = $(document.createElement("label"));

      checkBoxRv.attr("type", "checkbox");
      checkBoxRv.attr("value", "selectAllRv");
      checkBoxRv.attr("name", "selectionParentRv");
      checkBoxRv.attr("id", "headerbox_labelIDRv");
      labelRv.attr("class", "oj-checkbox-label hide-label");
      labelRv.attr("for", "headerbox_labelIDRv");
      labelRv.text(self.Nls.headerCheckBox);
      checkBoxRv.prop("disabled", true);
      $(context.headerContext.parentElement.firstElementChild.firstChild).append(checkBoxRv);
      $(context.headerContext.parentElement.firstElementChild.firstChild).append(labelRv);
    };

    self.renderSensitiveDataCheckBox = function (context) {
      const senstiveDataCheckBoxRv = $(document.createElement("input")),
        labelRv = $(document.createElement("label"));

      senstiveDataCheckBoxRv.attr("type", "checkbox");
      senstiveDataCheckBoxRv.attr("value", context.row.sensitiveCheck);
      senstiveDataCheckBoxRv.attr("name", "sensitiveCheck");
      labelRv.attr("class", "oj-checkbox-label  hide-label");
      senstiveDataCheckBoxRv.attr("id", context.row.fileIdentifier + "_labelID2");
      labelRv.attr("for", context.row.fileIdentifier + "_labelID2");
      senstiveDataCheckBoxRv.prop("disabled", true);
      labelRv.text(self.Nls.childCheckBox);
      senstiveDataCheckBoxRv.prop("checked", context.row.sensitiveCheck);
      $(context.cellContext.parentElement).append(senstiveDataCheckBoxRv);
      $(context.cellContext.parentElement).append(labelRv);
    };

    $(document).on("ojready", function () {
      $("input[name=selectionParentRv]").prop("checked", $("input[name=selectionRv]:checked").length === $("input[name=selectionRv]").length);
    });
  };
});