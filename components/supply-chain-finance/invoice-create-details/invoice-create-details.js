define([
    "ojL10n!resources/nls/invoice-create-details",
    "ojs/ojcore",
    "knockout",
    "ojs/ojformlayout",
    "ojs/ojtable",
    "ojs/ojarraytabledatasource",
    "ojs/ojlistview",
    "ojs/ojarraytabledatasource",
    "ojs/ojpagingtabledatasource"
], function (resourceBundle, oj, ko) {
    "use strict";

    return function (params) {
        const self = this;

        self.nls = resourceBundle;

        self.invoiceResponseList = ko.observableArray();

        const response = params.rootModel.invoiceCreationResponse.transactionResponse.batchDetailResponseDTOList,
            dataUploaded = params.rootModel.invoiceCreationResponse.customFields.additionalData;
        let i = 0,
            length;

        if (params.rootModel.invoiceCreationResponse.customFields.saveAsTemplate) {
            length = response.length - 1;
        } else {
            length = response.length;
        }

        for (i = 0; i < length; i++) {
            let status = self.nls.success,
                failureReason = "-";

            if (response[i].status !== 201 && response[i].status !== 200 && response[i].status !== 202) {
                status = self.nls.failed;
                failureReason = response[i].responseObj.message.detail;

                if (response[i].responseObj.message.validationError) {
                    failureReason = response[i].responseObj.message.validationError[0].errorMessage;
                }
            } else if (response[i].status === 202) {
                status = self.nls.initiated;
                failureReason = self.nls.pendingMessage;
            }

            self.invoiceResponseList.push({
                status: status,
                reasonForFailure: failureReason,
                buyerName: dataUploaded[i].payload.associatedParty.name,
                invoiceRefNumber: response[i].responseObj.invoice ? response[i].responseObj.invoice.invoiceId : "-",
                invoiceNumber: dataUploaded[i].payload.invoiceNumber,
                invoiceAmount: dataUploaded[i].payload.totalAmount.amount,
                invoiceCurrency: dataUploaded[i].payload.amount.currency
            });
        }

        self.columnsArray = [{
                headerText: self.nls.invoiceRefNumber,
                field: "invoiceRefNumber"
            }, {
                headerText: self.nls.buyerName,
                field: "buyerName"
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
                field: "status"
            },
            {
                headerText: self.nls.reasonForFailure,
                field: "reasonForFailure"
            }
        ];

        self.dataSource98 = new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.invoiceResponseList, {
            idAttribute: "invoiceRefNumber"
        }));

        self.dataSource30 = new oj.ArrayTableDataSource(self.invoiceResponseList, {
            idAttribute: "invoiceRefNumber"
        });
    };
});