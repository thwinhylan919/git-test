define([], function () {
    "use strict";

    const investmentaccountinvestmentsLocale = function () {
        return {
            root: {
              heading :{
                Relatives : "Relatives"
              },
                Relatives : {
                  RelationType : "Relation Type",
                  Name : "Name",
                  Age : "Age",
                  Dependent : "Dependent",
                  yes : "Yes",
                  no : "No",
                  Save: "Save",
                  RelativeNumber : "Relative {index}",
                  addRelative : "Add Relative Information",
                  clickToDelete : "Click to Delete",
                  deleteRelative: "Delete Relative Information",
                  select : "Select",
                  nameError : "Please enter a valid name"
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

    return new investmentaccountinvestmentsLocale();
});
