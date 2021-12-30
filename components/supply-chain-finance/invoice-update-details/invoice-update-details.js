define([
    "ojL10n!resources/nls/invoice-update-details",
    "knockout",
    "ojs/ojcore",
    "ojs/ojformlayout",
    "ojs/ojvalidationgroup",
    "ojs/ojtable",
    "ojs/ojarraytabledatasource",
    "ojs/ojpagingtabledatasource"
], function (resourceBundle, ko, oj) {
    "use strict";

    return function (params) {
        const self = this;

        self.nls = resourceBundle;

        self.invoiceResponseList = ko.observableArray();

        const response = params.rootModel.invoiceResponse.transactionResponse.batchDetailResponseDTOList,
            dataUploaded = params.rootModel.invoiceResponse.customFields.additionalData.selectedInvoices();
        let i = 0;

        for (i = 0; i < response.length; i++) {
            let status = self.nls.success,
                responseMessage = "-";

            if (response[i].status !== 201 && response[i].status !== 200 && response[i].status !== 202) {
                status = self.nls.failed;
                responseMessage = response[i].responseObj.message.detail;

                if (response[i].responseObj.jsonNode) {
                    responseMessage = response[i].responseObj.jsonNode.message;
                } else if (response[i].responseObj.message.validationError) {
                    responseMessage = response[i].responseObj.message.validationError[0].errorMessage;
                }
            } else if (response[i].status === 202) {
                status = self.nls.initiated;
                responseMessage = self.nls.pendingMessage;
            }

            self.invoiceResponseList.push({
                responseStatus: status,
                responseMessage: responseMessage,
                supplierName: dataUploaded[i].supplierName,
                invoiceRefNumber: dataUploaded[i].invoiceId,
                invoiceNumber: dataUploaded[i].invoiceNumber,
                invoiceAmount: dataUploaded[i].totalAmount.amount,
                invoiceCurrency: dataUploaded[i].totalAmount.currency
            });
        }

        self.columnsArray = [{
                headerText: self.nls.invoiceRefNumber,
                field: "invoiceRefNumber"
            }, {
                headerText: self.nls.supplierName,
                field: "supplierName"
            },
            {
                headerText: self.nls.invoiceNumber,
                field: "invoiceNumber"
            },
            {
                headerText: self.nls.invoiceAmount,
                field: "invoiceAmount"
            },
            {
                headerText: self.nls.status,
                field: "responseStatus"
            },
            {
                headerText: self.nls.reason,
                field: "responseMessage"
            }
        ];

        self.dataSource58 = new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.invoiceResponseList, { idAttribute: "invoiceNumber" }));
    };
});