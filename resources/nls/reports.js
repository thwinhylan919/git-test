define([], function () {
  "use strict";

  const ReportsLogLocale = function () {
    return {
      root: {
        reportsDetails: {
          labels: {
            title: "Reports",
            viewAll: "View All",
            reportList: "Report Details",
            noData: "New Reports Not Available",
            subData: "Access your recently generated reports form here",
            chooseUserType: "Select User Type on which you want to operate",
            userSelection: "User Type Selection",
            ruleType: "Reports Type",
            adminUser: "Administrative User",
            corporateUser: "Corporate User",
            status: {
              PROCESSED: "Processed",
              PENDING: "Pending",
              ERROR: "Error"
            }
          },
          reportDescription: {
            A16: "EPI Payment reconciliation Report",
            A11: "File Identifier wise Party User Mapping Report",
            A12: "Party User wise File Identifiers Mapping Report",
            A13: "Party wise User Groups Report",
            A7: "Party wise Approval Rules Report",
            A9: "Party wise File Identifiers Mapping Report",
            A10: "Party wise Payee Maintenance Report",
            C6: "Party User wise File Identifiers Mapping Report",
            C4: "Party wise Payee Maintenance Report",
            C3: "Party wise File Identifiers Mapping Report",
            C7: "Party wise User Groups Report",
            A6: "Wallet Transaction Activity Report",
            C1: "Party wise Workflows Report",
            C2: "Party wise pending Approvals list Report",
            A1: "Date wise User creation Report",
            A2: "Resources Child Role Mapping Report",
            A3: "Wallets KYC Report",
            A4: "Wallets creation for a Date Range Report",
            A8: "Party wise pending Approvals list Report",
            A14: "Party wise Workflows Report",
            U3: "Daily Balance Position Report",
            U4: "Transaction Summary Report",
            U1: "Party wise pending Approvals list Report",
            U2: "Party wise Payee Maintenance Report"
          },
          transactionTypes: {
            RT_N_CAC: "Create Corporate Administrator Report",
            RT_N_CAD: "Delete Corporate Administrator Report",
            RT_N_CAR: "Request Administrator Report",
            RT_N_CAU: "Update Corporate Administrator Report",
            RT_N_CUR: "Request User Report",
            RT_N_DAR: "Cancel Administrator Report",
            RT_N_DUR: "Cancel User Report",
            RT_N_UAR: "Update Administrator Report",
            RT_N_UUM: "Update User Report Mapping",
            RT_N_UUR: "Update User Report",
            GR_M_MSP: "Pause Structure",
            GR_M_MSR: "Resume Structure",
            GR_M_CNS: "Create Structure",
            GR_M_IMS: "Execute Structure",
            GR_M_ES: "Edit Structure",
            VAMA_M_CVA: "Create Virtual Account",
            VAMA_M_UVA: "Modify Virtual Account",
            VAMA_M_DVA: "Delete Virtual Account",
            VAMS_M_CVAS: "Create Virtual Accounts Structure",
            VAMS_M_UVAS: "Modify Virtual Accounts Structure",
            VAMS_M_DVAS: "Delete Virtual Accounts Structure",
            VAMI_M_UVI: "Remittance List",
            VAME_M_CVE: "Create Virtual Entity",
            VAME_M_UVE: "Modify Virtual Entity",
            VAME_M_DVE: "Delete Virtual Entity",
            VAMMC_M_CMCA: "Create Virtual Multi-Currency Account",
            VAMMC_M_UMCA: "Modify Virtual Multi-Currency Account",
            VAMMC_M_DMCA: "Delete Virtual Multi-Currency Account",
            OBCLPM_AF_ILA: "Loan Application",
            SCFP_M_CPM: "Supply Chain Finance Maintenance",
            SCFP_M_UPM: "Supply Chain Finance Maintenance",
            SCFI_M_AI: "Supply Chain Finance Maintenance",
            SCFI_M_RI: "Supply Chain Finance Maintenance",
            SCFI_M_CI: "Supply Chain Finance Maintenance",
            SCFCP_M_OCP: "Supply Chain Finance Maintenance",
            SCFI_AF_UI: "Supply Chain Finance Non-Account Financial",
            SCFI_AF_CI: "Supply Chain Finance Non-Account Financial",
            CF_N_ECA: "Evaluate Collateral",
            CF_N_RCA: "Re-evaluate Collateral"
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

  return new ReportsLogLocale();
});