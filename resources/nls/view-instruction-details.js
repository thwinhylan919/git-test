  define(function() {
      "use strict";

      const viewinstruction = function() {
          return {
              root: {
                  instruction: {
                      header: "Instructions Details",
                      specification: "Specifications",
                      parameter: "Parameters",
                      instruction: "Instruction",
                      frequency: "Frequency",
                      sweepPriority: "Sweep Priority",
                      sweepDirection: "Sweep Direction",
                      revSweepFrequency: "Reverse Sweep Frequency",
                      noInstructionText: "No instructions set.",
                      priority : "Priority {number}",
                      sweepDirectionDetails: {
                          OW: "One Way",
                          TW: "Two Way"
                      },
                      accountCheck: {
                          true: "External",
                          false: "Internal"
                      },
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
                      }
                  }
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

      return new viewinstruction();
  });