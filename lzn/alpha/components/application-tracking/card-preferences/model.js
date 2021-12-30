define(
  ["jquery",
    "baseService"
  ],
  function($, BaseService) {
    "use strict";

    return function CardPreferenceModel() {
      const Model = function(modelData) {
          this.cardHolderPreferences = {
            embossName: modelData ? modelData.embossName ? modelData.embossName : "" : "",
            userSpecifiedEmbossName: modelData ? modelData.userSpecifiedEmbossName ? modelData.userSpecifiedEmbossName : false : false,
            cardBackgroundId: modelData ? modelData.cardBackgroundId ? modelData.cardBackgroundId : null : null,
            companionCardBackgroundId: modelData ? modelData.companionCardBackgroundId ? modelData.companionCardBackgroundId : null : null,
            partyId: {
              value: modelData ? modelData.partyId ? modelData.partyId.value : null : null,
              displayValue: ""
            },
            applicantRelationshipType: modelData ? modelData.applicantRelationshipType ? modelData.applicantRelationshipType : "" : "",
            documentId: {
              value: modelData ? modelData.documentId ? modelData.documentId.value : null : null,
              displayValue: ""
            },
            externalReferenceId: {
              value: modelData ? modelData.externalReferenceId ? modelData.externalReferenceId.value : null : null,
              displayValue: ""
            },
            selectedValues: {}
          };
        },
        baseService = BaseService.getInstance();
      let fetchBgContentIdsDeferred;
      const fetchBgContentIds = function(submissionId, payload, deferred) {
        const options = {
          url: "submissions/{submissionId}/creditCardApplications/backGroundContent",
          data: JSON.stringify(payload),
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },
        params = {
        submissionId: submissionId
      };

        baseService.add(options, params);
      };
      let updateCardHolderPreferencesDeferred;
      const updateCardHolderPreferences = function(submissionId, applicationId, payload, deferred) {
        const params = {
            submissionId: submissionId,
            applicationId: applicationId
          },
          options = {
            url: "submissions/{submissionId}/applications/{applicationId}/cardHolderPreferences",
            data: payload,
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          };

        baseService.update(options, params);
      };
      let fetchCardHolderPreferencesDeferred;
      const fetchCardHolderPreferences = function(submissionId, applicationId, deferred) {
        const options = {
          url: "submissions/{submissionId}/applications/{applicationId}/cardHolderPreferences",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },
        params = {
        submissionId: submissionId,
        applicationId: applicationId
      };

        baseService.fetch(options, params);
      };

      return {
        getNewModel: function(modelData) {
          return new Model(modelData);
        },
        fetchBgContentIds: function(submissionId, payLoad) {
          fetchBgContentIdsDeferred = $.Deferred();
          fetchBgContentIds(submissionId, payLoad, fetchBgContentIdsDeferred);

          return fetchBgContentIdsDeferred;
        },
        updateCardHolderPreferences: function(submissionId, applicationId, payload) {
          updateCardHolderPreferencesDeferred = $.Deferred();
          updateCardHolderPreferences(submissionId, applicationId, payload, updateCardHolderPreferencesDeferred);

          return updateCardHolderPreferencesDeferred;
        },
        fetchCardHolderPreferences: function(submissionId, applicationId) {
          fetchCardHolderPreferencesDeferred = $.Deferred();
          fetchCardHolderPreferences(submissionId, applicationId, fetchCardHolderPreferencesDeferred);

          return fetchCardHolderPreferencesDeferred;
        }
      };
    };
  });
