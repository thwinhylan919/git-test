define(["extensions/override/task-component-mapping", "jquery"], function(extension, $) {
    "use strict";

    const tasks = {
        LO_ATM_CR: {
            name: "review-location-add",
            module: "location-maintenance",
            class: "legacy"
        },
        LO_ATM_UP: {
            name: "review-location-update",
            module: "location-maintenance",
            class: "legacy"
        },
        LO_ATM_DE: {
            name: "location-read",
            module: "location-maintenance",
            class: "legacy"
        },
        UM_N_UMD: {
            name: "review-user-update",
            module: "user-management",
            class: "legacy"
        },
        SR_M_FBU: {
            name: "service-request-approval-view",
            module: "service-requests",
            class: "legacy"
        },
        UM_N_UCR: {
            name: "review-user-create",
            module: "user-management",
            class: "legacy"
        },
        AP_N_CWF: {
            name: "workflow-review",
            module: "approvals",
            class: "legacy"
        },
        AP_N_UWF: {
            name: "workflow-review",
            module: "approvals",
            class: "legacy"
        },
        AP_N_UR: {
            name: "rules-review",
            module: "approvals",
            class: "legacy"
        },
        AP_N_CR: {
            name: "rules-review",
            module: "approvals",
            class: "legacy"
        },
        PP_N_UPD: {
            name: "review-modify-customer-preference",
            module: "customer-preference",
            class: "legacy"
        },
        AP_N_CUG: {
            name: "user-group-review",
            module: "approvals",
            class: "legacy"
        },
        AP_N_UUG: {
            name: "user-group-review",
            module: "approvals",
            class: "legacy"
        },
        AT_N_UCA: {
            name: "review-party-access-management",
            module: "account-access-management",
            class: "legacy"
        },
        AT_N_CCA: {
            name: "review-party-access-management",
            module: "account-access-management",
            class: "legacy"
        },
        AT_N_DCA: {
            name: "review-party-access-management",
            module: "account-access-management",
            class: "legacy"
        },
        PC_N_PCL: {
            name: "review-payee-restrictions",
            module: "payee-restrictions",
            class: "legacy"
        },
        PAT_N_CA: {
            name: "review-linked-party-access-management",
            module: "account-access-management",
            class: "legacy"
        },
        PAT_N_UA: {
            name: "review-linked-party-access-management",
            module: "account-access-management",
            class: "legacy"
        },
        PAT_N_DA: {
            name: "review-linked-party-access-management",
            module: "account-access-management",
            class: "legacy"
        },
        UAT_N_UA: {
            name: "review-user-access-management",
            module: "account-access-management",
            class: "legacy"
        },
        UAT_N_CA: {
            name: "review-user-access-management",
            module: "account-access-management",
            class: "legacy"
        },
        UAT_N_DA: {
            name: "review-user-access-management",
            module: "account-access-management",
            class: "legacy"
        },
        LAT_N_CA: {
            name: "review-linked-user-access-management",
            module: "account-access-management",
            class: "legacy"
        },
        LAT_N_UA: {
            name: "review-linked-user-access-management",
            module: "account-access-management",
            class: "legacy"
        },
        LAT_N_DA: {
            name: "review-linked-user-access-management",
            module: "account-access-management",
            class: "legacy"
        },
        PP_N_CRE: {
            name: "review-create-customer-preference",
            module: "customer-preference",
            class: "legacy"
        },
        FU_N_CFR: {
            name: "review-file-identifier",
            module: "file-upload",
            class: "legacy"
        },
        FU_N_UFR: {
            name: "review-file-identifier",
            module: "file-upload",
            class: "legacy"
        },
        FU_N_UUM: {
            name: "review-user-map",
            module: "file-upload",
            class: "legacy"
        },
        AP_N_DR: {
            name: "rules-review",
            module: "approvals",
            class: "legacy"
        },
        CP_LIN: {
            name: "linkage-review",
            module: "party-linkage",
            class: "legacy"
        },
        UP_LIN: {
            name: "linkage-review",
            module: "party-linkage",
            class: "legacy"
        },
        AL_N_UPD: {
            name: "alerts-maintenance",
            module: "alerts",
            class: "legacy"
        },
        AL_N_CR: {
            name: "alerts-maintenance",
            module: "alerts",
            class: "legacy"
        },
        AL_N_DEL: {
            name: "alerts-maintenance",
            module: "alerts",
            class: "legacy"
        },
        SM_N_CTB: {
            name: "transaction-blackout-review",
            module: "transaction-blackout",
            class: "legacy"
        },
        SM_N_UTB: {
            name: "transaction-blackout-review",
            module: "transaction-blackout",
            class: "legacy"
        },
        SM_N_DTB: {
            name: "transaction-blackout-review",
            module: "transaction-blackout",
            class: "legacy"
        },
        WW_N_CWW: {
            name: "review-working-window",
            module: "cutoff",
            class: "legacy"
        },
        WW_N_UWW: {
            name: "review-working-window",
            module: "cutoff",
            class: "legacy"
        },
        WW_N_DWW: {
            name: "review-working-window",
            module: "cutoff",
            class: "legacy"
        },
        UM_N_RCR: {
            name: "review-user-action",
            module: "user-management",
            class: "legacy"
        },
        UGSM_N_CM: {
            name: "review-mapping-create",
            module: "usergroup-subject-map",
            class: "legacy"
        },
        UGSM_N_UM: {
            name: "review-mapping-update",
            module: "usergroup-subject-map",
            class: "legacy"
        },
        AL_N_CS: {
            name: "manage-alerts-subscription",
            module: "alerts",
            class: "legacy"
        },
        AL_N_US: {
            name: "manage-alerts-subscription",
            module: "alerts",
            class: "legacy"
        },
        AL_N_DS: {
            name: "manage-alerts-subscription",
            module: "alerts",
            class: "legacy"
        },
        TD_N_ATD: {
            name: "review-td-amend",
            module: "term-deposits",
            class: "legacy"
        },
        TD_F_TTD: {
            name: "review-td-topup",
            module: "term-deposits",
            class: "legacy"
        },
        TD_F_RTD: {
            name: "review-td-redeem",
            module: "term-deposits",
            class: "legacy"
        },
        PC_N_CDDP: {
            name: "review-demand-draft-payee",
            module: "payee",
            class: "legacy"
        },
        PC_N_UDDP: {
            name: "review-demand-draft-payee",
            module: "payee",
            class: "legacy"
        },
        PC_N_DDDP: {
            name: "review-demand-draft-payee",
            module: "payee",
            class: "legacy"
        },
        TD_F_OTD: {
            name: "review-td-open",
            module: "term-deposits",
            class: "legacy"
        },
        PC_F_PIC: {
            name: "review-scheduled-payments",
            module: "payments",
            class: "legacy"
        },
        LN_F_LRP: {
            name: "review-loan-repayment",
            module: "loans",
            class: "legacy"
        },
        PC_F_SFT: {
            name: "review-payment-self",
            module: "payments",
            class: "legacy"
        },
        PC_F_SFTI: {
            name: "review-payment-self",
            module: "payments",
            class: "legacy"
        },
        PC_F_ITR: {
            name: "review-payment-international",
            module: "payments",
            class: "legacy"
        },
        PC_F_ITRI: {
            name: "review-payment-international",
            module: "payments",
            class: "legacy"
        },
        PC_F_DFT: {
            name: "review-payment-domestic",
            module: "payments",
            class: "legacy"
        },
        PC_F_DFTI: {
            name: "review-payment-domestic",
            module: "payments",
            class: "legacy"
        },
        PC_F_ITF: {
            name: "review-payment-internal",
            module: "payments",
            class: "legacy"
        },
        PC_F_ITFI: {
            name: "review-payment-internal",
            module: "payments",
            class: "legacy"
        },
        PC_F_BPT: {
            name: "review-bill-payments",
            module: "payments",
            class: "legacy"
        },
        PC_N_PBR: {
            name: "review-add-biller-main",
            module: "payments",
            class: "legacy"
        },
        PC_N_DOP: {
            name: "review-domestic-payee",
            module: "payee",
            class: "legacy"
        },
        PC_N_UDOP: {
            name: "review-domestic-payee",
            module: "payee",
            class: "legacy"
        },
        PC_N_UPBR: {
            name: "review-biller-details-edit",
            module: "payments",
            class: "legacy"
        },
        PC_N_DPBR: {
            name: "review-biller-details-edit",
            module: "payments",
            class: "legacy"
        },
        PC_N_CIP: {
            name: "review-internal-payee",
            module: "payee",
            class: "legacy"
        },
        PC_N_UIP: {
            name: "review-internal-payee",
            module: "payee",
            class: "legacy"
        },
        PC_N_DIP: {
            name: "review-internal-payee",
            module: "payee",
            class: "legacy"
        },
        PC_N_DDP: {
            name: "review-domestic-payee",
            module: "payee",
            class: "legacy"
        },
        PC_N_DITNP: {
            name: "review-international-payee",
            module: "payee",
            class: "legacy"
        },
        CH_I: {
            name: "review-cheque-status-inquiry",
            module: "demand-deposits",
            class: "legacy"
        },
        CH_N_RAS: {
            name: "review-statement-request",
            module: "accounts",
            class: "legacy"
        },
        CH_N_CBR: {
            name: "cheque-book-request",
            module: "demand-deposits"
        },
        CH_N_BDC: {
            name: "review-debit-card-hotlisting",
            module: "demand-deposits",
            class: "legacy"
        },
        CH_N_CIN: {
            name: "review-cheque-stop-unblock",
            module: "demand-deposits",
            class: "legacy"
        },
        TD_N_RAS: {
            name: "review-statement-request",
            module: "accounts",
            class: "legacy"
        },
        CH_N_EST: {
            name: "review-eStatement",
            module: "accounts",
            class: "legacy"
        },
        CH_N_RDCP: {
            name: "review-debit-card-pin-request",
            module: "demand-deposits",
            class: "legacy"
        },
        CH_N_ADC: {
            name: "review-debit-card-apply",
            module: "demand-deposits",
            class: "legacy"
        },
        PC_N_CITNP: {
            name: "review-international-payee",
            module: "payee",
            class: "legacy"
        },
        PC_N_UITNP: {
            name: "review-international-payee",
            module: "payee",
            class: "legacy"
        },
        FU_F_IFT: {
            name: "file-approval",
            module: "file-upload",
            class: "legacy"
        },
        FU_F_ABS: {
            name: "file-approval",
            module: "file-upload",
            class: "legacy"
        },
        FU_R_ABS: {
            name: "record-approval",
            module: "file-upload",
            class: "legacy"
        },
        FU_F_ILFT: {
            name: "file-approval",
            module: "file-upload",
            class: "legacy"
        },
        FU_F_DFT: {
            name: "file-approval",
            module: "file-upload",
            class: "legacy"
        },
        FU_F_MFT: {
            name: "file-approval",
            module: "file-upload",
            class: "legacy"
        },
        FU_R_IFT: {
            name: "record-approval",
            module: "file-upload",
            class: "legacy"
        },
        FU_R_ILFT: {
            name: "record-approval",
            module: "file-upload",
            class: "legacy"
        },
        FU_R_DFT: {
            name: "record-approval",
            module: "file-upload",
            class: "legacy"
        },
        FU_R_MFT: {
            name: "record-approval",
            module: "file-upload",
            class: "legacy"
        },
        FU_R_IP: {
            name: "record-approval",
            module: "file-upload",
            class: "legacy"
        },
        FU_F_IP: {
            name: "file-approval",
            module: "file-upload",
            class: "legacy"
        },
        FU_R_ILP: {
            name: "record-approval",
            module: "file-upload",
            class: "legacy"
        },
        FU_F_ILP: {
            name: "file-approval",
            module: "file-upload",
            class: "legacy"
        },
        FU_F_DP: {
            name: "file-approval",
            module: "file-upload",
            class: "legacy"
        },
        FU_R_DP: {
            name: "record-approval",
            module: "file-upload",
            class: "legacy"
        },
        FU_R_DDP: {
            name: "record-approval",
            module: "file-upload",
            class: "legacy"
        },
        FU_F_DDP: {
            name: "file-approval",
            module: "file-upload",
            class: "legacy"
        },
        FU_F_MPY: {
            name: "file-approval",
            module: "file-upload",
            class: "legacy"
        },
        FU_R_MPY: {
            name: "record-approval",
            module: "file-upload",
            class: "legacy"
        },
        PC_F_DDD: {
            name: "review-domestic-demand-draft",
            module: "payments",
            class: "legacy"
        },
        PC_F_DDDI: {
            name: "review-domestic-demand-draft",
            module: "payments",
            class: "legacy"
        },
        PC_F_IDD: {
            name: "review-international-demand-draft",
            module: "payments",
            class: "legacy"
        },
        PC_F_IDDI: {
            name: "review-international-demand-draft",
            module: "payments",
            class: "legacy"
        },
        PC_F_GNIP: {
            name: "review-adhoc-payments",
            module: "payments",
            class: "legacy"
        },
        PC_F_GNIDD: {
            name: "review-adhoc-draft",
            module: "payments",
            class: "legacy"
        },
        PC_F_GNDDD: {
            name: "review-adhoc-draft",
            module: "payments",
            class: "legacy"
        },
        PC_F_GNITNP: {
            name: "review-adhoc-payments",
            module: "payments",
            class: "legacy"
        },
        PC_F_GNDP: {
            name: "review-adhoc-payments",
            module: "payments",
            class: "legacy"
        },
        TF_AF_CLC: {
            name: "review-lc",
            module: "letter-of-credit",
            hostReferenceNumber: "result.letterOfCredit.id",
            class: "legacy"
        },
        TF_AF_CSG: {
            name: "review-shipping-guarantee",
            module: "shipping-guarantee",
            hostReferenceNumber: "result.shippingGuarantee.id",
            class: "legacy"
        },
        TF_AF_AIL: {
            name: "review-amend-lc",
            module: "letter-of-credit",
            class: "legacy"
        },
        TF_AF_CBL: {
            name: "review-collection",
            module: "collection",
            class: "legacy"
        },
        CF_N_CPM: {
            name: "user-segments-product-map",
            module: "user-segments-product",
            class: "legacy"
        },
        CF_N_UPM: {
            name: "user-segments-product-map",
            module: "user-segments-product",
            class: "legacy"
        },
        ML_N_CM: {
            name: "review-mailer-create",
            module: "mailers",
            class: "legacy"
        },
        ML_N_UM: {
            name: "review-mailer-edit",
            module: "mailers",
            class: "legacy"
        },
        ML_N_DM: {
            name: "review-mailer-create",
            module: "mailers",
            class: "legacy"
        },
        FL_N_CLT: {
            name: "review-create-limit",
            module: "financial-limits",
            class: "legacy"
        },
        FL_N_CLP: {
            name: "review-limit-package",
            module: "financial-limit-package",
            class: "legacy"
        },
        FL_N_DLT: {
            name: "review-create-limit",
            module: "financial-limits",
            class: "legacy"
        },
        FL_N_ULP: {
            name: "review-limit-package",
            module: "financial-limit-package",
            class: "legacy"
        },
        FL_N_DLP: {
            name: "review-limit-package",
            module: "financial-limit-package",
            class: "legacy"
        },
        TG_N_CTG: {
            name: "review-transaction-group-create",
            module: "transaction-group",
            class: "legacy"
        },
        TG_N_DTG: {
            name: "transaction-group-read",
            module: "transaction-group",
            class: "legacy"
        },
        TG_N_UTG: {
            name: "review-transaction-group-update",
            module: "transaction-group",
            class: "legacy"
        },
        AU_N_UAM: {
            name: "confirm-authentication-maintenance",
            module: "authentication",
            class: "legacy"
        },
        AU_N_CAM: {
            name: "confirm-authentication-maintenance",
            module: "authentication",
            class: "legacy"
        },
        UPP_N_CPP: {
            name: "review-create",
            module: "password-policy",
            class: "legacy"
        },
        UPP_N_UPP: {
            name: "review-update",
            module: "password-policy",
            class: "legacy"
        },
        TF_AF_CBG: {
            name: "review-guarantee",
            module: "guarantee",
            hostReferenceNumber: "result.bankGuarantee.bgId",
            class: "legacy"
        },
        UM_N_USD: {
            name: "review-user-channel-access",
            module: "user-management",
            class: "legacy"
        },
        RM_ENT_CR: {
            name: "review-enterprise-role-create",
            module: "enterprise-role-management",
            class: "legacy"
        },
        RM_ENT_UP: {
            name: "review-enterprise-role-update",
            module: "enterprise-role-management",
            class: "legacy"
        },
        RM_ENT_DE: {
            name: "review-enterprise-role-create",
            module: "enterprise-role-management",
            class: "legacy"
        },
        RT_N_UUM: {
            name: "review-report-user-map",
            module: "reports",
            class: "legacy"
        },
        RT_N_CAR: {
            name: "review-report-generation",
            module: "reports",
            class: "legacy"
        },
        RT_N_CUR: {
            name: "review-report-generation",
            module: "reports",
            class: "legacy"
        },
        RT_N_DAR: {
            name: "review-report-generation",
            module: "reports",
            class: "legacy"
        },
        RT_N_UUR: {
            name: "review-report-generation",
            module: "reports",
            class: "legacy"
        },
        RT_N_UAR: {
            name: "review-report-generation",
            module: "reports",
            class: "legacy"
        },
        RT_N_CAC: {
            name: "review-report-generation",
            module: "reports",
            class: "legacy"
        },
        RT_N_CAD: {
            name: "review-report-generation",
            module: "reports",
            class: "legacy"
        },
        RT_N_CAU: {
            name: "review-report-generation",
            module: "reports",
            class: "legacy"
        },
        RT_N_DUR: {
            name: "review-report-generation",
            module: "reports",
            class: "legacy"
        },
        TF_AF_CEL: {
            name: "review-amend-lc",
            module: "letter-of-credit",
            class: "legacy"
        },
        UM_N_ULS: {
            name: "review-user-status",
            module: "user-management",
            class: "legacy"
        },
        TF_AF_CIB: {
            name: "view-discrepancies",
            module: "customer-acceptance",
            class: "legacy"
        },
        TF_N_ULC: {
            name: "review-attach-documents",
            module: "trade-finance",
            class: "legacy"
        },
        TF_N_UBG: {
            name: "review-attach-documents",
            module: "trade-finance",
            class: "legacy"
        },
        TF_AF_AOG: {
            name: "review-amendment",
            module: "guarantee",
            class: "legacy"
        },
        TF_N_UBM: {
            name: "review-beneficiary-maintenance",
            module: "beneficiary-maintenance",
            class: "legacy"
        },
        TF_N_CBM: {
            name: "review-beneficiary-maintenance",
            module: "beneficiary-maintenance",
            class: "legacy"
        },
        TF_N_DBM: {
            name: "review-beneficiary-maintenance",
            module: "beneficiary-maintenance",
            class: "legacy"
        },
        EB_N_CBLR: {
            name: "review-biller",
            module: "biller-maintenance",
            class: "legacy"
        },
        EB_N_UBLR: {
            name: "review-biller",
            module: "biller-maintenance",
            class: "legacy"
        },
        EB_N_DBLR: {
            name: "review-biller",
            module: "biller-maintenance",
            class: "legacy"
        },
        FX_M_CFX: {
            name: "review-forex-deal-create",
            module: "forex-deal",
            hostReferenceNumber: "result.forexDealDTO.dealId",
            class: "legacy"
        },
        AZ_A_PMC: {
            name: "review-application-role-create",
            module: "role-transaction-mapping",
            class: "legacy"
        },
        AZ_A_PMU: {
            name: "review-role-transaction-update",
            module: "role-transaction-mapping",
            class: "legacy"
        },
        AZ_A_PMD: {
            name: "review-role-transaction-update",
            module: "role-transaction-mapping",
            class: "legacy"
        },
        EB_N_CCAT: {
            name: "review-category",
            module: "biller-maintenance",
            class: "legacy"
        },
        EB_N_UCAT: {
            name: "review-category",
            module: "biller-maintenance",
            class: "legacy"
        },
        EB_N_DCAT: {
            name: "review-category",
            module: "biller-maintenance",
            class: "legacy"
        },
        FD_M_FTU: {
            name: "feedback-home",
            module: "feedback",
            class: "legacy"
        },
        FD_M_FTC: {
            name: "feedback-home",
            module: "feedback",
            class: "legacy"
        },
        SR_M_FBC: {
            name: "service-request-approval-view",
            module: "service-requests",
            class: "legacy"
        },
        FX_MT_CFXM: {
            name: "review-forex-deal-settings",
            module: "forex-deal-settings",
            class: "legacy"
        },
        FX_MT_UFXM: {
            name: "review-forex-deal-settings",
            module: "forex-deal-settings",
            class: "legacy"
        },
        FX_MT_DFXM: {
            name: "review-forex-deal-delete-settings",
            module: "forex-deal-settings",
            class: "legacy"
        },
        AR_N_CMP: {
            name: "relationship-matrix-mapping",
            module: "relationship-matrix",
            class: "legacy"
        },
        AR_N_UMP: {
            name: "relationship-matrix-mapping",
            module: "relationship-matrix",
            class: "legacy"
        },
        AR_N_CMT: {
            name: "relationship-mapping-base",
            module: "relationship-mapping",
            class: "legacy"
        },
        AR_N_UMT: {
            name: "relationship-mapping-base",
            module: "relationship-mapping",
            class: "legacy"
        },
        RT_N_CUN: {
            name: "review-report-generation",
            module: "reports",
            class: "legacy"
        },
        EB_M_CBR: {
            name: "review-register-biller",
            module: "bill-payments",
            class: "legacy"
        },
        EB_M_UBR: {
            name: "review-register-biller",
            module: "bill-payments",
            class: "legacy"
        },
        EB_M_DBR: {
            name: "review-register-biller",
            module: "bill-payments",
            class: "legacy"
        },
        EB_F_BP: {
            name: "review-payment",
            module: "bill-payments",
            class: "legacy"
        },
        SG_M_CSE: {
            name: "review-create-segments",
            module: "segments",
            class: "legacy"
        },
        SG_M_USE: {
            name: "review-create-segments",
            module: "segments",
            class: "legacy"
        },
        FX_M_DFX: {
            name: "view-forex-deal-details",
            module: "forex-deal",
            class: "legacy"
        },
        LM_M_IMS: {
            name: "view-structure",
            module: "liquidity-management",
            class: "legacy"
        },
        VAME_M_CVE: {
            name: "review-virtual-entity",
            module: "virtual-account-management",
            class: "legacy"
        },
        VAME_M_UVE: {
            name: "review-virtual-entity",
            module: "virtual-account-management",
            class: "legacy"
        },
        VAME_M_DVE: {
            name: "review-virtual-entity",
            module: "virtual-account-management",
            class: "legacy"
        },
        VAMA_M_CVA: {
            name: "virtual-account",
            module: "virtual-account-management"
        },
        VAMA_M_UVA: {
            name: "virtual-account",
            module: "virtual-account-management"
        },
        VAMA_M_DVA: {
            name: "virtual-account",
            module: "virtual-account-management"
        },
        VAMS_M_CVAS: {
            name: "review-virtual-structure",
            module: "virtual-account-management",
            class: "legacy"
        },
        VAMS_M_UVAS: {
            name: "review-virtual-structure",
            module: "virtual-account-management",
            class: "legacy"
        },
        VAMS_M_DVAS: {
            name: "review-virtual-structure",
            module: "virtual-account-management",
            class: "legacy"
        },
        VAMI_M_UVI: {
            name: "virtual-identifiers-create",
            module: "virtual-account-management"
        },
        VAMMC_M_CMCA: {
            name: "virtual-multi-currency-account",
            module: "virtual-account-management"
        },
        VAMMC_M_UMCA: {
            name: "virtual-multi-currency-account",
            module: "virtual-account-management"
        },
        VAMMC_M_DMCA: {
            name: "virtual-multi-currency-account",
            module: "virtual-account-management"
        },
        VAMIT_F_CITF: {
            name: "review-move-money",
            module: "virtual-account-management",
            class: "legacy"
        },
        FU_F_CVI: {
            name: "file-approval",
            module: "file-upload",
            class: "legacy"
        },
        FU_F_CVAR: {
            name: "file-approval",
            module: "file-upload",
            class: "legacy"
        },
        FU_F_CVSR: {
            name: "file-approval",
            module: "file-upload",
            class: "legacy"
        },
        LM_M_CNS: {
            name: "view-structure",
            module: "liquidity-management",
            class: "legacy"
        },
        LM_M_ES: {
            name: "view-structure",
            module: "liquidity-management",
            class: "legacy"
        },
        LM_M_MSP: {
            name: "view-structure",
            module: "liquidity-management",
            class: "legacy"
        },
        LM_M_MSR: {
            name: "view-structure",
            module: "liquidity-management",
            class: "legacy"
        },
        SMB_N_UETM: {
            name: "sms-banking-review",
            module: "sms-banking",
            class: "legacy"
        },
        FL_A_CBC: {
            name: "bank-custom-limits",
            module: "limits-enquiry",
            class: "legacy"
        },
        BR_A_CBR: {
            name: "review-theme",
            module: "theme-config",
            class: "legacy"
        },
        BR_A_UBR: {
            name: "review-theme",
            module: "theme-config",
            class: "legacy"
        },
        BR_A_DBR: {
            name: "review-theme",
            module: "theme-config",
            class: "legacy"
        },
        BR_A_CBRMAP: {
            name: "review-mapping",
            module: "theme-config",
            class: "legacy"
        },
        BR_A_DBRMAP: {
            name: "review-mapping",
            module: "theme-config",
            class: "legacy"
        },
        TA_MT: {
            name: "review-task-aspects",
            module: "transaction-aspects",
            class: "legacy"
        },
        PC_MT_CMM: {
            name: "create-merchant",
            module: "merchant",
            class: "legacy"
        },
        PC_MT_UMM: {
            name: "create-merchant",
            module: "merchant",
            class: "legacy"
        },
        PC_MT_DMM: {
            name: "create-merchant",
            module: "merchant",
            class: "legacy"
        },
        SQ_MT_CSQ: {
            name: "review-security-question-maintenance",
            module: "security-question",
            class: "legacy"
        },
        SQ_MT_USQ: {
            name: "review-security-question-maintenance",
            module: "security-question",
            class: "legacy"
        },
        PM_M_CNP: {
            name: "view-network-preference",
            module: "network-suggestion",
            class: "legacy"
        },
        SP_M_USC: {
            name: "spend-category-edit",
            module: "spend-analysis",
            class: "legacy"
        },
        SP_M_CSC: {
            name: "spend-category-create",
            module: "spend-analysis",
            class: "legacy"
        },
        SCFP_M_CPM: {
            name: "create-program-review",
            module: "supply-chain-finance",
            class: "legacy"
        },
        SCFP_M_UPM: {
            name: "create-program-review",
            module: "supply-chain-finance",
            class: "legacy"
        },
        SCFI_AF_CI: {
            name: "review-invoice-form",
            module: "supply-chain-finance",
            class: "legacy",
            hostReferenceNumber: "result.invoice.invoiceId"
        },
        SCFI_AF_UI: {
            name: "review-invoice-form",
            module: "supply-chain-finance",
            class: "legacy",
            hostReferenceNumber: "result.invoice.invoiceId"
        },
        SCFI_M_AI: {
            name: "invoice-update-status-review",
            module: "supply-chain-finance",
            class: "legacy"
        },
        SCFI_M_RI: {
            name: "invoice-update-status-review",
            module: "supply-chain-finance",
            class: "legacy"
        },
        SCFI_M_CI: {
            name: "invoice-update-status-review",
            module: "supply-chain-finance",
            class: "legacy"
        },
        SCFCP_M_OCP: {
            name: "onboard-counter-party-review",
            module: "supply-chain-finance",
            class: "legacy"
        },
        SCFF_AF_RF: {
            name: "request-finance-review",
            module: "supply-chain-finance",
            class: "legacy",
            hostReferenceNumber: "result.finance.requestId"
        },
        FU_R_SCFCI : {
            name: "review-invoice-form",
            module: "supply-chain-finance",
            class: "legacy"
        },
        OBCLPM_AF_ILA: {
            name: "process-management-approval",
            module: "process-management",
            class: "legacy"
        },
        PATA_A_CPA: {
            name: "party-base",
            module: "corporate-resource-access"
        },
        PATA_A_UPA: {
            name: "party-base",
            module: "corporate-resource-access"
        },
        PATA_A_DPA: {
            name: "party-base",
            module: "corporate-resource-access"
        },
        UATA_A_CUS: {
            name: "user-base",
            module: "corporate-resource-access"
        },
        UATA_A_UUS: {
            name: "user-base",
            module: "corporate-resource-access"
        },
        UATA_A_DUS: {
            name: "user-base",
            module: "corporate-resource-access"
        },
        AM_M_UAM: {
            name: "application-message-edit",
            module: "application-message"
        },
        CF_N_CFM: {
            name: "view-submitted-application",
            module: "credit-facility",
            class: "legacy"
        },
        CF_N_UFM: {
            name: "view-submitted-application",
            module: "credit-facility",
            class: "legacy"
        },
        CF_N_ECA: {
            name: "collateral-evaluation-approval",
            module: "credit-facility",
            class: "legacy"
        },
        CF_N_RCA: {
            name: "collateral-revaluation-flow",
            class: "flow"
        },
        LN_AF_CLA: {
            name: "loan-drawdown",
            class: "flow"
           },
        UPC_C_UUS: {
            name: "profile-maintenance-review",
            module: "user-profile-maintenance",
            class: "legacy"
        },
        ACP_N_CP: {
            name: "access-point-view",
            module: "access-point",
            class: "legacy"
        },
        ACP_N_UP: {
            name: "access-point-view",
            module: "access-point",
            class: "legacy"
        }
    };

    return $.extend(true, tasks, extension);
});