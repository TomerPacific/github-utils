const CODING_LANGUAGE_STYLESHEET = document.styleSheets[4];

function hasCssRule(cssRuleToFind) {
    for(let index = 0; index < CODING_LANGUAGE_STYLESHEET.cssRules.length; index++) {
        let cssRule = CODING_LANGUAGE_STYLESHEET.cssRules[index];
        if (cssRule.selectorText.substring(1) === cssRuleToFind) {
            return true;
        }
    }

    return false;
}

function handleSpecialCSSClasses(codingLanguage) {
    codingLanguage = codingLanguage === 'C#' ? C_SHARP_CSS_CLASS : codingLanguage;
    codingLanguage = codingLanguage === 'C++' ? C_PLUS_PLUS_CSS_CLASS : codingLanguage;
    return codingLanguage;
}
