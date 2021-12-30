 define([

   "knockout",
   "ojs/ojlistview",
   "ojs/ojknockout",
   "ojs/ojarraytabledatasource",
   "ojs/ojtable"
 ], function(ko) {
   /**
    * View Model for account-card component used to display details in card format.
    * @property {Object} cardDetailsDataSource - Stores card details to be displayed on card.
    * @property {Object} rootParams - Object to store the data passed.
    */
   "use strict";

   return function(rootParams) {
     const self = this;

     ko.utils.extend(self, rootParams.rootModel);
     self.id = rootParams.id;
     self.data = rootParams.data;
     self.onCardClick = rootParams.onCardClick;
     self.cardDescription = rootParams.cardDescription;
     self.cardTitle = rootParams.cardTitle;
     self.header = rootParams.header;
   };
 });