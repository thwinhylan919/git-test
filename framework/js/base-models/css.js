define(["jquery", "framework/js/configurations/config", "platform"], function($, SystemConfiguration, Platform) {
    "use strict";

    return new function() {
        const self = this,
            cssTokens = {};

        let mainCSS, plateform;

        Platform.getInstance().then(function(instance) {
            plateform = instance;
        });

        function loadFonts(url) {
            const link = document.createElement("link");

            link.setAttribute("rel", "stylesheet");
            link.setAttribute("type", "text/css");
            link.setAttribute("isBrandScoped", true);
            link.setAttribute("media", "print");
            link.setAttribute("href", url.replace(/^"(.*)"$/, "$1"));
            document.head.appendChild(link);

            document.querySelector("link[isBrandScoped='true']").onload = function() {
                if (this.media !== "all") {
                    this.media = "all";
                }
            };
        }

        function parseBrandCSS(response) {
            const sizeUnit = "rem",
                styleAsset = JSON.parse(atob(response));
            let styleAssetString = ":root{";

            Object.keys(styleAsset).forEach(function(key) {
                styleAssetString += key + ":" + styleAsset[key] + (typeof styleAsset[key] === "number" ? sizeUnit : "") + ";";
            });

            styleAssetString += "}";

            return styleAssetString;
        }

        function appendBrandStyle(data) {
            if (data && data.assetDTO) {
                const style = document.createElement("style"),
                    cssString = parseBrandCSS(data.assetDTO.asset);

                style.textContent = cssString;
                style.setAttribute("isBrandScoped", true);
                document.head.appendChild(style);
            }
        }

        /**
         * @summary Utility function that tokenizes a css root prop string.<br>
         * @function getCSSTokens
         * @memberof CSS
         * @instance
         * @param  {string} cssString    - The string containing tokens to be formatted.
         * @param  {Object} [tokenObjectReference=cssTokens] - The object in which to set tokens to.
         * @returns {Object} The object containing tokens.
         */
        self.getCSSTokens = function(cssString, tokenObjectReference) {
            tokenObjectReference = tokenObjectReference || cssTokens;

            if (cssString && cssString.match(/\:root{(.*?)}/)) {
                cssString.match(/\:root{(.*?)}/)[1].split(";").forEach(function(element) {
                    const token = element.match(/(^.*?):(.*)$/);

                    if (token) {
                        tokenObjectReference[token[1]] = token[2];
                    }
                });
            }

            return tokenObjectReference;
        };

        /**
         * @summary Utility function that replaces the css string with css tokens collected before<br>
         * @function replaceCSSTokens
         * @memberof CSS
         * @inner
         * @param  {string} cssString - The string containing tokens to be formatted.
         * @returns {string} The css with replaced tokens.
         */
        const replaceCSSTokens = function(cssString) {
            Object.keys(self.getCSSTokens()).forEach(function(variable) {
                const regex = new RegExp("var\\(" + variable + "\\)", "g");

                cssString = cssString.replace(regex, self.getCSSTokens()[variable]);
            });

            return cssString;
        };

        /**
         * @summary Utility function that checks whether browser supports CSS custom properties.<br>
         * @function isCSSCustomPropAvailable
         * @memberof CSS
         * @instance
         * @returns {boolean} <code>true</code> or <code>false</code> depending on whether CSS custom properties are supported or not, respectively.
         */
        self.isCSSCustomPropAvailable = function() {
            return window.CSS && window.CSS.supports && window.CSS.supports("--fake-var", 0);
        };

        /**
         * @summary Function that returns the currently computed tokens, irrespective of browser support for CSS variables.<br>
         * @function getCurrentTokens
         * @memberof CSS
         * @instance
         * @returns {Object} The token object is returned.
         */
        self.getCurrentTokens = function() {
            return new Promise(function(resolve) {
                if (!self.isCSSCustomPropAvailable()) {
                    return resolve(JSON.parse(JSON.stringify(cssTokens)));
                }

                require(["text!" + mainCSS + ".css"], function(mainCSSString) {
                    const tokenObject = {};

                    self.getCSSTokens(mainCSSString, tokenObject);

                    return resolve(tokenObject);
                });
            });
        };

        /**
         * @summary Function that replaces the CSS strings based on CSS Custom Variables browser support.
         * @function replaceCSS
         * @memberof CSS
         * @instance
         * @param  {string} content - The string containing tokens to be formatted.
         * @returns {string} The transformed CSS string is returned.
         */
        self.replaceCSS = function(content) {

            const regex = new RegExp("\{images\}", "g");

            content = content.replace(regex, plateform("getImageBaseURL"));

            if (!self.isCSSCustomPropAvailable()) {
                return replaceCSSTokens(content);
            }

            return content;
        };

        self.loadCSS = function(brandPromise) {
            return new Promise(function(resolve) {
                $("[isBrandScoped=true]").remove();
                mainCSS = "framework/css/main" + (SystemConfiguration.development.enabled ? "" : "." + SystemConfiguration.system.buildTimestamp);

                if (!self.isCSSCustomPropAvailable()) {
                    require(["text!" + mainCSS + ".css"], function(mainCSSString) {
                        brandPromise.then(function(data) {
                            self.getCSSTokens(mainCSSString);

                            if (data && data.assetDTO) {
                                const brandCSSString = parseBrandCSS(data.assetDTO.asset);

                                if (brandCSSString) {
                                    self.getCSSTokens(brandCSSString);
                                }
                            }

                            loadFonts(self.getCSSTokens()["--base-font-url"]);

                            const node = document.createElement("style");

                            node.textContent = self.replaceCSS(mainCSSString);
                            node.setAttribute("isBrandScoped", true);
                            document.head.appendChild(node);
                            resolve();
                        });
                    });
                } else {
                    require(["css!" + mainCSS], function() {
                        brandPromise.then(function(data) {
                            appendBrandStyle(data);
                            loadFonts(getComputedStyle(document.querySelector(":root")).getPropertyValue("--base-font-url"));
                            resolve();
                        });
                    });
                }
            });
        };
    };
});