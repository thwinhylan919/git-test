define([

  "knockout",
  "jquery",

  "ojL10n!resources/nls/service-requests-track",
  "./model",
  "jqueryui-amd/widgets/sortable",
  "ojs/ojinputnumber",
  "ojs/ojinputtext",
  "ojs/ojselectcombobox"
], function (ko, $, ResourceBundle, ServiceRequestsDetailModel) {
  "use strict";

  return function (params) {
    const self = this;

    ko.utils.extend(self, params.rootModel.params);
    self.validationTracker = params.validator;
    self.resource = ResourceBundle;
    self.serviceRequestId = ko.observable();
    self.serviceRequestId(params.rootModel.params.serviceRequestId);
    self.dataLoad = ko.observable(false);
    self.statusLoad = ko.observable(false);
    self.statusData = ko.observable();
    self.severityData = ko.observable();
    self.requestTypeData = ko.observable();
    self.detailsLoad = ko.observable(false);
    self.dataFill = ko.observableArray();
    self.showModal = ko.observable(false);
    self.showModalUpdate = ko.observable(false);
    self.transactionName = ko.observable();
    self.completed = ko.observable(false);
    self.updatedStatus = ko.observable();
    self.comments = ko.observableArray();
    self.statusArray = ko.observableArray();
    self.applicableStatus = ko.observableArray();
    self.commentShow = ko.observable(false);
    self.completedCount = 0;
    self.commentVisible = ko.observable(false);
    params.dashboard.headerName(self.resource.serviceRequestHeader);
    params.baseModel.registerElement("confirm-screen");

    let i;

    self.loadFormBuilder = function () {
      self.backFromDetails = ko.observable(true);
      params.baseModel.registerComponent("service-requests-base", "service-requests");
      params.dashboard.loadComponent("service-requests-base", {});
    };

    self.openRetailDashboard = function () {
      params.dashboard.switchModule();
    };

    ServiceRequestsDetailModel.fetchProductsDetail(self.serviceRequestId()).done(
      function (data) {
        self.serviceRequestData = data.response;

        if (self.serviceRequestData.comments) {
          self.comments().push({
            comment: self.serviceRequestData.comments,
            date: self.serviceRequestData.lastUpdatedDate,
            user: self.serviceRequestData.userID,
            status: self.serviceRequestData.status,
            visible:self.commentVisible()
          });
        }

        if (data.historyDetails) {
          for (i = 0; i < data.historyDetails.length - 1; i++) {
            if (data.historyDetails[i].status === "CO") {
              self.completedCount += 1;

              if (self.completedCount === 1) {
                self.commentVisible(true);
              } else {
                self.commentVisible(false);
              }
            }

            self.comments().push({
              comment: data.historyDetails[i].comments,
              date: data.historyDetails[i].creationDate,
              user: data.historyDetails[i].userID,
              status: data.historyDetails[i].status,
              visible: self.commentVisible()
            });
          }

          self.commentShow(true);
        }

        self.updatedStatus(self.serviceRequestData.status);

        if (self.serviceRequestData.status === "PE") {
          self.completed(false);
        } else {
          self.completed(true);
        }

        self.transactionName(self.serviceRequestData.definition.name);
        self.creationDate = self.serviceRequestData.creationDate;

        ServiceRequestsDetailModel.fetchStatuses().done(function (data) {
          for (i = 0; i < data.enumRepresentations[0].data.length; i++) {
            self.statusArray().push({
              code: data.enumRepresentations[0].data[i].code,
              description: data.enumRepresentations[0].data[i].description
            });

            if (self.serviceRequestData.status === data.enumRepresentations[0].data[i].code) {
              self.statusData(data.enumRepresentations[0].data[i].description);
            }
          }

          let p;

          for (p = 0; p < self.serviceRequestData.definition.allowedStatuses.length; p++) {
            for (i = 0; i < data.enumRepresentations[0].data.length; i++) {
              if (self.serviceRequestData.definition.allowedStatuses[p] === data.enumRepresentations[0].data[i].code) {
                self.applicableStatus().push({
                  code: data.enumRepresentations[0].data[i].code,
                  description: data.enumRepresentations[0].data[i].description
                });
              }
            }
          }

          self.statusLoad(true);
        });

        ServiceRequestsDetailModel.fetchSeverity().done(function (data) {
          for (i = 0; i < data.enumRepresentations[0].data.length; i++) {
            if (self.serviceRequestData.definition.priorityType === data.enumRepresentations[0].data[i].code) {
              self.severityData(data.enumRepresentations[0].data[i].description);
              break;
            }
          }
        });

        ServiceRequestsDetailModel.fetchRequestTypes().done(function (data) {
          for (i = 0; i < data.enumRepresentations[0].data.length; i++) {
            if (self.serviceRequestData.definition.requestType === data.enumRepresentations[0].data[i].code) {
              self.requestTypeData(data.enumRepresentations[0].data[i].description);
              break;
            }
          }
        });

        const parseData = $.parseHTML(self.serviceRequestData.requestData),
          requestData = JSON.parse(parseData[0].data);

        for (i = 0; i < requestData.elements.length; i++) {
          if (requestData.elements[i].displayValues.length) {
            self.dataFill.push(requestData.elements[i]);
          }
        }

        self.dataLoad(true);
        self.detailsLoad(true);
      }
    );

    $(document).off("keyup", "#remarksBox");

    $(document).on("keyup", "#remarksBox", function () {
      if ($("#remarksBox").val().length > 0) {
        self.disableApproveRejectButton(false);
      } else {
        self.disableApproveRejectButton(true);
      }
    });

    self.submit = function () {
      $("#otherTransactionsApproval").hide().trigger("closeModal");
      self.fireTransactions(self.serviceRequest());
    };

    self.cancelModal = function () {
      $("#otherTransactionsApproval").hide().trigger("closeModal");
    };

    self.submitUpdate = function () {
      $("#updateStatus").hide().trigger("closeModal");
      self.fireTransactions(self.serviceRequest());
    };

    self.cancelModalUpdate = function () {
      $("#updateStatus").hide().trigger("closeModal");
    };

    self.showModalWindowUpdate = function () {
      self.natureOfTask("");
      self.remarks("");
      self.showModalUpdate(true);
      $("#updateStatus").trigger("openModal", "textarea");
    };

    self.showModalWindow = function (nature) {
      self.natureOfTask(nature);
      self.remarks("");
      self.showModal(true);
      ko.tasks.runEarly();
      $("#otherTransactionsApproval").trigger("openModal");
    };

    self.getMessage = function () {
      let displayMsg;

      if (self.approvalStatus === "RE") {
        displayMsg = self.resource.rejected;
      } else {
        displayMsg = self.resource.completed;
      }

      return displayMsg;
    };

    self.fireTransactions = function (id) {
      let status = "";

      if (self.natureOfTask() === "APPROVE") {
        self.approvalStatus = "CO";
        status = "CO";
      } else if (self.natureOfTask() === "REJECT") {
        status = "RE";
        self.approvalStatus = "RE";
      } else {
        status = self.updatedStatus();
        self.approvalStatus = self.updatedStatus();
      }

      if (status === "RE" || status === "CO") {
        ServiceRequestsDetailModel.approveRejectSR(id, self.remarks(), status).done(function (data, status, jqXhr) {
          self.backFromDetails = ko.observable(true);

          params.dashboard.loadComponent("confirm-screen", {
            jqXHR: jqXhr,
            srNo: self.serviceRequestId(),
            transactionName: self.transactionName(),
            transactionStatus: self.approvalStatus,
            confirmScreenExtensions: {
              confirmScreenStatusEval: self.getMessage,
              isSet: true,
              template: "service-request/service-request-confirm"
            }
          }, self);
        });
      } else {
        ServiceRequestsDetailModel.approveRejectSR(id, self.remarks(), status).done(function () {
          self.serviceRequest = ko.observable();
          params.baseModel.registerComponent("service-requests-admin-track", "service-requests");

          params.dashboard.loadComponent("service-requests-admin-track", {
            serviceRequestId: self.serviceRequestId()
          }, self);
        });
      }
    };

    self.getFile = function (data) {
      ServiceRequestsDetailModel.readFile(data.values[0]);
    };
  };
});