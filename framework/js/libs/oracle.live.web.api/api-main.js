/*
 * Copyright (c) 2018 Oracle. All rights reserved.
 *
 * This material is the confidential property of Oracle Corporation or its
 * licensors and may be used, reproduced, stored or transmitted only in
 * accordance with a valid Oracle license or sublicense agreement.
 */

/* the baseUrl will need adjusting for your setup if you did not extract the sources into the 'lx' directory */
requirejs.config({
  baseUrl: "lx/js",
  waitSeconds: 60,
  paths: {
    // third-party dependency paths:
    "jquery": "../lib/jquery",
    "text": "oracle.live.api",
    "css": "oracle.live.api",
    // live-experience web-component paths:
    "oracle.live.api": "oracle.live.api",
    // CSS is always in a separate file
    "oracle.live.style": "oracle.live.style",
    "oracle.live.button": "oracle.live.api",
    "oracle.live.messages": "oracle.live.api",
    "oracle.live.sdk": "oracle.live.api",
  },
  shim: {
    "jquery": {
      exports: ["jQuery", "$"]
    }
  }
});
