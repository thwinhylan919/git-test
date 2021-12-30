define(["framework/js/configurations/config", "text"], function (SystemConfiguration, text) {
  "use strict";

  const buildMap = {},
    matchFileType = function (file, fileType) {
      return file.split("?")[0].match(new RegExp("\\" + fileType + "$"));
    },
    isJSON = function (file) {
      return matchFileType(file, ".json");
    },
    isCSS = function (file) {
      return matchFileType(file, ".css");
    },
    transformFunction = function (file, data) {
      if (isJSON(file)) {
        return JSON.parse(data);
      }

      return data;
    };

  return {
    load: function (url, _req, onLoad, config) {
      if (config.load && config.load.inline === false) {
        onLoad();

        return;
      }

      if (url.indexOf("empty:") === 0) {
        onLoad();

        return;
      }

      url = config.baseUrl + url + (config && !config.isBuild && !SystemConfiguration.development.enabled ? "?bust=" + SystemConfiguration.system.buildTimestamp : "");

      text.get(url, function (data) {
          let parsed;

          if (config.isBuild) {
            buildMap[url] = data;
            onLoad(data);
          } else {
            try {
              parsed = transformFunction(url, data);
            } catch (e) {
              onLoad.error(e);
            }

            onLoad(parsed);
          }
        },
        onLoad.error, {
          accept: isJSON(url) ? "application/json" : isCSS(url) ? "text/css" : "text/html"
        }
      );
    },
    write: function (pluginName, moduleName, write) {
      //eslint-disable-next-line no-undef
      const fullyQualifiedModuleName = requirejsVars.requirejs.toUrl(moduleName),
        fileContents = buildMap[fullyQualifiedModuleName];

      if (fileContents) {
        let content;

        if (isJSON(fullyQualifiedModuleName)) {
          content = fileContents.replace(/\s/g, "");
        } else {
          content = "'" + text.jsEscape(fileContents) + "'";
        }

        // eslint-disable-next-line obdx-string-validations
        write("define(\"" + pluginName + "!" + moduleName + "\", function(){ return " + content + ";});\n");
      }
    }
  };
});