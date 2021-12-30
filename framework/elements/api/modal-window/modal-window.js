define([
  "knockout",
  "jquery",
  "ojL10n!resources/nls/generic",
  "baseLogger"
], function (ko, $, resourceBundle, BaseLogger) {
  "use strict";

  /**
   * This file contains the modal-window-bindings.
   *
   * @namespace ModalWindow~viewModel
   * @member
   * @implements [ModalWindow]{@link modal-window-bindings}
   * @constructor ModalWindow
   * @property {string} dialogId - unique id for each modal
   */
  const vm = function (rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    self.dialogId = rootParams.id;
    self.header = rootParams.header ? rootParams.header : null;
    self.closeHandler = rootParams.closeHandler;
    self.focusedElementBeforeModal = null;
    self.modalWindowNls = resourceBundle;
    self.hideHeader = rootParams.hideHeader || false;
    self.display = rootParams.display || (self.hideHeader ? "close-header" : "normal");

    const modalWindowReady = rootParams.modalWindowReady;

    /**
    Function gets called on click of close button of modal window.
    On sucessfully closing, the back button of navigation bar is activated.
     *
    * @function closeDialog
    * @memberOf ModalWindow
    **/
    self.closeDialog = function () {
      $("#" + self.dialogId).hide();

      if (self.focusedElementBeforeModal) {
        self.focusedElementBeforeModal.focus();
      }

      if (self.closeHandler) {
        self.closeHandler();
      }
    };

    if (!self.header) {
      return;
    }

    self.attachEventHandler = function () {
      $("#" + self.dialogId).on("openModal", function (_event, firstElementToFocus) {
        const modal = $("#" + self.dialogId)[0];

        modal.setAttribute("style", "display:flex;");
        self.focusedElementBeforeModal = document.activeElement;

        const focusableElementsString = "input:not([disabled]), a[href], area[href], select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex=\"0\"], [contenteditable]";

        if (firstElementToFocus) {
          firstElementToFocus = modal.querySelector(firstElementToFocus);

          if (!firstElementToFocus) {
            BaseLogger.info("INVALID SELECTOR. FOCUSSING THE FIRST FOCUSABLE ELEMENT");
          }
        }

        (firstElementToFocus ? firstElementToFocus : modal.querySelector("div[role=\"alert\"]")).focus();

        function trapTabKey(e) {
          let focusableElements = modal.querySelectorAll(this.focusableElementsString);

          focusableElements = Array.prototype.slice.call(focusableElements);

          const firstTabStop = focusableElements[0],
            lastTabStop = focusableElements[focusableElements.length - 1];

          if (e.keyCode === 9) {
            if (e.shiftKey) {
              if (document.activeElement === firstTabStop) {
                e.preventDefault();
                lastTabStop.focus();
              }
            } else if (document.activeElement === lastTabStop) {
              e.preventDefault();
              firstTabStop.focus();
            }
          }

          if (e.keyCode === 27) {
            self.closeDialog();
          }
        }

        modal.addEventListener("keydown", trapTabKey.bind({
          focusableElementsString: focusableElementsString
        }));
      });

      $("#" + self.dialogId).on("closeModal", self.closeDialog);

      if (modalWindowReady) {
        modalWindowReady();
      }
    };
  };

  return vm;
});