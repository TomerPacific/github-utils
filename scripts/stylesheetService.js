const CODING_LANGUAGE_STYLESHEET = document.styleSheets[4];

function hasCssRule(cssRule) {
    for(let index = 0; index < CODING_LANGUAGE_STYLESHEET.cssRules.length; index++) {
        let cssRule = CODING_LANGUAGE_STYLESHEET.cssRules[index];
        console.log(cssRule.selectorText);
        console.log(cssRule);
        console.log(cssRule.selectorText.substring(1));
        if (cssRule.selectorText.substring(1) === cssRule) {
            console.log('Returning true for ' + cssRule);
            return true;
        }
    }
    console.log('Returning false for ' + cssRule);
    return false;
}
