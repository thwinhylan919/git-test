require(["module"], function() {
  "use strict";

  //Helper function to get URL Parameter
  const getURLParameter = function(sParam) {
      const sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split("&");

      for (let i = 0; i < sURLVariables.length; i++) {
        const sParameterName = sURLVariables[i].split("=");

        if (sParameterName[0] === sParam) {
          return sParameterName[1];
        }
      }
    },
    authorize = function() {
      //Gets the Authorization Code
      const code = getURLParameter("code"),
        state = getURLParameter("state");

      if (typeof code !== "undefined") {
        if (typeof state !== "undefined") {
          //Redirecting to Authorization URL
          const redirercturl = window.location.origin + "?homeModule=account-aggregation&homeComponent=aggregate-register-accounts&state=" + state + "&code=" + code;

          location.href = redirercturl;
        }
      }
    };

  authorize();
});
