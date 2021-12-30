module.exports = function (grunt) {
  "use strict";

  grunt.file.defaultEncoding = "utf8";
  grunt.loadNpmTasks("grunt-string-replace");
  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks("grunt-sass");

  const buildProps = grunt.file.readJSON("properties.json"),
    mobileProps = grunt.file.readJSON("mobile_properties.json"),
    properties = Object.assign(buildProps, mobileProps);

  grunt.config.merge({
    "string-replace": {
      genericReplacements: {
          files: grunt.file.readJSON("fileCleanup.json").stringReplace.map(element => {
              return {
                  src: element,
                  dest: element
              };
          }),
          options: {
              replacements: Object.keys(properties).map(element => {
                  return {
                      pattern: new RegExp("@@" + element.toUpperCase(), "g"),
                      replacement: properties[element] || Date.now()
                  };
              })
          }
      }
    },
    copy: {
      "dev-copy-mobile": {
        files: [
          // includes files within path and its sub-directories
          {
            cwd: "../",
            expand: true,
            //src: ['./**', '!./_build/**', '!./third-party/**', '!./wallet/**', '!./admin/**', '!./.svn/**', '!./mobile/**', '!./config/**', '!./dist/**', '!./**/node_modules/**', '!./scaffolding/**'],
            // or
            //src: ['./framework/**', './images/**', './retail/**', './corporate/**', './index/**', '!./.svn/**', '!./framework/.svn/**', './images/.svn/**', './retail/.svn/**', './corporate/.svn/**', './index/.svn/**'],
            // or for export
            src: ["./components/**", "./extensions/**", "./framework/**", "./images/**", "./index/**", "./json/**", "./partials/**", "./resources/**", "./index.html", "./manifest.json", "./sw.js", "./build.fingerprint", "./lzn/**"],
            dest: "../destInt/"
          }
        ]
      }
    }
  });

  grunt.registerTask("addCharsetAttribute", "add meta tag with charset attribute in index.html", function() {
    let out_file = grunt.file.read("../dist/index.html");
    const code = "<head><meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\">";
    out_file = out_file.replace(/<head>(?:<meta http-equiv="Content-Type" content="text\/html; charset=UTF-8">)*/g, code);
    grunt.file.write("../dist/index.html", out_file);
  });

};
