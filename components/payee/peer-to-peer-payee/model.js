define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const PeerToPeerModel = function() {
    const Model = function() {
      this.p2pPayee = {
        dictionaryArray: null,
        refLinks: null,
        id: null,
        name: null,
        nickName: "",
        partyId: null,
        groupId: "",
        status: "ACTIVE",
        alias: null,
        tokenId: null,
        contentId: null,
        transferMode: "",
        transferValue: "",
        payeeType: "PEERTOPEER"
      };

      this.payeeGroup = {
        name: null,
        contentId: null
      };
    };
    let modelInitialized = false;
    const baseService = BaseService.getInstance();
    /* variable to make sure that in case there is no change
     * in model no additional fetch requests are fired.*/
    let createPayeeGroupDeferred;
    const createPayeeGroup = function(model, deferred) {
      const options = {
        url: "payments/payeeGroup",
        data: model,
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.add(options);
    };
    let deletePayeeGroupDeferred;
    const deletePayeeGroup = function(gId, deferred) {
      const options = {
          url: "payments/payeeGroup/{groupId}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },
        params = {
          groupId: gId
        };

      baseService.remove(options, params);
    };
    let addPayeeDeferred;
    const addPayee = function(id, type, model, deferred) {
      const options = {
          url: "payments/payeeGroup/{groupId}/payees/{payeeType}",
          data: model,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },
        params = {
          groupId: id,
          payeeType: type
        };

      baseService.add(options, params);
    };
    let verifyPayeeDeferred;
    const verifyPayee = function(groupId, payeeId, type, deferred) {
      const options = {
          url: "payments/payeeGroup/{groupId}/payees/{payeeType}/{payeeId}",
          success: function(data, status, jqXHR) {
            deferred.resolve(data, status, jqXHR);
          }
        },
        params = {
          groupId: groupId,
          payeeType: type,
          payeeId: payeeId
        };

      baseService.patch(options, params);
    };
    let uploadImageDeffered;
    const uploadImage = function(form, deferred) {
        const options = {
          url: "contents",
          formData: form,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

        baseService.uploadFile(options);
      },
      errors = {
        InitializationException: function() {
          let message = "";

          message += "\nObject can't be initialized without a valid submission Id. ";
          message += "\nPlease make sure the submission id is present.";
          message += "\nProper initialization has to be:";
          message += "\n\n\tModelName.init(\"SubId\"[, \"ApplicantId\"]);";

          return message;
        }(),
        ObjectNotInitialized: function() {
          let message = "";

          message += "\nModel has not been initialized. Please initialize the model before setting properties. ";
          message += "\nProper initialization has to be: ";
          message += "\n\n\tModelName.init(\"SubId\"[, \"ApplicantId\"]);";

          return message;
        }()
      },
      objectInitializedCheck = function() {
        if (!modelInitialized) {
          throw new Error(errors.ObjectNotInitialized);
        }
      };

    return {
      init: function() {
        modelInitialized = true;

        return modelInitialized;
      },
      getNewModel: function(modelData) {
        return new Model(modelData);
      },
      addPayee: function(groupId, payeeType, model) {
        objectInitializedCheck();
        addPayeeDeferred = $.Deferred();
        addPayee(groupId, payeeType, model, addPayeeDeferred);

        return addPayeeDeferred;
      },
      verifyPayee: function(groupId, payeeId, payeeType) {
        objectInitializedCheck();
        verifyPayeeDeferred = $.Deferred();
        verifyPayee(groupId, payeeId, payeeType, verifyPayeeDeferred);

        return verifyPayeeDeferred;
      },
      createPayeeGroup: function(payload) {
        objectInitializedCheck();
        createPayeeGroupDeferred = $.Deferred();
        createPayeeGroup(payload, createPayeeGroupDeferred);

        return createPayeeGroupDeferred;
      },
      deletePayeeGroup: function(gId) {
        objectInitializedCheck();
        deletePayeeGroupDeferred = $.Deferred();
        deletePayeeGroup(gId, deletePayeeGroupDeferred);

        return deletePayeeGroupDeferred;
      },
      uploadImage: function(form) {
        uploadImageDeffered = $.Deferred();
        uploadImage(form, uploadImageDeffered);

        return uploadImageDeffered;
      },
      /**
       * Fetches retrieveImage.
       *
       * @param {Object} id - Retreives image details.
       * @returns {Promise}  Returns the promise object.
       */
      retrieveImage: function(id) {
        return baseService.fetch({
          url: "contents/{id}"
        }, {
          id: id
        });
      },
      retrieveImageTypeSuuport: function() {
        return baseService.fetch({
          url: "maintenances/payments/payeecontent"
        });
      },
      getPayeeMaintenance: function() {
        return baseService.fetch({
          url: "maintenances/payments"
        });
      },
      getGroupDetails: function(groupId) {
        return baseService.fetch({
          url: "payments/payeeGroup/{groupId}"
        }, {
          groupId: groupId
        });
      },
      getPayeeDetails: function(pId, gId, type) {
        return baseService.fetch({
          url: "payments/payeeGroup/{groupId}/payees/{payeeType}/{payeeId}"
        }, {
          groupId: gId,
          payeeId: pId,
          payeeType: type
        });
      },
      updatePayee: function(gId, pId, type, model) {
        return baseService.update({
          url: "payments/payeeGroup/{groupId}/payees/{payeeType}/{payeeId}",
          data: model
        }, {
          groupId: gId,
          payeeId: pId,
          payeeType: type
        });
      },
      confirmPayee: function(gId, pId, type) {
        return baseService.patch({
          url: "payments/payeeGroup/{groupId}/payees/{payeeType}/{payeeId}"
        }, {
          groupId: gId,
          payeeId: pId,
          payeeType: type
        });
      },
      validateRequest: function(pId, gId, model) {
          return baseService.update({
              url: "payments/payeeGroup/{groupId}/payees/peerToPeer/{payeeId}",
              data: model,
              headers: {
                  "X-Validate-Only": "Y"
              }
          }, {
            groupId: gId,
            payeeId: pId
          });
      }
    };
  };

  return new PeerToPeerModel();
});