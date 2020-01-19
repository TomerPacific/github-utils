const CODING_LANGUAGES_STYLESHEET_NAME = 'coding-languages.css';

function getCodingLanguagesStyleSheet() {
    let chosen = document.styleSheets[4];
    console.log(chosen);
    for(let index = 0; index < chosen.cssRules.length; index++) {
        console.log(chosen.cssRules[index]);
    }
}

function hasCssRule(styleSheet, cssRule) {

}
