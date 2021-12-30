  define([
      "ojL10n!resources/nls/generic"
  ], function() {
      "use strict";

      const setInstructions = function(Generic) {
          return {
              root: {
                  instruction: {
                      header: "Instructions Details",
                      pleaseSelect: "Please Select",
                      specification: "Specifications",
                      parameter: "Parameters",
                      instruction: "Instruction",
                      frequency: "Frequency",
                      sweepPriority: "Sweep Priority",
                      sweepDirection: "Sweep Direction",
                      revSweepFrequency: "Reverse Sweep Frequency",
                      noInstructionText: "No instructions set.",
                      currency: "Currency : {currencyCode}",
                      branch: "Branch : {branchCode}",
                      priority : "Priority {number}",
                      parameterErrorMessage : "Please enter only numeric values",
                      instructionParamList: {
                          Maximum: "Maximum",
                          MaximumDeficit: "Maximum Deficit",
                          Minimum: "Minimum",
                          MinimumDeficit: "Minimum Deficit",
                          Multiple: "Multiple",
                          ThresholdAmount: "Threshold Amount",
                          CollarAmount: "Collar Amount",
                          MaximumAmount: "Maximum Amount",
                          MinimumAmount: "Minimum Amount",
                          FixedAmount: "Fixed Amount",
                          Percentage: "Percentage",
                          TargetAmount: "Target Amount"
                      },
                      update:"Update",
                      accountCheck: {
                        true: "External",
                        false: "Internal"
                      }
                  },
                  generic:Generic
              },
              ar: true,
              fr: true,
              cs: true,
              sv: true,
              en: false,
es :true,
              "en-us": false,
              el: true
          };
      };

      return new setInstructions();
  });