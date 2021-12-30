/**
 * Base Model will be extended by all components. This class has utility methods and variables which are required at a framework level.<br>
 * This file specifies all those functions which are not dependent on [KnockoutJS]{@link http://knockoutjs.com}.
 * @module base-model
 */
define(["jquery",
        "framework/js/constants/constants",
        "base-models/utils/background-tasks",
        "base-models/utils/prefetch",
        "base-models/css",
        "framework/js/configurations/config"
    ],
    function($, Constants, EnqueueBackgroundTasks, PreFetch, CSS, Configurations) {
        "use strict";

        /**
         * Base Model will be extended by all components. This class has utility methods and variables which are required at a framework level.<br>
         * This file specifies all those functions which are not dependent on [KnockoutJS]{@link http://knockoutjs.com}.
         *
         * @class
         * @alias BaseModel
         * @memberof module:base-model
         */
        const baseModel = function BaseModel() {
            /**
             * Assign <code>this</code> to <code>self</code>.
             * @member {Object}
             */
            const self = this;

            self.enqueueTask = EnqueueBackgroundTasks;

            self.preFetch = PreFetch;

            const characterEncodingElement = document.createElement("textarea"),

                /**
                 * Map of all the framework level event listeners.
                 * @memberof BaseModel
                 * @type {Map}
                 */
                eventMap = new Map();

            self.traverseAndApply = function(obj, fn) {
                let property;

                for (property in obj) {
                    if (Object.prototype.hasOwnProperty.call(obj, property)) {
                        if (typeof obj[property] === "object") {
                            self.traverseAndApply(obj[property], fn);
                        } else if (obj[property] !== "") {
                            const returnVal = fn(obj[property]);

                            if (returnVal === "break") {
                                break;
                            }
                        }
                    }
                }
            };

            /**
             * Holds the random string for use by [incrementIdCount]{@linkcode BaseModel#incrementIdCount} and [currentIdCount]{@linkcode BaseModel#currentIdCount}
             * @member {String}
             */
            let idCount;

            /**
             * Creates and returns a random string on each invocation.<br>
             * Useful for dynamic <code>id</code> generation for HTML Elements.
             *
             * @memberof BaseModel
             * @function incrementIdCount
             * @instance
             * @return {string} The random string returned.
             */
            self.incrementIdCount = function() {
                const crypto = window.crypto || window.msCrypto,
                    array = new Uint8Array(20);

                idCount = "obdx" + Array.prototype.slice.call(crypto.getRandomValues(array)).map(function(element) {
                    return element.toString(32);
                }).join("");

                return idCount;
            };

            /**
             * Returns the random string stored by [idCount]{@linkcode BaseModel~idCount}.
             *
             * @memberof BaseModel
             * @function currentIdCount
             * @instance
             * @return {string} The current value [idCount]{@linkcode BaseModel~idCount} holds.
             */
            self.currentIdCount = function() {
                if (!idCount) {
                    self.incrementIdCount();
                }

                return idCount;
            };

            /**
             * This function returns the type of cordova device, i.e. <code>iOS</code> or <code>Android</code>.
             *
             * @memberof BaseModel
             * @function cordovaDevice
             * @instance
             * @return {string} The type of cordova device.
             */
            self.cordovaDevice = function() {
                if (window.cordova && window.device) {
                    return window.device.platform.toUpperCase();
                }
            };

            /**
             * Returns a string corresponding to current device size computed via screen width.
             *
             * @function getDeviceSize
             * @instance
             * @memberof BaseModel
             * @return {string} Returns <code>large</code>, <code>medium</code> or <code>small</code>.
             */
            self.getDeviceSize = function() {
                const windowWidth = window.screen.width < window.innerWidth ?
                    window.screen.width : window.innerWidth;

                if (windowWidth > 1279) {
                    return "xl";
                } else if (windowWidth > 1023) {
                    return "large";
                } else if (windowWidth > 767) {
                    return "medium";
                }

                return "small";
            };

            /**
             * In order to show selected description (not the value) in review screen
             * we need to keep track of selected descriptions for each dropdown, this function
             * will return description based on the key passed.
             *
             * @function getDescriptionFromCode
             * @param {Array} enumArray - Array containing all the dropdown values.
             * @param {string} selectedCode - Selected code from dropdown.
             * @param {string} codeString - Optional argument in case code string in array is something other than default ('code').
             * @param {string} descString - Optional argument in case desc string in array is something other than default ('description').
             * @memberof BaseModel
             * @instance
             * @returns {string} Description of selected value.
             */
            self.getDescriptionFromCode = function(enumArray, selectedCode, codeString, descString) {
                let returnVal = "";
                const codeStr = codeString || "code",
                    descStr = descString || "description";
                let i;

                if (enumArray) {
                    for (i = 0; i < enumArray.length; i++) {
                        if (enumArray[i][codeStr] === selectedCode) {
                            returnVal = enumArray[i][descStr];
                            break;
                        }
                    }
                }

                return returnVal;
            };

            /**
             * This function switches the page using <code>window.location.assign()</code> or <code>window.location.replace()</code>.
             *
             * @function switchPage
             * @param {Object} config - Object containing the configuration information for switching pages.
             * @param {boolean} [isSecure=false] Optional boolean argument that specifies whether the page is secure or public.
             *                                   Defaults to <code>false</code>.
             * @param {Boolean} [historyRequired=true] Optional boolean argument that specifies whether the page is loaded via <code>assign</code> or <code>replace</code>.
             *                                         Defaults to <code>true</code>.
             * @param {Object} urlArgs Optional JS object to be passed to the new page. Alternative for <code>sessionStorage</code>.
             * @memberof BaseModel
             * @instance
             * @returns {Boolean} Returns false.
             * @example
             * switchPage({  module: 'login' }, true); // will switch to login page from pre-login screen
             */
            self.switchPage = function(config, isSecure, historyRequired, urlArgs) {
                isSecure = isSecure || false;
                historyRequired = historyRequired || true;

                const baseLocation = isSecure ? Configurations.authentication.pages.securePage : Configurations.authentication.pages.publicPage;

                window.onbeforeunload = null;

                const formattedURLArgs = encodeURIComponent(JSON.stringify(urlArgs) || "");

                if (formattedURLArgs) {
                    config.OBDX_ARGS = formattedURLArgs;
                }

                window.location[historyRequired ? "assign" : "replace"](self.QueryParams.add(baseLocation, config));

                return false;
            };

            /**
             * @summary Utility function that checks whether browser supports CSS custom properties.<br>
             * @function isCSSCustomPropAvailable
             * @memberof BaseModel
             * @instance
             * @returns {boolean} <code>true</code> or <code>false</code> depending on whether CSS custom properties are supported or not, respectively.
             */
            self.isCSSCustomPropAvailable = CSS.isCSSCustomPropAvailable;

            /**
             * @summary Function that tranforms the template of a component to add scoped component CSS.
             * @function transformTemplate
             * @memberof BaseModel
             * @instance
             * @param  {string} template - The template of the component.
             * @param  {string} css - The CSS of the component.
             * @param  {string} [className] - The name of the component.
             * @returns {string} The transformed template string with css inside <code>style</code> tag is returned.
             */
            self.transformTemplate = function(template, css, className) {
                if (!className) {
                    return;
                }

                if (!document.querySelector("style#obdx-component-style-" + className)) {
                    const element = document.createElement("style");

                    element.textContent = CSS.replaceCSS(css);
                    element.id = "obdx-component-style-" + className;
                    document.querySelector("head").appendChild(element);
                }

                return "<obdx-component class='" + className + "-container'>" + template + "</obdx-component>";
            };

            /**
             * @summary Function that returns the name of the component from the AMD module object.
             * @function getComponentName
             * @memberof BaseModel
             * @instance
             * @param  {Object} module - The AMD module object.
             * @returns {string} The name of the component is returned.
             */
            self.getComponentName = function(module) {
                return module.id.split("/")[module.id.split("/").length - 2];
            };

            self.isEmpty = function(value) {
                return typeof value === "undefined" || value === null || value.length === 0;
            };

            self.displayInteraction = function(type, selector, duration) {
                $(selector)[type](duration);
            };

            self.modalInteraction = function(selector, event, element) {
                $(selector).trigger(event, element);
            };

            /**
             * @summary Utility function that returns a formatted string.<br>
             * @description The first argument is a string containing zero or more placeholder tokens.
             * Placeholder tokens are <code>{ }</code>.<br>
             * The next argument should be an <code>Object</code> that contains keys as the tokens used in first argument and values as the values to be substituted.<br><br>
             * This function is commonly used for URL paramterization in [parameterizeURL]{@linkcode BaseService~parameterizeURL}.
             * @function format
             * @memberof BaseModel
             * @instance
             * @param  {string} message    - The string containing tokens to be formatted.
             * @param  {Object<string, string>} parameters - The object containing key-wise description for tokens used in <code>message</code>.
             * @param  {boolean} [encodingRequired=false]   The boolean specifying whether the key should be encoded using <code>encodeURIComponent</code> or not.
             *                                       Defaults to false. Use with caution.
             * @returns {String} The formatted string.
             * @example
             * self.format('This string needs to be {token}', { token : 'formatted' });
             * // returns "This string needs to be formatted".
             */
            self.format = function(message, parameters, encodingRequired) {
                if (!message) {
                    throw new ReferenceError("Please specify a valid message");
                }

                if (parameters) {
                    const jsonObject = typeof parameters === "string" ? JSON.parse(parameters) : parameters,
                        allPropertyNames = Object.keys(jsonObject);

                    for (let i = 0; i < allPropertyNames.length; i++) {
                        const replacement = self.isEmpty(jsonObject[allPropertyNames[i]]) ? "" : jsonObject[allPropertyNames[i]];

                        message = message.replace("{" + allPropertyNames[i] + "}", encodingRequired ? encodeURIComponent(replacement) : replacement);
                    }
                }

                return message;
            };

            /**
             * Internal function used for obtaining value of nested object's key using string accessor.
             *
             * @protected
             * @memberof BaseModel
             * @function getObjectProperty
             * @param  {Object} object    - The object whose value needs to be computed.
             * @param  {string} stringKey - The string value of nested property, e.g. <code>'a.b.c.d.e'</code>.
             * @return {*}           The value of the property being accessed.
             */
            function getObjectProperty(object, stringKey) {
                let latestValue = object;

                for (let i = 0, partialKey = stringKey.split("."); i < partialKey.length; i++) {
                    latestValue = latestValue[partialKey[i]];
                }

                return latestValue;
            }

            /**
             * @summary Function which returns property value from <code>Constants</code><br>
             * @description Function which returns property value from <code>Constants</code>.
             * @function getConstantsProp
             * @memberof BaseModel
             * @instance
             * @param  {string} property - The string value of nested property, e.g. <code>'a.b.c.d.e'</code>.
             * @returns {String}  - The value of the requested property.
             * @example
             * rootParams.baseModel.getConstantsProp("pages.securePage");
             * // returns "/home.html".
             */
            self.getConstantsProp = function(property) {
                return getObjectProperty(Constants, property);
            };

            /**
             * Utility function to sort array of objects based on multiple properties.
             *
             * @function sortLib
             * @memberof BaseModel
             * @instance
             * @param  {Array.<Object>} data - The array of objects that needs to be sorted.
             * @param  {string|Array} sortBy The property against which sorting is to be performed.<br> A single string value or array of strings.
             *  If an array is passed, the priority of sort is in decreases from left to right.<br>
             *  Say, if you pass <code>['a.b', 'a.c']</code> as the argument, the function will sort the array based on <code>'a.b'</code> first,
             *  then for same values of <code>'a.b'</code>, it will sort those values by <code>'a.c'</code> and so on.<br>
             *  By default, all orders are ascending.
             * @param  {String|Array} order The order which sorting is to be performed. A single string value or array of strings. Values are <code>'asc'</code> or <code>'desc'</code>.
             * If it is an array, it maps one to one to the arguments of [sortLib]{@linkcode BaseModel~sortLib}.
             * In the example <code>self.sortLib(test, ['a.b', 'a.c.d', 'a.e.f.g'], ['desc', 'asc', 'desc'])</code>, <code>'a.b'</code> is sorted in descending order,
             * <code>'a.c.d'</code> in ascending order and <code>'a.e.f.g'</code> in descending order.
             * Defaults to <code>'asc'</code>.
             * @return {Array.<Object>}  The sorted array is returned.
             * @example
             * self.sortLib([{a:{b:2}},{a:{b:6}},{a:{b:1}}], 'a.b');
             * // returns sorted array against the property 'a.b'.
             *
             * self.sortLib(test, ['a.b', 'a.c.d', 'a.e.f.g'], ['desc', 'asc', 'desc']);
             * // uses the unsorted array 'test' and returns sorted array based on the properties, with priority 'a.b', 'a.c.d', 'a.e.f.g',
             * // in descending, ascending and descending order respectively.
             */
            self.sortLib = function(data, sortBy, order) {
                if (!(data && sortBy)) {
                    throw new Error("Specify the data source and atleast one property to sort it by");
                }

                if (!Array.isArray(data)) {
                    throw new Error("Specify the data source as an array");
                }

                if (!Array.isArray(sortBy)) {
                    sortBy = [sortBy];
                }

                if (!Array.isArray(order)) {
                    order = [order];
                }

                /**
                 * This function converts values of keys to a mathematical comparable format.
                 *
                 * @param  {Object} data   - The object inside array.
                 * @param  {string} sortBy - The property against which sorting is to be performed.
                 * @return {Date|number|string}        The value of the key in comparable format is returned.
                 */
                function parse(data, sortBy) {
                    const latestValue = getObjectProperty(data, sortBy);

                    if (!latestValue && latestValue !== 0) {
                        return Number.NEGATIVE_INFINITY;
                    }

                    if (typeof latestValue === "string" && latestValue.match(/^\d{4}(-\d\d(-\d\d(T\d\d:\d\d(:\d\d)?(\.\d+)?(([+-]\d\d:\d\d)|Z)?)?)?)?$/i)) {
                        return new Date(latestValue);
                    } else if (typeof latestValue === "string") {
                        return latestValue.toLowerCase();
                    } else if (typeof latestValue === "boolean") {
                        return latestValue.toString();
                    }

                    return latestValue;
                }

                /**
                 * Internal function that is called recursively to perform sorting.
                 *
                 * @function performSort
                 * @private
                 * @memberof BaseModel#sortLib
                 * @param  {string|Array} order The order which sorting is to be performed. A single string value or array of strings. Values are <code>'asc'</code> or <code>'desc'</code>.
                 * If it is an array, it maps one to one to the arguments of [sortLib]{@linkcode BaseModel~sortLib}.
                 * In the example <code>self.sortLib(test, ['a.b', 'a.c.d', 'a.e.f.g'], ['desc', 'asc', 'desc'])</code>, <code>'a.b'</code> is sorted in descending order,
                 * <code>'a.c.d'</code> in ascending order and <code>'a.e.f.g'</code> in descending order.
                 * Defaults to <code>'asc'</code>.
                 * @param  {String|Array} sortBy The property against which sorting is to be performed.<br> A single string value or array of strings.
                 *  If an array is passed, the priority of sort is in decreases from left to right.<br>
                 *  Say, if you pass <code>['a.b', 'a.c']</code> as the argument, the function will sort the array based on <code>'a.b'</code> first,
                 *  then for same values of <code>'a.b'</code>, it will sort those values by <code>'a.c'</code> and so on.<br>
                 *  By default, all orders are ascending.
                 * @return {Array}        Sorted array for partial values is returned.
                 */
                function performSort(order, sortBy) {
                    // eslint-disable-next-line array-callback-return
                    return data.sort(function(a, b) {
                        for (let i = 0; i < sortBy.length; i++) {
                            const currentOrder = sortBy[i],
                                A = parse(a, currentOrder),
                                B = parse(b, currentOrder);

                            if ((A < B) || (B === Number.NEGATIVE_INFINITY)) {
                                return order[i] ? order[i] === "asc" ? -1 : 1 : -1;
                            } else if ((A > B) || (A === Number.NEGATIVE_INFINITY)) {
                                return order[i] ? order[i] === "asc" ? 1 : -1 : 1;
                            }
                        }

                        return 0;
                    });
                }

                return performSort(order, sortBy);
            };

            /**
       * Utility function to group array of objects based on multiple properties.
             *
       * @function groupBy
       * @instance
       * @memberof BaseModel
       * @param  {Array} array     - Array to be grouped.
       * @param  {string|Array} keys      - The priority order which grouping is to be performed. A single string value or array of strings.
       * @param  {Function} transform     The transformation function to be applied to keys on which grouping is specified.<br>It is a function which accepts the object from input array and returns an array of specifying transformation for each key level.
       * For example, <code>groupBy(test, ['a', 'b.c' ...], function(item){ return [item.toString() + '~key~1', fn(item.property)...] })</code> where <code>fn</code> is any transformation function.<br>
       * Note that transformation is applied at the output result for transforming input to a consumable output. If used, transformation must be specified for each key level.
       * @return {Array}           The grouped array is returned.
       * @example
       * self.groupBy([{
         "a": 1,
         "b": {
           "c": "C"
         }
       }, {
         "a": 2,
         "b": {
           "c": "D"
         }
       }, {
         "a": 1,
         "b": {
           "c": "C"
         }
       }, {
         "a": 1,
         "b": {
           "c": "A"
         }
       }], 'a');
//returns
       [{
         "key": "1",
         "children": [{
           "key": "C",
           "children": [{
             "a": 1,
             "b": {
               "c": "C"
             }
           }, {
             "a": 1,
             "b": {
               "c": "C"
             }
           }]
         }, {
           "key": "A",
           "children": [{
             "a": 1,
             "b": {
               "c": "A"
             }
           }]
         }]
       }, {
         "key": "2",
         "children": [{
           "key": "D",
           "children": [{
             "a": 2,
             "b": {
               "c": "D"
             }
           }]
         }]
       }]
       */
            self.groupBy = function(array, keys, transform) {
                let groups, transformation;

                return Object.keys((groups = array.reduce(function(accumulator, currentValue) {
                    const key = getObjectProperty(currentValue, keys[0]);

                    // eslint-disable-next-line no-unused-expressions
                    transform ? (transformation = transformation || [], transformation[key] = transform(currentValue)) : null;
                    (accumulator[key] = accumulator[key] || []).push(currentValue);

                    return accumulator;
                }, {}), keys = JSON.parse(JSON.stringify(keys)), keys.shift(), groups)).map(function(item) {
                    return {
                        label: transform ? transformation[item][keys.length ? keys.length - 1 : transformation[item].length - 1] : item,
                        children: keys[0] ? self.groupBy(groups[item], keys, transform) : groups[item]
                    };
                });
            };

            /**
             * Function to truncate the string passed with ellipsis.
             *
             * @function getVisibleText
             * @instance
             * @memberof BaseModel
             * @param  {string} actualText - The string to be truncated.
             * @param  {number} precision  Number of characters after which string should be truncated. <br>
             *                             If string length is lesser than the <code>precision</code> specified, the original string will be returned.
             * @return {String}            The truncated string is returned.
             * @example
             * self.getVisibleText('This is a very long string that needs to be truncated', 25);
             * // returns "This is a very long str.."
             */
            self.getVisibleText = function(actualText, precision) {
                if (actualText) {
                    if (actualText.length <= precision) {
                        return actualText;
                    }

                    return actualText.substring(0, precision - 2) + "..";
                }

                return "";
            };

            /**
             * Utility function to parse special characters from received response.
             *
             * @inner
             * @function characterEncoding
             * @memberof BaseModel
             * @param  {Object} obj - The object received from response containing special characters.
             * @return {Object}     The parsed object is returned.
             */
            self.characterEncoding = function(obj) {
                if (typeof obj === "object") {
                    let property;

                    for (property in obj) {
                        if (obj[property]) {
                            if (typeof obj[property] === "object") {
                                self.characterEncoding(obj[property]);
                            } else if (typeof obj[property] === "string" && obj[property] !== "") {
                                characterEncodingElement.innerHTML = obj[property];
                                obj[property] = characterEncodingElement.textContent;
                            }
                        }
                    }
                }

                return obj;
            };

            /**
             * Clears browser's <code>localStorage</code> and <code>sessionStorage</code>, except <code>user-locale</code>, if found in <code>sessionStorage</code>.
             * @function clearStorage
             * @instance
             * @memberof BaseModel
             * @returns {void}
             */
            /* eslint-disable no-storage/no-browser-storage */
            self.clearStorage = function() {
                const locale = sessionStorage.getItem("user-locale");

                localStorage.clear();
                sessionStorage.clear();

                if (locale) {
                    sessionStorage.setItem("user-locale", locale);
                }
            };
            /* eslint-enable no-storage/no-browser-storage */

            /**
             * Utility function to debounce any given function.
             * Returns a function, that, as long as it continues to be invoked, will not be triggered.
             * The function will be called after it stops being called for <code>wait</code> milliseconds.
             * If <code>immediate</code> is passed, trigger the function on the leading edge, instead of the trailing.
             * @function debounce
             * @instance
             * @memberof BaseModel
             * @param  {Function} func - The function to be debounced.
             * @param  {Number} wait - Time in milliseconds to wait for debouncing.
             * @param  {Boolean} [immediate=false] - If true, triggers the function on leading edge instead of trailing.
             * @returns {void}
             */
            self.debounce = function(func, wait, immediate) {
                let timeout;

                return function() {
                    const context = this,
                        args = arguments,
                        later = function() {
                            timeout = null;

                            if (!immediate) {
                                func.apply(context, args);
                            }
                        },
                        callNow = immediate && !timeout;

                    clearTimeout(timeout);
                    timeout = setTimeout(later, wait);

                    if (callNow) {
                        func.apply(context, args);
                    }
                };
            };

            /**
             * Utility function to throttle any given function.
             * Creates and returns a new, throttled version of the passed function, that, when invoked repeatedly,
             * will only actually call the original function at most once per every wait milliseconds.
             * @function throttle
             * @instance
             * @memberof BaseModel
             * @param  {Function} func - The function to be debounced.
             * @param  {Number} wait - Time in milliseconds to wait for debouncing.
             * @returns {void}
             */
            self.throttle = function(func, wait) {
                let timeout, throttling, more, result;
                const whenDone = self.debounce(function() {
                    more = throttling = false;
                }, wait);

                return function() {
                    const context = this,
                        args = arguments,
                        later = function() {
                            timeout = null;

                            if (more) {
                                func.apply(context, args);
                            }

                            whenDone();
                        };

                    if (!timeout) {
                        timeout = setTimeout(later, wait);
                    }

                    if (throttling) {
                        more = true;
                    } else {
                        result = func.apply(context, args);
                    }

                    whenDone();
                    throttling = true;

                    return result;
                };
            };

            /**
             * Utility functions for handling query parameters.
             * @typedef {Object} - QueryParams
             * @memberof BaseModel
             * @alias QueryParams
             * @property {Function} add - Adds one or more query parameters
             * @property {Function} get - Returns one or all query parameters
             * @property {Function} remove - Removes one or more query parameters
             */
            self.QueryParams = {
                /**
                 * Internal Method for evaluating multiple queries with same key.
                 *
                 * @function __resolveQuery
                 * @private
                 * @param  {Object} map   - The map of query params.
                 * @param  {string} value - The query param under consideration.
                 * @return {string}       Array of query values with same parameter converted to query parameter format.
                 */
                __resolveQuery: function(map, value) {
                    if (!Array.isArray(map[value])) {
                        return encodeURIComponent(map[value]);
                    }

                    return map[value].reduce(function(accumulator, currentValue, currentIndex, array) {
                        return accumulator + (currentIndex === 0 ? "" : value + "=") + encodeURIComponent(currentValue) + (currentIndex === array.length - 1 ? "" : "&");
                    }, "");
                },
                /**
                 * Adds the query parameters to existing URL.
                 *
                 * @function
                 * @memberof! BaseModel#QueryParams
                 * @alias QueryParams.add
                 * @param {string} url - The URL to which query parameters are to be added.
                 * @param {Object} parameterObject - The key value pair object which has keys are query parameter keys and values as query parameter values.
                 * @param {Boolean} supressDecoding - The boolean to indicate the extract query part to not decode the query params values.
                 * @return {string} The URL string with added query parameters.
                 */
                add: function(url, parameterObject) {
                    if (!parameterObject) {
                        return url;
                    }

                    const link = document.createElement("a");

                    link.href = url;

                    const queryMap = link.search ? self.QueryParams.get(null, link.search) : {};

                    $.extend(queryMap, parameterObject);

                    const modifiedQuery = Object.keys(queryMap).reduce(function(accumulator, currentValue, currentIndex, array) {
                        return accumulator + currentValue + "=" + self.QueryParams.__resolveQuery(queryMap, currentValue) + (currentIndex === array.length - 1 ? "" : "&");
                    }, "");

                    link.search = modifiedQuery;

                    return url.split("?")[0] + link.search;
                },
                /**
                 *  Gets the query parameters from the string URL and returns either a map of query parameter and their values
                 *  or the value for a requested query parameter.
                 *
                 * @function
                 * @memberof! BaseModel#QueryParams
                 * @alias QueryParams.get
                 * @param  {string} param - The query parameter for which value is required. If not specified, returns the whole key-value map.
                 * @param  {string} str   - The URL search string. Do make sure to pass location.search and not location.href for a particular window. Defaults to current window's URL search string.
                 * @return {Object|string} If query parameter (param) is specified, returns the query string value for the particular parameter requested or else returns the object map for whole query string.
                 */
                get: function(param, str) {
                    str = str || window.location.search;

                    const ret = Object.create(null);

                    if (typeof str !== "string" || !str.length) {
                        return null;
                    }

                    str = str.match(/\?[^\?]*$/);

                    if (!str) {
                        return null;
                    }

                    str = str[0];
                    str = str.trim().replace(/^(\?|#|&)/, "");

                    if (!str) {
                        return null;
                    }

                    str.split("&").forEach(function(param) {
                        // eslint-disable-next-line obdx-string-validations
                        const parts = param.replace(/\+/g, " ").split("="),
                            key = parts.shift();
                        let val = parts.length > 0 ? parts.join("=") : undefined;

                        val = val === undefined ? null : decodeURIComponent(val);

                        if (ret[decodeURIComponent(key)] === undefined) {
                            ret[decodeURIComponent(key)] = val;

                            return;
                        }

                        ret[decodeURIComponent(key)] = [].concat(ret[decodeURIComponent(key)], val);
                    });

                    const result = Object.keys(ret).sort().reduce(function(result, key) {
                        const val = ret[key];

                        result[key] = val;

                        return result;
                    }, Object.create(null));

                    return param ? result[param] : result;
                },
                /**
                 * Remove one or more query parameters from the URL string given.
                 *
                 * @function
                 * @memberof! BaseModel#QueryParams
                 * @alias QueryParams.remove
                 * @param  {string} url - The URL from which query parameters are to be deleted.
                 * @param  {Array} keysToDelete - Array of keys to delete.
                 * @return {string} The URL string with removed query parameters.
                 */
                remove: function(url, keysToDelete) {
                    const link = document.createElement("a");

                    link.href = url;

                    const queryMap = self.QueryParams.get(null, link.search);

                    if (keysToDelete) {
                        if (!Array.isArray(keysToDelete)) {
                            keysToDelete = [keysToDelete];
                        }

                        keysToDelete.forEach(function(deleteKey) {
                            delete queryMap[deleteKey];
                        });

                        return self.QueryParams.add(link.pathname, queryMap);
                    }

                    return url.replace(/\?[^\?]*$/, "");
                }
            };

            /**
             * Fires a new custom event for an element.
             *
             * @instance
             * @function dispatchCustomEvent
             * @param element - {HTMLElement} The element on which event is to be fired.
             * @param event - {String} The name of the event.
             * @param data - {Object} The data to be passed to the event handler of the event.
             * @memberof BaseModel
             * @returns {void}
             */
            self.dispatchCustomEvent = function(element, event, data) {
                if ((!(element instanceof HTMLElement) && element !== window && element !== document) || typeof event !== "string") {
                    return;
                }

                return element.dispatchEvent(new CustomEvent(event, {
                    detail: data
                }));
            };

            /**
             * Adds a new event to the framework scoped [eventMap]{@linkcode BaseModel~eventMap} and attaches the event to element with event handler.
             *
             * @instance
             * @function addEvent
             * @param id - {String} The unique id for the [eventMap]{@linkcode BaseModel~eventMap} against which event details are stored.
             * @param eventObject - {Object} The object which stores event attributes.
             * @param eventObject.element - {HTMLElement} The element to which event listener is to be attached.
             * @param eventObject.eventName - {String} The name of the event to be attached to the element.
             * @param eventObject.eventHandler - {Function} The event handler to be executed on dispatch of the said event.
             * @memberof BaseModel
             * @returns {void}
             */
            self.addEvent = function(id, eventObject) {
                if (!eventMap.has(id) && (eventObject.element === window || eventObject.element === document)) {
                    eventMap.set(id, eventObject);

                    eventObject.element.addEventListener(eventObject.eventName, eventObject.eventHandler);
                }
            };

            /**
             * Attaches or removes all the events stored in [eventMap]{@linkcode BaseModel~eventMap}.
             *
             * @instance
             * @function processAllEvents
             * @param type - {String} Accepts "addEventListener" or "removeEventListener" to add all events or remove all events respectively.
             * @memberof BaseModel
             * @returns {void}
             */
            self.processAllEvents = function(type) {
                eventMap.forEach(function(mapItem) {
                    mapItem.element[type](mapItem.eventName, mapItem.eventHandler);
                });
            };

            /**
             * Removes an existing event from the framework scoped [eventMap]{@linkcode BaseModel~eventMap} and removes the event listener from the element.
             *
             * @instance
             * @function removeEvent
             * @param id - {String} The unique id for the [eventMap]{@linkcode BaseModel~eventMap} against which event details are stored.
             * @memberof BaseModel
             * @returns {void}
             */
            self.removeEvent = function(id) {
                if (eventMap.has(id)) {
                    const eventObject = eventMap.get(id);

                    eventObject.element.removeEventListener(eventObject.eventName, eventObject.eventHandler);

                    eventMap.delete(id);
                }
            };

            /**
             * Removes an all existing event from the framework scoped [eventMap]{@linkcode BaseModel~eventMap} and removes the event listener from the element.
             *
             * @instance
             * @function removeAllEvent
             * @memberof BaseModel
             * @returns {void}
             */
            self.removeAllEvent = function() {
                eventMap.forEach(function(mapItem) {
                    mapItem.element.removeEventListener(mapItem.eventName, mapItem.eventHandler);
                });

                eventMap.clear();
            };

            /**
             * Returns a boolean whether the current device is touch enabled device or not.
             *
             * @instance
             * @function isTouchDevice
             * @memberof BaseModel
             * @returns {boolean} The return value is true if device is touch enabled device, false otherwise.
             */
            self.isTouchDevice = function() {
                try {
                    document.createEvent("TouchEvent");
                } catch (e) {
                    return false;
                }

                return true;
            };

            /**
             * Listener to focus the button-container on the screen when hotkey <code>Alt + B</code> is pressed.
             * @listens document#keydown
             * @event keydown
             * @param  {Object} event The event object returned by jQuery.
             * @returns {void}
             */
            self.addEvent("focus-primary-button", {
                element: document,
                eventName: "keydown",
                eventHandler: function(event) {
                    if (event.keyCode === 66 && event.altKey) {
                        event.preventDefault();
                        $("div .button-container .action-button-primary").focus();
                    }
                }
            });

            /**
             * Listener to click the secondary action button on the screen when hotkey <code>Alt + X</code> is pressed.
             * @listens document#keyup
             * @event keyup
             * @param  {Object} event The event object returned by jQuery.
             * @returns {void}
             */
            self.addEvent("click-secondary-button", {
                element: document,
                eventName: "keyup",
                eventHandler: function(event) {
                    if (event.keyCode === 88 && event.altKey && $(".action-button-secondary").length) {
                        event.preventDefault();
                        $(".action-button-secondary")[0].click();
                    }
                }
            });

            /**
             * This function injects the target with properties from source on the prototype chain which can be accessed via getter functions.
             *
             * @function injectProps
             * @memberof BaseModel
             * @param  {Object} target - JS object.
             * @param  {string} propertyName - The name of the property to be set.
             * @param  {*} propertyValue - Value of <code>propertyName</code>.
             * @return {void}
             */
            self.injectProps = function(target, propertyName, propertyValue) {
                Object.defineProperty(target, propertyName, {
                    value: function(args) {
                        if (typeof propertyValue === "function") {
                            return propertyValue(args);
                        }

                        return propertyValue;
                    }
                });
            };

            if (history.scrollRestoration) {
                history.scrollRestoration = "manual";
            }
        };

        return baseModel;
    });