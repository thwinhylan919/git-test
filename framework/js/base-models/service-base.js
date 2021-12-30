/**
 * Service Base contains all the network methods to fire middleware requests.
 * @module baseService
 * @requires jquery
 * @requires baseModel
 * @requires framework/js/constants/constants
 * @requires platform
 */
define([
    "jquery",
    "baseModel",
    "framework/js/constants/constants",
    "framework/js/configurations/config",
    "platform"
], function ($, BaseModel, Constants, Configurations, Platform) {
    "use strict";

    /**
     * Service Base contains all the network methods to fire middleware requests.
     *
     * @class
     * @alias BaseService
     * @memberof module:baseService
     * @hideconstructor
     */
    const BaseService = function () {
        /**
         * Assign <code>this</code> to <code>self</code>.
         * @member {Object}
         */
        const self = this,
            /**
             * Creates a map of requests to handle repost.
             * @member {Object}
             */
            map = {},
            /**
             * Creates a map of requests to handle throttled fetch requests.
             * @member {Object}
             */
            fetchPromiseMap = new Map(),
            /**
             * Creates a map of eTags per request URL.
             * @member {Object}
             */
            eTags = {},
            /**
             * The number of maximum number of nonce that can be requested.
             * @member {Number}
             */
            maximumNonceRequested = 15,
            /**
             * Stores the properties of service base modifiable via exposed properties method.
             * @member {Object}
             */
            props = {
                helpDeskSessionKey: "",
                /**
                 * Array to hold the nonce values to be set for each middleware request.
                 * @member {Array}
                 */
                nonceKeys: []
            },
            /**
             * HTTP Error Code for bank admin session lock
             */
            sessionLockedHTTPCode = 419,
            /**
             * HTTP Error Code for Channel Access Not Allowed
             */
            channelAccessNotAllowed = 420;
        let suspendAllRest = false;

        /**
         * Holds the current active request.
         * @member {Array}
         */
        const activeXHRPool = [],
            /**
             * Instance of [BaseKOModel]{@linkcode BaseKOModel}.
             * @member {BaseKOModel}
             */
            baseModel = BaseModel.getInstance();

        /**
         * Boolean to enable/disable nonce.
         * @type {Boolean}
         */
        self.nonceEnabled = true;

        /**
         * Stores success/failure for batch requests.
         * @type {Boolean}
         */
        let batchSuccess = true,
            /**
             * Hold the platform properties.
             * @type {function}
             */
            platform;
        /**
         * Array of jQuery [Deferred]{@linkcode http://api.jquery.com/category/deferred-object/} to hold state of nonce request.
         * @type {Array.<Deferred>}
         */
        const isNonceFetched = [];
        /**
         * A boolean which holds the state for current pending nonce.
         * @type {Boolean}
         */
        let isNoncePending = false,

            /**
             * A boolean which holds the current number for nonce requests.
             * @type {Number}
             */
            nonceRequestCount = 0;

        const setRequestHeader = function (xhr, headers) {
                Object.keys(headers).forEach(function (header) {
                    if (headers[header]) {
                        xhr.setRequestHeader(header, headers[header]);
                    }
                });
            },
            /**
             * This function return the resource path.
             *
             * @function getResourcePath
             * @memberof BaseService
             * @inner
             * @param  {Object} options     - Ajax Options.
             * @return {string}          Resource path.
             */
            getResourcePath = function (options) {
                const serverURL = platform("getServerURL"),
                    baseUrl = Configurations.apiCatalogue[options.apiType].contextRoot;

                return options.url.replace(serverURL + "/" + baseUrl, "").replace("/" + options.version + "/", "");

            },
            /**
             * This function strips out empty query parameters from the URL.
             *
             * @function normalizeURL
             * @memberof BaseService
             * @inner
             * @param  {string} url - The URL to clean.
             * @return {string}     Normalized URL is returned.
             */
            normalizeURL = function (url) {
                if (url.split("?").length > 1) {
                    return url.split("?")[0] + "?" + url.split("?").pop().replace(/(&?)\w+=(?:&|undefined(&)?|null(&)?|$)/g, "$1").replace(/&$/, "");
                }

                return url;
            },
            /**
             * This function appends user-locale information to all outgoing network requests.<br>
             * Uses [add]{@linkcode BaseModel} method from <code>QueryParams</code> to append <code>locale</code> query parameter picked from current user locale from <code>oj.Config.getLocale()</code>.
             *
             * @function addUserLocale
             * @memberof BaseService
             * @inner
             * @param  {string} url - The URL to which user-locale query parameter is to be added.
             * @return {string}     Returns the URL with <code>locale</code> query parameter which holds user-locale code.
             */
            addUserLocale = function (url) {
                return baseModel.QueryParams.add(url, {
                    locale: baseModel.getLocale()
                }, true);
            },
            /**
             * This function return the resource URL.
             *
             * @function getResourceURL
             * @memberof BaseService
             * @inner
             * @param  {Object} options     - AJAX Options.
             * @return {string}         Resource URL.
             */
            getResourceURL = function (options) {
                const serverURL = platform("getServerURL"),
                    baseUrl = Configurations.apiCatalogue[options.apiType].contextRoot;

                if (options.url === "batch") {
                    return serverURL + "/" + baseUrl + "/" + options.url;
                }

                return serverURL + "/" + baseUrl + "/" + options.version + "/" + options.url;
            },

            /**
             * The generic function which serves as <code>completeHandler</code> for all ajax requests.
             *
             * @function genericCompleteHandler
             * @inner
             * @memberof BaseService
             * @param  {jQuery.jqXHR} jqXHR      - The jqXHR object returned from jQuery [ajax]{@linkcode http://api.jquery.com/jquery.ajax/} call.
             * @param  {string} textStatus       The string categorizing the status of the request viz.<br><code>"success"</code>, <code>"notmodified"</code>, <code>"nocontent"</code>, <code>"error"</code>, <code>"timeout"</code>, <code>"abort"</code>, or <code>"parsererror"</code><br>
             *                                   For more details, see [ajax settings]{@linkcode http://api.jquery.com/jquery.ajax/#jQuery-ajax-settings}.
             * @returns {void}
             */
            genericCompleteHandler = function (jqXHR, textStatus) {
                let eTag;

                if (this && this.type !== "GET") {
                    delete map[this.type + this.url];
                }

                batchSuccess = true;

                let key = JSON.parse(jqXHR.getResponseHeader("x-nonce"));

                if (key && key.nonce) {
                    props.nonceKeys = props.nonceKeys.concat(JSON.parse(jqXHR.getResponseHeader("x-nonce")).nonce);
                    self.nonceEnabled = true;
                } else {
                    self.nonceEnabled = false;
                }

                if (this && this.url && this.type === "GET") {
                    eTag = jqXHR.getResponseHeader("ETag");

                    if (eTag) {
                        eTags[this.url] = eTag;
                    }
                }

                Constants.currentServerDate.setTime(new Date(jqXHR.getResponseHeader("Date")).getTime());

                if (jqXHR.getResponseHeader("PASSWORD_ENABLED") === "Y") {
                    $("#passwordDialog").trigger("openModal");
                }

                if (jqXHR.status === sessionLockedHTTPCode) {
                    $("#sessionExpired").trigger("openModal");
                } else if (jqXHR.status === channelAccessNotAllowed) {
                    suspendAllRest = true;

                } else if (jqXHR.status === 403) {
                    const options = {};

                    options.url = "me";
                    options.type = "GET";
                    options.apiType = "base";
                    options.version = Configurations.apiCatalogue.base.defaultVersion;
                    options.contentType = "application/json";

                    options.complete = function (jqXHR1) {
                        if (jqXHR1.status === 401) {
                            location.reload();
                        }
                    };

                    if (getResourceURL(options) !== this.url) {
                        // Noncompliant@+1 {{Move the declaration of "fireAjax" before this usage.}}
                        // eslint-disable-next-line no-use-before-define
                        fireAjax(options, {});
                    }
                }

                if (jqXHR.getResponseHeader("BATCH_ID")) {
                    for (let i = 0; i < jqXHR.responseJSON.batchDetailResponseDTOList.length; i++) {
                        key = JSON.parse(jqXHR.responseJSON.batchDetailResponseDTOList[i].header["x-nonce"] || "{}");

                        if (key && key.nonce) {
                            props.nonceKeys.push(key.nonce[0]);
                        }

                        if (jqXHR.responseJSON.batchDetailResponseDTOList[i].status >= 400) {
                            batchSuccess = false;
                        }
                    }

                    if (!batchSuccess) {
                        baseModel.showMessages(jqXHR);
                    }
                } else {
                    if (this.showMessage) {
                        baseModel.showMessages(jqXHR);
                    }

                    if (textStatus === "timeout" && this.timeoutMessage) {
                        baseModel.showMessages(null, [this.timeoutMessage], "ERROR");
                    }
                }

                const index = activeXHRPool.indexOf(jqXHR);

                if (index > -1) {
                    activeXHRPool.splice(index, 1);
                }

                if (activeXHRPool.length === 0) {
                    setTimeout(function () {
                        if (activeXHRPool.length === 0) {
                            $(".se-pre-con").fadeOut("slow");
                        }
                    }, 100);

                    baseModel.lastUpdatedTime(new Date());
                }

                if (jqXHR.status === 417) {
                    baseModel.showMessages(jqXHR);
                    this.url = getResourcePath(this);
                    // eslint-disable-next-line no-use-before-define
                    baseModel.showAuthScreen(jqXHR, this, this.requestType === "batch" ? fireBatchAjax : this.requestType === "upload" ? self.uploadFile : fireAjax, this.success, this.error);

                    return false;
                }
            },
            /**
             * Method to fetch nonce keys for base service. This method will fire a
             * POST request and based fetch nonce keys from the response header
             * and add them to [nonceKeys]{@linkcode BaseService~nonceKeys} array, from which a key is popped and added to each
             * going request.
             *
             * @function getNonceForServiceInstance
             * @memberof BaseService
             * @instance
             * @param  {number} [nonceCount=15]      - The number of nonce requested.
             * @param  {number} [otp]                - The OTP for the current request.
             * @param  {number} [referenceNumber]    - Reference Number for the current request.
             * @returns {void}
             */
            getNonceForServiceInstance = function () {
                if (self.nonceEnabled) {
                    ++nonceRequestCount;
                }

                if (self.nonceEnabled && (props.nonceKeys.length - nonceRequestCount < 3) && (!isNoncePending || nonceRequestCount >= maximumNonceRequested)) {
                    isNoncePending = true;
                    nonceRequestCount = 0;

                    const options = {},
                        currentNonce = $.Deferred();

                    options.type = "POST";
                    options.apiType = "base";
                    options.version = Configurations.apiCatalogue[options.apiType].defaultVersion;
                    options.contentType = "application/json";
                    options.showMessage = true;

                    options.headers = {
                        "x-noncecount": maximumNonceRequested
                    };

                    options.complete = function (jqXHR) {
                        genericCompleteHandler.apply(this, [jqXHR]);
                        currentNonce.resolve();
                        isNoncePending = false;
                    };

                    options.beforeSend = function (xhr) {
                        activeXHRPool.push(xhr);
                    };

                    $("body").removeClass("loaded");
                    isNonceFetched.push(currentNonce);
                    options.url = "session/nonce";
                    platform("addHeader", options.headers);
                    options.url = getResourceURL(options);
                    options.url = addUserLocale(options.url);
                    options.url = normalizeURL(options.url);
                    $.ajax(options);
                }
            },
            /**
             * This object specifies the default ajax settings for all network calls fired via exported methods of [BaseService]{@linkcode BaseService}.<br>
             * See [list]{@linkcode module:baseService} of all such methods.
             * @type {Object}
             */
            defaults = {
                type: "GET",
                url: "",
                version: Configurations.apiCatalogue.base.defaultVersion,
                async: true,
                contentType: "application/json",
                throttle: true,
                dataType: "json",
                showMessage: true,
                apiType: "base",
                headers: {},
                beforeSend: function (xhr) {

                    if (suspendAllRest) {
                        xhr.abort();
                    }

                    setRequestHeader(xhr, {
                        "X-Helpdesk-Key": props.helpDeskSessionKey,
                        "X-Target-Unit": Object.prototype.hasOwnProperty.call(this.headers, "X-Target-Unit") ? this.headers["X-Target-Unit"] : Constants.currentEntity,
                        "If-Match": eTags[this.url],
                        "x-nonce": props.nonceKeys.pop()
                    });

                    activeXHRPool.push(xhr);
                    $(".se-pre-con").show();

                    if (this.type !== "GET" && !(this.headers.boundary && this.headers.boundary.indexOf("--OBDXbatch") > -1)) {
                        if (!map[this.type + this.url]) {
                            map[this.type + this.url] = this.type + this.url;
                        } else {
                            const index = activeXHRPool.indexOf(xhr);

                            xhr.abort();

                            if (index > -1) {
                                activeXHRPool.splice(index, 1);
                            }

                            return false;
                        }
                    }

                    return true;
                },
                complete: genericCompleteHandler
            },
            /**
             * This function utilizes [format]{@linkcode BaseModel#format} to parameterize URL.
             * Supports same arguments as [format]{@linkcode BaseModel#format}. See its documentation for more details.
             * @function parameterizeURL
             * @inner
             * @memberof BaseService
             */
            parameterizeURL = baseModel.format,
            /**
             * This function clears the [isNonceFetched]{@linkcode BaseService#isNonceFetched} array based on which deferreds are resolved.
             *
             * @function clearIsNonceFetched
             * @inner
             * @memberof BaseService
             */
            clearIsNonceFetched = function () {
                isNonceFetched.forEach(function (deferred, index, array) {
                    if (deferred.state() === "resolved") {
                        array.splice(index, 1);
                    }
                });
            },
            /**
             * The main function which fires the actual <code>ajax</code> request.<br>
             * This function is called internally from all the exported methods of [BaseService]{@linkcode BaseService}.
             * Returns a promise which resolves/rejects with the network request.
             *
             * @function fireAjax
             * @memberof BaseService
             * @inner
             * @param  {Object} settings - The object containing ajax options. See [ajax settings]{@linkcode http://api.jquery.com/jquery.ajax/#jQuery-ajax-settings} for more details.
             * @param  {Object} params   - The parameter object passed for [normalizeURL]{@linkcode BaseService~normalizeURL}.
             * @return {Promise}         Returns the promise which resolves/rejects with the network request.
             */
            fireAjax = function (settings, params) {
                if (settings.nonceRequired) {
                    self.nonceEnabled = true;
                }

                return new Promise(function (resolve, reject) {
                    Platform.getInstance().then(function (instance) {

                        platform = instance;
                        getNonceForServiceInstance();

                        Promise.all(isNonceFetched).then(function () {
                            clearIsNonceFetched();

                            const options = $.extend(true, {}, defaults, settings);

                            if (options.apiType !== "external") {
                                options.url = getResourceURL(options);
                            }

                            if (params) {
                                options.url = parameterizeURL(options.url, params, true);
                            }

                            options.promiseResolve = resolve;
                            options.url = addUserLocale(options.url);
                            options.url = normalizeURL(options.url);
                            platform("addHeader", options.headers);

                            $.ajax(options).done(function (data, _textStatus, jqXHR) {
                                baseModel.injectProps(data, "getResponseStatus", jqXHR.status);
                                baseModel.injectProps(data, "getResponseHeader", jqXHR.getResponseHeader);
                                resolve(data);
                            }).fail(function (jqXHR) {
                                if (jqXHR.status !== 417) {
                                    reject(jqXHR);
                                }
                            });
                        });
                    });

                });
            },
            /**
             * The main function which fires the actual batch <code>ajax</code> request.<br>
             * This function is called internally from [batch]{@linkcode BaseService#batch}.
             *
             * @function fireBatchAjax
             * @memberof BaseService
             * @inner
             * @param  {Object} settings - The object containing ajax options. See [ajax settings]{@linkcode http://api.jquery.com/jquery.ajax/#jQuery-ajax-settings} for more details.
             * @param  {Object} params   - The parameter object passed for [normalizeURL]{@linkcode BaseService~normalizeURL}.
             * @returns {void}
             */
            fireBatchAjax = function (settings) {
                const matches = settings.data.match(/x-nonce:\s(.*?)\r\n/g),
                    options = $.extend(true, {}, defaults, settings);

                options.url = "batch";
                options.url = getResourceURL(options);
                options.url = addUserLocale(options.url);

                platform("addHeader", options.headers);

                if (options.async) {
                    return new Promise(function (resolve, reject) {
                        matches.forEach(function () {
                            getNonceForServiceInstance();
                        });

                        Promise.all(isNonceFetched).then(function () {
                            clearIsNonceFetched();
                            options.promiseResolve = resolve;

                            matches.forEach(function (oldNonceHeader) {
                                // eslint-disable-next-line obdx-string-validations
                                options.data = options.data.replace(oldNonceHeader, "x-nonce: " + props.nonceKeys.pop() + "\r\n");
                            });

                            $.ajax(options).done(function (data, _textStatus, jqXHR) {
                                baseModel.injectProps(data, "getResponseStatus", jqXHR.status);
                                baseModel.injectProps(data, "getResponseHeader", jqXHR.getResponseHeader);
                                resolve(data);
                            }).fail(function (jqXHR) {
                                if (jqXHR.status !== 417) {
                                    reject(jqXHR);
                                }
                            });
                        });
                    });
                }

                $.ajax(options);
            },
            /**
             * Generates a random string using <code>Math</code> for use by [batch]{@linkcode BaseService#batch}.
             * @function generateRandomString
             * @inner
             * @memberof BaseService
             * @param  {Number} length The length of string desired
             * @return {String}        Random string of desired length is returned.
             */
            generateRandomString = (function (length) {
                return function () {
                    return Math.round(Math.pow(36, length + 1) - (Math.random() * Math.pow(36, length))).toString(36).slice(1);
                };
            })(10),
            /**
             * Create payload for batch request.
             *
             * @function buildBatchRequest
             * @memberof BaseService
             * @inner
             * @param  {Object} data     - The non-formatted payload parameter sent to <code>buildBatchRequest</code> for formatting.
             * @param  {string} boundary - The boundary string for separating individual requests of batch request.
             * @return {Object}          The payload object to be fired is returned.
             */
            buildBatchRequest = function (data, boundary) {
                let payload = "";
                const batchPayloadFormat = {
                    boundary: "--{boundary}\r\n",
                    header: "{key}: {value}\r\n",
                    url: "\r\n{methodType} {url} HTTP/{majorminorversion}\r\n",
                    payload: "\r\n{payload}\r\n",
                    end: "--{boundary}--\r\n"
                };

                for (let i = 0; i < data.batchDetailRequestList.length; i++) {
                    payload += baseModel.format(batchPayloadFormat.boundary, {
                        boundary: boundary
                    });

                    payload += baseModel.format(batchPayloadFormat.header, {
                        key: "x-nonce",
                        value: "nonce"
                    });

                    Object.keys(data.batchDetailRequestList[i].headers).forEach(function (key) {
                        if (data.batchDetailRequestList[i].headers[key] !== null) {
                            payload += baseModel.format(batchPayloadFormat.header, {
                                key: key,
                                value: data.batchDetailRequestList[i].headers[key]
                            });
                        }
                    });

                    payload += baseModel.format(batchPayloadFormat.url, {
                        methodType: data.batchDetailRequestList[i].methodType,
                        url: parameterizeURL(data.batchDetailRequestList[i].uri.value, data.batchDetailRequestList[i].uri.params, true),
                        majorminorversion: "1.1"
                    });

                    if (data.batchDetailRequestList[i].payload && data.batchDetailRequestList[i].payload.trim()) {
                        payload += baseModel.format(batchPayloadFormat.payload, {
                            payload: data.batchDetailRequestList[i].payload.trim()
                        });
                    }
                }

                return payload += baseModel.format(batchPayloadFormat.end, {
                    boundary: boundary
                });
            },
            /**
             * This function sets the [fetchPromiseMap]{@linkcode BaseService#fetchPromiseMap} and deletes the saved promises after throttle period, as set by <code>framework/js/constants</code>.
             *
             * @function populatePromiseMap
             * @memberof BaseService
             * @inner
             * @param  {Object} settings - The ajax settings object.
             * @param  {Object} params - The ajax params object.
             * @return {void}
             */
            populatePromiseMap = function (settings, params) {
                if (settings.throttle === false) {
                    return fireAjax(settings, params);
                }

                let url = settings.url;

                if (settings.apiType !== "external") {
                    url = settings.version + "~" + url + "~" + (settings.headers ? settings.headers["X-Target-Unit"] : "");
                }

                if (params) {
                    url = parameterizeURL(url, params, true);
                }

                if (!fetchPromiseMap.has(url)) {
                    fetchPromiseMap.set(url, {
                        promise: fireAjax(settings, params).then(function (data) {
                            setTimeout(function () {
                                fetchPromiseMap.delete(url);
                            }, Configurations.system.requestThrottleSeconds * 1000);

                            return data;
                        }).catch(function (err) {
                            setTimeout(function () {
                                fetchPromiseMap.delete(url);
                            }, Configurations.system.requestThrottleSeconds * 1000);

                            return err;
                        })
                    });
                }

                return !settings.validationError && fetchPromiseMap.has(url) ? fetchPromiseMap.get(url).promise : new Promise(function (resolve, reject) {
                    fetchPromiseMap.get(url).promise.then(function (data) {
                        if (typeof settings.validationError === "function") {
                            const result = settings.validationError(data);

                            if (result) {
                                reject(new Error(result));
                            }
                        }

                        resolve();
                    }).catch(function () {
                        reject(new Error(settings.validationError));
                    });
                });
            };

        /**
         * Download a file.
         *
         * @function downloadFile
         * @instance
         * @memberof BaseService
         * @param  {Object} options - The object containing ajax options. See [ajax settings]{@linkcode http://api.jquery.com/jquery.ajax/#jQuery-ajax-settings} for more details.
         * @param  {Object} params  - The parameter object passed for [normalizeURL]{@linkcode BaseService~normalizeURL}.
         * @returns {void}
         * @example
         * var baseService = BaseService.getInstance();
         * var options = {
         *     url: 'accounts/loan/{accountId}/schedule?media=application/pdf&fromDate={fromDate}&toDate={toDate}'
         * };
         * var params = { 'accountId': accountId, 'fromDate': fromDate, 'toDate': toDate };
         * baseService.downloadFile(options, params);
         */
        self.downloadFile = function (options, params) {
            $(".se-pre-con").show();
            options = $.extend(true, {}, defaults, options);
            options.url = getResourceURL(options);

            if (params) {
                options.url = parameterizeURL(options.url, params, true);
            }

            options.url = addUserLocale(options.url);
            options.url = normalizeURL(options.url);
            getNonceForServiceInstance();
            platform("downloadFile", options, props.nonceKeys.pop(), genericCompleteHandler);
        };

        /**
         * Fires a <code>POST</code> request for passed parameters. Delegates the <code>ajax</code> call to [fireAjax]{@linkcode BaseService~fireAjax}.
         *
         * @function add
         * @memberof BaseService
         * @instance
         * @param  {Object} settings - The object containing ajax options. See [ajax settings]{@linkcode http://api.jquery.com/jquery.ajax/#jQuery-ajax-settings} for more details.
         * @param  {Object} params   - The parameter object passed for [normalizeURL]{@linkcode BaseService~normalizeURL}.
         * @returns {Promise}        Returns the promise returned from [fireAjax]{@linkcode BaseService~fireAjax}.
         * @example
         * var baseService = BaseService.getInstance();
         * var options = {
         *     url: 'accounts/deposit/{accountId}/penalities',
         *     data: postDataToBeSent
         * };
         * var params = { 'accountId': accountId };
         * return baseService.add(options, params);
         */
        self.add = function (settings, params) {
            settings.type = "POST";

            const successHandler = settings.success;

            settings.success = function (data, status, jqXHR) {
                data = baseModel.characterEncoding(data);

                if (successHandler) {
                    successHandler(data, status, jqXHR);
                }
            };

            return fireAjax(settings, params);
        };

        /**
         * Fires a <code>GET</code> request for passed parameters and downloads an image from the OBDX Middleware.
         *
         * @function fetchImage
         * @memberof BaseService
         * @instance
         * @param  {Object} settings - The object containing ajax options. See [ajax settings]{@linkcode http://api.jquery.com/jquery.ajax/#jQuery-ajax-settings} for more details.
         * @param  {Object} params   - The parameter object passed for [normalizeURL]{@linkcode BaseService~normalizeURL}.
         * @returns {Promise}        Returns the promise returned which resolves with <code>src</code> content in form of Blob to display the image.
         * @example
         * var baseService = BaseService.getInstance();
         * var options = {
         *     url: "brands/{brandID}?name={resourcePath}&type=I",
         *     element: document.getElementById("myImageElement")
         * };
         * var params = {brandID: Constants.brandID, resourcePath: resourcePath};
         * return baseService.fetchImage(options, params);
         */
        self.fetchImage = function (settings, params) {
            const headers = new Headers(),
                options = $.extend(true, {}, defaults, settings);

            if (options.apiType !== "external") {
                options.url = getResourceURL(options);
            }

            if (params) {
                options.url = parameterizeURL(options.url, params, true);
            }

            options.url = addUserLocale(options.url);
            options.url = normalizeURL(options.url);

            getNonceForServiceInstance();

            return Promise.all(isNonceFetched).then(function () {
                headers.append("X-Target-Unit", Constants.currentEntity);
                headers.append("x-nonce", props.nonceKeys.pop());

                const imageFetchRequest = new Request(options.url, {
                    method: "GET",
                    credentials: "same-origin",
                    headers: headers
                });

                return fetch(imageFetchRequest).then(function (response) {
                    const nonceResponseHeader = response.headers.get("x-nonce");

                    if (nonceResponseHeader) {
                        props.nonceKeys.push(JSON.parse(nonceResponseHeader).nonce[0]);
                    }

                    return response.blob();
                }).then(function (blob) {
                    const blobResponse = window.URL.createObjectURL(blob);

                    if (options.element && options.sourceAttribute) {
                        options.element.setAttribute(options.sourceAttribute, blobResponse);
                    }

                    return blobResponse;
                });
            });
        };

        /**
         * Fires a batch request for passed parameters. Delegates the <code>ajax</code> call to [fireBatchAjax]{@linkcode BaseService~fireBatchAjax}.
         *
         * @function batch
         * @memberof BaseService
         * @instance
         * @param  {Object} settings - The object containing ajax options. See [ajax settings]{@linkcode http://api.jquery.com/jquery.ajax/#jQuery-ajax-settings} for more details.
         * @param  {Object} params   - The parameter object passed for [normalizeURL]{@linkcode BaseService~normalizeURL}.
         * @param  {Object} data     - The non-formatted payload parameter sent to <code>buildBatchRequest</code> for formatting.
         * @returns {void}
         * @example
         * var baseService = BaseService.getInstance();
         * var options = {
         *     url: 'batch'
         * };
         * baseService.batch(options, {}, batchRequestData);
         */
        self.batch = function (settings, params, data) {
            const boundary = "--OBDXbatch" + generateRandomString();

            settings.type = "POST";
            settings.contentType = "multipart/mixed";

            settings.headers = {
                boundary: boundary,
                "X-BATCH_TYPE": params ? params.type : null,
                "X-Target-Unit": Constants.currentEntity
            };

            settings.requestType = "batch";
            settings.data = buildBatchRequest(data, boundary);

            const successHandler = settings.success;

            settings.success = function (data, status, jqXHR) {
                for (let i = 0; i < data.batchDetailResponseDTOList.length; i++) {
                    data.batchDetailResponseDTOList[i].responseObj = baseModel.characterEncoding(JSON.parse(data.batchDetailResponseDTOList[i].responseText));
                }

                if (successHandler) {
                    successHandler(data, status, jqXHR);
                }
            };

            return fireBatchAjax(settings, params);
        };

        /**
         * Fires an <code>PUT</code> request for passed parameters. Delegates the <code>ajax</code> call to [fireAjax]{@linkcode BaseService~fireAjax}.
         *
         * @function update
         * @memberof BaseService
         * @instance
         * @param  {Object} settings - The object containing ajax options. See [ajax settings]{@linkcode http://api.jquery.com/jquery.ajax/#jQuery-ajax-settings} for more details.
         * @param  {Object} params   - The parameter object passed for [normalizeURL]{@linkcode BaseService~normalizeURL}.
         * @returns {Promise}        Returns the promise returned from [fireAjax]{@linkcode BaseService~fireAjax}.
         * @example
         * var baseService = BaseService.getInstance();
         * var options = {
         *     url: 'accounts/deposit/{accountId}/penalities',
         *     data: updateData
         * };
         * var params = { 'accountId': accountId };
         * return baseService.update(options, params);
         */
        self.update = function (settings, params) {

            settings.type = "PUT";

            return fireAjax(settings, params);
        };

        /**
         * Fires a <code>PATCH</code> request for passed parameters. Delegates the <code>ajax</code> call to [fireAjax]{@linkcode BaseService~fireAjax}.
         *
         * @function patch
         * @memberof BaseService
         * @instance
         * @param  {Object} settings - The object containing ajax options. See [ajax settings]{@linkcode http://api.jquery.com/jquery.ajax/#jQuery-ajax-settings} for more details.
         * @param  {Object} params   - The parameter object passed for [normalizeURL]{@linkcode BaseService~normalizeURL}.
         * @returns {Promise}        Returns the promise returned from [fireAjax]{@linkcode BaseService~fireAjax}.
         * @example
         * var baseService = BaseService.getInstance();
         * var options = {
         *     url: 'accounts/deposit/{accountId}/penalities'
         * };
         * var params = { 'accountId': accountId };
         * return baseService.patch(options, params);
         */
        self.patch = function (settings, params) {
            settings.type = "PATCH";

            return fireAjax(settings, params);
        };

        /**
         * Fires a <code>DELETE</code> request for passed parameters. Delegates the <code>ajax</code> call to [fireAjax]{@linkcode BaseService~fireAjax}.
         *
         * @function remove
         * @memberof BaseService
         * @instance
         * @param  {Object} settings - The object containing ajax options. See [ajax settings]{@linkcode http://api.jquery.com/jquery.ajax/#jQuery-ajax-settings} for more details.
         * @param  {Object} params   - The parameter object passed for [normalizeURL]{@linkcode BaseService~normalizeURL}.
         * @returns {Promise}        Returns the promise returned from [fireAjax]{@linkcode BaseService~fireAjax}.
         * @example
         * var baseService = BaseService.getInstance();
         * var options = {
         *     url: 'accounts/deposit/{accountId}/penalities'
         * };
         * var params = { 'accountId': accountId };
         * return baseService.remove(options, params);
         */
        self.remove = function (settings, params) {

            settings.type = "DELETE";

            settings.dataFilter = function (data) {
                if (!data) {
                    return "{}";
                }

                return data;
            };

            return fireAjax(settings, params);
        };

        /**
         * Fires a <code>GET</code> request for passed parameters. Delegates the <code>ajax</code> call to [fireAjax]{@linkcode BaseService~fireAjax}.
         *
         * @function fetch
         * @memberof BaseService
         * @instance
         * @param  {Object} settings - The object containing ajax options. See [ajax settings]{@linkcode http://api.jquery.com/jquery.ajax/#jQuery-ajax-settings} for more details.
         * @param  {Object} params   - The parameter object passed for [normalizeURL]{@linkcode BaseService~normalizeURL}.
         * @returns {Promise}        Returns the promise returned from [fireAjax]{@linkcode BaseService~fireAjax}.
         * @example
         * var baseService = BaseService.getInstance();
         * var options = {
         *     url: 'accounts/deposit/{accountId}/penalities'
         * };
         * var params = { 'accountId': accountId };
         * return baseService.fetch(options, params);
         */
        self.fetch = function (settings, params) {
            settings.type = "GET";

            const successHandler = settings.success;

            settings.success = null;

            return populatePromiseMap(settings, params).then(function (data) {
                const encodedData = baseModel.characterEncoding(data);

                if (successHandler) {
                    successHandler(encodedData);
                }

                return encodedData;
            });
        };

        /**
         * Delegates a request to <code>load!</code> or [fetch]{@linkcode BaseService~fetch} depending on whether or not to mock data for Dashboard Management Creation Flow.
         *
         * @function fetchWidget
         * @memberof BaseService
         * @instance
         * @param  {Object} settings - The object containing ajax options. See [ajax settings]{@linkcode http://api.jquery.com/jquery.ajax/#jQuery-ajax-settings} for more details.
         * @param  {Object} params   - The parameter object passed for [normalizeURL]{@linkcode BaseService~normalizeURL}.
         * @returns {Promise}        Returns the promise returned from [fetch]{@linkcode BaseService~fetch} or <code>load!</code>.
         * @example
         * var baseService = BaseService.getInstance();
         * var options = {
         *     url: 'accounts/deposit/{accountId}/penalities',
         *     mockedUrl: 'framework/json/design-dashboard/accounts/financial-summary/accounts.json'
         * };
         * var params = { 'accountId': accountId };
         * return baseService.fetchWidget(options, params);
         */
        self.fetchWidget = function (settings, params, data) {
            if (baseModel.isDashboardBuilderContext()) {
                settings.url = settings.mockedUrl;

                return new Promise(function (resolve) {
                    require(["load!" + settings.url], function (json) {
                        resolve(json);

                        if (settings.success) {
                            settings.success(json);
                        }
                    });
                });
            } else if (settings.url === "batch") {
                return self.batch(settings, params, data);
            }

            return self.fetch(settings, params);
        };

        /**
         * This function invalidates the existing nonce and cached data in the storage.
         *
         * @function invalidateSession
         * @memberof BaseService
         * @instance
         * @return {void}
         */
        self.invalidateSession = function () {
            clearIsNonceFetched();
            props.nonceKeys.length = 0;
            fetchPromiseMap.clear();

            activeXHRPool.forEach(function (xhr) {
                xhr.abort();
            });

            self.nonceEnabled = true;
            activeXHRPool.length = 0;
        };

        /**
         * This function sets or gets the properties of service base.
         *
         * @function properties
         * @memberof BaseService
         * @param {string} propName - The name of the property to be read or modified.
         * @param {Object} [propValue] - The value of the property to be set.
         * @instance
         * @return {Object} Either returns the value or sets the value and returns the value that was set.
         */
        self.properties = function (propName, propValue) {
            if (!propName) {
                return new Error("NO PROPERTY NAME SPECIFIED");
            }

            if (propValue === undefined) {
                return props[propName];
            }

            return props[propName] = propValue;
        };

        /**
         * Uploads a file to the server.
         *
         * @function uploadFile
         * @memberof BaseService
         * @instance
         * @param  {Object} settings - The object containing ajax options. See [ajax settings]{@linkcode http://api.jquery.com/jquery.ajax/#jQuery-ajax-settings} for more details.
         * @param  {Object} params   - The parameter object passed for [normalizeURL]{@linkcode BaseService~normalizeURL}.
         * @returns {void}
         * @example
         * var baseService = BaseService.getInstance();
         * var options = {
         *    url: 'brand/{brandId}',
         *    formData: form,
         *    type: 'PUT'
         * };
         * var params = { 'brandId': brandId };
         * baseService.uploadFile(options, params);
         */
        self.uploadFile = function (settings, params) {
            settings.type = settings.type || "POST";

            const xhr = new XMLHttpRequest(),
                //Extend the settings object
                options = $.extend(true, {}, defaults, settings);

            let response;

            //Appending the url with the context
            options.url = getResourceURL(options);

            if (params) {
                options.url = parameterizeURL(options.url, params, true);
            }

            options.url = addUserLocale(options.url);
            options.url = normalizeURL(options.url);
            options.requestType = "upload";
            //readying xhr for nonce
            xhr.open(options.type, options.url, true);
            xhr.responseType = "json";

            const performRequest = options.beforeSend(xhr);

            if (options.headers["X-CHALLENGE_RESPONSE"]) {
                Object.keys(options.headers).forEach(function (key) {
                    xhr.setRequestHeader([key], options.headers[key]);
                });
            }

            xhr.send(options.formData);

            if (!performRequest) {
                xhr.abort();
            }

            return new Promise(function (resolve, reject) {
                xhr.onreadystatechange = function () {
                    if (this.readyState === 4) {
                        if (typeof this.response === "string") {
                            response = JSON.parse(this.response);
                        } else {
                            response = this.response;
                        }

                        if ([200, 201, 202].includes(this.status)) {
                            baseModel.injectProps(response, "getResponseStatus", this.status);
                            resolve(response);
                        } else if (this.status !== 417) {
                            reject(response);
                        }

                        if (options.success && [200, 201, 202].includes(this.status)) {
                            options.success(response, this.status, this);
                        } else if (options.error && this.status !== 417) {
                            options.error(response, this.status, this);
                        }

                        this.responseJSON = response;
                        genericCompleteHandler.apply(options, [xhr]);
                    }
                };
            });
        };

        self.login = function (params) {
            return fetch(addUserLocale(parameterizeURL(Configurations.sharding.apiBaseURL + "/{contextRoot}/j_security_check", {
                contextRoot: Configurations.apiCatalogue.base.contextRoot
            })), {
                method: "POST",
                credentials: "same-origin",
                body: params,
                headers: {
                    "Content-type": "application/x-www-form-urlencoded"
                }
            });
        };
    };
    /**
     * Holds the instance of [BaseService]{@linkcode BaseService}
     * @memberof module:baseService
     * @inner
     * @type {BaseService}
     */
    let instance;

    /**
     * Creates a instance of service base and returns it.
     *
     * @function createInstance
     * @memberof module:baseService
     * @inner
     * @return {BaseService} Instance of service base.
     */
    function createInstance(override) {
        const baseService = new BaseService(),
            /**
             * The exported methods of base service.
             * @type {Object}
             * @name ServiceBaseExports
             * @instance
             * @property {Function} add - Fires a <code>POST</code> request. See [add]{@linkcode BaseService#add} for detailed usage and documentation.
             * @property {Function} patch - Fires a <code>PATCH</code> request. See [patch]{@linkcode BaseService#patch} for detailed usage and documentation.
             * @property {Function} fetch - Fires a <code>GET</code> request. See [fetch]{@linkcode BaseService#fetch} for detailed usage and documentation.
             * @property {Function} update - Fires an <code>PUT</code> request. See [update]{@linkcode BaseService#update} for detailed usage and documentation.
             * @property {Function} remove - Fires a <code>DELETE</code> request. See [remove]{@linkcode BaseService#remove} for detailed usage and documentation.
             * @property {Function} batch - Fires a <code>batch</code> request. See [batch]{@linkcode BaseService#batch} for detailed usage and documentation.
             * @property {Function} downloadFile - Download a file. See [downloadFile]{@linkcode BaseService#downloadFile} for detailed usage and documentation.
             * @property {Function} uploadFile - Upload a file. See [uploadFile]{@linkcode BaseService#uploadFile} for detailed usage and documentation.
             */
            ServiceBaseExports = {
                add: baseService.add,
                patch: baseService.patch,
                fetch: baseService.fetch,
                update: baseService.update,
                remove: baseService.remove,
                batch: baseService.batch,
                fetchWidget: baseService.fetchWidget,
                downloadFile: baseService.downloadFile,
                uploadFile: baseService.uploadFile,
                fetchImage: baseService.fetchImage,
                invalidateSession: baseService.invalidateSession,
                props: baseService.properties,
                login: baseService.login
            };

        Object.assign(baseService, override);

        return ServiceBaseExports;
    }

    return {
        /**
         * Get the Service Base instance. Checks [instance]{@linkcode module:baseService~instance} for instance. If exists, returns it, else invokes [createInstance]{@linkcode module:baseService~createInstance} to create an instance and returns it.
         *
         * @function getInstance
         * @memberof module:baseService
         * @static
         * @returns {BaseService} The base service instance.
         */
        getInstance: function (override) {
            if (!instance) {
                instance = createInstance(override);
            }

            return instance;
        }
    };
});