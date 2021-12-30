define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/create-theme",
    "ojs/ojknockout",
    "ojs/ojcolor",
    "ojs/ojcolorspectrum",
    "ojs/ojknockout-validation",
    "ojs/ojinputtext",
    "ojs/ojradioset",
    "ojs/ojinputnumber",
    "ojs/ojaccordion",
    "ojs/ojfilepicker",
    "ojs/ojvalidationgroup",
    "ojs/ojswitch"
], function(oj, ko, $, model, locale) {
    "use strict";

    return function(params) {
        const self = this;

        self.resourceBundle = locale;
        self.validationTracker = ko.observable();
        self.validationTrackerID = "validationTrackerID" + params.baseModel.incrementIdCount();
        params.dashboard.headerName(self.resourceBundle.heading.saveTheme);
        self.currentObj = null;
        self.showPreviewTheme = ko.observable(false);
        self.modelInit = ko.observable(false);
        self.colorValue = ko.observable(new oj.Color("rgba(255,255,255,0.8)"));
        self.selectedColors = ko.observableArray();
        self.sizeUnit = "rem";
        self.themeData = {};
        self.zip = null;
        self.parameters = params.rootModel.params;
        params.baseModel.registerComponent("review-theme", "theme-config");
        params.baseModel.registerComponent("preview-theme", "theme-config");
        params.baseModel.registerComponent("help-box", "theme-config");
        params.baseModel.registerElement("color-picker");
        params.baseModel.registerElement("modal-window");
        self.currentTokens = {};
        self.skeletonStructure = {};
        self.themeProperties = ["background", "border", "hover", "size", "interaction", "selected", "typography", "shadow"];

        function flattenNestedObject(parentObject, result) {
            result = result || {};

            let property;

            for (property in parentObject) {
                if (Object.prototype.hasOwnProperty.call(parentObject, property)) {
                    if (typeof parentObject[property] === "object") {
                        flattenNestedObject(parentObject[property], result);
                    } else {
                        result[parentObject[property]] = null;
                    }
                }
            }

            return result;
        }

        self.saveTheme = function() {
            if (!params.baseModel.showComponentValidationErrors(document.getElementById(self.validationTrackerID)) || !self.zip) {
                if (!self.zip) {
                    params.baseModel.showMessages(null, [self.resourceBundle.fileInvalid], "ERROR");
                }

                return;
            }

            self.themeData.styleAsset = self.currentTokens;

            model.uploadDocument(ko.mapping.toJS(self.themeData), self.zip).done(function(data, status, jqXhr) {
                self.resetColors();

                params.dashboard.loadComponent("confirm-screen", {
                    jqXHR: jqXhr,
                    transactionName: self.resourceBundle.themeTransaction
                }, self);
            });
        };

        self.reviewTheme = function() {
            if (!params.baseModel.showComponentValidationErrors(document.getElementById(self.validationTrackerID)) || !self.zip) {
                if (!self.zip) {
                    params.baseModel.showMessages(null, [self.resourceBundle.fileInvalid], "ERROR");
                }

                return;
            }

            self.themeData.styleAsset = self.currentTokens;

            params.dashboard.loadComponent("review-theme", {
                mode: "review",
                data: ko.mapping.toJS(self.themeData),
                zip: self.zip
            }, self);
        };

        self.updateTheme = function() {
            if (!params.baseModel.showComponentValidationErrors(document.getElementById(self.validationTrackerID))) {
                return;
            }

            if (!self.zip) {
                $("#confirmZipMissing").trigger("openModal");
            } else {
                self.confirmUpdateTheme();
            }
        };

        self.confirmUpdateTheme = function() {
            self.themeData.styleAsset = self.currentTokens;

            params.dashboard.loadComponent("review-theme", {
                mode: "edit",
                data: ko.mapping.toJS(self.themeData),
                zip: self.zip,
                brandId: params.rootModel.params.data.brandId
            }, self);
        };

        self.cancelConfirmZipDialog = function() {
            $("#confirmZipMissing").trigger("closeModal");
        };

        self.setColor = function(currentObj) {
            self.currentObj = currentObj;
            $("#colorPaletteModal").trigger("openModal");
        };

        const getTargetLinkageModel = function(data) {
            const KoModel = model.getTargetLinkageModel(data);

            return ko.mapping.fromJS(KoModel);
        };

        self.resetColors = function() {
            Object.keys(self.currentTokens).forEach(function(observableStyleProp) {
                if (ko.isObservable(self.currentTokens[observableStyleProp])) {
                    self.currentTokens[observableStyleProp](null);
                }
            });

            self.showPreviewTheme(false);
            ko.tasks.runEarly();
            self.showPreviewTheme(true);
        };

        self.zipFileUploadListener = function(event) {
            self.zip = event.detail.files[0];

            $("#selectedFileNotification").html(params.baseModel.format(self.resourceBundle.fileSelection, {
                fileName: self.zip.name
            }));
        };

        self.showZipFileHelp = function() {
            $("#zipFileHelp").trigger("openModal");
        };

        self.getTokens = function() {
            return Object.keys(self.skeletonStructure).map(function(element) {
                return {
                    headerName: element
                };
            });
        };

        self.hideColorPalete = function() {
            $("#colorPaletteModal").trigger("closeModal");
        };

        self.themeProperties.forEach(function(component) {
            params.baseModel.registerComponent(component, "theme-config");
        });

        self.brandCollapsibleExpand = function(event, data) {
            $("#leftSection").animate({
                scrollTop: $("#accordionThemePage").find("#" + event.target.id).index() * 45
            }, 600);
        };

        require(["load!framework/json/theme/themes.json"], function(data) {
            const json = flattenNestedObject(data);

            json["--base-font-url"] = null;
            json["--base-font-family"] = null;

            Object.assign(self.skeletonStructure, data);
            Object.assign(self.themeData, getTargetLinkageModel());

            if (params.rootModel.params.mode === "edit") {
                params.dashboard.headerName(self.resourceBundle.heading.updateTheme);

                const theme = params.rootModel.params.data;

                Object.assign(json, theme.styleAsset);
                self.themeData.brandName(theme.brandName);
                self.themeData.brandDescription(theme.brandDescription);
                self.themeData.availableForSelection(theme.availableForSelection);
            } else if (params.rootModel.previousState) {
                self.zip = params.rootModel.previousState.zip;

                const theme = params.rootModel.previousState.data;

                Object.assign(json, theme.styleAsset);
                self.themeData.brandName(params.rootModel.previousState.data.brandName);
                self.themeData.brandDescription(params.rootModel.previousState.data.brandDescription);
                self.themeData.availableForSelection(params.rootModel.previousState.data.availableForSelection);
            }

            Object.assign(self.currentTokens, ko.mapping.fromJS(json));
            self.modelInit(true);
            self.showPreviewTheme(true);
        });

        const scrollMap = {
            header: {
                scroll: 1,
                id: "preview-header"
            },
            form: {
                scroll: 1,
                id: "form-section"
            },
            footer: {
                scroll: 1990,
                id: "preview-footer"
            },
            table: {
                scroll: 300,
                id: "table-section"
            },
            button: {
                scroll: 180,
                id: "button-section"
            },
            "button-set": {
                scroll: 380,
                id: "buttonset-section"
            },
            "nav-bar": {
                scroll: 250,
                id: "nav-section"
            },
            "modal-window": {
                scroll: 500,
                id: "modalwindow-section"
            },
            "alert-message": {
                scroll: 550,
                id: "alertbox-section"
            },
            "help-panel": {
                scroll: 850,
                id: "helppanel-section"
            },
            banner: {
                scroll: 1100,
                id: "banner-section"
            },
            "confirm-screen": {
                scroll: 1900,
                id: "confirmscreen-section"
            },
            "review-banner": {
                scroll: 1400,
                id: "review-section"
            },
            overlay: {
                scroll: 600,
                id: "overlay-section"
            }
        };

        self.listener = function(event) {
            $(window).animate({
                scrollTop: 225
            }, 600);

            const composedPath = event.composedPath();

            if (composedPath[0].attributes[3] && composedPath[0].attributes[3].value !== "group" && scrollMap[composedPath[0].attributes[3].value]) {
                $("#previewTheme").animate({
                    scrollTop: scrollMap[composedPath[0].attributes[3].value].scroll
                }, 600);

                setTimeout(function() {
                    $("#" + scrollMap[composedPath[0].attributes[3].value].id).addClass("highlightElement");
                }, 600);

                setTimeout(function() {
                    $("#" + scrollMap[composedPath[0].attributes[3].value].id).removeClass("highlightElement");
                }, 2600);
            }
        };
    };
});