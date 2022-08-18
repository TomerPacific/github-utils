
function parseRepositories(repositories) {

    for (let index = 0; index < repositories.length; index++) {
        let repository = repositories[index];
        let anchorElement = document.createElement('a');
        let headerElement = document.createElement('h4');
        let divElement = document.createElement('div');
        divElement.classList.add('repository');

        //Repository Name
        anchorElement.href = repository.html_url;
        anchorElement.target = LINK_TARGET_BLANK;
        anchorElement.innerHTML = repository.name;
        anchorElement.title = repository.description ? repository.description : 'No description exists for repository';
        headerElement.appendChild(anchorElement);
        divElement.appendChild(headerElement);

        addStarToRepository(repository, divElement);
        addForkIcon(repository, divElement);
        getAmountOfWatchers(repository).then(function(result) {

            if (result != undefined && result.length > 1) {
                let spanElement = document.createElement('span');
                spanElement.innerHTML = EYE_EMOJI;
                spanElement.title = result.length;
                divElement.appendChild(spanElement);
            }

            addLanguage(repository.language, divElement);
            addCloneButton(repository, divElement);

            repositoriesList.appendChild(divElement);
        });
    }
    
    loaderDiv.style.display = 'none';
    searchButton.innerHTML = 'Search Again?';
}

function addStarToRepository(repository, divElement) {

    if (!repository.stargazers_count) {
        return;
    }

    let stars = document.createElement('a');
    stars.href = repository.html_url + '/stargazers';
    stars.target = LINK_TARGET_BLANK;
    stars.innerHTML = STAR_EMOJI;
    stars.title = repository.stargazers_count;
    divElement.appendChild(stars);
}

function addForkToRepository(repository, divElement) {
    let forks = document.createElement('span');
    forks.innerHTML = FORK_EMOJI;
    forks.title = repository.forks_count;
    divElement.appendChild(forks);
}

function addLanguage(language, divElement) {
    if (!language) {
        return;
    }

    language = language === 'JavaScript' ? 'JS' : language;

    let languageElement = document.createElement('span');
    languageElement.innerHTML = language;
    languageElement.classList.add(CODING_LANGUAGE_CSS_CLASS);

    language = language.replace(/\s/g, ''); //To erase space between coding languages with two words
    
    language = handleSpecialCSSClasses(language);

    if (hasCssRule(language)) {
        languageElement.classList.add(language);
    } else {
        languageElement.classList.add('default');
    }

    divElement.appendChild(languageElement);
}

function addCloneButton(repository, divElement) {
    let cloneElement = document.createElement('button');
    cloneElement.innerHTML = 'Clone';
    cloneElement.setAttribute('data-toggle', "tooltip");
    cloneElement.setAttribute('data-placement', "right");
    cloneElement.title = "Copy to Clipboard";

    cloneElement.classList.add('clone');

    cloneElement.addEventListener('click', function() {
        let element = document.createElement('textarea');
        document.body.appendChild(element);
        element.value = repository.clone_url;
        element.select();
        element.setSelectionRange(0, 99999);
        document.execCommand("copy");
        document.body.removeChild(element);
        this.title = 'Copied!';
    });
    
    divElement.appendChild(cloneElement);
}

function addForkIcon(repository, divElement) {

    if (repository['forks'] == 0) {
        return;
    }

    let spanElement = document.createElement('span');
    spanElement.innerHTML = FORK_EMOJI;
    spanElement.title = repository['forks'];
    divElement.appendChild(spanElement);
}

function getAmountOfWatchers(repository) {

    if (!repository || !repository['subscribers_url']) {
        return;
    }

    let watchersUrl = repository['subscribers_url'];

    return fetchDataFromUrl(watchersUrl);
}
