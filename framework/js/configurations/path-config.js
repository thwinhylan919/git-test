define(["framework/js/configurations/config"], function(Configuration) {
    "use strict";

    function getCDNPath(resource) {
        const isCSS = resource.indexOf(".css") > -1;

        return (isCSS ? "css!" : "") + Configuration.oracleJet.baseUrl + "/v" + Configuration.oracleJet.version + "/" + resource;
    }

    function getLocalPath(resource) {
        const isCSS = resource.indexOf(".css") > -1,

            basePath = Configuration.oracleJet.baseUrl + "/" + Configuration.oracleJet.version + "/" + (isCSS ? "css" : "js") + "/libs/";

        return (isCSS ? "css!" : "") + basePath + resource;
    }

    const pathConfig = {
        local: {
            paths: {
                ojs: getLocalPath("oj/v7.3.0/min"),
                ojtranslations: getLocalPath("oj/v7.3.0/resources"),
                jquery: getLocalPath("jquery/jquery-3.5.1.min"),
                knockout: getLocalPath("knockout/knockout-3.5.0"),
                "knockout-mapping": getLocalPath("knockout/knockout.mapping-latest"),
                text: getLocalPath("require/text"),
                "jqueryui-amd": getLocalPath("jquery/jqueryui-amd-1.12.1.min"),
                customElements: getLocalPath("webcomponents/custom-elements.min"),
                promise: getLocalPath("es6-promise/es6-promise.min"),
                hammerjs: getLocalPath("hammer/hammer-2.0.8.min"),
                ojdnd: getLocalPath("dnd-polyfill/dnd-polyfill-1.0.0.min"),
                css: getLocalPath("require-css/css.min"),
                fetch: getLocalPath("persist/min/impl/fetch"),
                ojL10n: getLocalPath("oj/v7.3.0/ojL10n"),
                touchr: getLocalPath("touchr/touchr"),
                signals: getLocalPath("js-signals/signals"),
                alta: getLocalPath("oj/v7.3.0/alta/oj-alta-notag-min.css")
            }
        },
        cdn: {
            paths: {
                ojs: getCDNPath("default/js/min"),
                ojtranslations: getCDNPath("default/js/resources"),
                "jqueryui-amd": getCDNPath("3rdparty/jquery/jqueryui-amd-1.12.1.min"),
                fetch: getCDNPath("3rdparty/persist/min/impl/fetch"),
                promise: getCDNPath("3rdparty/es6-promise/es6-promise.min"),
                alta: getCDNPath("default/css/alta/oj-alta-notag-min.css")
            },
            bundles: {
                "ojs/oj3rdpartybundle": ["knockout", "knockout-mapping", "jquery", "jqueryui-amd/version", "jqueryui-amd/widget", "jqueryui-amd/unique-id", "jqueryui-amd/keycode", "jqueryui-amd/focusable", "jqueryui-amd/tabbable", "jqueryui-amd/ie", "jqueryui-amd/widgets/mouse", "jqueryui-amd/data", "jqueryui-amd/plugin", "jqueryui-amd/safe-active-element", "jqueryui-amd/safe-blur", "jqueryui-amd/scroll-parent", "jqueryui-amd/widgets/draggable", "jqueryui-amd/position", "signals", "text", "hammerjs", "ojdnd", "customElements", "css", "touchr"],
                "ojs/ojcorebundle": ["ojL10n", "ojtranslations/nls/ojtranslations", "ojs/ojlogger", "ojs/ojcore-base", "ojs/ojcore", "ojs/ojconfig", "ojs/ojcontext", "ojs/ojresponsiveutils", "ojs/ojthemeutils", "ojs/ojtimerutils", "ojs/ojtranslation", "ojs/ojmessaging", "ojs/ojcustomelement", "ojs/ojcomponentcore", "ojs/ojkoshared", "ojs/ojtemplateengine", "ojs/ojhtmlutils", "ojs/ojcomposite-knockout", "ojs/ojcomposite", "ojs/ojbindingprovider", "ojs/ojknockouttemplateutils", "ojs/ojresponsiveknockoututils", "ojs/ojknockout", "ojs/ojknockout-validation", "ojs/ojrouter", "ojs/ojmodule", "ojs/ojmodule-element", "ojs/ojmodule-element-utils", "ojs/ojmoduleanimations", "ojs/ojdefer", "ojs/ojdatasource-common", "ojs/ojarraytabledatasource", "ojs/ojeventtarget", "ojs/ojdataprovider", "ojs/ojdataprovideradapter", "ojs/ojarraydataprovider", "ojs/ojlistdataproviderview", "ojs/ojcss"],
                "ojs/ojcommoncomponentsbundle": ["ojs/ojoption", "ojs/ojbutton", "ojs/ojjquery-hammer", "ojs/ojpopupcore", "ojs/ojanimation", "ojs/ojmenu", "ojs/ojtoolbar", "ojs/ojpopup", "ojs/ojdialog", "ojs/ojkeysetimpl", "ojs/ojkeyset", "ojs/ojmap", "ojs/ojoffcanvas", "ojs/ojdomscroller", "ojs/ojlistview", "ojs/ojnavigationlist", "ojtranslations/nls/localeElements", "ojs/ojlocaledata", "ojs/ojvalidation-base", "ojs/ojlabel", "ojs/ojeditablevalue", "ojs/ojvalidation-number", "ojs/ojinputnumber", "ojs/ojinputtext", "ojs/ojavatar", "ojs/ojswitcher", "ojs/ojoptgroup", "ojs/ojlabelvalue"],
                "ojs/ojdvtbasebundle": ["ojs/internal-deps/dvt/DvtToolkit", "ojs/ojattributegrouphandler", "ojs/ojdvt-base"]
            }

        }
    };

    require.config(pathConfig[Configuration.oracleJet.hostedAt]);

    return {
        jetLocation: Configuration.oracleJet.hostedAt,
        altaPath: pathConfig[Configuration.oracleJet.hostedAt].paths.alta
    };
});