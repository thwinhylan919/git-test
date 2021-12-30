define(["framework/js/plugins/encryption/rsa-encrypt", "baseService", "baseModel"], function (RSA, BaseService, BaseModel) {
    "use strict";

    const baseService = BaseService.getInstance(),
        baseModel = BaseModel.getInstance(),
        rsa = new RSA();

    return function (passwordList,apiType) {
        if (!Array.isArray(passwordList)) {
            passwordList = [passwordList];
        }

        return baseService.fetch({
            url: "publicKey",
            throttle: false,
            apiType: apiType
        }).then(function (data) {
            if (data.publicKeyDTO.publicKey) {
                return baseService.add({
                    url: "salt",
                    apiType: apiType
                }).then(function (saltData) {
                    rsa.setPublic(data.publicKeyDTO.modulus, data.publicKeyDTO.publicExponent);

                    return passwordList.map(function (password) {
                        password = baseModel.format("{password} {salt}", {
                            password: password,
                            salt: decodeURIComponent(saltData.saltDTO.id)
                        });

                        return rsa.encryptb64(password);
                    });
                });
            }

            return passwordList;
        });
    };
});