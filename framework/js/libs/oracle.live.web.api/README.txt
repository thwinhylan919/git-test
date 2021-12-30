
Live Experience Web Component
========================================
The Live Experience web component integrates with the Oracle Live Experience service.
The web component includes a set of buttons to start, end, pause and resume a call with an associate
that is logged into the Desktop Agent Experience at: https://live.oraclecloud.com/dae/?tenant=<YourTenant>

Note: The Live Experience web component library makes use of require.js for content and dependency loading,
if you do not already use require.js in your application you can include the provided api-main.js in your index.html
to configure the web component paths or if you already use require.js simply copy the paths from this file into your
current require.js data-main configuration file.
If you cannot use require.js then load oracle.live.api.all.js instead, this bundles the web component
with the required libraries.


CONTENTS
========
The web component contains the following files:
/README.txt - this README file
/js/api-main.js - Contains require.js configuration.
/js/oracle.live.api.js - Contains functions to start/stop an audio/video call
/js/oracle.live.api.all.js - Contains functions to start/stop an audio/video call (bundled with libraries)
/js/oracle.live.style.css - Contains styling for video elements and buttons
/lib/require.js - Require.JS library
/lib/jquery.js - JQuery library
/README.md - Contains sample code for using the web component


INSTALLATION
============
1. Extract the zip file into a folder within your web application
2. Refer to README.md for an example using the following steps:
  a. Include the require.js data-main script tag into the HTML head of your application. (Optional)
  b. Retrieve an authentication token and expiry from your server-side Auth Module
  c. Configure the service and context attributes
  d. Add the web component to a page in your application


MORE INFORMATION
================
Please review the JS Developer API documentation here:
http://www.oracle.com/pls/topic/lookup?ctx=wsccl&id=js-api-ref

The latest version of this web component can be downloaded from here:
http://www.oracle.com/pls/topic/lookup?ctx=wsccl&id=js-sdk

A sample application that uses this component can be downloaded from here:
http://www.oracle.com/pls/topic/lookup?ctx=wsccl&id=js-sample


Copyright (c) 2018 Oracle and/or its affiliates. All rights reserved.

This material is the confidential property of Oracle Corporation or its
licensors and may be used, reproduced, stored or transmitted only in
accordance with a valid Oracle license or sublicense agreement.
