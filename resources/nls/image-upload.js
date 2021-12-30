define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";

  const AccountInputLocale = function() {
    return {
      root: {
        drag: "Drag files here",
        or: "Or",
        remove: "Remove",
        removeImage: "Remove Image",
        removeImageTitle: "Click to Remove Image",
        fileUpload: "File Upload",
        goalImage: "Goal Category Image",
        goalImageTitle: "Goal Category Image",
        maxFileSize: "Image size should not exceed {fileSize} KB. Upload .JPG and .PNG files only.",
        emptyFileErrorMsg: "The uploaded file is empty, Please upload a valid file.",
        fileSizeErrorMsg: "The uploaded file exceeds the maximum permissible size of {fileSize} KB. Please reduce the file size and try again.",
        fileTypeError: "Invalid file type. Upload .JPG and .PNG files only.",
        maxSize: "1000000",
        generic: Generic,
        alertMessage: "The File API is not fully supported in this browser.",
        uploadPhoto: "Upload Photo",
        change: "Change",
        maxFileSizeInfo: "Max image size - {fileSize} KB.",
        fileFormatInfo: "File format - .JPG and .PNG",
        removePhoto: "Do you want to remove the photo?",
        alt: {
          change: "Change",
          remove: "Remove",
          uploadPhoto: "Upload Photo"
        },
        warning: "Warning"
      },
      ar: false,
      fr: true,
      cs: false,
      sv: false,
      en: false,
es :true,
      "en-us": false,
      el: false
    };
  };

  return new AccountInputLocale();
});