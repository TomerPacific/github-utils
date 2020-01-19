const CODING_LANGUAGE_STYLESHEET = document.styleSheets[4];

function hasCssRule(cssRuleToFind) {
    for(let index = 0; index < CODING_LANGUAGE_STYLESHEET.cssRules.length; index++) {
        let cssRule = CODING_LANGUAGE_STYLESHEET.cssRules[index];
        if (cssRule.selectorText === cssRuleToFind) {
            return true;
        }
    }

    return false;
}
