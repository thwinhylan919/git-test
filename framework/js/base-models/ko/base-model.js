/**
 * Base Model will be extended by all components. This class has utility methods and variables which are required at a framework level.<br>
 * This file specifies all those functions which are dependent on [KnockoutJS]{@link http://knockoutjs.com}.
 * @module baseModel
 * @requires jquery
 * @requires knockout
 * @requires ojs/ojcore
 * @requires base-model
 * @requires knockout-mapping
 * @requires base-models/validations/validations
 * @requires base-models/ko/formatters
 * @requires base-models/ko/help
 * @requires base-models/ko/custom-bindings
 * @requires knockout-helper
 * @requires framework/js/constants/constants
 * @requires extensions/extension.json
 */
define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "base-model",
    "base-models/validations/validations",
    "base-models/ko/help",
    "ojL10n!resources/nls/generic",
    "framework/js/constants/constants",
    "framework/js/configurations/config",
    "text!extensions/extension.json",
    "ojs/ojvalidation-base",
    "base-models/css",
    "baseLogger",
    "base-models/ko/custom-bindings",
    "knockout-helper",
    "ojs/ojknockout"
], function (oj, ko, $, BaseModel, Validations, Help, Locale, Constants, Configurations, extensions, ValidationBase, CSS, BaseLogger) {
    "use strict";

    /**
     * Base Model will be extended by all components. This class has utility methods and variables which are required at a framework level.<br>
     * This file specifies all those functions which are dependent on [KnockoutJS]{@link http://knockoutjs.com}.
     *
     * @class
     * @alias BaseKOModel
     * @memberof module:baseModel
     */
    const BaseKOModel = function () {
        /**
         * Assign <code>this</code> to <code>self</code>.
         * @member {Object}
         */
        const self = this;

        ko.utils.extend(self, new BaseModel());
        ko.utils.extend(self, new Help(self));
        ko.utils.extend(self, new Validations());

        /**
         * This variable hold the object for current extensions.
         * @type {Object}
         */
        const Extensions = JSON.parse(extensions);

        /**
         * Knockout Observable which returns boolean true/false depending on whether the screen is large and above.
         * @instance
         * @memberof BaseKOModel
         * @alias large
         * @type {Observable.<Boolean>}
         */
        self.large = ko.observable();
        /**
         * Knockout Observable which returns boolean true/false depending on whether the screen is medium sized only.
         * @instance
         * @memberof BaseKOModel
         * @alias medium
         * @type {Observable.<Boolean>}
         */
        self.medium = ko.observable();
        /**
         * Knockout Observable which returns boolean true/false depending on whether the screen is small only.
         * @instance
         * @memberof BaseKOModel
         * @alias small
         * @type {Observable.<Boolean>}
         */
        self.small = ko.observable();
        /**
         * Knockout Observable which returns boolean true/false depending on whether the screen is extra large and above.
         * @instance
         * @memberof BaseKOModel
         * @alias xl
         * @type {Observable.<Boolean>}
         */
        self.xl = ko.observable();
        /**
         * Knockout Observable which returns boolean true/false depending on whether the current context is inside dashboard builder screen or not.
         * @instance
         * @memberof BaseKOModel
         * @alias isDashboardBuilderContext
         * @type {Observable.<Boolean>}
         */
        self.isDashboardBuilderContext = ko.observable(false);

        /**
         * Create a key in knockout object for mapping plugin.
         * @type {Object}
         */
        require(["knockout-mapping"], function (mapping) {
            ko.mapping = mapping;
        });

        function setOjLocale(language) {
            /**
             * Set the language [lang]{@linkcode BaseKOModel~lang} as locale for <code>oj.Config</code> so that localization for Oracle JET is properly set.
             * @type {Object}
             */
            oj.Config.setLocale(language, function () {
                const direction = Configurations.i18n.rtlLocales.indexOf(language) === -1 ? "ltr" : "rtl";

                document.getElementsByTagName("html")[0].setAttribute("dir", direction);
                document.getElementsByTagName("html")[0].setAttribute("lang", language);
            });
        }

        /**
         * The current language of the page as determined from <code>navigator</code> or user requested value picked from <code>sessionStorage</code>.
         * @type {String}
         * @member
         */

        // eslint-disable-next-line no-storage/no-browser-storage
        const language = sessionStorage.getItem("user-locale") || document.getElementsByTagName("html")[0].getAttribute("lang") || "en";

        setOjLocale(language);

        const screenSize = {
            xl: "screen and (min-width: 1281px)",
            large: "screen and (min-width: 1024px)",
            medium: "screen and (max-width: 1023px) and (min-width: 768px)",
            small: "screen and (max-width: 767px)"
        };

        function setScreenSize(mediaQuery) {
            Object.keys(screenSize).forEach(function (key) {
                if (screenSize[key].replace(/\s/g, "") === mediaQuery.media.replace(/\s/g, "")) {
                    self[key](mediaQuery.matches);
                }
            });

            return mediaQuery;
        }

        function pad(number) {
            if (number < 10) {
                return "0" + number;
            }

            return number;
        }

        function toISODate(date) {
            return date.getUTCFullYear() +
                "-" + pad(date.getUTCMonth() + 1) +
                "-" + pad(date.getUTCDate());
        }

        Object.keys(screenSize).forEach(function (key) {
            setScreenSize(window.matchMedia(screenSize[key])).addListener(setScreenSize);
        });

        /**
         * Array to store the list of authorized components for a particular user which will be consumed by
         * [knockout custom component loader]{@linkcode BaseKOModel~componentCustomLoader}.
         * @instance
         * @memberof BaseKOModel
         * @alias authorisedComponentList
         * @type {Array}
         */
        const authorisedComponentList = new Set(),
            authorisedDashboardList = new Set();

        self.setAuthorisedComponentList = function (components) {
            if (!authorisedComponentList.size) {
                components.authorizedUIComponents.forEach(function (component) {
                    authorisedComponentList.add(component);
                });
            }

            if (!authorisedDashboardList.size) {
                components.defaultDashboards.forEach(function (dashboard) {
                    authorisedDashboardList.add(dashboard);
                });
            }
        };

        self.clearAuthorisedComponentList = function () {
            authorisedComponentList.clear();
            authorisedDashboardList.clear();
        };

        self.getAuthorisedComponentList = function (componentType) {
            if (componentType === "DASHBOARD") {
                return authorisedDashboardList;
            }

            return authorisedComponentList;
        };

        self.filterAuthorisedComponents = function (sourceArray, key, exclusionPredicate) {
            if (!Configurations.system.componentAccessControlEnabled) {
                return sourceArray;
            }

            return sourceArray.filter(function (element) {
                return authorisedComponentList.has(element[key]) || (exclusionPredicate && exclusionPredicate(element));
            });
        };

        /**
         * Observable to store the time at which the last middleware request was fired.<br>
         * Declared inside [BaseKOModel]{@linkcode BaseKOModel} but is set in [service base]{@linkcode BaseService~genericCompleteHandler}.
         * @instance
         * @memberof BaseKOModel
         * @alias lastUpdatedTime
         * @type {Observable.<String>}
         */
        self.lastUpdatedTime = ko.observable();

        /**
         * Knockout Custom Component loader to selectively load only those components which are specified in [authorisedComponentList]{@linkcode BaseKOModel#authorisedComponentList}.<br>
         * For more details, refer the [official KnockoutJS documentation]{@link http://knockoutjs.com/documentation/component-loaders.html#custom-component-loader}.
         * @type {Object}
         * @member
         */
        const componentCustomLoader = {
                loadComponent: function (name, componentConfig, callback) {
                    if (componentConfig.module !== "core" && Extensions.components.indexOf(componentConfig.module + "/" + name) > -1) {
                        componentConfig.basePath = "extensions/components";
                    } else if (Constants.localization && componentConfig.basePath === "components" && Constants.localization.data.components.indexOf(componentConfig.module + "/" + name) > -1) {
                        componentConfig.basePath = "lzn/" + Constants.localization.name + "/components";
                    }

                    let componentPath = componentConfig.basePath + "/" + componentConfig.module + "/";

                    if (componentConfig.config) {
                        componentPath += name.replace(/^review-/, "") + (Configurations.development.enabled ? "/loader" : "");

                        require([componentPath], function (loader) {
                            const loaderConfig = loader(componentConfig.config);

                            ko.components.defaultLoader.loadComponent(name, {
                                viewModel: loaderConfig.viewModel,
                                template: loaderConfig.template
                            }, callback);
                        });
                    } else {
                        componentPath += name + (Configurations.development.enabled ? "/loader" : "");

                        ko.components.defaultLoader.loadComponent(name, {
                            require: componentConfig.compLoader ? componentConfig.compLoader(name, componentConfig, componentPath) : componentPath
                        }, callback);
                    }
                }
            },

            noAccessComponentLoader = {
                loadComponent: function (name, componentConfig, callback) {
                    if (Configurations.system.componentAccessControlEnabled && !authorisedComponentList.has(name) && componentConfig.basePath !== "framework/elements" && !self.isDashboardBuilderContext()) {
                        const componentPath = "framework/elements/core/access-denied" + (Configurations.development.enabled ? "/loader" : "");

                        ko.components.defaultLoader.loadComponent(name, {
                            require: componentPath
                        }, callback);
                    } else {
                        callback(null);
                    }
                }
            };

        /**
         * Set the custom loader [componentCustomLoader]{@linkcode BaseKOModel~componentCustomLoader} as the primary Knockout component loader.
         * @type {Boolean}
         */
        ko.components.loaders.unshift(noAccessComponentLoader, componentCustomLoader);
        /**
         * Using deferUpdates as true reduces the UI clutter. Notifications happen asynchronously, immediately after the current task and generally before any UI redraws.
         * But you should take care because it will break code that depends on synchronous updates or on notification of intermediate values. Recommended workaround is using <b>ko.tasks.runEarly()</b>.
         * @type {Boolean}
         */
        ko.options.deferUpdates = true;

        /**
         * This function is used to register a knockout component.<br>
         * Once a knockout component is registered, it can be used as a reusable template wherever required,
         * wherein both the component's template and view model shall be loaded.
         *
         * @function registerComponent
         * @instance
         * @param {string} componentId  - The name of the component.
         * @param {Object} moduleId - The module name the component is a part of.
         * @param {Object} compLoader    - Callback for component loader to be used while component registration.
         * @memberof BaseKOModel
         * @return {void}
         */
        self.registerComponent = function (componentId, moduleId, compLoader, config) {
            const basePath = "components";

            if (!ko.components.isRegistered(componentId)) {
                ko.components.register(componentId, {
                    basePath: basePath,
                    module: moduleId,
                    compLoader: compLoader,
                    config: config
                });
            }
        };

        /**
         * This function is used to register a OBDX transaction.
         * This registers the component with <code>componentId</code> being passed and a review component named <code>review-{componentId}</code>.<br>
         * Once a knockout component is registered, it can be used as a reusable template wherever required,
         * wherein both the component's template and view model shall be loaded.
         *
         * @function registerTransaction
         * @instance
         * @param {string} componentId  - The name of the component.
         * @param {Object} moduleId - The module name the component is a part of.
         * @param {Object} [config] - Custom configuration object to be passed to the transaction.
         * @param {Object} [compLoader]    - Callback for component loader to be used while component registration.
         * @memberof BaseKOModel
         * @return {void}
         */
        self.registerTransaction = function (componentId, moduleId, config, compLoader) {
            self.registerComponent(componentId, moduleId, compLoader, Object.assign({}, config, {
                type: "init"
            }));

            self.registerComponent("review-" + componentId, moduleId, compLoader, Object.assign({}, config, {
                type: "review"
            }));
        };

        /**
         * This function is used to register a OBDX core elements.<br>
         * Once a knockout component is registered, it can be used as a reusable template wherever required,
         * wherein both the component's template and view model shall be loaded.
         *
         * @function registerElement
         * @instance
         * @param {string} components  - The name of the component.
         * @param {Object} [moduleId = 'api'] - The module name the component is a part of.
         * @memberof BaseKOModel
         * @return {void}
         */
        self.registerElement = function (components, moduleId) {
            const basePath = "framework/elements";

            if (!Array.isArray(components)) {
                components = [components];
            }

            components.forEach(function (componentId) {
                if (!ko.components.isRegistered(componentId)) {
                    ko.components.register(componentId, {
                        basePath: basePath,
                        module: moduleId || "api"
                    });
                }
            });
        };

        self.wrappedComponent = function (component, module, customParams) {
            self.registerComponent(component, module);

            customParams = customParams || {};

            return {
                viewModel: function (rootParams) {
                    const self = this;

                    rootParams = rootParams || {};
                    rootParams.rootModel = rootParams.rootModel || {};
                    Object.assign(self, rootParams.rootModel);
                    self.params = self.params || {};
                    Object.assign(self.params, customParams);
                },
                // eslint-disable-next-line obdx-string-validations
                template: "<" + component + " params='baseModel : $baseModel, dashboard : $dashboard, rootModel: $data'></" + component + ">"
            };
        };

        /**
         * Converts a javascript object to JSON string implemenation.<br>
         *
         * @function removeTempAttributes
         * @instance
         * @memberof BaseKOModel
         * @param  {Object} data - The javascript object to be converted.
         * @return {string}      JSON string is returned.
         */
        self.removeTempAttributes = function (data) {
            return JSON.stringify(ko.toJS(data), function (key, value) {
                if (key.substring(0, 5) !== "temp_") {
                    return value;
                }
            });
        };

        self.messages = ko.observableArray();

        const messagesClosed = [];

        /**
         * Event handler fired when after a notification message is closed.
         *
         * @memberof BaseKOModel
         * @function closeMessageHandler
         * @param {Event} event - The custom event wrapping the message closing event is passed.
         * @instance
         * @returns {void}
         */
        self.closeMessageHandler = function (event) {
            self.messages.remove(function (message) {
                return message.id === event.detail.message.id;
            });

            if (messagesClosed.length) {
                const deferred = messagesClosed[messagesClosed.findIndex(function (deferred) {
                    return deferred.state() !== "resolved";
                })];

                if (deferred) {
                    deferred.resolve();
                }
            }

            if (event.detail.message.onClose) {
                event.detail.message.onClose();
            }
        };

        /**
         * Closes notification messages by severity or all.
         *
         * @memberof BaseKOModel
         * @function closeNotificationMessages
         * @param {string} [severity] - Only close messages matching this severity level.
         * @instance
         * @returns {void}
         */
        self.closeNotificationMessages = function (severity) {
            const node = document.getElementById("message-box");

            if (node) {
                const busyContext = oj.Context.getContext(node).getBusyContext(),
                    ojMessages = node.querySelectorAll("oj-message");

                messagesClosed.length = 0;

                Array.from(ojMessages).forEach(function (node) {
                    if (node.getProperty("message.severity") === severity || !severity) {
                        messagesClosed.push($.Deferred());
                    }
                });

                busyContext.whenReady().then(function () {
                    node.closeAll(function (message) {
                        return severity ? message.severity === severity : true;
                    });
                });

                return Promise.all(messagesClosed);
            }

            return Promise.resolve();
        };

        const createMessageObject = function (messageList) {
            for (let i = 0; i < messageList.length; i++) {
                if ((messageList[i].code || messageList[i].errorCode) !== "DIGX_UM_042") {
                    if ((messageList[i].detail || messageList[i].errorMessage) && !self.messages().filter(function (element) {
                            return (element.summary === messageList[i].code) || (element.summary === messageList[i].errorCode);
                        }).length) {
                        self.messages.push({
                            detail: self.characterEncoding({
                                message: messageList[i].detail || messageList[i].errorMessage
                            }).message,
                            severity: (messageList[i].type || "ERROR").toLowerCase(),
                            summary: messageList[i].code || messageList[i].errorCode,
                            id: Math.ceil((Math.random() * 9999999999) + 1)
                        });
                    }
                }

                createMessageObject(messageList[i].relatedMessage || []);
            }
        };

        /**
         * This function is used to display the server side error message or devloper configured messages.<br>
         * Registers and opens a new component <code>message-box</code> for displaying the error messages.
         *
         * @function showMessages
         * @memberof BaseKOModel
         * @instance
         * @param {Object} jqXHR  - The jqXHR object of the ajax call.<br>
         *                          Used to extract server sent error messages by [service base]{@linkcode BaseService~genericCompleteHandler}.
         * @param {Array<string>} errors  - Sets the custom error message(s) to be thrown.<br>
         *                                  The server needn't throw any error, set this property to thow user customized message(s).<br>Pass <code>null</code> as first argument in such cases.
         * @param {string} messageType - The type of message intended, is compulsory if custom message is being thrown.<br>
         *                               Can assume following values,
         *                               <code>ERROR</code>, <code>INFO</code>, <code>SUCCESS</code> or <code>NOTIFICATION</code>.
         * @param {Function} [onClose] - Function to be called when message box opened by this function is closed.
         * @returns {void}
         */
        self.showMessages = function (jqXHR, errors, messageType, onClose) {
            let i = 0;

            if (errors && errors.length > 0) {
                for (i = 0; i < errors.length; i++) {
                    self.messages.push({
                        detail: self.characterEncoding({
                            message: errors[i]
                        }).message,
                        severity: messageType.toLowerCase(),
                        onClose: onClose,
                        id: Math.ceil((Math.random() * 9999999999) + 1)
                    });
                }
            } else if (jqXHR && jqXHR.responseJSON) {
                if (jqXHR.responseJSON.message) {
                    if (jqXHR.responseJSON.message.validationError) {
                        createMessageObject(jqXHR.responseJSON.message.validationError);
                    } else {
                        createMessageObject([jqXHR.responseJSON.message]);
                    }
                }

                if (jqXHR.responseJSON.status && jqXHR.responseJSON.status.message) {
                    createMessageObject([jqXHR.responseJSON.status.message]);
                }
            }
        };

        self.authViewModel = null;
        self.onTFAScreen = ko.observable(false);

        /**
         * Generic method to invoke authorization screen (OTP Screen, HOTP Screen, etc).
         *
         * @param  {Object} jqXHR                  - The jqXHR object of the ajax call.
         * @param  {Object} context                - The context of the request to be passed forward.
         * @param  {Function} requestFunction        The request function to invoke the middleware request again with authorization credentials.<br>
         *                                         Can be [fireAjax]{@linkcode BaseService#fireAjax} or [getNonceForServiceInstance]{@linkcode BaseService~getNonceForServiceInstance}.
         * @param  {Function} successHandlerFunction The success handler of the middleware request.
         * @returns {void}
         */
        self.showAuthScreen = function (jqXHR, context, requestFunction, successHandlerFunction, errorHandlerFunction) {
            self.authViewModel = {
                serverResponse: jqXHR,
                currentContext: context,
                fireRequest: requestFunction,
                originalSuccess: successHandlerFunction,
                originalError: errorHandlerFunction,
                closeNotificationMessages: self.closeNotificationMessages
            };

            if (context.url.substr(0, context.url.indexOf("?")) === "me") {
                CSS.loadCSS(Promise.resolve());
            }

            self.registerElement("generic-authentication", "2fa");
            ko.contextFor(document.body).$data.isDashboardSet(true);
            self.onTFAScreen(false);
            ko.tasks.runEarly();
            self.onTFAScreen(true);
        };

        /**
         * This method used for getting server date time on user desired format.
         *
         * @function getDate
         * @instance
         * @memberof BaseKOModel
         * @param {string} [dateType] - Desired format of server date.<br>
         *                             Use valid <code>ISO 639-1</code> language code.
         * @returns {Date}
         */
        self.getDate = function (dateType) {
            const date = new Date(Constants.currentServerDate.getTime());

            if (Constants.timezoneOffset) {
                date.setMinutes(date.getMinutes() + date.getTimezoneOffset() + (-1 * Constants.timezoneOffset));
            }

            switch (dateType) {
                case "DATE_TIME":
                    return date;
                case "ISO_DATE":
                    return toISODate(date);
                default:
                    return new Date(date.toDateString());
            }
        };

        /**
         * Returns the <code>ISO 639-1</code> of the current language of the application.
         *
         * @function getLocale
         * @instance
         * @memberof BaseKOModel
         * @return {string} The <code>ISO 639-1</code> code of the language.
         */
        self.getLocale = function () {
            return oj.Config.getLocale();
        };

        const Validation = {
            numberRange: function (taxonomy) {

                return ValidationBase.Validation.validatorFactory("numberrange")
                    .createValidator({
                        min: taxonomy.minLength,
                        max: taxonomy.maxLength,
                        messageDetail: taxonomy.lengthErrorCode
                    });

            },
            length: function (taxonomy) {
                return ValidationBase.Validation.validatorFactory(oj.ValidatorFactory.VALIDATOR_TYPE_LENGTH)
                    .createValidator({
                        min: taxonomy.minLength,
                        max: taxonomy.maxLength,
                        messageDetail: taxonomy.lengthErrorCode
                    });

            },
            regExp: function (taxonomy) {
                return ValidationBase.Validation.validatorFactory(oj.ValidatorFactory.VALIDATOR_TYPE_REGEXP)
                    .createValidator({
                        pattern: taxonomy.pattern,
                        messageDetail: taxonomy.errorCode
                    });
            },
            mandatory: function (taxonomy) {
                return ValidationBase.Validation.validatorFactory(oj.ValidatorFactory.VALIDATOR_TYPE_REQUIRED)
                    .createValidator({
                        messageDetail: taxonomy.mandatoryErrorCode
                    });
            },
            dateRange: function (taxonomy, field) {
                const currentDate = self.getDate("ISO_DATE");

                return ValidationBase.Validation.validatorFactory(oj.ValidatorFactory.VALIDATOR_TYPE_DATETIMERANGE)
                    .createValidator({
                        min: taxonomy.minLength ? new Date(currentDate).setDate(currentDate.getDate() + taxonomy.minLength) : null,
                        max: taxonomy.maxLength ? new Date(currentDate).setDate(currentDate.getDate() + taxonomy.maxLength) : null,
                        messageDetail: taxonomy.lengthErrorCode,
                        converter: document.querySelector(field).converter
                    });
            }
        };

        self.getTaxonomyValidator = function (taxonomyPromise, field, fieldSelector) {
            taxonomyPromise.then(function (taxonomy) {
                const taxonomyField = taxonomy.fields.find(function (element) {
                    return element.idfield === field;
                });

                if (taxonomyField.mandatory) {
                    document.querySelector(fieldSelector).setAttribute("required", "required");
                }
            });

            return {
                validate: function (value) {

                    return new Promise(function (resolve, reject) {
                        taxonomyPromise.then(function (taxonomy) {
                            const taxonomyField = taxonomy.fields.find(function (element) {
                                    return element.idfield === field;
                                }),
                                validators = [];

                            switch (taxonomyField.fieldType) {
                                case "TEXT": {
                                    validators.push(Validation.length(taxonomyField));
                                    validators.push(Validation.regExp(taxonomyField));
                                    break;
                                }
                                case "NUMBER": {
                                    validators.push(Validation.numberRange(taxonomyField));
                                    break;
                                }
                                case "DATE": {
                                    validators.push(Validation.dateRange(taxonomyField, fieldSelector));

                                    break;
                                }
                                case "OTHER": {
                                    validators.push(Validation.length(taxonomyField));
                                }
                            }

                            try {
                                validators.forEach(function (validator) {
                                    validator.validate(value);
                                });

                                resolve();
                            } catch (e) {
                                reject({
                                    detail: e.message
                                });
                            }
                        });
                    });

                }
            };
        };

        /**
         * The global error handler for RequireJS.<br>
         * To detect errors that are not caught by local errbacks, this overridden implementation of <code>requirejs.onError()</code> is used.
         *
         * @function onError
         * @inner
         * @callback
         * @memberof BaseKOModel
         * @param  {Object} err - The error object returned by RequireJS.
         * @returns {void}
         */
        require.onError = function (err) {
            BaseLogger.error(err);

            if (err.requireType === "timeout" || err.requireType === "scripterror") {
                self.showMessages(null, [Locale.error], "ERROR");
            }
        };
    };

    /**
     * Holds the instance of [BaseKOModel]{@linkcode BaseKOModel}
     * @memberof module:baseModel
     * @inner
     * @type {BaseKOModel}
     */
    let instance;

    return {
        /**
         * Get the base model instance. Checks [instance]{@linkcode module:baseModel~instance} for instance.
         *
         * @function getInstance
         * @memberof module:baseModel
         * @static
         * @returns {BaseKOModel} The base service instance.
         */
        getInstance: function () {
            if (!instance) {
                instance = new BaseKOModel();
            }

            return instance;
        }
    };
});