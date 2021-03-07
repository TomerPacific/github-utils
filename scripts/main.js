
const LINK_TARGET_BLANK = "_blank";
const STAR_EMOJI = '&#11088;';
const FORK_EMOJI = '&#127860;';
const EYE_EMOJI = '&#x1F441;';
const FOLLOWERS_EMOJI = '&#127939;';
const FOLLOWING_EMOJI = '&#128373;';

const ENTER_KEY_CODE = 13;
const CODING_LANGUAGE_CSS_CLASS = 'coding-language';

const REPOSITORY_ICONS = {
    'forks_count': FORK_EMOJI,
    'watchers': EYE_EMOJI
};

let usernameInput = document.getElementById('username_input');
let repositoriesList = document.getElementById('repositories');
let searchButton = document.getElementById('github_user_btn');
let loaderDiv = document.getElementById('loader');
let userProfileDiv = document.getElementById('user-profile');

function setupInputListener() {
    usernameInput.addEventListener("keyup", function(event) {
        if (event.keyCode === ENTER_KEY_CODE) {
            event.preventDefault();
            userProfileDiv.innerHTML = '';
            loaderDiv.style.display = 'block';
            while(repositoriesList.firstChild) {
                repositoriesList.removeChild(repositoriesList.firstChild);
            }
            let username = usernameInput.value;
            getUserRepositoriesData(username);
        }
    });
}

function getUserRepositoriesData(username) {
    fetchUserRepositories(username).then(function(repositories) {
        if (repositories.length === 0) {
            addUserNotFoundIndication(username);
            loaderDiv.style.display = 'none';
            searchButton.innerHTML = 'Search Again?';
            return;
        }
        parseUserData(repositories[0].owner);
        parseRepositories(repositories);
    });
}

function addUserNotFoundIndication(username) {
    let paragraphElement = document.createElement('p');
    paragraphElement.innerHTML = "User " + username + " has not been found";
    repositoriesList.appendChild(paragraphElement);
}

function parseUserData(userData) {
    let followersPromise = fetchDataFromUrl(userData.followers_url);
    let followingUrl = extractFollowingUrl(userData.following_url);
    let followingPromise = fetchDataFromUrl(followingUrl);

    Promise.all([followersPromise, followingPromise]).then(function(results) {
        setUserData(userData);
        for(let index = 0; index < results.length; index++) {
            let result = results[index];
            if (index === 0) { //Followers
                let followersSpan = document.createElement('span');
                followersSpan.innerHTML =  FOLLOWERS_EMOJI + result.length;
                followersSpan.title = 'Followers';
                userProfileDiv.appendChild(followersSpan);
            } else if (index === 1) { //Following
                let followingSpan = document.createElement('span');
                followingSpan.innerHTML =  FOLLOWING_EMOJI + result.length;
                followingSpan.title = 'Following';
                userProfileDiv.appendChild(followingSpan);
            }
        }
    }).catch(function(error) {
        console.error("Something went wrong with fetching data " + error);
    });
}

function setUserData(userData) {
    let userProfileAvatar = document.createElement('img');
    userProfileAvatar.src = userData.avatar_url;
    userProfileAvatar.setAttribute('id', 'user-profile-avatar');
    let userProfileLink = document.createElement('a');
    userProfileLink.href = userData.html_url;
    userProfileLink.target = LINK_TARGET_BLANK;
    userProfileLink.appendChild(userProfileAvatar);
    userProfileDiv.appendChild(userProfileLink);
}

function extractFollowingUrl(url) {
    let curlyBracketIndex = url.indexOf("{");
    return url.substring(0, curlyBracketIndex);
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
