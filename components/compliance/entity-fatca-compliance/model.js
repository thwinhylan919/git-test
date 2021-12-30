define([
    "baseService"
  ],
  function (BaseService) {
    "use strict";

    const EntityFatcaComplianceModel = function () {
      const Model = function () {
          this.fatcaComplianceData = {
            kycInfo: {
              occupationDetails: null,
              pepStatus: null,
              grossAnnualIncome: null
            },
            identificationInfo: {
              title: null,
              fullName: null,
              addressDetails: {
                line1: null,
                line2: null,
                line3: null,
                line4: null,
                line5: null,
                line6: null,
                line7: null,
                line8: null,
                city: null,
                state: null,
                country: null,
                zipCode: null
              },
              addressType: null,
              mailingAddress: {
                line1: null,
                line2: null,
                line3: null,
                line4: null,
                line5: null,
                line6: null,
                line7: null,
                line8: null,
                city: null,
                state: null,
                country: null,
                zipCode: null
              },
              nationality: null,
              countryOfBirth: null,
              cityOfBirth: null,
              identificationType: null,
              identificationNumber: null,
              fathersName: null,
              spouseName: null,
              countryOfIncorporation: null
            },
            entityCertification: {
              entityFinancialInstitution: null,
              nonFinancialInstitutionDetails: {
                activeNFE: null,
                activeNonFinancialEntityType: null,
                subCategoryOfActiveNFE: null,
                stockTradedCorporation: null,
                natureOfRelation: null,
                nameOfEstablishedSecuritiesMarket: null
              },
              financialInstitutionDetails: {
                investmentEntity: null,
                locatedInNonParticipating: null,
                giin: null,
                reasonForNonAvailability: null,
                giinAvailable: null
              }
            },
            taxResidencyInfoDTO: {
              nonDomesticTaxResidencyInfo: [{
                taxResidenceCountry: null,
                taxIdentifierType: null,
                taxIdentifier: null,
                tinAvailable: false,
                tin: null,
                tinNonAvailabilityReason: null
              }],
              domesticTaxResident: false,
              domesticEntity: null,
              usCitizen: false,
              sptStatus: false,
              usGreenCardOwner: false,
              usIncorporatedEntity: false,
              nonDomesticBenificialOwners: false
            },
            statementTruthDeclaration: null,
            representativeFullName: null,
            designation: null,
            selectedValues: {
              addressType: "",
              country: "",
              state: "",
              city: "",
              nationality: "",
              countryOfBirth: "",
              cityOfBirth: "",
              identificationType: "",
              occupationDetails: "",
              pEPstatus: "",
              taxResidenceCountry: [],
              taxIdentifierType: "",
              countryOfIncorporation: "",
              countryMailing: "",
              statesMailing: ""
            }
          };
        },
        baseService = BaseService.getInstance();

      return {
        getNewModel: function () {
          return new Model();
        },
        /**
         * SubmitFatcaCompliance - method to post fatca compliance to server.
         *
         * @param  {Object} payload - Fatca compliance data.
         * @return {Object}         Deferred object.
         */
        submitFatcaCompliance: function (payload) {
          const options = {
            url: "me/party/FATCA",
            data: payload
          };

          return baseService.add(options);
        }
      };
    };

    return new EntityFatcaComplianceModel();
  });