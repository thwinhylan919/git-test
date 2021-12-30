define([], function() {
  "use strict";

  const CustomerPreferenceLocale = function() {
    return {
      root: {
        username: "User Name",
        firstname: "First Name",
        lastname: "Last Name",
        email: "Email",
        mobilenumber: "Mobile Number",
        emailid: "Email Id",
        middlename: "Middle Name",
        usertype: "User Type",
        accstartdate: "Account Start Date",
        accenddate: "Account End Date",
        address1: "Address Line 1",
        address2: "Address Line 2",
        address3: "Address Line 3",
        address4: "Address Line 4",
        city: "City",
        state: "State",
        country: "Country",
        pincode: "Pin Code",
        dob: "Date of Birth",
        homebranch: "Home Branch",
        homeentity: "Home Entity",
        accessibleentity: "Accessible Entity",
        contactlandline: "Contact number (landline)",
        contactmobile: "Contact number (mobile)",
        resetpassword: "Reset Password",
        changePassword: "Change Password",
        welcomeletter: "Welcome Letter",
        organization: "Organization",
        manager: "Manager",
        empno: "Employee Number",
        userstatus: "User Status",
        lockstatus: "Lock Status",
        userstatustext: "Current User Status is :",
        lockstatustext: "Current Lock Status is :",
        employee: "Employee",
        customer: "Party",
        partyid: "Party Id",
        partyname: "Party Name",
        party: "Party",
        newpassword: "Enter New Password",
        confirmnewPassword: "Confirm New Password",
        oldPassword: "Enter Current Password",
        usergroups: "User Groups",
        sequential: "Sequential",
        parallel: "Parallel",
        noApproval: "No Approval",
        refNum: "Reference Number"
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

  return new CustomerPreferenceLocale();
});