
const GITHUB_REPOSITORIES_URL = "https://api.github.com/users/"
const GET_REQUEST = "GET";
const LINK_TARGET_BLANK = "_blank";
const STAR_EMOJI = '&#11088;';
const FORK_EMOJI = '&#127860;';
const READY_STATE_OK = 4;
const RESPONSE_STATUS_OK = 200;
const RESPONSE_STATUS_NOT_FOUND = 404;
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

function fetchUserRepositories() {
    let username = usernameInput.value;
    request = new XMLHttpRequest();
    let url = GITHUB_REPOSITORIES_URL + username + '/repos?per_page=100';
    request.open(GET_REQUEST, url);
    try {
        request.send(null);
    } catch(exception) {
        console.error(exception);
    }
    

    request.onreadystatechange = function() {
        if (this.readyState === READY_STATE_OK && this.status === RESPONSE_STATUS_OK) {

            while(repositoriesList.firstChild) {
                repositoriesList.removeChild(repositoriesList.firstChild);
            }

            let repositories = JSON.parse(this.responseText);
            parseRepositories(repositories);
        } else if (this.readyState === READY_STATE_OK && this.status === RESPONSE_STATUS_NOT_FOUND) {
            let divElement = document.createElement('div');
            let liElement = document.createElement('li');
            liElement.innerHTML = "User has not been found";
            divElement.appendChild(liElement);
            repositoriesList.appendChild(divElement);
        }
    }
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
        let stargazersPromise = fetchStargazers(repository.stargazers_url)
        
        //Repository Forks
        let forksPromise = fetchForks(repository.forks_url)
        
        Promise.all([stargazersPromise, forksPromise])
        .then(function(results) {
            for (let index = 0; index < results.length; index++) {
                let result = results[index];
                if (index % 2 === 0 && result > 0) {
                    addStarToRepository(repository, divElement);
                }

                if (index % 2 !== 0 && result > 0) {
                    addForkToRepository(repository, divElement);
                }

                liElement.appendChild(divElement);
                repositoriesList.appendChild(liElement);
            }
        })
        .catch(function(error) {
            console.error(error);
        });
    }
}

function fetchStargazers(stargazers_url) {
    request = new XMLHttpRequest();
    request.open(GET_REQUEST, stargazers_url);
    request.send(null);

    return new Promise(function(resolve, reject) {
        request.onreadystatechange = function() {
            if (this.readyState === READY_STATE_OK && this.status === RESPONSE_STATUS_OK) {
                let stargazers = JSON.parse(this.responseText);
                resolve(stargazers.length);
             }
        }
    });
}

function fetchForks(forks_url) {
    request = new XMLHttpRequest();
    request.open(GET_REQUEST, forks_url);
    request.send(null);

    return new Promise(function(resolve, reject) {
        request.onreadystatechange = function() {
            if (this.readyState === READY_STATE_OK && this.status === RESPONSE_STATUS_OK) {
                let forks = JSON.parse(this.responseText);
                resolve(forks.length);
            }
        }
    });
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


setupInputListener();
