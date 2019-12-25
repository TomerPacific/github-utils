
const GITHUB_REPOSITORIES_URL = "https://api.github.com/users/"
const GET_REQUEST = "GET";
const READY_STATE_OK = 4;
const RESPONSE_STATUS_OK = 200;
let request = null;

let usernameInput = document.getElementById('username_input');
let repositoriesList = document.getElementById('repositories');

//name
//html_url
//description
//stargazers_url

function fetchUserRepositories() {
    let username = usernameInput.value;
    request = new XMLHttpRequest();
    let url = GITHUB_REPOSITORIES_URL + username + '/repos?per_page=100';
    request.open(GET_REQUEST, url);
    request.send(null);

    request.onreadystatechange = function() {
        if (this.readyState === READY_STATE_OK && this.status === RESPONSE_STATUS_OK) {
            let repositories = JSON.parse(this.responseText);
            for (let index = 0; index < repositories.length; index++) {
                let repository = repositories[index];
                let liElement = document.createElement('li');
                liElement.innerHTML = repository.name + ' | ' + repository.description;
                repositoriesList.appendChild(liElement);
            }
        }
    }
}