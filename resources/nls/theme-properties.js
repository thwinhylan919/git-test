define(["ojL10n!resources/nls/generic", "ojL10n!resources/nls/theme-labels"], function(Generic, ThemeLabels) {
  "use strict";

  const ReviewThemeLocale = function() {
    return {
      root: {
        generic: Generic,
        heading: ThemeLabels.heading,
        labels: ThemeLabels.labels,
        color: "Color",
        iconsize: "Icon Size",
        size: "Size",
        solidcolor: "Solid Color",
        topcolor: "Start Color",
        bottomcolor: "End Color",
        gradientDir: "Gradient Direction",
        gradient: "Gradient",
        left: "Left",
        right: "Right",
        bottom: "Bottom",
        leftBottom: "Left Bottom",
        rightBottom: "Right Bottom",
        width: "Width",
        radius: "Radius",
        weight: "Weight",
        fontWeight: "Font Weight",
        light: "Light",
        regular: "Regular",
        bold: "Bold",
        interactionType: "Interaction Type",
        collapsible: "Collapsible",
        sliding: "Sliding",
        gradientDirection: "Gradient Direction",
        bordercolor: "Border Color",
        borderwidth: "Border Width",
        borderradius: "Border Radius",
        backgroundType: "Type",
        transparent: "Transparent",
        hLength:"Horizontal Length",
        vLength:"Vertical Length",
        bRadius:"Blur Radius",
        sRadius:"Spread Radius",
        shadowColor:"Shadow Color",
        opacity:"Opacity",
        shadowType:"Shadow Type",
        outline:"Outside",
        inset:"Inside"
      },
      ar: true,
      fr: true,
      en: false,
es :true,
      "en-us": false
    };
  };

  return new ReviewThemeLocale();
});