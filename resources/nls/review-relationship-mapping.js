define([
  "ojL10n!resources/nls/generic"
], function (Generic) {
  "use strict";

  const ReviewRelationshipMappingLoacal = function () {
    return {
      root: {
        confirmRelationship: "Confirm",
        cancelRelationship: "Cancel",
        relationshipId: "Relationship Name and ID",
        relationshipDescription: "Relationship Description",
        mapRelationship: "Map Relationship",
        relationsipMappingTable: "Relationship Mapping Maintenance Table",
        backRelationship: "Back",
        editRelationship: "Edit",
        confirmationMessage: "Relationship Mapping Maintenance",
        generic: Generic
      },
      ar: true,
      fr: true,
      cs: true,
      sv: true,
      en: false,
      es: true,
      "en-us": false,
      el: true
    };
  };

  return new ReviewRelationshipMappingLoacal();
});