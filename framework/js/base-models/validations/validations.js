/**
 * This file lists all the methods needed for validations.
 */
define(["base-models/validations/obdx-locale", "extensions/override/obdx-locale", "framework/js/constants/constants", "ojL10n!resources/nls/data-types", "ojL10n!extensions/resources/nls/data-types"], function (obdxLocale, obdxLocaleExtension, Constants, DataTypes, DataTypesExtension) {
    /**
     * This file lists all the methods needed for validations.
     * @class
     * @alias Validations
     * @memberof module:baseModel
     */
    "use strict";

    const Validations = function () {
        /**
         * Assign <code>this</code> to <code>self</code>.
         *
         * @member {Object}
         */
        const self = this,
            getDataTypeDefinition = function (key) {
                if (DataTypesExtension && DataTypesExtension[key]) {
                    return DataTypesExtension[key];
                } else if (Constants.localization && Constants.localization.data.dataType && Constants.localization.data.dataType[key]) {
                    return Constants.localization.data.dataType[key];
                }

                return DataTypes[key];
            },
            updateValidation = function (overrideValidation, baseValidation) {
                const validation = [],
                    typeOfValidation = [];

                overrideValidation.forEach(function (item) {
                    validation.push(item);
                    typeOfValidation.push(item.type);
                });

                if (baseValidation) {
                    baseValidation.forEach(function (item) {
                        if (typeOfValidation.indexOf(item.type) === -1) {
                            validation.push(item);
                        }
                    });
                }

                return validation;

            },
            getValidatorDefinition = function (key) {
                if (obdxLocaleExtension && obdxLocaleExtension[key]) {
                    return updateValidation(obdxLocaleExtension[key], obdxLocale[key]);
                } else if (Constants.localization && Constants.localization.data.validations && Constants.localization.data.validations[key]) {
                    return updateValidation(Constants.localization.data.validations[key], obdxLocale[key]);
                }

                return obdxLocale[key];
            };

        /**
         * This function is used to generate the validation object from specified arguments.
         *
         * @function getValidator
         * @instance
         * @memberof Validations
         * @param  {string} key       - Key of the object required from <code>obdx-locale</code> or <code>data-type</code> if <code>extension</code> argument is supplied.
         * @param  {string} [message]  - The custom validation message to be shown.
         * @param  {Object} [extension] The validation object to be passed to override/add validation like length, number range, etc.<br>
         *                              If specified, the <code>key</code> is no longer a key from <code>obdx-locale</code> but from <code>data-type</code>.
         * @return {Validator}         Returns the Oracle JET validator object.
         * @example
         * self.getValidator('ACCOUNT');
         * self.getValidator('ACCOUNT', 'My custom validation message');
         * self.getValidator('AlphanumericWithSpace', 'My required validation message',
         * {
         *  type: 'numberRange',
         *  options: {
         *    min: 2,
         *    max: 10
         *  }
         *  });
         */
        self.getValidator = function (key, message, extension) {
            if (extension) {
                return [{
                    type: "regExp",
                    options: {
                        pattern: getDataTypeDefinition(key),
                        messageDetail: message
                    }
                }, extension];
            } else if (message) {
                const clone = JSON.parse(JSON.stringify(getValidatorDefinition(key)));

                clone[0].options.messageDetail = message;

                return clone;
            }

            return getValidatorDefinition(key);
        };

        /**
         * This function is used to display the validation errors if any for a form, and automatically focus on the first erroneous field.
         *
         * @function showComponentValidationErrors
         * @instance
         * @param {Object} trackerObj  - This knockout observable tracking the form.
         * @memberof Validations
         * @returns {boolean}  True in case all validations succeed, false otherwise.
         */
        self.showComponentValidationErrors = function (trackerObj) {
            if (trackerObj && trackerObj.valid !== "valid") {
                trackerObj.showMessages();
                trackerObj.focusOn("@firstInvalidShown");

                return false;
            }

            return true;
        };
    };

    return Validations;
});