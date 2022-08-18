
const LINK_TARGET_BLANK = "_blank";
const STAR_EMOJI = '&#11088;';
const FORK_EMOJI = '&#127860;';
const EYE_EMOJI = '&#x1F441;';
const FOLLOWERS_EMOJI = '&#127939;';
const FOLLOWING_EMOJI = '&#128373;';

const ENTER_KEY_CODE = 13;
const CODING_LANGUAGE_CSS_CLASS = 'coding-language';

let usernameInput = document.getElementById('username_input');
let repositoriesList = document.getElementById('repositories');
let searchButton = document.getElementById('github_user_btn');
let loaderDiv = document.getElementById('loader');
let userProfileDiv = document.getElementById('user-profile');

let totalAmountOfFollowers = 0;

function setupInputListener() {
    usernameInput.addEventListener("keyup", function(event) {
        if (event.keyCode === ENTER_KEY_CODE) {
            event.preventDefault();
            searchForUserDetails();
        }
    });

    searchButton.addEventListener("click", function(event) {
        event.preventDefault();
        searchForUserDetails();
    });
}

function searchForUserDetails() {
    userProfileDiv.innerHTML = '';
    loaderDiv.style.display = 'block';
    while(repositoriesList.firstChild) {
        repositoriesList.removeChild(repositoriesList.firstChild);
    }
    let username = usernameInput.value;
    getUserRepositoriesData(username);
}

function getUserRepositoriesData(username) {
    fetchUserRepositories(username).then(function(repositories) {
        if (repositories.length === 0) {
            addUserNotFoundIndication(username);
            loaderDiv.style.display = 'none';
            searchButton.innerHTML = 'Search Again?';
            return;
        }
        fetchFollowers(repositories[0].owner, 1);
        parseRepositories(repositories);
    });
}

function addUserNotFoundIndication(username) {
    let paragraphElement = document.createElement('p');
    paragraphElement.innerHTML = "User " + username + " has not been found";
    repositoriesList.appendChild(paragraphElement);
}

function fetchFollowing(userData) {
    let followingUrl = extractFollowingUrl(userData.following_url);
    fetchDataFromUrl(followingUrl).then(function(result) {
        let followingSpan = document.createElement('span');
        followingSpan.innerHTML =  FOLLOWING_EMOJI + result.length;
        followingSpan.title = 'Following';
        userProfileDiv.appendChild(followingSpan);
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

function fetchFollowers(userData, pageNumber) {
    let urlWithQueryParameters = userData.followers_url + "?per_page=100&page=" + pageNumber;
    fetchDataFromUrl(urlWithQueryParameters).then(function(result) {
        if (result.length == 0) {
            let followersSpan = document.createElement('span');
            followersSpan.innerHTML =  FOLLOWERS_EMOJI + totalAmountOfFollowers;
            followersSpan.title = 'Followers';
            userProfileDiv.appendChild(followersSpan);
            fetchFollowing(userData);
        } else {
            totalAmountOfFollowers+= result.length;
            return fetchFollowers(userData, ++pageNumber);
        }
    }).catch(function(error) {
        console.error("Something went wrong with fetching data " + error);
    })
}

setupInputListener();
