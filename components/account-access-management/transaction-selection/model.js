define([], function () {
  "use strict";

  const TransactionSeclectionModel = function () {

    /**
     * In case more than one instance of model is required,
     * we are declaring model as a function, of which new instances can be created and
     * used when required.
     *
     * @class Model
     * @private
     * @memberOf ExclusionModel~ExclusionModel
     */
    const Model = function () {
      this.transactionMapping = {
        accountNumber: {
          displayValue: "",
          value: "",
          accountStatus: ""
        },
        selectedTask: [],
        accountType: "",
        nonSelectedTask: []
      };
    };

    return {
      getNewModel: function () {
        return new Model();
      }
    };
  };

  return new TransactionSeclectionModel();
});