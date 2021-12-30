/* eslint-env node */

"use strict";

module.exports = function(grunt) {

    require("time-grunt")(grunt);

    const sass = require("node-sass"),
        Terser = require("terser"),
        path = require("path");

    grunt.loadNpmTasks("grunt-svgmin");
    grunt.loadNpmTasks("grunt-concurrent");
    grunt.loadNpmTasks("grunt-sass");
    //grunt.loadNpmTasks("grunt-cwebp");
    grunt.loadNpmTasks("grunt-terser");
    grunt.loadNpmTasks("grunt-combine-media");
    grunt.loadNpmTasks("grunt-newer");
    require("matchdep").filterAll("grunt-contrib-*").forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        fileCleanup: grunt.file.readJSON("fileCleanup.json"),
        compress: {
            components: {
                options: {
                    mode: "brotli"
                },
                expand: true,
                cwd: "../dist",
                src: ["./extensions/**/*.{js,html,json}", "./resources/**/*.js", "./components/**/*.{js,json}", "./lzn/**/*.{js,html,json}"],
                dest: "../dist/",
                rename: function(dest, src) {
                    return dest + src.replace(/\.(js|html|css|json)$/, ".$1.br");
                }
            },
            core: {
                options: {
                    mode: "brotli"
                },
                expand: true,
                cwd: "../dist",
                src: ["./framework/**/*.{js,css,json}", "!./framework/js/configurations/security.js", "!./framework/js/libs/**"],
                dest: "../dist/",
                rename: function(dest, src) {
                    return dest + src.replace(/\.(js|html|css|json)$/, ".$1.br");
                }
            },
            libs: {
                options: {
                    mode: "brotli"
                },
                expand: true,
                cwd: "../dist",
                src: ["./framework/js/libs/**/*.{js,html,css,json}"],
                dest: "../dist/",
                rename: function(dest, src) {
                    return dest + src.replace(/\.(js|html|css|json)$/, ".$1.br");
                }
            },
            images: {
                options: {
                    mode: "brotli"
                },
                expand: true,
                cwd: "../dist",
                src: ["images/**/*.svg", "framework/css/fonts/obdx.woff", "json/**/*"],
                dest: "../dist/",
                rename: function(dest, src) {
                    return dest + src.replace(/\.(svg|woff|json)$/, ".$1.br");
                }
            }
        },
        terser: {
            components: {
                files: [{
                    cwd: "../",
                    expand: true,
                    src: ["./{extensions,resources,components,lzn,flows}/**/*.js"],
                    dest: "../destInt/"
                }]
            },
            core: {
                files: [{
                    cwd: "../",
                    expand: true,
                    src: ["./{framework,third-party-data-aggregation}/**/*.js", "./sw.js", "!./framework/js/configurations/security.js", "!./framework/js/libs/**"],
                    dest: "../destInt/"
                }]
            }
        },
        htmlmin: {
            options: {
                removeComments: true,
                ignoreCustomComments: [
                    /^\s+ko/,
                    /\/ko\s+$/
                ],
                collapseWhitespace: true,
                minifyCSS: true,
                minifyJS: true,
                minifyURLs: true,
                keepClosingSlash: true
            },
            core: {
                files: [{
                    cwd: "../",
                    expand: true,
                    src: ["./{components,flows,partials,extensions,lzn,third-party}/**/*.html", "./framework/elements/**/*.html", "./index.html", "./home.html", "./oauthredirect.html"],
                    dest: "../destInt/"
                }]
            }
        },
        cwebp: {
            dynamic: {
                options: {
                    q: 95
                },
                files: [{
                    expand: true,
                    cwd: "../images",
                    src: ["**/*.{png,jpg,jpeg}"],
                    dest: "../destInt/images"
                }]
            }
        },
        cmq: {
            options: {
                log: false
            },
            main: {
                expand: true,
                cwd: "../destInt/",
                src: ["{components,lzn,extensions,flows}/**/*.css", "framework/elements/**/*.css", "framework/css/*.css"],
                dest: "../destInt/"
            }
        },
        cssmin: {
            main: {
                options: {
                    level: 2
                },
                expand: true,
                cwd: "../destInt/",
                src: ["{components,lzn,extensions,flows}/**/*.css", "framework/elements/**/*.css", "framework/css/*.css"],
                dest: "../destInt/"
            }
        },
        sass: {
            bundle: {
                options: {
                    implementation: sass,
                    sourcemap: "none",
                    outputStyle: "compressed"
                },
                files: {
                    "../destInt/framework/css/main.css": "../framework/sass/main.scss",
                    "../destInt/framework/css/loader.css": "../framework/sass/loader.scss",
                    "../destInt/framework/css/obdx-font.css": "../framework/sass/obdx-font.scss"
                }
            }
        },
        copy: {
            core: {
                files: [{
                    cwd: "../",
                    expand: true,
                    src: ["./framework/js/configurations/security.js", "./framework/js/libs/**", "./framework/css/**"],
                    dest: "../destInt/"
                }]
            },
            misc: {
                files: [{
                    cwd: "../",
                    expand: true,
                    src: ["./**/*.json", "./webhelp/**", "./images/**", "./build.fingerprint.js", "./lzn/manifest", "!./_build/**", "!./destInt/**", "!./dist/**", "!./images/**/*.{svg}"],
                    dest: "../destInt/"
                }]
            }
        },
        clean: {
            options: {
                force: true
            },
            postBuildCleanUp: "<%= fileCleanup.postBuildCleanUp %>"
        },
        svgmin: {
            minify: {
                options: {
                    plugins: [{
                        inlineStyles: false
                    }]
                },
                files: [{
                    expand: true,
                    cwd: "../",
                    src: ["./images/**/*.svg"],
                    dest: "../destInt"
                }]
            }
        },
        concurrent: {
            cssCleanup: ["cmq", "cssmin"],
            generateWorkspace: {
                tasks: [
                    "newer:copy:core", "newer:copy:misc", "newer:htmlmin:core", "newer:svgmin:minify",
                    "newer:terser:components", "newer:terser:core",
                    "sass:bundle", "componentCSS"
                ],
                options: {
                    limit: 4,
                    logConcurrentOutput: true
                }
            },
            brotli: ["newer:compress:components", "newer:compress:core", "newer:compress:libs", "newer:compress:images"],
            finalize: ["clean:postBuildCleanUp"]
        }
    });

    grunt.registerTask("default", ["concurrent:generateWorkspace", "concurrent:cssCleanup", "inlineLoaderCSS", "generateBuildFingerprint", "renderRequireJSConfig", "require", "fileMove", "concurrent:finalize"]);

    grunt.registerTask("inlineLoaderCSS", "Inline the loader css", function() {
        const loader = grunt.file.read("../destInt/framework/css/loader.css"),
            index = grunt.file.read("../destInt/index.html");

        grunt.file.write("../destInt/index.html", index.replace(/<link data-embed.*?loader\.css.*?>/, `<style>${loader}</style>`));
    });

    grunt.registerTask("fileMove", "Move the require-config to proper location", function() {
        grunt.file.write("../dist/framework/js/configurations/require-config.js", Terser.minify(grunt.file.read("../destInt/tmp/require-config.tmp")).code);
    });

    grunt.registerTask("require", "Bundles the files", function() {
        grunt.config("requirejs", {
            compileComponents: {
                options: {
                    baseUrl: "../destInt/",
                    mainConfigFile: "../_build/build-config-components.js",
                    dir: "../dist",
                    keepBuildDir: false,
                    optimize: "none",
                    preserveLicenseComments: false,
                    optimizeCss: "none",
                    pragmasOnSave: {
                        excludeRequireCss: true
                    },
                    modules: [{
                        name: "text"
                    }, {
                        name: "ojL10n"
                    }, {
                        name: "css",
                        exclude: ["jquery"]
                    }, {
                        name: "load",
                        exclude: ["text", "framework/js/configurations/config"]
                    }].concat(grunt.file.readJSON("./requirejs-config.json").moduleProperties)
                }
            },
            compileCore: {
                options: {
                    baseUrl: "../destInt/",
                    name: "require-config",
                    optimize: "none",
                    exclude: grunt.file.readJSON("./requirejs-config.json").excludeProperties,
                    include: [
                        "knockout-helper",
                        "baseModel",
                        "baseService",
                        "framework/js/view-model/generic-view-model",
                        "framework/js/base-models/platform/default",
                        "jquery-private",
                        "load"
                    ],
                    excludeShallow: ["ojL10n", "text", "text!extensions/extension.json", "css", "normalize", "css!framework/css/obdx-font"],
                    mainConfigFile: "../_build/build-config.js",
                    out: "../destInt/tmp/require-config.tmp"
                }
            }
        });

        grunt.task.run(["requirejs"]);
    });

    grunt.registerTask("renderRequireJSConfig", "Generate the configuration for require js task", function(path) {
        const done = this.async(),
            promisify = require("util").promisify,
            glob = promisify(require("multi-glob").glob),
            globArray = [
                "../destInt/lzn/*/components/*/*/loader.js",
                "../destInt/lzn/*/components/widgets/*/*/loader.js",
                "../destInt/components/*/*/loader.js",
                "../destInt/flows/*/*/loader.js",
                "../destInt/extensions/components/*/*/loader.js",
                "../destInt/extensions/components/widgets/*/*/loader.js",
                "../destInt/components/widgets/*/*/loader.js",
                "../destInt/framework/elements/*/*/loader.js"
            ];

        glob(globArray)
            .then(function(files) {
                return files.reduce(function(accumulator, file) {
                    const tokens = file.split("/");

                    tokens.shift();
                    tokens.shift();
                    tokens[tokens.length - 1] = "loader";

                    const fullPath = tokens.join("/");

                    accumulator.push({
                        name: fullPath,
                        exclude: ["text", "css", "ojL10n", "load"]
                    });

                    return accumulator;
                }, []);
            })
            .then(function(globResult) {
                grunt.file.write("./requirejs-config.json", JSON.stringify({
                    moduleProperties: globResult,
                    excludeProperties: path !== "mobile" ? [] : ["css!framework/css/obdx-font"]
                }));

                done();
            });
    });

    grunt.registerTask("generateBuildFingerprint", "Generate the build fingerprint file", function() {
        const buildFingerprint = grunt.file.read("../destInt/build.fingerprint.js");

        grunt.file.write("../destInt/build.fingerprint.js", buildFingerprint.replace("return {}", `return { timeStamp: ${Date.now()} }`));
    });

    grunt.registerTask("cleanToolkitFiles", "Delete toolkit generated files after build", function() {
        if (grunt.file.exists("../uiworkbench.files")) {
            const files = grunt.file.readJSON("../uiworkbench.files");
            let fileCount = 0;

            [...new Set(files.map(file => {
                if (file.startsWith("partials") || file.startsWith("resources")) {
                    return file;
                } else if (file.startsWith("components")) {
                    return path.parse(file).dir;
                } else if (file.startsWith("flows")) {
                    if (path.parse(file).base === "flow.config.js") {
                        return path.parse(file).dir;
                    }

                    return path.parse(path.parse(file).dir).dir;
                }

                return file;

            }))].forEach(file => {
                grunt.file.delete("../" + file, { force: true });
                grunt.verbose.writeln(`File ${file} deleted successfully`);
                fileCount++;
            });

            grunt.log.ok(`${fileCount} ${grunt.util.pluralize(fileCount, "file/files")} deleted`);
        }
    });

    grunt.registerTask("componentCSS", "Compile the component CSS", function(path) {
        require("./component-sass")(grunt, path);
    });

    //mobilebuild tasks

    grunt.registerTask("mobilebuild", ["concurrent:generateWorkspace", "componentCSS:mobile_properties", "concurrent:cssCleanup", "inlineLoaderCSS", "mobile-build:replace", "renderRequireJSConfig:mobile", "require", "fileMove", "concurrent:finalize", "mobile-build:addCharset"]);

    grunt.registerTask("mobile-build", "make mobile specific code changes", function(arg1) {
        grunt.loadTasks("mobile");
        grunt.log.writeln("mobile tasks loaded");

        if (arg1 === "replace") {
            grunt.log.writeln("Running: string-replace:genericReplacements");
            grunt.task.run("string-replace:genericReplacements");
        } else if (arg1 === "addCharset") {
            grunt.log.writeln("Running: addCharsetAttribute task");
            grunt.task.run("addCharsetAttribute");
        }
    });

    grunt.registerTask("mobile-dev", "make unminified ios src code changes", function() {
        grunt.loadTasks("mobile");
        grunt.log.writeln("mobile-dev tasks loaded");
        grunt.log.writeln("Running: mobile dev ui changes");
        grunt.task.run("copy:dev-copy-mobile");
        grunt.task.run("sass:bundle");
    });

};