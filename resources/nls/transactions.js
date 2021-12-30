define([], function () {
  "use strict";

  const ActivityLogLocale = function () {
    return {
      root: {
        labels: {
          header: "Activity Log ({count})",
          ACCOUNT_FINANCIAL: "Accounts Financial",
          AMOUNT_FINANCIAL: "Non Account",
          ACCOUNT_NON_FINANCIAL: "Accounts Non Financial",
          PAYMENTS: "Payments",
          ELECTRONIC_BILL_PAYMENTS: "Bill Payments",
          BULK: "Bulk",
          BULK_FILE: "Bulk File",
          BENEFICIARY: "Beneficiary",
          OTHER_TRANSACTION: "Other transactions",
          OTHER_TRANSACTION_COUNT: "Other transactions ({count})",
          ACCOUNT_FINANCIAL_COUNT: "Accounts Financial ({count})",
          AMOUNT_FINANCIAL_COUNT: "Non Account ({count})",
          ACCOUNT_NON_FINANCIAL_COUNT: "Accounts Non Financial ({count})",
          PAYMENTS_COUNT: "Payments ({count})",
          BULK_COUNT: "Bulk ({count})",
          BULK_FILE_COUNT: "Bulk File ({count})",
          PAYEE_BILLER_COUNT: "Payee and Biller ({count})",
          PAYEE_BILLER: "Payee and Biller",
          BULK_RECORD: "Bulk Record",
          BULK_RECORD_COUNT: "Bulk Record ({count})",
          NON_ACCOUNT_BULK_RECORD: "Non Account Bulk Record",
          NON_ACCOUNT_BULK_RECORD_COUNT: "Non Account Bulk Record ({count})",
          TRADE_FINANCE_COUNT: "Trade Finance ({count})",
          BULK_RECORD_NON_FINANCIAL_COUNT: "Bulk Record Non Financial ({count})",
          BULK_FILE__NON_FINANCIAL_COUNT: "Bulk File Non Financial ({count})",
          FU_R_DP: "Domestic Payee",
          FU_F_DP: "Domestic Payee",
          FU_R_ILP: "International Payee",
          FU_F_ILP: "International Payee",
          FU_R_DDP: "Demand Draft Payee",
          FU_F_DDP: "Demand Draft Payee",
          FU_F_IP: "Internal Payee",
          FU_R_IP: "Internal Payee",
          FU_F_MPY: "Mixed Payee",
          RT_N_CAC: "Create Corporate Administrative Report",
          RT_N_CAD: "Delete Corporate Administrative Report",
          RT_N_CAR: "Request Administrative Report",
          RT_N_CAU: "Update Corporate Administrative Report",
          RT_N_CUR: "Request User Report",
          RT_N_DAR: "Cancel Administrative Report",
          RT_N_DUR: "Cancel User Report",
          RT_N_UAR: "Update Administrative Report",
          RT_N_UUM: "Update User Report Mapping",
          RT_N_UUR: "Update User Report",
          GR_M_MSP: "Pause Structure",
          GR_M_MSR: "Resume Structure",
          GR_M_IMS: "Execute Structure",
          GR_M_CNS: "Create Structure",
          GR_M_ES: "Edit Structure",
          FU_R_SCFCI: "Supply Chain Finance Invoice Bulk Record",
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
          SCFP_M_CPM: "Supply Chain Finance Maintenance",
          SCFP_M_UPM: "Supply Chain Finance Maintenance",
          SCFI_M_AI: "Supply Chain Finance Maintenance",
          SCFI_M_RI: "Supply Chain Finance Maintenance",
          SCFI_M_CI: "Supply Chain Finance Maintenance",
          SCFCP_M_OCP: "Supply Chain Finance Maintenance",
          SCFI_AF_UI: "Supply Chain Finance Non-Account Financial",
          SCFI_AF_CI: "Supply Chain Finance Non-Account Financial",
          OBCLPM_AF_ILA: "Loan Application",
          CF_N_ECA: "Evaluate Collateral",
          CF_N_RCA: "Re-evaluate Collateral",
          CF_N_CFM: "Create Facility",
          CF_N_UFM: "Amend Facility",
          date: "Date",
          type: "Type",
          referenceNo: "Reference No",
          initiatedBy: "Initiated By",
          LIQUIDITY_MANAGEMENT: "Liquidity Management",
          structureId: "Structure Id",
          structureDescription: "Structure Description",
          referenceNumber: "Reference Number",
          status: "Status",
          accountsFinancial: "Accounts Financial",
          accountsNonFinancial: "Others",
          transactionType: "Transaction Type",
          accountNumber: "Account Number",
          accountName: "Account Name",
          amount: "Amount",
          debitAccountNumber: "From Account",
          beneficiaryAccountNumber: "Payee Account Details",
          beneficiaryName: "Payee Account Name",
          beneDetails: "Beneficiary Name",
          description: "Description",
          payee: "Payee/Biller Name",
          payeeType: "Payee Type",
          category: "Category",
          payeeAccountDetails: "Payee Account Details",
          list: "Activity Log Details",
          accountsFinancialList: "Financial Accounts List",
          amountFinancialList: "Non Account List",
          accountsNonFinancialList: "Non-Financial Accounts List",
          tradeFinanceList: "Trade Finance List",
          beneficiaryList: "Beneficiary Details List",
          bulkFileList: "Bulk Files List",
          bulkRecordList: "Bulk Records List",
          nonAccountBulkRecordList: "Non Account Bulk Records List",
          paymentList: "Payment Transaction List",
          billPaymentsList: "Bill Payments List",
          totalFileAmount: "File Amount",
          approvalType: "Approval Type",
          fileIdentifierDetail: "File Identifier",
          fileName: "File Name",
          valueDate: "Value Date",
          debitAccountNo: "Debit Account",
          creditAccountNo: "Credit Account No",
          paymentType: "Payment Type",
          recordStatus: "Record Status",
          fileRefId: "File Reference Number",
          recRefId: "Record Reference Number",
          fileReferenceNo: "File Reference Number",
          createdBy: "{FName} {LName}",
          details: "Click to see details of {transactionId}",
          detailText: "Transaction ID {transactionId}",
          payeeName: "Payee Name-{payeeName}",
          uploaded: "Uploaded",
          deleted: "Deleted",
          approvals: "Approvals",
          activityLogheader: "Activity Log ({count})",
          pendingApprovalheader: "Pending For Approvals ({count})",
          approvedLogHeader: "My Approved List ({count})",
          NON_FINANCIAL_BULK_FILE: "Non Financial Bulk File",
          NON_FINANCIAL_BULK_RECORD: "Non Financial Bulk Record",
          TRADE_FINANCE: "Trade Finance",
          PARTY_MAINTENANCE: "Customer Maintenances",
          ADMIN_MAINTENANCE: "Administrative Maintenance",
          BULK_FILE_ADMIN: "Bulk File Administrator",
          BULK_RECORD_ADMIN: "Bulk Record Administrator",
          dateFrom: "From Date",
          dateTo: "To Date",
          search: "Search",
          back: "Back",
          downloadEreceipt: "e-Receipt",
          filterAlt: "Click here to filter results by date",
          filter: "Filter results by date",
          mobileClick: "Click here to enter {module}",
          mobileClickTitle: "Click to enter {module}",
          eReceiptDownload: "Click here to download E Receipt",
          eReceiptDownloadAlt: "Download E Receipt",
          chooseTxnType: "Choose Transaction Type",
          financialTxn: "{count} Financial",
          nonFinancialTxn: "{count} Non Financial",
          gracePeriod: "Grace Period",
          forexDealListTable: "Forex Deal List",
          forexDealList: "Forex Deal",
          FOREX_DEAL: "Forex Deal",
          currencyCombination: "Currency Combination",
          dealType: "Deal Type",
          dealPatternType: {
            S: "Spot",
            F: "Forward"
          },
          dealAmountBuyCp: "Buy {currency}",
          dealAmountSellCp: "Sell {currency}",
          buy: "Buy",
          sell: "Sell"
        },
        status: {
          PENDING_APPROVAL: "In Progress",
          REJECTED: "Rejected",
          APPROVED: "Approved",
          INITIATED: "Initiated",
          COMPLETED: "Processed",
          EXPIRED: "Expired",
          MODIFICATION_REQUESTED: "Modification Requested"
        },
        navBarDescription: "Approved Transactions",
        toolTipMesssage: "You can approve this transaction on or before {maxDate}",
        makerToolTipMessage: "This transaction can be approved on or before {maxDate} by approver"
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

  return new ActivityLogLocale();
});