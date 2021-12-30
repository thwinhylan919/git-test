define([], function () {
  "use strict";

  const ComponentInputLocale = function () {
    return {
      root: {
        dashboard: {
          "dashboard-quick-links": {
            type: {
              name: "Component Type",
              values: {
                "payments-quick-links": "Payments",
                "quick-access": "Quick Access",
                "mutual-funds": "Mutual Funds",
                "liquidity-management": "Liquidity Management",
                "supply-chain-finance": "Supply Chain Finance",
                "credit-facility": "Credit Facility"
              }
            }
          },
          "quick-links": {
            type: {
              name: "Component Type",
              values: {
                "demand-deposits": "Demand Deposits",
                "term-deposits": "Term Deposits",
                "term-deposits-details": "Term Deposits Details",
                loans: "Loans",
                default: "Default"
              }
            }
          },
          "wealth-management-promotional-offers": {
            type: {
              name: "Select Wealth Management Image",
              values: {
                Promotion1: "Buy Now",
                Promotion2: "SIP",
                Promotion3: "Future Image"
              }
            }
          },
          "supply-chain-finance-banner": {
            type: {
              name: "Select Supply Chain Finance Image",
              values: {
                Promotion1: "Offer Deals"
              }
            }
          },
          "dashboard-admin-action-card": {
            type: {
              name: "Component Type",
              values: {
                onboarding: "Onboarding",
                communications: "Communications",
                security: "Security",
                templates: "Templates",
                limits: "Limits",
                commonServices: "Common Services",
                payments: "Payments",
                accessPolicies: "Access Policies",
                pfm: "Personal Finance Management",
                userExp: "User Experience",
                controlMonitor: "Control & Monitor"
              }
            }
          }
        },
        "personal-finance-management": {
          "spend-summary": {
            type: {
              name: "Component Type",
              values: {
                cards: "Cards",
                graph: "Graph"
              }
            }
          }
        },
        corporateDashboard: {
          "limits-widget": {
            type: {
              name: "Component Type",
              values: {
                USER: "User",
                PARTY: "Party"
              }
            }
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

  return new ComponentInputLocale();
});