define([], function () {
    "use strict";

    const viewprogramsearchLocale = function () {
        return {
            root: {
                heading: {
                    ViewProgramBanner: "View Program Banner",
                    SwitchView: "Switch View",
                    Search: "Search",
                    ProgramList: "Program List"
                },
                ViewProgramBanner: {
                    PartyName: "Party Name",
                    PartyID: "Party ID :{partyId}",
                    PartyId: "Party Id",
                    ProgramType: "Program Type",
                    ProgramName: "Program Name",
                    ProgramID: "Program ID"
                },
                SwitchView: {
                    SelectyourroleasaBuyeroraSuppliertoviewyourdataintermsofReceivablesorPayables: "Select your role as a Buyer or a Supplier to view your data in terms of Receivables or Payables",
                    Buyer: "Buyer",
                    Supplier: "Supplier"
                },
                Search: {
                    ProgramName: "Program Name",
                    ProgramNameError: "Please enter valid Program name",
                    ProgramId: "Program Id",
                    ProgramIdError: "Please enter valid Program Id",
                    CounterPartyName: "Counter Party Name",
                    ProgramType: "Program Type",
                    Search: "Search",
                    Clear: "Clear"
                },
                ProgramList: {
                    ProgramName: "Program Name",
                    linkTitle: "Click here for Program details",
                    ID: "Program ID : <span class= '{linkText}'>{programId}</span>",
                    IDvalue: "ID value",
                    Active: "Active",
                    UserRole: "User Role",
                    userrolevalue: "user role value",
                    TypeofProgram: "Type of Program",
                    TypeOfProgramValue: "Type Of Program Value",
                    CounterpartiesNo: "Counterparties (No.)",
                    CounterpartiesNumber: "Counterparties Number",
                    Receivables: "Receivables",
                    receivablesValue: "receivables Value",
                    ProgramsList: "Programs List",
                    programslist: "programs list",
                    programsTable: "programs Table",
                    ProgramnameandId: "Program name and Id",
                    Status: "Status",
                    Cancel: "Cancel",
                    programid: "program id",
                    Userrole: "User role",
                    typeofprogram: "type of program",
                    Counterparties: "Counterparties",
                    linkAltText: "Program details card"
                },
                Status: {
                    INITIATED: "Initiated",
                    ACTIVE: "Active",
                    MODIFIED: "Modified",
                    CLOSED: "Closed",
                    OTHERS: "Others"
                },
                Relation : {
                    A: "Anchor",
                    CP: "Counterparty"
                },
                Role: {
                    B: "Buyer",
                    S: "Supplier"
                },
                componentHeader: "View Program",
                supplier: "Supplier",
                buyer: "Buyer",
                select: "Select",
                userRoleToDisplay: "{userRelation} - {userRole}",
                anchor: "Anchor",
                counterparty: "Counterparty",
                errorMessage: "The Program Details can be viewed, only when Program is in Active Status.",
                textToCreate: "Can't find what you are looking for ?",
                linkToCreate: "Create New Program"
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

    return new viewprogramsearchLocale();
});