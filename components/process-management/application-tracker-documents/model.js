define(["baseService"], function (BaseService) {
    "use strict";

    const Model = function () {
        const baseService = BaseService.getInstance();

        return {
            letterofcreditsletterOfCreditIdget: function (letterOfCreditId, versionNo, forBillsCreation) {
                const params = {
                    letterOfCreditId: letterOfCreditId,
                    versionNo: versionNo,
                    forBillsCreation: forBillsCreation
                },
                 options = {
                    url: "/letterofcredits/{letterOfCreditId}?versionNo={versionNo}&forBillsCreation={forBillsCreation}",
                    version: "v1"
                };

                return baseService.fetch(options, params);
            },
            contentscontentIdget: function (contentId, alt, ownerId, applicationId, transactionType, toBeDownloaded) {
                const params = {
                    contentId: contentId,
                    alt: alt,
                    ownerId: ownerId,
                    applicationId: applicationId,
                    transactionType: transactionType,
                    toBeDownloaded: toBeDownloaded
                },
                 options = {
                    url: "/contents/{contentId}?alt={alt}&ownerId={ownerId}&applicationId={applicationId}&transactionType={transactionType}&toBeDownloaded={toBeDownloaded}",
                    version: "v1"
                };

                return baseService.downloadFile(options, params);
            },
            tradeApplicationsapplicationIddocumentsget: function (applicationId) {
                const params = { applicationId: applicationId },
                 options = {
                    url: "/tradeApplications/{applicationId}/documents",
                    version: "v1"
                };

                return baseService.fetch(options, params);
            }
        };
    };

    return new Model();
});