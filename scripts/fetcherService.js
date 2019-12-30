const GITHUB_REPOSITORIES_URL = "https://api.github.com/users/"
const GET_REQUEST = "GET";

const READY_STATE_OK = 4;
const RESPONSE_STATUS_OK = 200;
const RESPONSE_STATUS_NOT_FOUND = 404;

let request = null;

function fetchUserRepositories(username) {
    request = new XMLHttpRequest();
    let url = GITHUB_REPOSITORIES_URL + username + '/repos?per_page=100';
    request.open(GET_REQUEST, url);
    try {
        request.send(null);
    } catch(exception) {
        console.error(exception);
    }
    

    return new Promise(function(resolve, reject) {
        request.onreadystatechange = function() {
            if (this.readyState === READY_STATE_OK && this.status === RESPONSE_STATUS_OK) {
                let repositories = JSON.parse(this.responseText);
                resolve(repositories);
            } else if (this.readyState === READY_STATE_OK && this.status === RESPONSE_STATUS_NOT_FOUND) {
                resolve([]);
            }
        }
    });
    
}
