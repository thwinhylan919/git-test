module.exports = {
    STRING_ONLY_SPACES: new RegExp(/\+\s*[\"\']\s+[\"\']\s*\+/),
    //ERROR
    I_TAG: new RegExp(/<\s*i\s+/),
    //ERROR
    DEPRECATED_TAG_SUMMARY: new RegExp(/<.*summary\s*=\s*[\'\"][^=]*[\'\"]/),
    //ERROR
    DEPRECATED_TAG_ALIGN: new RegExp(/<.*\salign\s*=\s*[\'\"][^=]*[\'\"]/),
    //ERROR
    EQUALITY_CHECK: new RegExp(/[^=!][=!]=[^=]/),
    //ERROR
    HEADER_NAME: new RegExp(/self\.headerName\s*?\(\s*[\'\"].\*?/),
    //ERROR
    ANCHOR_WITHOUT_HREF: new RegExp(/<a(?=\s|>)(?!(?:[^>=]|=([\'\"])(?:(?!\1).)*\1)*?\shref\s*=\s*[\'\"])[^>\n]*>.*?/),
    //ERROR
    DIV_SPAN_CLICK: new RegExp(/<(div|span|li|ul)((?!ojComponent|>).)*(on\-)?click\s*:.*/),
    //ERROR
    MESSAGE_PLACEHOLDER_HARDCODED: new RegExp(/(messageDetail|placeholder)[\s\t]*:[\s\t]*[\'\"]\w/),
    //ERROR
    EMPTY_LABEL: new RegExp(/<label((?!text|html).)*>/),
    //ERROR
    SELF_PASSED_AS_PARAMS: new RegExp(/loadComponent[\s\t]*\(.*,[\s\t]*self[\s\t]*,.*$/),
    //ERROR
    TEXT_BINDING_HARDCODING: new RegExp(/[,\'\"\s\t]+text[\s\t]*:[\s\t]*[\'\"][\w\s\(\)]*[\'\"]/),
    //ERROR
    INLINE_STYLING_TAG: new RegExp(/[\s\t]+style\s*=\s*[\'\"][^\'\"]*[\'\"]/),
    //ERROR
    INLINE_STYLING_ROOTATTRIBUTES: new RegExp(/rootAttributes[\s\t]*:[\s\t]*\{.*style.*\}/),
    //ERROR
    INVALID_FILE_NAME_PATTERN: new RegExp(/[A-Z0-9_]+/),
    //ERROR
    INVALID_SUB_HEADING: new RegExp(/((action\-header)|(page\-section)).*heading[\s\t]*\:[\s\t]*[\'\"]\w+/),
    //ERROR
    HARDCODED_ROW_LABEL: new RegExp(/<row.*label[\s\t]*\:[\s\t]*[\'\"]/),
    //ERROR
    DEPRECATED_METHODS: new RegExp(/(getDropDownValue\s*\()|(checkAndBindObservable\s*\()/),
    //ERROR
    CAPITAL_VALUES: new RegExp(/\:[\s\t]*[\'\"][A-Z ]+[\'\"]/),
    //ERROR
    HARDCODED_LABEL: new RegExp(/label[\s\t]*\:[\s\t]*[\'\"]\w*/),
    //ERROR
    ARIA_HARDCODED_LABEL: new RegExp(/[^:]aria\-label[\s\t]*[\=\:][\s\t]*[\'\"]/),
    //ERROR
    SELF_PARAMS: new RegExp(/(self\.params[\s]*?=(?!=))|(self\.params\.(?=\w)[\w\s\.]*?=(?!=))/),
    //ERROR
    ALT_IN_DATABIND: new RegExp(/['"]*alt['"]*\s*:(.*?)[,}]/),
    //ERROR
    TITLE_IN_DATABIND: new RegExp(/['"]?title['"]?\s*\:(.*?)[,}]/),
    //ERROR
    COLOR_EXP: new RegExp(/\:\s*#[0-9a-fA-f]{3,6}/),
    //ERROR
    CONFIRM_SCREEN: new RegExp(/name\s*\:\s*[\'\"]confirm\-screen[\'\"]/),
    //ERROR
    HARDCODED_MESSAGES: new RegExp(/.*?[^(info|error|warn|groupCollapsed)]\([\'\"][A-Z][\w]*\s+[\w\s]+[\'\"]/),
    //ERROR
    RB_INVALID_VALUE: new RegExp(/\.root[\.\s\n\,]+/),
    //ERROR
    RB_INVALID_DATA_BIND: new RegExp(/data\-bind/),
    //ERROR
    RB_INVALID_IMPORT: new RegExp(/[\'\"]resources\/nls\//),
    //ERROR
    RB_END_WITH_SPACE: new RegExp(/:\s*?".*?\s\s?"[\,\s]?/),
    //ERROR
    RB_START_WITH_SPACE: new RegExp(/:\s*"\s+.*"/),
    //ERROR
    IS_STRING_REGEX: new RegExp(/".*"[\,\s]?$/g),
    //ERROR
    TITLE_CASE: new RegExp(/^\s*?[A-Z][^A-Z]+?.*?\b[\s]+/),
    //ERROR
    SIZE_IN_PX: new RegExp(/px|PX/),
    //ERROR
    KO_MAPPING: new RegExp(/__ko_mapping__/),
    //ERROR
    SPLIT_BY_T: new RegExp(/split\(['"]T['"]\)/),
    //ERROR
    DELETE_ON_KEY: new RegExp(/^[\s\t]*delete/),
    //ERROR
    LOCALE_STRING: new RegExp(/toLocale(.*)?String/),
    //ERROR
    NEW_DATE: new RegExp(/new[\s\t]+Date[\s\t]*\([\s\t]*\)/),
    //ERROR
    DIGX_IN_COMPONENT: new RegExp(/\/digx/),
    //ERROR
    INVALID_SASS_PROPS: new RegExp(/^\s*?(left|right|float|text\-align)\s*?\:/g),
    //ERROR
    INVALID_PADDING_LEFT_RIGHT: new RegExp(/^\s*?(padding-left|padding-right|margin-left|margin-right|border-left|border-right|border-.*?(left|right)-radius)\s*?\:/g),
    //ERROR
    INVALID_PADDING_VALUES: new RegExp(/(padding|margin|border|border-radius)\s*?:\s*?([^!\s]+)\s+([^!\s]+)\s+([^!\s]+)\s+([^!\s]+)\s*?;/),
    //ERROR
    INVALID_CONSTANT_COMPARISON: new RegExp(/[\!=]==\s*self\.(nls|resourceBundle|locale|resource)\./i),
    //ERROR
    OJ_OLD_SYNTAX_USED: new RegExp(/ojComponent/),
    //ERROR
    JQUERY_IN_HTML: new RegExp(/\$[\.\(]/),
    //ERROR
    FUNCTION_IN_HTML: new RegExp(/function\s*\(/),
    // ERROR
    LEFT_RIGHT: new RegExp(/[\s\t]+(margin|padding|border)-(left|right)/),
    // ERROR
    TEXT_ALIGN: new RegExp(/[\s\t]+(text-align|float)\s*\:\s*(left|right)/),
    // ERROR
    PROP_LEFT_RIGHT: new RegExp(/[\s\t]+(left|right)\s*\:[^\%]*;/),
    // ERROR
    ILLEGAL_HEADING: new RegExp(/<h[5,6]/),
    // ERROR
    KEYWORD_JAVASCRIPT_USED: new RegExp(/javascript\:/),
    // ERROR
    OJ_OVERRIDE_SCSS: new RegExp(/\.oj\-/),
    // ERROR
    HARDCODED_HEADER_TEXT: new RegExp(/[\'\"]headerText[\'\"]\s*\:\s*[\'\"]\w/),
    // ERROR
    HARDCODED_TEXT: new RegExp(/>[\s\t\n\r]*[A-Za-z]/),
    // ERROR
    MODEL_URL_NO_STRING: new RegExp(/url\s*?:\s*(?!.*"[^"]*?").*/),
    // ERROR
    ILLEGAL_FORMATTER_USAGE_BINDINGS: new RegExp(/baseModel\.(formatDate)/),
    // ERROR
    ILLEGAL_FORMATTER_USAGE_HTML: new RegExp(/baseModel\.(formatDate|dateConverter|timeConverter|dateTimeConverter|getLocaleValue|formatNumber|formatCurrency)/),
    // WARNING
    HARD_CODED_COLORS: new RegExp(/\:[\s\t]*(white|red|green|blue|black|yellow|grey)/),
    // WARNING
    HARD_CODED_COLOR_HEX: new RegExp(/[\s\t]+[^\$][\w\d\-\_]+\:[\s\t]*\#[\dA-Fa-f]{3,6}/),
    // WARNING
    INVALID_USE_OF_ACTION_HEADER: new RegExp(/<action-header.*>[\s\t\n\r]*<\/action-header>/),
    // WARNING
    MODEL_URL_SINGLE_STRING: new RegExp(/url\s*?:\s*".*\++/),
    // ERROR
    INVALID_HELP_PANEL_CLASS: new RegExp(/information-wrapper(-image)?/),
    // ERROR
    WIDGET_HEADER_NAME: new RegExp(/\.dashboard\.headerName\(/),
    // ERROR
    HASHCHANGE_BINDINGS: new RegExp(/hashchange|\.hash[^\w]/),
    // ERROR
    INVALID_HTML_QUOTING: new RegExp(/=\s*?"[^"]*?"\s*?"/)
};