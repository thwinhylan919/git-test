define(["framework/js/configurations/config"], function(Configurations) {
    "use strict";

    return {
        init: function(platform, resolve) {
            resolve(platform);
        },
        downloadFile: function(options, nonce, genericCompleteHandler) {
            const request = new XMLHttpRequest();

            request.open(options.type || "GET", options.url, true);
            request.setRequestHeader("x-nonce", nonce);
            request.setRequestHeader("Content-type", "application/json");

            const a = document.createElement("a");
            let win;

            if (typeof a.download === "undefined") {
                win = window.open("", "_blank");
            }

            request.onreadystatechange = function() {
                if (request.readyState === 4) {
                    if (request.status === 200) {
                        let filename = "";
                        const disposition = request.getResponseHeader("Content-Disposition");

                        if (disposition && disposition.indexOf("attachment") !== -1) {
                            const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/,
                                matches = filenameRegex.exec(disposition);

                            if (matches && matches[1]) {
                                filename = window.decodeURI(matches[1].substr(matches[1].lastIndexOf("'")+1,matches[1].length));
                                filename = filename.replace(/['"]/g, "");
                            }
                        }

                        const blob = request.response;

                        if (typeof window.navigator.msSaveBlob !== "undefined") {
                            // IE workaround for "HTML7007: One or more blob URLs were revoked by closing the blob for which they were created. These URLs will no longer resolve as the data backing the URL has been freed."
                            window.navigator.msSaveBlob(blob, filename);
                        } else {
                            const URL = window.URL || window.webkitURL,
                                downloadUrl = URL.createObjectURL(blob);

                            if (filename) {
                                // use HTML5 a[download] attribute to specify filename
                                const a = document.createElement("a");

                                // safari doesn't support this yet
                                if (typeof a.download === "undefined") {
                                    win.location = downloadUrl;

                                    win.onunload = function() {
                                        URL.revokeObjectURL(downloadUrl);
                                    };
                                } else {
                                    a.href = downloadUrl;
                                    a.download = filename;
                                    document.body.appendChild(a);
                                    a.click();

                                    setTimeout(function() {
                                        URL.revokeObjectURL(downloadUrl);
                                        document.body.removeChild(a);
                                    }, 100);
                                }
                            } else {
                                win.location = downloadUrl;

                                win.onunload = function() {
                                    URL.revokeObjectURL(downloadUrl);
                                };
                            }
                        }

                        genericCompleteHandler.apply(options, [request]);
                    } else if (request.responseText !== "") {
                        const newRequest = request;

                        newRequest.responseJSON = JSON.parse(request.responseText);
                        genericCompleteHandler.apply(options, [newRequest]);
                    }
                } else if (request.readyState === 2) {
                    if (request.status === 200) {
                        request.responseType = "blob";
                    } else {
                        request.responseType = "text";
                    }
                }
            };

            request.send(options.data);
        },
        logOut: function(authenticatorImplementation, resetLayout) {
            if (authenticatorImplementation === "OBDXAuthenticator") {
                resetLayout();
            } else {
                const form = document.createElement("form");

                form.action = "/logout";
                document.body.appendChild(form);
                form.submit();
            }
        },
        getServerURL: function() {

            return Configurations.sharding.apiBaseURL;
        },
        getImageBaseURL: function() {

            return Configurations.sharding.imageResourcePath;
        }
    };
});