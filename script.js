
const GITHUB_REPOSITORIES_URL = "https://api.github.com/users/"
const GET_REQUEST = "GET";
const LINK_TARGET_BLANK = "_blank";
const READY_STATE_OK = 4;
const RESPONSE_STATUS_OK = 200;
const ENTER_KEY_CODE = 13;
let request = null;

let usernameInput = document.getElementById('username_input');
let repositoriesList = document.getElementById('repositories');

function setupInputListener() {
    usernameInput.addEventListener("keyup", function(event) {
        if (event.keyCode === ENTER_KEY_CODE) {
            event.preventDefault();
            fetchUserRepositories();
        }
    });
}


function parseRepositories(repositories) {

    for (let index = 0; index < repositories.length; index++) {
        let repository = repositories[index];
        let liElement = document.createElement('li');
        let anchorElement = document.createElement('a');
        let divElement = document.createElement('div');

        //Repository Name
        anchorElement.href = repository.html_url;
        anchorElement.target = LINK_TARGET_BLANK;
        anchorElement.innerHTML = repository.name;
        anchorElement.title = repository.description;
        divElement.appendChild(anchorElement);

        //Repository Stars
        fetchStargazers(repository.stargazers_url, addStarToRepository.bind(null, repository, divElement));

        fetchForks(repository.forks_url, addForkToRepository.bind(null, divElement));
        
        liElement.appendChild(divElement);
        repositoriesList.appendChild(liElement);
    }
}


function fetchUserRepositories() {
    let username = usernameInput.value;
    request = new XMLHttpRequest();
    let url = GITHUB_REPOSITORIES_URL + username + '/repos?per_page=100';
    request.open(GET_REQUEST, url);
    request.send(null);

    request.onreadystatechange = function() {
        if (this.readyState === READY_STATE_OK && this.status === RESPONSE_STATUS_OK) {
            let repositories = JSON.parse(this.responseText);
            parseRepositories(repositories);
        }
    }
}

function addStarToRepository(repository, divElement) {
    let stars = document.createElement('a');
    stars.href = repository.html_url + '/stargazers';
    stars.target = LINK_TARGET_BLANK;
    stars.innerHTML = '&#11088;';
    divElement.appendChild(stars);
}

function fetchStargazers(stargazers_url, successCallback) {
    request = new XMLHttpRequest();
    request.open(GET_REQUEST, stargazers_url);
    request.send(null);

    request.onreadystatechange = function() {
        if (this.readyState === READY_STATE_OK && this.status === RESPONSE_STATUS_OK) {
            let stargazers = JSON.parse(this.responseText);
            if (stargazers.length) {
                successCallback();
            }
        }
    }
}

function addForkToRepository(divElement) {
    let forks = document.createElement('a');
    forks.href = '#';
    forks.target = LINK_TARGET_BLANK;
    forks.innerHTML = '&#127860;';
    divElement.appendChild(forks);
}

function fetchForks(forks_url, successCallback) {
    request = new XMLHttpRequest();
    request.open(GET_REQUEST, forks_url);
    request.send(null);

    request.onreadystatechange = function() {
        if (this.readyState === READY_STATE_OK && this.status === RESPONSE_STATUS_OK) {
            let forks = JSON.parse(this.responseText);
            if (forks.length) {
                successCallback();
            }
        }
    }
}


setupInputListener();
