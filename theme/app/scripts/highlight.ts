import * as hljs from "highlight.js/lib/core.js";
import * as xml from "highlight.js/lib/languages/xml.js";
import * as bash from "highlight.js/lib/languages/bash.js";
import * as markdown from "highlight.js/lib/languages/markdown.js";
import * as gradle from "highlight.js/lib/languages/gradle.js";
import * as groovy from "highlight.js/lib/languages/groovy.js";
import * as java from "highlight.js/lib/languages/java.js";
import * as javascript from "highlight.js/lib/languages/javascript.js";
import * as json from "highlight.js/lib/languages/json.js";
import * as kotlin from "highlight.js/lib/languages/kotlin.js";
import * as sql from "highlight.js/lib/languages/sql.js";
import * as yaml from "highlight.js/lib/languages/yaml.js";

export function highlight() {
    hljs.registerLanguage("xml", xml);
    hljs.registerLanguage("bash", bash);
    hljs.registerLanguage("markdown", markdown);
    hljs.registerLanguage("gradle", gradle);
    hljs.registerLanguage("groovy", groovy);
    hljs.registerLanguage("java", java);
    hljs.registerLanguage("javascript", javascript);
    hljs.registerLanguage("json", json);
    hljs.registerLanguage("kotlin", kotlin);
    hljs.registerLanguage("sql", sql);
    hljs.registerLanguage("yaml", yaml);
    hljs.initHighlighting();
}
