define([
    "ojs/ojcore",
    "knockout",
    "ojL10n!resources/nls/expandable-preview",
    "ojs/ojanimation",
    "ojs/ojbutton"
], function(oj, ko, Locale) {
    "use strict";

    const vm = function(rootParams) {
        const self = this;

        let panel, childPanel, initHeight;

        self.isExpanded = ko.observable(false);
        self.locale = Locale;
        self.header = rootParams.header;
        self.childPanelExists = ko.observable(false);
        ko.utils.extend(self, Object.assign({}, rootParams.rootModel || {}, rootParams.panelData || {}));
        self.editActionAvailable = rootParams.editAction || rootParams.showEditAction;
        self.panelId = rootParams.baseModel.incrementIdCount();

        self.componentReady = function() {
            panel = document.getElementById(self.panelId);
            childPanel = panel.querySelector(".content .child-panel");

            if (childPanel) {
                self.childPanelExists(true);
                childPanel.style.display = "none";
            }

            initHeight = getComputedStyle(panel).height;
        };

        self.editAction = function() {
            if (rootParams.editAction) {
                rootParams.editAction(rootParams.stageIndex);
            }
        };

        self.buttonClick = function() {
            if (childPanel) {
                if (self.isExpanded()) {
                    oj.AnimationUtils.collapse(panel, { endMaxHeight: initHeight }).then(function() {
                        childPanel.style.display = "none";
                        self.isExpanded(false);
                    });
                } else {
                    childPanel.style.display = "block";

                    oj.AnimationUtils.expand(panel, { startMaxHeight: initHeight }).then(function() {
                        self.isExpanded(true);
                    });
                }
            }
        };
    };

    return vm;
});