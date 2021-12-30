/**
 * This file lists all the knockout custom bindings.
 * @requires knockout
 * @requires jquery
 * @requires framework/js/constants/brand-assets
 * @requires framework/js/configurations/config
 */
define([
    "knockout",
    "jquery",
    "framework/js/configurations/config",
    "platform",
    "baseLogger"
], function(ko, $, Configurations, Platform, BaseLogger) {
    "use strict";

    /**
     * This file lists all the methods needed for knockout custom bindings.
     *
     * @class
     * @alias CustomBindings
     * @memberof module:baseModel
     */
    const CustomBindings = function() {
        /**
         * The instance of <code>IntersectionObserver</code>.
         * @member {Object|undefined}
         */
        // eslint-disable-next-line no-use-before-define
        const observer = window.IntersectionObserver ? new IntersectionObserver(onIntersection) : null,
            /**
             * The boolean to indicate whether native lazy loading for images is supported by the browser or not.
             * @member {Boolean}
             */
            nativeLazyLoadSupported = Object.hasOwnProperty.call(HTMLImageElement.prototype, "loading");

        /**
         * The instance of current brand data.
         * @member {Object}
         */
        let brandInformation;

        function getElementSourceAttribute(element) {
            if (element.nodeName === "IMG" || element.nodeName === "VIDEO" || element.nodeName === "OJ-AVATAR") {
                return "src";
            } else if (element.nodeName === "OBJECT") {
                element.setAttribute("type", "image/svg+xml");

                return "data";
            }
        }

        /**
         *
         * @function fetchBrandImage
         * @memberof CustomBindings
         * @inner
         * @param  {HTMLElement} element - The HTMLElement to which the image is to be bound.
         * @returns {void}
         */
        function fetchBrandImage(element) {
            const lazySrc = element.getAttribute("lazySrc");

            element.removeAttribute("lazySrc");

            require(["baseService"], function(BaseService) {
                const baseService = BaseService.getInstance();

                return baseService.fetchImage({
                    url: "brands/{brandID}?name={resourcePath}&type=I",
                    element: element,
                    sourceAttribute: getElementSourceAttribute(element)
                }, {
                    brandID: brandInformation.assetDTO.brandId,
                    resourcePath: lazySrc
                });
            });
        }

        function onElementInViewport(element) {
            if (element.getAttribute("isBranded")) {
                fetchBrandImage(element);
            } else {
                element.setAttribute(getElementSourceAttribute(element), element.getAttribute("lazySrc"));
                element.removeAttribute("lazySrc");
            }
        }

        /**
         *
         * @function onIntersection
         * @memberof CustomBindings
         * @inner
         * @param  {IntersectionObserverEntry} entries The [IntersectionObserverEntry]{@link https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserverEntry} interface of the Intersection Observer API describes the intersection between the target element and its root container at a specific moment of transition.
         * @returns {void}
         */
        function onIntersection(entries) {
            entries.forEach(function(entry) {
                if (entry.intersectionRatio > 0) {
                    const element = entry.target;

                    observer.unobserve(element);
                    onElementInViewport(element);
                }
            });
        }

        /**
         * The <code>component</code> binding preprocessor. Adds bindings for <code>baseModel</code> and <code>dashboard</code> automagically.<br>
         * For more information, refer the [official knockout documentation]{@linkcode http://knockoutjs.com/documentation/binding-preprocessing.html#binding-preprocessor-reference}.
         *
         * @alias component.preprocess
         * @instance
         * @memberof CustomBindings
         * @type {Object}
         */
        ko.bindingHandlers.component.preprocess = function(stringFromMarkup) {
            const matches = stringFromMarkup.match(/\{\s*?['"]?name['"]?\s*?\:\s*?['"]?([^'",]*)['"]?,?/),
                componentName = matches[1];

            if (["dashboard", "confirm-dialog"].indexOf(componentName) === -1) {
                // eslint-disable-next-line obdx-string-validations
                return stringFromMarkup.replace(/(params\s*?:\s*?\{)/, "$1baseModel: $baseModel, dashboard: $dashboard, ");
            }

            return stringFromMarkup;
        };

        /**
         * Inner utility function to handle image loading via [ko.bindingHandlers.loadImage]{@linkcode CustomBindings~loadImage}.
         *
         * @inner
         * @param  {HTMLElement} element         - The DOM element involved in this binding.
         * @param  {Observable} valueAccessor   - A JavaScript function that you can call to get the current model property that is involved in this binding. Call this without passing any parameters (i.e., call valueAccessor()) to get the current model property value. To easily accept both observable and plain values, call ko.unwrap on the returned value.
         * @param  {Object} allBindings     - A JavaScript object that you can use to access all the model values bound to this DOM element. Call allBindings.get('name') to retrieve the value of the name binding (returns undefined if the binding doesn’t exist); or allBindings.has('name') to determine if the name binding is present for the current element.
         * @param  {Object} viewModel       - This parameter is deprecated in Knockout 3.x. Use bindingContext.$data or bindingContext.$rawData to access the view model instead.
         * @param  {Object} bindingContext  - An object that holds the binding context available to this element’s bindings. This object includes special properties including $parent, $parents, and $root that can be used to access data that is bound against ancestors of this context.
         * @param  {string} resourcePath    - The string resource path of the image.
         * @param  {string} locationOfImage - The calculated location of the image.
         * @returns {void}
         */
        function loadImage(element, bindingContext, resourcePath, locationOfImage, isExternal, isBranded) {
            if (isBranded) {
                element.setAttribute("isBranded", "isBranded");
            }

            if (!nativeLazyLoadSupported) {
                element.setAttribute("lazySrc", isExternal || isBranded ? resourcePath : locationOfImage + "/" + resourcePath);
            }

            if (nativeLazyLoadSupported) {
                element.setAttribute("loading", "lazy");

                if (isExternal) {
                    element.setAttribute("src", resourcePath);
                } else if (isBranded) {
                    element.setAttribute("lazySrc", resourcePath);
                    fetchBrandImage(element);
                } else {
                    element.setAttribute("src", locationOfImage + "/" + resourcePath);
                }
            } else if (observer) {
                observer.observe(element);
            } else {
                const fold = $(window).height() + $(window).scrollTop(),
                    top = $(window).scrollTop();

                if (fold > $(element).offset().top && top <= $(element).offset().top + $(element).height()) {
                    if (isBranded) {
                        fetchBrandImage(element);
                    } else {
                        const path = isExternal ? resourcePath : locationOfImage + "/" + resourcePath;

                        element.setAttribute(getElementSourceAttribute(element), path);
                        element.removeAttribute("lazySrc");
                    }
                }
            }

            let attribute = "";

            ko.utils.arrayForEach(element.getAttribute("data-bind").split(","), function(item) {
                if (!item.indexOf("loadImage") > -1) {
                    attribute += item + ",";
                }
            });

            element.setAttribute("data-bind", attribute.slice(0, -1));

            if (bindingContext.$data && bindingContext.$data.errorImage) {
                element.setAttribute("onerror", "this.onerror=null;this.src='" + locationOfImage + bindingContext.$data.errorImage + "';");
            }

            const allBindingsKeys = ko.expressionRewriting.parseObjectLiteral(element.getAttribute("data-bind")),
                clickBinding = allBindingsKeys.filter(function(obj) {
                    return obj.key === "click";
                });

            if (clickBinding[0]) {
                const attributeBinding = allBindingsKeys.filter(function(obj) {
                    return obj.key === "attr";
                });

                if (!attributeBinding.length || !attributeBinding[0].value.match("alt") || !attributeBinding[0].value.match("title")) {
                    BaseLogger.info("Clickable images need both title attribute and alt attribute. Image name:", resourcePath);
                    element.parentElement.removeChild(element);

                    return false;
                }

                let latestAttribute = "";

                ko.utils.arrayForEach(allBindingsKeys, function(item) {
                    if (item.key !== "click") {
                        latestAttribute += item.key + ":" + item.value + ",";
                    }
                });

                element.setAttribute("data-bind", latestAttribute.slice(0, -1));

                const a = document.createElement("a");

                a.setAttribute("data-bind", "click:" + clickBinding[0].value);

                if (element.getAttribute("id")) {
                    a.setAttribute("id", element.getAttribute("id"));
                    element.removeAttribute("id");
                }

                a.setAttribute("href", "#");
                element.setAttribute("height", "100%");
                element.setAttribute("width", "100%");
                $(element).wrap(a);
            } else {
                const altAttribute = allBindingsKeys.filter(function(obj) {
                    return obj.key === "alt";
                });

                if (!altAttribute) {
                    const attrBinding = allBindingsKeys.filter(function(obj) {
                        return obj.key === "attr";
                    });

                    if (!attrBinding.length || !attrBinding[0].value.match("alt")) {
                        element.setAttribute("alt", "");
                    }
                } else {
                    element.setAttribute("alt", "");
                }
            }
        }

        /**
         * The binding handler to load images from a common root path.<br><br>
         * If images are clickable then wraps it in a anchor element.<br>
         * Validates if <code>alt</code> and <code>title</code> attributes are specified for clickable images.<br>
         * Else set empty <code>alt</code> for images anyway.
         * @alias loadImage
         * @instance
         * @memberof CustomBindings
         * @example
         * <img data-bind="loadImage: 'account-nickname/edit.png'" />
         * <img data-bind="loadImage: {url: 'some-external-url', isExternal: true}" />
         * @type {Object}
         */
        ko.bindingHandlers.loadImage = {
            init: function(element, valueAccessor, _allBindings, _viewModel, bindingContext) {
                const resourcePath = ko.utils.unwrapObservable(valueAccessor());

                if (resourcePath) {
                    Platform.getInstance().then(function(plateform) {
                        const locationOfImage = plateform("getImageBaseURL"),
                            isExternal = !!resourcePath.isExternal;

                        element.setAttribute("src", Configurations.sharding.imageResourcePath + "/placeholder.svg");

                        ko.contextFor(document.body).$data.userInfoPromise.then(function() {
                            ko.contextFor(document.body).$data.fetchCurrentBrand.then(function(brandData) {
                                brandInformation = brandData;
                                loadImage(element, bindingContext, resourcePath.url || resourcePath, locationOfImage, isExternal, brandData.assetDTO && brandData.imageResources.indexOf(resourcePath) !== -1 && !isExternal);
                            });
                        });
                    });
                } else {
                    element.setAttribute("src", "");
                }
            }
        };

        /**
         * The binding handler to fade in or fade out element based on a boolean observable.
         * @alias fadeVisible
         * @instance
         * @memberof CustomBindings
         * @example
         * <div data-bind="fadeVisible: someObservable">
         * ....
         * </div>
         * @type {Object}
         */
        ko.bindingHandlers.fadeVisible = {
            update: function(element, valueAccessor) {
                const value = valueAccessor();

                if (ko.unwrap(value)) {
                    $(element).fadeIn();
                } else {
                    $(element).fadeOut();
                }
            }
        };

        /**
         * The html binding does not process bindings within the inserted HTML.<br/>
         * This custom binding helps do that. For more information [see this]{@link https://stackoverflow.com/a/28775676}.
         * @alias htmlBound
         * @instance
         * @memberof CustomBindings
         * @type {Object}
         * @example
         * <div data-bind="htmlBound: someObservableWithDataBind">
         * ....
         * </div>
         */
        ko.bindingHandlers.htmlBound = {
            init: function() {
                return {
                    controlsDescendantBindings: true
                };
            },
            update: function(element, valueAccessor, _allBindings, _viewModel, bindingContext) {
                ko.utils.setHtml(element, valueAccessor());
                ko.applyBindingsToDescendants(bindingContext, element);
            }
        };

        /**
         * Knockout Extender used to check if an observable is set or not.
         *
         * @function loaded
         * @instance
         * @memberof CustomBindings
         * @param {Observable} target - The observable under consideration.
         * @param {Promise} promise   Promise attached to the observable.<br><br>
         *                            Not yet complete.
         * @example
         * self.someObservable = ko.observable().extend({loaded: false});
         * // some where else
         * self.someObservable('value');
         * // on HTML
         * <!-- ko if: $component.someObservable.loaded -->
         * // do something here
         * <!-- /ko -->
         * @returns {Observable} The observable is returned.
         */
        ko.extenders.loaded = function(target, promise) {
            target.loaded = ko.observable();

            /**
             * Internal function to check if promise is passed or not.<br><br>
             * Not yet complete.
             *
             * @param  {string}  newValue - The new value of the observable.
             * @returns {void}
             */
            function isLoaded(newValue) {
                if (!(promise instanceof Promise)) {
                    target.loaded(!!newValue);
                }
            }

            isLoaded(target());
            target.subscribe(isLoaded);

            return target;
        };

        /**
         * @summary Listener to scroll event to handle lazy image load when <code>IntersectionObserver</code> is not supported by browser.
         * @description This event listener check whether image is in viewport and marks the image to load if it appears in viewport. This event handler is <code>passive</code> in nature.
         * @listens document#scroll
         * @event scroll
         * @returns {void}
         */
        if (!nativeLazyLoadSupported && !observer) {
            document.addEventListener("scroll", function() {
                const top = $(window).scrollTop(),
                    fold = $(window).height() + top,
                    images = Array.prototype.filter.call(document.querySelectorAll("img"), function(element) {
                        const elementOffsetTop = $(element).offset().top;

                        return element.getAttribute("lazySrc") && (fold > elementOffsetTop) && (top < elementOffsetTop + $(element).height());
                    });

                images.forEach(onElementInViewport);
            });
        }
    };

    return new CustomBindings();
});