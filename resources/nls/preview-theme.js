define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";

  const PreviewThemeLocale = function() {
    return {
      root: {
        generic: Generic,
        labels: {
          name: "Font Name",
          "header-font": "Header Font Size",
          "menu-item-font-size": "Menu Font Size",
          primaryBtn: "Primary Button",
          secondaryBtn: "Secondary Button",
          tertiaryBtn: "Tertiary Button",
          helpBtn: "Help Button",
          "btn-font-size": "Button Font Size",
          confirmText: "Confirmation",
          errorText: "Error"
        },
        sampleTxt: {
          form: "Form Header",
          label: "Label Color",
          anchorTxt: "Anchor Text Color",
          sampleTxt: "Open banking is an emerging trend in financial technology, one based on using API that enable third party providers to build applications and services around a financial institution",
          home: "Home",
          "confirm-screen":"Transaction Submitted Successfully",
          "error-screen":"Maintenance rejected",
          "review-screen":"Review transaction before you confirm!",
          aboutUs: "About Us",
          font: "Font Color",
          input: "Input Properties",
          primaryBtn: "Primary Button Properties",
          secondaryBtn: "Secondary Button Properties",
          tertiaryBtn: "Tertiary Button Properties",
          helpBtn: "Help Button Properties",
          footer: "Copyright © 2006, 2017, Oracle and/or its affiliates. All rights reserved.",
          option1:"Option 1",
          option2:"Option 2",
          option3:"Option 3",
          navBarDescription:"Sample Navigation Bar",
          btnSetLabel:"Button Set",
          showmodalWindow:"Show Modal Window",
          showAlertBox:"Show Alert Box",
          demoModalTxt:"Demo Modal Window",
          demoAlertTxt:"Demo Alert Text",
          modalWindow:"Modal Window",
          showOverlay:"Show Overlay"
        },
        data:{
          table:{
            data1:"Administration",
            data2:"Marketing",
            data3:"Purchasing",
            arialabel:"Departments Table",
            header1:"Department Id",
            header2:"Department Name"
          }
        },
        pageHeader: "Theme Preview",
        setFont: "{size}{unit}"
      },
      ar: true,
      fr: true,
      en: false,
es :true,
      "en-us": false
    };
  };

  return new PreviewThemeLocale();
});