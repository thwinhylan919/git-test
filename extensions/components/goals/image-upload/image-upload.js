define([
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/image-upload",
    "ojs/ojknockout"
], function(ko, $, model, locale) {
    "use strict";

    return function(rootParams) {
        const self = this;

        ko.utils.extend(self, rootParams.rootModel);

        self.file = rootParams.file;
        self.target = rootParams.imageId;
        self.input = rootParams.fileId;
        self.previewImage = rootParams.preview;
        self.initials = rootParams.initials;
        self.defaultImagePath = rootParams.defaultImagePath || null;
        self.contentId = rootParams.contentId || ko.observable();
        self.uploadHandlerRequired = rootParams.uploadHandlerRequired;
        self.label = rootParams.label;
        self.nls = locale;
        self.imageNotUploaded = ko.observable(!(rootParams.preview && rootParams.preview()));
        self.maxFileSize = rootParams.maxFileSize ? rootParams.maxFileSize : ko.observable(self.nls.maxSize);
        self.removeImageFlag = ko.observable(false);
        self.refreshAvatar = ko.observable(true);
        self.isRemoveAllowed = rootParams.isRemoveAllowed || ko.observable(true);

        if (rootParams.fileTypeArray) {
            self.fileTypeArray = rootParams.fileTypeArray;
        } else {
            self.fileTypeArray = ko.observableArray(["image/jpeg", "image/png"]);
        }

        self.template = rootParams.template ? rootParams.template : null;
        rootParams.baseModel.registerComponent("file-input", "file-upload");

        self.imageChangeHandler = function(value) {
            ko.tasks.runEarly();

            if (value) {
                document.getElementById("avatar-image-upload").setAttribute("src", value);
            } else {
                document.getElementById("avatar-image-upload").setAttribute("src", null);
                self.refreshAvatar(false);
                ko.tasks.runEarly();
                self.refreshAvatar(true);
            }
        };

        const previewImage = self.previewImage.subscribe(self.imageChangeHandler);

        self.dispose = function() {
            previewImage.dispose();
        };

        function readURL() {
            if (self.file()) {
                if (!(self.fileTypeArray().indexOf(self.file().type) > -1)) {
                    rootParams.baseModel.showMessages(null, [self.nls.fileTypeError], "ERROR");
                    self.file("");
                    document.getElementById(self.input()).value = "";

                    return;
                }

                if (self.file().size <= 0) {
                    rootParams.baseModel.showMessages(null, [self.nls.emptyFileErrorMsg], "ERROR");
                    self.file("");
                    document.getElementById(self.input()).value = "";

                    return;
                } else if (self.file().size > self.maxFileSize()) {
                    rootParams.baseModel.showMessages(null, [rootParams.baseModel.format(self.nls.fileSizeErrorMsg, {
                        fileSize: self.maxFileSize() / 1000
                    })], "ERROR");

                    self.file("");
                    document.getElementById(self.input()).value = "";

                    return;
                }

                const reader = new FileReader();

                reader.onload = function(e) {
                    self.previewImage(e.target.result);

                    if (rootParams.dashboard.appData.segment === "ADMIN") { $("#" + self.target()).attr("src", e.target.result); }
                };

                reader.readAsDataURL(self.file());
                self.imageNotUploaded(false);

                if (self.uploadHandlerRequired) { self.uploadImage(); }
            }
        }

        const imageFunction = function() {
            self.file(document.getElementById(self.input()).files[0]);

            if (self.imageCallBackHandler) {
                self.imageCallBackHandler(self.file());
            }

            readURL(this);
        };

        self.afterRender = function() {
            $("#" + self.input()).change(imageFunction);
        };

        if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
            rootParams.baseModel.showMessages(null, [self.nls.alertMessage], "INFO");
        }

        function handleFileSelect(evt) {
            evt.stopPropagation();
            evt.preventDefault();

            const files = evt.dataTransfer.files,
                targetId = evt.currentTarget.id.split("_")[1];

            if (self.input() === targetId) {
                for (let i = 0; i < files.length; i++) {
                    self.file(files[i]);
                    readURL(this);
                }
            }
        }

        function handleDragOver(evt) {
            evt.stopPropagation();
            evt.preventDefault();
            evt.dataTransfer.dropEffect = "copy";
        }

        function addListner() {
            const dropZone = document.getElementsByClassName("uploadImage-fileUpload");

            for (let i = 0; i < dropZone.length; i++) {
                dropZone[i].addEventListener("dragover", handleDragOver, false);
                dropZone[i].addEventListener("drop", handleFileSelect, false);
            }
        }

        addListner();

        self.uploadImage = function() {
            const form = new FormData();

            form.append("file", self.file());

            if (rootParams.moduleIdentifier) { form.append("moduleIdentifier", rootParams.moduleIdentifier); }

            if (rootParams.isThumbnail) { form.append("isThumbnail", "true"); } else { form.append("isThumbnail", "false"); }

            model.uploadImage(form).done(function(data) {
                if (data && data.contentDTOList[0] && data.contentDTOList[0].contentId) {
                    self.contentId(data.contentDTOList[0].contentId.value);
                }
            });
        };

        self.retrieveImage = function() {
            model.retrieveImage(self.contentId()).done(function(data) {
                if (data && data.contentDTOList[0]) {
                    $("#" + self.target()).attr("src", "data:image/gif;base64," + data.contentDTOList[0].content);
                }
            });
        };

        self.removePreviewImage = function() {
            self.imageNotUploaded(true);
            $("#" + self.target()).attr("src", "");
            self.file("");
            ko.tasks.runEarly();
            document.getElementById(self.input()).value = "";
            addListner();
        };

        self.remove = function() {
            model.deleteImage(self.contentId()).done(function() {
                $("#" + self.target()).attr("src", "");
            });
        };

        self.removeImageCheck = function() {
            self.removeImageFlag(true);
        };

        self.closeRemove = function() {
            self.removeImageFlag(false);
        };

        self.removeImage = function() {
            if (self.imageCallBackHandler) {
                self.imageCallBackHandler();
            }

            self.imageNotUploaded(true);
            self.file("");
            self.removeImageFlag(false);
            ko.tasks.runEarly();
            document.getElementById(self.input()).value = "";
            self.previewImage("");
            self.contentId(null);

            if (rootParams.dashboard.appData.segment === "ADMIN") { self.removeImageModal("closeModal"); }
        };

        self.uploadProfileImage = function() {
            $("#" + self.input() + ":hidden").trigger("click");
        };

        self.removeImageModal = function(data) {
            $("#removeImage").trigger(data);
        };
    };
});