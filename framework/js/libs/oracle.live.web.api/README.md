# Oracle&reg; Live Experience JavaScript API Reference, E65220-01 #

----------

Add the following code to a HTML page within your application.

**Note**:
The Oracle Live Experience web component uses require.js for dependency management.
If you cannot use AMD/require.js then include the 'all' version as shown below.
The 'lx' path below is the location of the Live Experience web component on the web server.


__Require.JS version:__

```html
<head>
  <!-- load require.js and the data-main configuration, if you already use require.js in your
       application then add the live-experience configuration to your data-main script. -->
  <script type="text/javascript" data-main="lx/js/api-main" src="lx/lib/require.js"></script>
</head>

<body>
  <script type="text/javascript">
    require(["oracle.live.api"], function(liveApi) {
      const getAuthToken = (callback) => {
        // get the auth token from the live experience authentication server,
        // via an application-specific server-side authentication module (such as auth.cgi).
        fetch(new Request("/auth.cgi"))
        .then(response => { return response.json(); })
        .then(auth => { callback(auth.access_token, auth.expires_in); });
      };
      // Note: getAuthToken has a callback parameter which is provided by this arrow function
      getAuthToken((myAuthToken, myTokenExpiry) => {
        liveApi.controller.service.userID = "my.user@example.com";
        liveApi.controller.service.tenantID = "MyTenant";
        liveApi.controller.service.clientID = "My application ID";
        // auth token and expiry are returned during Live Experience Authentication
        liveApi.controller.service.authToken = myAuthToken;
        // the callback should update the authToken property with the refreshed token
        liveApi.controller.service.authRefresh(myTokenExpiry, () => {
          app.getAuthToken((jwt) => { liveApi.controller.service.authToken = jwt; });
        });

        liveApi.controller.contextAttributes.set("appLocation", "Basic Guidance");

        liveApi.controller.addComponent();
        document.querySelector("body").addEventListener(
          liveApi.controller.events.LiveConnected, (event) => {
            console.log("Event: " + event.type);
          });
      });
    });
  </script>
</body>
```

__Non-Require.JS version:__
```html
<head>
  <!-- if you cannot use require.js then use the 'all' version which bundles all required libraries,
       access the controller via the 'liveApi' global property. -->
  <script type="text/javascript" src="lx/js/oracle.live.api.all.js"></script>
</head>

<body>
  <script type="text/javascript">
  window.onload = () => {
    /* globals liveApi */
    const getAuthToken = (callback) => {
      // get the auth token from the live experience authentication server,
      // via an application-specific server-side authentication module (such as auth.cgi).
      fetch(new Request("/auth.cgi"))
      .then(response => { return response.json(); })
      .then(auth => { callback(auth.access_token, auth.expires_in); });
    };
    // Note: getAuthToken has a callback parameter which is provided by this arrow function
    getAuthToken((myAuthToken, myTokenExpiry) => {
      liveApi.controller.service.userID = "my.user@example.com";
      liveApi.controller.service.tenantID = "MyTenant";
      liveApi.controller.service.clientID = "My application ID";
        // auth token and expiry are returned during Live Experience Authentication
        liveApi.controller.service.authToken = myAuthToken;
        // the callback should update the authToken property with the refreshed token
        liveApi.controller.service.authRefresh(myTokenExpiry, () => {
          app.getAuthToken((jwt) => { liveApi.controller.service.authToken = jwt; });
        });

      liveApi.controller.contextAttributes.set("appLocation", "Basic Guidance");

      liveApi.controller.addComponent();
      document.querySelector("body").addEventListener(
        liveApi.controller.events.LiveConnected, (event) => {
          console.log("Event: " + event.type);
        });
    });
  };
  </script>
</body>
```

----------

Copyright &copy; 2019, Oracle and/or its affiliates. All rights reserved.
