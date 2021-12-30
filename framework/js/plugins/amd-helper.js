define(["knockout", "framework/js/constants/constants", "framework/js/configurations/config", "text!extensions/extension.json"], function(ko, Constants, SystemConfiguration, extensions) {
    "use strict";

    const require = window.require,
        addTrailingSlash = function(path) {
            return path && path.replace(/\/?$/, "/");
        },
        Extensions = JSON.parse(extensions);

    (function(ko, require) {
        const koAMDHelper = new ko.nativeTemplateEngine(),
            sources = {},
            defaultPath = "./partials",
            defaultSuffix = ".html",
            defaultRequireTextPluginName = "text";

        koAMDHelper.loader = function(templateName, done) {
            const partialPath = (function() {
                if (Extensions.partials.indexOf(templateName) > -1) {
                    return "extensions/partials";
                } else if (Constants.localization && Constants.localization.data && Constants.localization.data.partials.indexOf(templateName) > -1) {
                    return "lzn/" + Constants.localization.name + "/partials";
                }

                return defaultPath;
            })();

            require([defaultRequireTextPluginName + "!" + addTrailingSlash(partialPath) + templateName + defaultSuffix + (SystemConfiguration.development.enabled ? "" : "?bust=" + SystemConfiguration.system.buildTimestamp)], done);
        };

        ko.templateSources.requireTemplate = function(key) {
            this.key = key;
            // eslint-disable-next-line obdx-string-validations
            this.template = ko.observable(" ");
            this.requested = false;
            this.retrieved = false;
        };

        ko.templateSources.requireTemplate.prototype.text = function() {
            if (!this.requested && this.key) {
                koAMDHelper.loader(this.key, function(templateContent) {
                    this.retrieved = true;
                    this.template(templateContent);
                }.bind(this));

                this.requested = true;
            }

            if (!this.key) {
                this.template("");
            }

            if (arguments.length === 0) {
                return this.template();
            }
        };

        koAMDHelper.createRootTemplate = function(template, doc) {
            let el;

            if (typeof template === "string") {
                el = (doc || document).getElementById(template);

                if (el && el.tagName.toLowerCase() === "script") {
                    return new ko.templateSources.domElement(el);
                }

                if (!sources[template]) {
                    sources[template] = new ko.templateSources.requireTemplate(template);
                }

                return sources[template];
            } else if (template && (template.nodeType === 1 || template.nodeType === 8)) {
                return new ko.templateSources.anonymousTemplate(template);
            }
        };

        koAMDHelper.renderTemplate = function(template, bindingContext, options, templateDocument) {
            let templateSource,
                existingAfterRender = options && options.afterRender;
            const localTemplate = options && options.templateProperty && bindingContext.$module && bindingContext.$module[options.templateProperty];

            if (existingAfterRender) {
                existingAfterRender = options.afterRender = options.afterRender.original || options.afterRender;
            }

            if (localTemplate && (typeof localTemplate === "function" || typeof localTemplate === "string")) {
                templateSource = {
                    text: function() {
                        return typeof localTemplate === "function" ? localTemplate.call(bindingContext.$module) : localTemplate;
                    }
                };
            } else {
                templateSource = koAMDHelper.createRootTemplate(template, templateDocument);
            }

            if (typeof existingAfterRender === "function" && templateSource instanceof ko.templateSources.requireTemplate && !templateSource.retrieved) {
                options.afterRender = function() {
                    if (templateSource.retrieved) {
                        existingAfterRender.apply(this, arguments);
                    }
                };

                options.afterRender.original = existingAfterRender;
            }

            return koAMDHelper.renderTemplateSource(templateSource, bindingContext, options, templateDocument);
        };

        ko.amdTemplateEngine = koAMDHelper;
        ko.setTemplateEngine(koAMDHelper);
    })(ko, require);
});