define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/bank-custom-limits",
  "ojs/ojvalidationgroup",
  "ojs/ojinputtext",
  "ojs/ojselectcombobox",
  "ojs/ojbutton",
  "ojs/ojswitch"
], function (oj, ko, $, BankCustomLimitsModel, resourceBundle) {
  "use strict";

  return function (params) {
    const self = this;

    ko.utils.extend(self, params.rootModel);
    self.nls = resourceBundle;
    params.dashboard.headerName(self.nls.BankCustomLimits.header);
    params.baseModel.registerElement("confirm-screen");
    params.baseModel.registerElement("modal-window");
    self.dataGridSource = ko.observableArray([]);

    let filteredRecordsForTransaction = [],
      currentTransactionId = null,
      accessPointGroupValue = null;
    const currencies = {
      SINGLE: null,
      GROUP: null,
      GLOBAL: null
    };

    self.userFullData = ko.observable(self.params.userFullData);
    self.dataGridSourceCopy = ko.observableArray([]);
    self.accessPoints = [];
    self.currentAccessPoint = ko.observable();
    self.dataLoaded = ko.observable(false);
    self.displayGrid = ko.observable(false);
    self.mode = ko.observable("VIEW");
    params.baseModel.registerComponent("limit-data-grid", "limits-enquiry");
    self.transactions = ko.observableArray([]);
    self.currentTransaction = ko.observable();
    self.limitPackages = [];
    self.limitsHeader = ko.observable(self.nls.BankCustomLimits.viewLimits);
    self.today = ko.observable(oj.IntlConverterUtils.dateToLocalIso(params.baseModel.getDate()));
    self.effectiveDate = self.params.mode ? ko.observable(self.params.transactionDetails.transactionSnapshot.effectiveDate) : ko.observable(self.today());
    self.endDate = ko.observable();

    self.minEndDate = ko.computed(function () {
      const temp = new Date(self.effectiveDate());

      temp.setDate(temp.getDate() + 1);
      temp.setHours(0, 0, 0, 0);

      return oj.IntlConverterUtils.dateToLocalIso(temp).toString();
    }, self);

    if (self.params.transactionDetails && self.params.transactionDetails.transactionSnapshot) {
      self.transactionDetails = self.params.transactionDetails.transactionSnapshot;
      self.userId = self.params.transactionDetails.transactionSnapshot.userId;
      self.limitPackageDTOList = self.params.transactionDetails.transactionSnapshot.limitPackageDTOList;
    }

    self.approvalMode = self.params.mode ? ko.observable(self.params.mode) : ko.observable();

    if (self.transactionDetails) {
      BankCustomLimitsModel.fetchUser(self.transactionDetails.userId).then(function (data) {
        self.fullName = params.baseModel.format(self.nls.BankCustomLimits.fullNameTemplate, {
          firstName: data.userDTO.firstName,
          middleName: data.userDTO.middleName,
          lastName: data.userDTO.lastName
        });

        self.partyIdDisplayValue = data.userDTO.partyId.displayValue;
      });
    }

    if (self.approvalMode() === "approval") {
      self.currentTransaction(self.params.transactionDetails.transactionSnapshot.transactionName);
    }

    self.partyIdDisplayValue = self.params.transactionDetails ? self.partyIdDisplayValue : self.userFullData().partyId.displayValue;
    self.userId = self.params.transactionDetails ? self.userId : params.rootModel.params.username;

    self.fullName = self.params.transactionDetails ? self.fullName : params.baseModel.format(self.nls.BankCustomLimits.fullNameTemplate, {
      firstName: self.userFullData().firstName,
      middleName: self.userFullData().middleName,
      lastName: self.userFullData().lastName
    });

    const effectiveDateDispose = self.effectiveDate.subscribe(function () {
      if (self.endDate()) {
        const effectiveDateObject = new Date(self.effectiveDate()),
          endDateObject = new Date(self.endDate());

        effectiveDateObject.setHours(0, 0, 0, 0);
        endDateObject.setHours(0, 0, 0, 0);

        if (effectiveDateObject >= endDateObject) {
          self.endDate("");
        }
      }
    });

    self.httpStatus = ko.observable();
    self.transactionStatus = ko.observable();

    self.taskMap = {};

    BankCustomLimitsModel.fetchEffectiveTodayDetails().then(function (data) {
      if (data.isEffectiveSameDay === "N") {
        let temp = params.baseModel.getDate();

        temp = temp.setDate(temp.getDate() + 1);
        self.today(oj.IntlConverterUtils.dateToLocalIso(temp));
        self.effectiveDate(self.today());
      }
    });

    self.fetchAllLimits = function () {

      Promise.all([BankCustomLimitsModel.fetchAssignedLimitPackages(self.userId, self.currentAccessPoint().id, "SINGLE"),
          BankCustomLimitsModel.fetchUtilizedLimits(self.userId, "PARTY", self.currentAccessPoint().id, "SINGLE", "PER#DAILY"),
          BankCustomLimitsModel.fetchUtilizedLimits(self.userId, "PARTY", self.currentAccessPoint().id, "SINGLE", "PER#MONTHLY"),
          BankCustomLimitsModel.fetchCustomLimitPackages(self.userId, "true"), BankCustomLimitsModel.searchTransactionGroup("limit"),
          BankCustomLimitsModel.searchTasks()
        ])
        .then(function (data) {
          const assigned = data[0],
            custom = data[3],
            taskGroups = data[4],
            tasks = data[5].taskList;

          self.dataGridSource([]);

          let utilized = [];

          data[5].taskList.forEach(function (task) {
            self.taskMap[task.id] = task.name;
          });

          if (data[1].limitUtilizationDTOs) {
            utilized = utilized.concat(data[1].limitUtilizationDTOs);
          }

          if (data[2].limitUtilizationDTOs) {
            utilized = utilized.concat(data[2].limitUtilizationDTOs);
          }

          assigned.limitPackageDTOList.forEach(function (limitPackageDTO) {
            const accessPointGroupType = limitPackageDTO.accessPointGroupType;

            if (accessPointGroupType === "GROUP") {
              accessPointGroupValue = limitPackageDTO.accessPointValue;
            }

            const taskGroupLinkages = [];

            limitPackageDTO.targetLimitLinkages.forEach(function (linkage) {
              if (linkage.target.type.id === "TASK") {
                const transactionDesc = self.taskMap[linkage.target.value];
                let txnType = linkage.target.value,
                  txnTypeDesc = transactionDesc;

                if (accessPointGroupType === "GROUP") {
                  txnType = "TPG";
                  txnTypeDesc = self.nls.BankCustomLimits[txnType];
                } else if (accessPointGroupType === "GLOBAL") {
                  txnType = "CONS";
                  txnTypeDesc = self.nls.BankCustomLimits[txnType];
                }

                const monthlyRecords = [];

                linkage.limits.forEach(function (limit) {

                  if (!currencies[accessPointGroupType]) {
                    currencies[accessPointGroupType] = limit.currency;
                  }

                  if (limit.limitType === "PER") {
                    const countRecord = {
                        id: txnType + linkage.target.value + limit.periodicity + "COUNT",
                        bank: {
                          value: limit.maxCount
                        },
                        user: {
                          value: 0
                        },
                        utilized: {
                          value: 0
                        },
                        available: {
                          value: limit.maxCount
                        },
                        type: txnType,
                        typeDesc: txnTypeDesc,
                        transaction: linkage.target.value,
                        transactionDesc: transactionDesc,
                        dataTypeDesc: self.nls.BankCustomLimits[limit.periodicity].count,
                        newValue: {
                          value: ko.observable()
                        },
                        periodicity: limit.periodicity,
                        dataType: "COUNT"

                      },
                      amountRecord = {
                        id: txnType + linkage.target.value + limit.periodicity + "AMOUNT",
                        bank: {
                          value: limit.maxAmount.amount,
                          currency: limit.currency
                        },
                        user: {
                          value: 0,
                          currency: limit.currency
                        },
                        utilized: {
                          value: 0,
                          currency: limit.currency
                        },
                        available: {
                          value: limit.maxAmount.amount,
                          currency: limit.currency
                        },
                        type: txnType,
                        typeDesc: txnTypeDesc,
                        transaction: linkage.target.value,
                        transactionDesc: transactionDesc,
                        dataTypeDesc: self.nls.BankCustomLimits[limit.periodicity].amount,
                        newValue: {
                          value: ko.observable(),
                          currency: limit.currency
                        },
                        periodicity: limit.periodicity,
                        currency: limit.currency,
                        dataType: "AMOUNT"

                      };

                    if (limit.periodicity === "DAILY") {
                      self.dataGridSource().push(countRecord, amountRecord);
                    } else {
                      monthlyRecords.push(countRecord, amountRecord);
                    }
                  }
                });

                self.dataGridSource(self.dataGridSource().concat(monthlyRecords));

              } else if (linkage.target.type.id === "TASK_GROUP") {
                taskGroupLinkages.push(linkage);
              }
            });

            taskGroupLinkages.forEach(function (linkage) {
              const filteredTaskGroups = ko.utils.arrayFilter(taskGroups.taskGroupDTOlist, function (taskGroup) {
                  return taskGroup.id === linkage.target.value;
                }),
                taskGroup = filteredTaskGroups[0];
              let txnType = "TG";

              if (accessPointGroupType === "GROUP") {
                txnType = "TPGTG";
              } else if (accessPointGroupType === "GLOBAL") {
                txnType = "CONSTG";
              }

              const txnTypeDesc = self.nls.BankCustomLimits[txnType];

              taskGroup.taskDTOs.forEach(function (taskDTO) {
                const monthlyRecords = [];

                linkage.limits.forEach(function (limit) {
                  if (!currencies[accessPointGroupType]) {
                    currencies[accessPointGroupType] = limit.currency;
                  }

                  if (limit.limitType === "PER") {
                    const transactionDesc = self.taskMap[taskDTO.id],

                     countRecord = {
                        id: txnType + taskDTO.id + limit.periodicity + "COUNT",
                        bank: {
                          value: limit.maxCount
                        },
                        user: {
                          value: 0
                        },
                        utilized: {
                          value: 0
                        },
                        available: {
                          value: limit.maxCount
                        },
                        type: txnType,
                        typeDesc: txnTypeDesc,
                        transaction: taskDTO.id,
                        transactionDesc: transactionDesc,
                        dataTypeDesc: self.nls.BankCustomLimits[limit.periodicity].count,
                        newValue: {
                          value: ko.observable()
                        },
                        periodicity: limit.periodicity,
                        txnGroup: taskGroup.id,
                        dataType: "COUNT"
                      },
                      amountRecord = {
                        id: txnType + taskDTO.id + limit.periodicity + "AMOUNT",
                        bank: {
                          value: limit.maxAmount.amount,
                          currency: limit.currency
                        },
                        user: {
                          value: 0,
                          currency: limit.currency
                        },
                        utilized: {
                          value: 0,
                          currency: limit.currency
                        },
                        available: {
                          value: limit.maxAmount.amount,
                          currency: limit.currency
                        },
                        type: txnType,
                        typeDesc: txnTypeDesc,
                        transaction: taskDTO.id,
                        transactionDesc: transactionDesc,
                        dataTypeDesc: self.nls.BankCustomLimits[limit.periodicity].amount,
                        newValue: {
                          value: ko.observable(),
                          currency: limit.currency
                        },
                        periodicity: limit.periodicity,
                        currency: limit.currency,
                        txnGroup: taskGroup.id,
                        dataType: "AMOUNT"
                      };

                    if (limit.periodicity === "DAILY") {
                      self.dataGridSource().push(countRecord, amountRecord);
                    } else {
                      monthlyRecords.push(countRecord, amountRecord);
                    }
                  }
                });

                self.dataGridSource(self.dataGridSource().concat(monthlyRecords));
              });
            });
          });

          custom.limitPackageDTOList.forEach(function (limitPackageDTO) {
            const accessPointGroupType = limitPackageDTO.accessPointGroupType;

            limitPackageDTO.targetLimitLinkages.forEach(function (linkage) {
              if (linkage.target.type.id === "TASK") {
                let txnType = linkage.target.value;

                if (accessPointGroupType === "GROUP") {
                  txnType = "TPG";
                } else if (accessPointGroupType === "GLOBAL") {
                  txnType = "CONS";
                }

                linkage.limits.forEach(function (limit) {
                  if (limit.limitType === "PER") {

                    const filter1 = txnType + linkage.target.value + limit.periodicity + "AMOUNT",
                      filter2 = txnType + linkage.target.value + limit.periodicity + "COUNT";

                    self.dataGridSource().forEach(function (record, index, dataGridSourceReference) {
                      if (record.id === filter1) {
                        dataGridSourceReference[index].user.value = limit.maxAmount.amount;
                      } else if (record.id === filter2) {
                        dataGridSourceReference[index].user.value = limit.maxCount;
                      }

                      dataGridSourceReference[index].available.value = dataGridSourceReference[index].user.value ? Math.min(dataGridSourceReference[index].bank.value, dataGridSourceReference[index].user.value) : dataGridSourceReference[index].bank.value;
                    });

                  }
                });
              } else if (linkage.target.type.id === "TASK_GROUP") {
                let txnType = "TG";

                if (accessPointGroupType === "GROUP") {
                  txnType = "TPGTG";
                } else if (accessPointGroupType === "GLOBAL") {
                  txnType = "CONSTG";
                }

                const filteredTaskGroups = ko.utils.arrayFilter(taskGroups.taskGroupDTOlist, function (taskGroup) {
                    return taskGroup.id === linkage.target.value;
                  }),
                  taskGroup = filteredTaskGroups[0];

                taskGroup.taskDTOs.forEach(function (taskDTO) {
                  linkage.limits.forEach(function (limit) {
                    if (limit.limitType === "PER") {

                      const filter1 = txnType + taskDTO.id + limit.periodicity + "AMOUNT",
                        filter2 = txnType + taskDTO.id + limit.periodicity + "COUNT";

                      self.dataGridSource().forEach(function (record, index, dataGridSourceReference) {
                        if (record.id === filter1) {
                          dataGridSourceReference[index].user.value = limit.maxAmount.amount;
                        } else if (record.id === filter2) {
                          dataGridSourceReference[index].user.value = limit.maxCount;
                        }

                        dataGridSourceReference[index].available.value = dataGridSourceReference[index].user.value ? Math.min(dataGridSourceReference[index].bank.value, dataGridSourceReference[index].user.value) : dataGridSourceReference[index].bank.value;
                      });

                    }
                  });

                });
              }

            });
          });

          utilized.forEach(function (utilizedLimit) {
            const accessPointGroupType = utilizedLimit.accessPointGroupType,

              filteredTasks = ko.utils.arrayFilter(tasks, function (task) {
                return task.id === utilizedLimit.utilizationId;
              });

            if (filteredTasks.length) {
              let txnType = utilizedLimit.utilizationId;

              if (accessPointGroupType === "GROUP") {
                txnType = "TPG";
              } else if (accessPointGroupType === "GLOBAL") {
                txnType = "CONS";
              }

              const filter1 = txnType + utilizedLimit.utilizationId + (utilizedLimit.limitType.includes("DAILY") ? "DAILY" : "MONTHLY") + "AMOUNT",
                filter2 = txnType + utilizedLimit.utilizationId + (utilizedLimit.limitType.includes("DAILY") ? "DAILY" : "MONTHLY") + "COUNT";

              self.dataGridSource().forEach(function (record, index, dataGridSourceReference) {
                if (record.id === filter1) {
                  dataGridSourceReference[index].utilized.value = utilizedLimit.amount.amount;

                  const applicable = Math.min(dataGridSourceReference[index].bank.value, dataGridSourceReference[index].user.value);

                  dataGridSourceReference[index].available.value = [applicable ? applicable : dataGridSourceReference[index].bank.value] - utilizedLimit.amount.amount;
                } else if (record.id === filter2) {
                  dataGridSourceReference[index].utilized.value = utilizedLimit.count;

                  const applicable = Math.min(dataGridSourceReference[index].bank.value, dataGridSourceReference[index].user.value);

                  dataGridSourceReference[index].available.value = [applicable ? applicable : dataGridSourceReference[index].bank.value] - utilizedLimit.count;
                }
              });

            } else {
              const filteredTaskGroups = ko.utils.arrayFilter(taskGroups.taskGroupDTOlist, function (taskGroup) {
                return taskGroup.id === utilizedLimit.utilizationId;
              });

              if (filteredTaskGroups.length) {
                let txnType = "TG";

                if (accessPointGroupType === "GROUP") {
                  txnType = "TPGTG";
                } else if (accessPointGroupType === "GLOBAL") {
                  txnType = "CONSTG";
                }

                const taskGroup = filteredTaskGroups[0];

                taskGroup.taskDTOs.forEach(function (taskDTO) {

                  const filter1 = txnType + taskDTO.id + (utilizedLimit.limitType.includes("DAILY") ? "DAILY" : "MONTHLY") + "AMOUNT",
                    filter2 = txnType + taskDTO.id + (utilizedLimit.limitType.includes("DAILY") ? "DAILY" : "MONTHLY") + "COUNT";

                  self.dataGridSource().forEach(function (record, index, dataGridSourceReference) {
                    if (record.id === filter1) {
                      dataGridSourceReference[index].utilized.value = utilizedLimit.amount.amount;

                      const applicable = Math.min(dataGridSourceReference[index].bank.value, dataGridSourceReference[index].user.value);

                      dataGridSourceReference[index].available.value = [applicable ? applicable : dataGridSourceReference[index].bank.value] - utilizedLimit.amount.amount;
                    } else if (record.id === filter2) {
                      dataGridSourceReference[index].utilized.value = utilizedLimit.count;

                      const applicable = Math.min(dataGridSourceReference[index].bank.value, dataGridSourceReference[index].user.value);

                      dataGridSourceReference[index].available.value = [applicable ? applicable : dataGridSourceReference[index].bank.value] - utilizedLimit.count;
                    }
                  });

                });

              }

            }
          });

          if (self.limitPackageDTOList) {
            self.limitPackageDTOList.forEach(function (limitPackageDTO) {
              const accessPointGroupType = limitPackageDTO.accessPointGroupType;

              limitPackageDTO.targetLimitLinkages.forEach(function (linkage) {
                if (linkage.target.type.id === "TASK") {
                  let txnType = linkage.target.value;

                  if (accessPointGroupType === "GROUP") {
                    txnType = "TPG";
                  } else if (accessPointGroupType === "GLOBAL") {
                    txnType = "CONS";
                  }

                  linkage.limits.forEach(function (limit) {
                    if (limit.limitType === "PER") {

                      const filter1 = txnType + linkage.target.value + limit.periodicity + "AMOUNT",
                        filter2 = txnType + linkage.target.value + limit.periodicity + "COUNT";

                      self.dataGridSource().forEach(function (record, index, dataGridSourceReference) {
                        if (record.id === filter1) {
                          if(dataGridSourceReference[index].available.value !== limit.maxAmount.amount){
                          dataGridSourceReference[index].newValue = {
                            value: ko.observable(limit.maxAmount.amount),
                            currency: limit.maxAmount.currency
                          };
                          }
                        } else if (record.id === filter2) {
                          if(dataGridSourceReference[index].available.value !== limit.maxCount){
                          dataGridSourceReference[index].newValue = {
                            value: ko.observable(limit.maxCount)
                          };
                        }
                        }
                      });

                    }
                  });
                } else if (linkage.target.type.id === "TASK_GROUP") {
                  let txnType = "TG";

                  if (accessPointGroupType === "GROUP") {
                    txnType = "TPGTG";
                  } else if (accessPointGroupType === "GLOBAL") {
                    txnType = "CONSTG";
                  }

                  const filteredTaskGroups = ko.utils.arrayFilter(taskGroups.taskGroupDTOlist, function (taskGroup) {
                      return taskGroup.id === linkage.target.value;
                    }),
                    taskGroup = filteredTaskGroups[0];

                  taskGroup.taskDTOs.forEach(function (taskDTO) {
                    linkage.limits.forEach(function (limit) {
                      if (limit.limitType === "PER") {
                        const filter1 = txnType + taskDTO.id + limit.periodicity + "AMOUNT",
                          filter2 = txnType + taskDTO.id + limit.periodicity + "COUNT";

                        self.dataGridSource().forEach(function (record, index, dataGridSourceReference) {
                          if (record.id === filter1) {
                            if(dataGridSourceReference[index].available.value !== limit.maxAmount.amount){
                            dataGridSourceReference[index].newValue = {
                              value: ko.observable(limit.maxAmount.amount),
                              currency: limit.maxAmount.currency
                            };
                            }
                          } else if (record.id === filter2) {
                            if(dataGridSourceReference[index].available.value !== limit.maxCount){
                            dataGridSourceReference[index].newValue = {
                              value: ko.observable(limit.maxCount)
                            };
                          }
                          }
                        });
                      }
                    });

                  });
                }

              });
            });
          }

          if (self.approvalMode() !== "approval") {
            self.currentTransaction(null);
          }

          self.displayGrid(true);
          self.dataLoaded(true);
        });
    };

    BankCustomLimitsModel.fetchAccessPoints().then(function (data) {
      self.accessPoints = data.accessPointListDTO;

      const loggedInAccessPoint = ko.utils.arrayFirst(self.accessPoints, function (accessPoint) {
        return accessPoint.currentLoggedIn;
      });

      self.currentAccessPoint(loggedInAccessPoint);
      self.displayGrid(false);
      self.fetchAllLimits();
    });

    const createLimit = function (records, periodicity) {
        const limit = {};

        limit.limitType = "PER";
        limit.periodicity = periodicity;

        records.forEach(function (limitRecord) {
          if (limitRecord.dataType === "AMOUNT") {
            limit.maxAmount = {
              currency: limitRecord.currency,
              amount: limitRecord.newValue.value() ? limitRecord.newValue.value() : limitRecord.user.value ? limitRecord.user.value : limitRecord.bank.value
            };
          } else {
            limit.maxCount = limitRecord.newValue.value() ? limitRecord.newValue.value() : limitRecord.user.value ? limitRecord.user.value : limitRecord.bank.value;
          }
        });

        return limit;
      },

      createLinkage = function (targetId, type, records) {
        const linkage = {
          target: {
            value: targetId,
            type: {
              id: type
            }
          },
          limits: [],
          effectiveDate: self.effectiveDate(),
          expiryDate: self.endDate()
        };

        if (records[0] && records[0].txnGroup) {
          linkage.target.value = records[0].txnGroup;
        }

        const dailyRecords = ko.utils.arrayFilter(records, function (record) {
            return record.periodicity === "DAILY";
          }),
          monthlyRecords = ko.utils.arrayFilter(records, function (record) {
            return record.periodicity === "MONTHLY";
          });

        if (dailyRecords.length) {
          linkage.limits.push(createLimit(dailyRecords, "DAILY"));

        }

        if (monthlyRecords.length) {
          linkage.limits.push(createLimit(monthlyRecords, "MONTHLY"));
        }

        return linkage;
      },

      prepareLimitPackagePayload = function (records, accessPointGroupType, accessPointValue) {
        const limitPackageDTO = {
          targetLimitLinkages: []
        };

        limitPackageDTO.accessPointGroupType = accessPointGroupType;
        limitPackageDTO.currency = currencies[accessPointGroupType];
        limitPackageDTO.accessPointValue = accessPointValue;

        let transactionLevelRecords = ko.utils.arrayFirst(records, function (record) {
            return !record.txnGroup && record.newValue.value();
          }),
          transactionGroupLevelRecords = ko.utils.arrayFirst(records, function (record) {
            return record.txnGroup && record.newValue.value();
          });

        if (transactionLevelRecords) {
          transactionLevelRecords = ko.utils.arrayFilter(records, function (record) {
            return !record.txnGroup;
          });

          limitPackageDTO.targetLimitLinkages.push(createLinkage(currentTransactionId, "TASK", transactionLevelRecords));
        }

        if (transactionGroupLevelRecords) {
          transactionGroupLevelRecords = ko.utils.arrayFilter(records, function (record) {
            return record.txnGroup;
          });

          limitPackageDTO.targetLimitLinkages.push(createLinkage(currentTransactionId, "TASK_GROUP", transactionGroupLevelRecords));
        }

        if (limitPackageDTO && limitPackageDTO.targetLimitLinkages && limitPackageDTO.targetLimitLinkages.length) {
          self.limitPackages.push(limitPackageDTO);
        }
      },

      giveTransactionRecords = function (records, transactionId) {
        const filteredRecords = ko.utils.arrayFilter(records, function (record) {
          return record.transaction === transactionId;
        });

        return filteredRecords;
      };

    self.confirm = function () {
      self.limitPackages = [];

      const accessPointLevelRecords = ko.utils.arrayFilter(filteredRecordsForTransaction, function (record) {
        return record.type === currentTransactionId || record.type === "TG";
      });

      if (accessPointLevelRecords && accessPointLevelRecords.length) {
        prepareLimitPackagePayload(accessPointLevelRecords, "SINGLE", self.currentAccessPoint().id);
      }

      if (accessPointGroupValue) {
        const accessPointGroupLevelRecords = ko.utils.arrayFilter(filteredRecordsForTransaction, function (record) {
          return record.type === "TPG" || record.type === "TPGTG";
        });

        if (accessPointGroupLevelRecords && accessPointGroupLevelRecords.length) {
          prepareLimitPackagePayload(accessPointGroupLevelRecords, "GROUP", accessPointGroupValue);
        }
      }

      const globalRecords = ko.utils.arrayFilter(filteredRecordsForTransaction, function (record) {
        return record.type === "CONS" || record.type === "CONSTG";
      });

      if (globalRecords && globalRecords.length) {
        prepareLimitPackagePayload(globalRecords, "GLOBAL", "GLOBAL");
      }

      BankCustomLimitsModel.createBankCustomLimits(ko.mapping.toJSON({
        limitPackageDTOList: self.limitPackages,
        transactionName: self.currentTransaction(),
        accessPointValue: self.currentAccessPoint().name,
        effectiveDate: self.effectiveDate(),
        expiryDate: self.endDate()
      }), self.userId).then(function (data, status, jqXhr) {
        self.httpStatus(jqXhr.status);
        self.transactionStatus(data.status);

        params.dashboard.loadComponent("confirm-screen", {
          jqXHR: jqXhr,
          transactionName: self.nls.BankCustomLimits.transactionName
        });
      });
    };

    self.cancel = function () {
      $("#reviewCancel").trigger("openModal");
    };

    self.no = function () {
      $("#reviewCancel").hide();
    };

    const isRecordEdited = function (records, type) {
        const filteredRecord = ko.utils.arrayFirst(records, function (record) {

          return record.type === type && record.newValue.value() && record.newValue.value() > 0;

        });

        return filteredRecord;
      },

      filterForTab = function (records, Tab) {
        const filteredRecords = ko.utils.arrayFilter(records, function (record) {
          return record.type === Tab;
        });

        return filteredRecords;
      };

    self.filterDataSource = function () {
      let reviewRecords = [];

      Object.keys(self.taskMap).forEach(function (key) {
        if (self.taskMap[key] === self.currentTransaction()) {
          currentTransactionId = key;
        }
      });

      filteredRecordsForTransaction = giveTransactionRecords(self.dataGridSource(), currentTransactionId);

      if (isRecordEdited(filteredRecordsForTransaction, currentTransactionId)) {
        reviewRecords = reviewRecords.concat(filterForTab(filteredRecordsForTransaction, currentTransactionId));
      }

      if (isRecordEdited(filteredRecordsForTransaction, "TG")) {
        reviewRecords = reviewRecords.concat(filterForTab(filteredRecordsForTransaction, "TG"));
      }

      if (isRecordEdited(filteredRecordsForTransaction, "TPG")) {
        reviewRecords = reviewRecords.concat(filterForTab(filteredRecordsForTransaction, "TPG"));
      }

      if (isRecordEdited(filteredRecordsForTransaction, "TPGTG")) {
        reviewRecords = reviewRecords.concat(filterForTab(filteredRecordsForTransaction, "TPGTG"));
      }

      if (isRecordEdited(filteredRecordsForTransaction, "CONS")) {
        reviewRecords = reviewRecords.concat(filterForTab(filteredRecordsForTransaction, "CONS"));
      }

      if (isRecordEdited(filteredRecordsForTransaction, "CONSTG")) {
        reviewRecords = reviewRecords.concat(filterForTab(filteredRecordsForTransaction, "CONSTG"));
      }

      return reviewRecords;
    };

    const dataLoadedDispose = self.dataLoaded.subscribe(function () {
      if (self.transactionDetails) {
        self.dataGridSource(self.filterDataSource());
      }
    });

    self.save = function () {
      if (!params.baseModel.showComponentValidationErrors(document.getElementById("tracker"))) {
        return;
      }

      const reviewRecords = self.filterDataSource();

      if (!reviewRecords.length) {
        params.baseModel.showMessages(null, [self.nls.BankCustomLimits.noChangeError], "ERROR");
      } else {
        self.mode("REVIEW");
        self.limitsHeader(self.nls.BankCustomLimits.limitsChanged);
        self.dataGridSourceCopy(self.dataGridSource());
        self.dataGridSource(reviewRecords);
      }

    };

    self.dispose = function () {
      self.minEndDate.dispose();
      effectiveDateDispose.dispose();
      dataLoadedDispose.dispose();
    };

  };
});
