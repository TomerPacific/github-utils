
const GITHUB_REPOSITORIES_URL = "https://api.github.com/users/"
const GET_REQUEST = "GET";
const LINK_TARGET_BLANK = "_blank";
const READY_STATE_OK = 4;
const RESPONSE_STATUS_OK = 200;
let request = null;

let usernameInput = document.getElementById('username_input');
let repositoriesList = document.getElementById('repositories');

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
                let anchorElement = document.createElement('a');
                let stars = document.createElement('a');
                let divElement = document.createElement('div');

                //Repository Name
                anchorElement.href = repository.html_url;
                anchorElement.target = LINK_TARGET_BLANK;
                anchorElement.innerHTML = repository.name;

                //Repository Stars
                stars.href = repository.html_url + '/stargazers';
                stars.target = LINK_TARGET_BLANK;
                stars.innerHTML = '&#11088;';

                divElement.title = repository.description;

                divElement.appendChild(anchorElement);
                divElement.appendChild(stars);
                liElement.appendChild(divElement);
                repositoriesList.appendChild(liElement);
            }
        }
    }
}