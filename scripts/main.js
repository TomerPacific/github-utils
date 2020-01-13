
const LINK_TARGET_BLANK = "_blank";
const STAR_EMOJI = '&#11088;';
const FORK_EMOJI = '&#127860;';
const EYE_EMOJI = '&#x1F441;';
const ENTER_KEY_CODE = 13;
const CODING_LANGUAGE_CSS_CLASS = 'coding-language';

let usernameInput = document.getElementById('username_input');
let repositoriesList = document.getElementById('repositories');
let searchButton = document.getElementById('github_user_btn');

function setupInputListener() {
    usernameInput.addEventListener("keyup", function(event) {
        if (event.keyCode === ENTER_KEY_CODE) {
            event.preventDefault();

            while(repositoriesList.firstChild) {
                repositoriesList.removeChild(repositoriesList.firstChild);
            }
            let username = usernameInput.value;
            fetchUserRepositories(username).then(function(repositories) {
                if (repositories.length === 0) {
                    addUserNotFoundIndication(username);
                    searchButton.innerHTML = 'Search Again?';
                    return;
                }
                
                parseRepositories(repositories);
            });
        }
    });
}

function addUserNotFoundIndication(username) {
    let divElement = document.createElement('div');
    let liElement = document.createElement('li');
    liElement.innerHTML = "User " + username + " has not been found";
    divElement.appendChild(liElement);
    repositoriesList.appendChild(divElement);
}

function parseRepositories(repositories) {

    for (let index = 0; index < repositories.length; index++) {
        let repository = repositories[index];
        let anchorElement = document.createElement('a');
        let liElement = document.createElement('li');
        let divElement = document.createElement('div');

        //Repository Name
        anchorElement.href = repository.html_url;
        anchorElement.target = LINK_TARGET_BLANK;
        anchorElement.innerHTML = repository.name;
        anchorElement.title = repository.description;
        divElement.appendChild(anchorElement);

        addLanguage(repository.language, divElement);
        addCloneButton(repository, divElement);
        addWatchersIcon(repository, divElement);

        //Repository Stars
        if (repository.stargazers_count) {
            addStarToRepository(repository, divElement);
        }

        //Repository Forks
        if (repository.forks_count) {
            addForkToRepository(repository, divElement);
        }

        liElement.appendChild(divElement);
        repositoriesList.appendChild(liElement);
    }
}

function addStarToRepository(repository, divElement) {
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
    languageElement.classList.add(language);
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

function addWatchersIcon(repository, divElement) {

    if (!repository.watchers) {
        return;
    }

    let watchersElement = document.createElement('span');
    watchersElement.innerHTML = EYE_EMOJI;
    watchersElement.title = repository.watchers;
    divElement.appendChild(watchersElement);
}


setupInputListener();
