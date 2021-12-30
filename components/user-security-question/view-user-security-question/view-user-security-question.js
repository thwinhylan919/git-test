define([

    "knockout",

    "./model",
    "ojL10n!resources/nls/user-security-question",
    "ojs/ojselectcombobox",
    "ojs/ojknockout-validation",
    "ojs/ojpagingcontrol",
    "ojs/ojknockout",
    "ojs/ojnavigationlist",
    "ojs/ojarraytabledatasource",
    "ojs/ojtable"
], function (ko, viewUserSecurityQuestionModel, ResourceBundle) {
    "use strict";

    return function (rootParams) {
        const self = this;

        ko.utils.extend(self, rootParams.rootModel);
        self.nls = ResourceBundle;

        rootParams.baseModel.registerComponent("create-user-security-question", "user-security-question");
        rootParams.baseModel.registerComponent("edit-user-security-question", "user-security-question");
        rootParams.baseModel.registerComponent("user-login-configuration-header", "user-login-configuration");

        if (rootParams.dashboard.userData.firstLoginFlowDone) {
            rootParams.dashboard.headerName(rootParams.dashboard.appData.segment === "ADMIN" ? self.nls.userSecurityQuestion.headers.userSecurityQuestion : self.nls.userSecurityQuestion.headers.headerName);
        }

        self.questionList = ko.observableArray();
        self.userQuestionList = ko.observableArray();
        self.questionListMap = {};
        self.userQuestionListMap = {};
        self.isQuestionListLoaded = ko.observable(false);
        self.isUserQuestionListLoaded = ko.observable(false);
        self.showCreateScreen = ko.observable(false);
        self.noOfQuesToConfigure = ko.observable();

        self.back = function () {
            history.back();
        };

        const roles = rootParams.dashboard.userData.userProfile.roles;
        let userSegment;

        for (let k = 0; k < roles.length; k++) {
            if (roles[k] === "Administrator") {
                userSegment = "administrator.NO_QUE_ANS";
                break;
            } else if (roles[k] === "RetailUser") {
                userSegment = "retailuser.NO_QUE_ANS";
                break;
            } else if (roles[k] === "CorporateUser") {
                userSegment = "corporateuser.NO_QUE_ANS";
                break;
            }
        }

        viewUserSecurityQuestionModel.fetchQuestionConfiguration(userSegment).done(function (data) {
            self.noOfQuesToConfigure(data.noOfQuestions);
        });

        viewUserSecurityQuestionModel.fetchQuestions().done(function (data) {
            if (data.secQueList) {
                self.questionList(data.secQueList[0].secQueMapping);

                if (self.questionList().length === 0) {
                    rootParams.baseModel.showMessages(null, [self.nls.userSecurityQuestion.labels.questionConfigErrorMsg], "ERROR");
                }

                for (let i = 0; i < self.questionList().length; i++) {
                    self.questionListMap[self.questionList()[i].questionId] = self.questionList()[i].question;
                }

                self.isQuestionListLoaded(true);
            }
        });

        viewUserSecurityQuestionModel.fetchUserQuestions().done(function (data) {
            self.userQuestionList(data.userSecurityQuestionDTOList);

            if (self.userQuestionList().length === 0) {
                self.showCreateScreen(true);
            } else {
                for (let i = 0; i < self.userQuestionList().length; i++) {
                    self.userQuestionListMap[self.userQuestionList()[i].questionId] = self.userQuestionList()[i].answer;
                }
            }

            self.isUserQuestionListLoaded(true);
        });

        self.openCreateMode = function () {
            rootParams.dashboard.loadComponent("create-user-security-question", {
                mode: "CREATE",
                data: self.noOfQuesToConfigure,
                loadNextComponent: rootParams.rootModel.params.loadNextComponent,
                componentMandatory: rootParams.rootModel.params.componentMandatory
            });
        };

        self.showEditScreen = function () {
            rootParams.dashboard.loadComponent("edit-user-security-question", {
                mode: "EDIT",
                data: self.noOfQuesToConfigure,
                loadNextComponent: rootParams.rootModel.params.loadNextComponent,
                componentMandatory: rootParams.rootModel.params.componentMandatory
            });
        };
    };
});