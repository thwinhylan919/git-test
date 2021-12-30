define([], function () {
    "use strict";

    return {
        accountParser: {
            creditcard: function (data, currentTransaction) {
                const creditCardList = [];

                data[0].creditcards.forEach(function (item) {
                    if (currentTransaction === "card-details") {
                        creditCardList.push(item);
                    }

                    if (currentTransaction === "card-statement") {
                        if (item.cardOwnershipType === "PRIMARY") {
                            creditCardList.push(item);
                        }
                    }

                    if (currentTransaction === "card-pay") {
                        if (item.cardOwnershipType === "PRIMARY" && item.cardStatus !== "CLD") {
                            creditCardList.push(item);
                        }
                    }

                    if (currentTransaction === "request-pin") {
                        if (item.cardStatus === "ACT") {
                            creditCardList.push(item);
                        }
                    }

                    if (currentTransaction === "block-card") {
                        if (item.cardStatus === "ACT" || item.cardStatus === "IAT") {
                            creditCardList.push(item);
                        }
                    }

                    if (currentTransaction === "auto-pay") {
                        if (item.cardOwnershipType === "PRIMARY" && item.cardStatus === "ACT") {
                            creditCardList.push(item);
                        }
                    }

                    if (currentTransaction === "creditcard-reset-pin") {
                        if (item.cardOwnershipType === "PRIMARY" && item.cardStatus === "ACT") {
                            creditCardList.push(item);
                        }
                    }

                    if (currentTransaction === "add-on-card") {
                        if (item.cardOwnershipType === "PRIMARY" && item.cardStatus === "ACT") {
                            creditCardList.push(item);
                        }
                    }
                });

                data[0].accounts = creditCardList;

                data[0].accounts.map(function (creditCard) {
                    creditCard.id = creditCard.creditCard;
                    creditCard.partyId = data[0].associatedParty;
                    creditCard.partyName = creditCard.ownerName;
                    creditCard.accountNickname = creditCard.cardNickname;
                    creditCard.associatedParty = data[0].associatedParty;

                    return creditCard;
                });

                return data[0].accounts;
            },
            "demand-deposits": function (accounts, currentTransaction) {
                if (currentTransaction === "cheque-book-request" || currentTransaction === "cheque-status-inquiry" || currentTransaction === "cheque-stop-unblock") {
                    return accounts.filter(function (account) {
                        return account.accountFacilities.hasChequeBook;
                    });
                }

                return accounts;
            },
            "term-deposits": function (accounts, currentTransaction) {
                if (currentTransaction === "td-topup") {
                    return accounts.filter(function (account) {
                        return account.productDTO.facilityParameter && account.productDTO.facilityParameter.topupAllowed;
                    });
                }

                return accounts;
            }
        },

        transactionParser: {
            creditcard: function (transactions, parameters) {
                let itemToRemove = [];

                if (parameters.cardOwnershipType === "ADDON" && parameters.cardStatus === "ACT") {
                    itemToRemove = itemToRemove.concat([
                        "card-statement",
                        "card-pay",
                        "auto-pay",
                        "reset-pin",
                        "add-on-card"
                    ]);
                } else if (parameters.cardOwnershipType === "PRIMARY" && parameters.cardStatus === "IAT") {
                    itemToRemove = itemToRemove.concat([
                        "request-pin",
                        "auto-pay",
                        "reset-pin",
                        "add-on-card"
                    ]);
                } else if (parameters.cardOwnershipType === "ADDON" && parameters.cardStatus === "IAT") {
                    itemToRemove = itemToRemove.concat([
                        "card-statement",
                        "card-pay",
                        "request-pin",
                        "auto-pay",
                        "reset-pin",
                        "add-on-card"
                    ]);
                } else if (parameters.cardOwnershipType === "PRIMARY" && parameters.cardStatus === "HTL") {
                    itemToRemove = itemToRemove.concat([
                        "request-pin",
                        "block-card",
                        "auto-pay",
                        "reset-pin",
                        "add-on-card"
                    ]);
                } else if (parameters.cardOwnershipType === "ADDON" && parameters.cardStatus === "HTL") {
                    itemToRemove = itemToRemove.concat([
                        "card-statement",
                        "card-pay",
                        "request-pin",
                        "block-card",
                        "auto-pay",
                        "reset-pin",
                        "add-on-card"
                    ]);
                } else if (parameters.cardOwnershipType === "PRIMARY" && parameters.cardStatus === "CLD") {
                    itemToRemove = itemToRemove.concat([
                        "card-pay",
                        "request-pin",
                        "block-card",
                        "auto-pay",
                        "reset-pin",
                        "add-on-card"
                    ]);
                } else if (parameters.cardOwnershipType === "ADDON" && parameters.cardStatus === "CLD") {
                    itemToRemove = itemToRemove.concat([
                        "card-statement",
                        "card-pay",
                        "request-pin",
                        "block-card",
                        "auto-pay",
                        "reset-pin",
                        "add-on-card"
                    ]);
                }

                return transactions.filter(function (item) {
                    return itemToRemove.indexOf(item.component) === -1;
                });

            },
            "demand-deposits": function (transactions, parameters) {
                if (!parameters.accountFacilities.hasChequeBook) {
                    const itemToRemove = ["cheque-book-request", "cheque-status-inquiry", "cheque-stop-unblock"];

                    return transactions.filter(function (item) {
                        return itemToRemove.indexOf(item.component) === -1;
                    });
                }

                return transactions;
            },
            "term-deposits": function (transactions, parameters) {
                if (!parameters.productDTO.facilityParameter || !parameters.productDTO.facilityParameter.topupAllowed) {
                    const itemToRemove = ["td-topup"];

                    return transactions.filter(function (item) {
                        return itemToRemove.indexOf(item.component) === -1;
                    });
                }

                return transactions;
            }
        }
    };
});