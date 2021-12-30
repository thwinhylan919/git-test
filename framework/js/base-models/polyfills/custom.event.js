define([], function () {
    "use strict";

    const CustomEvent = function (event, params) {
        params = params || {};
        params.bubbles = !!params.bubbles;
        params.cancelable = !!params.cancelable;

        const evt = document.createEvent("CustomEvent");

        evt.initCustomEvent(
            event,
            params.bubbles,
            params.cancelable,
            params.detail
        );

        const origPrevent = evt.preventDefault;

        evt.preventDefault = function () {
            origPrevent.call(this);

            try {
                Object.defineProperty(this, "defaultPrevented", {
                    get: function () {
                        return true;
                    }
                });
            } catch (e) {
                this.defaultPrevented = true;
            }
        };

        return evt;
    };

    CustomEvent.prototype = window.Event.prototype;
    window.CustomEvent = CustomEvent;
});