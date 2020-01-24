
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
        addIconsToRepository(repository, divElement);
        addLanguage(repository.language, divElement);
        addCloneButton(repository, divElement);

        repositoriesList.appendChild(divElement);
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

function addWatchersIcon(repository, divElement) {

    if (!repository.watchers) {
        return;
    }

    let watchersElement = document.createElement('span');
    watchersElement.innerHTML = EYE_EMOJI;
    watchersElement.title = repository.watchers;
    divElement.appendChild(watchersElement);
}

function addIconsToRepository(repository, divElement) {
   for(let icon in REPOSITORY_ICONS) {
      if (!repository[icon]) {
          continue;
      }

    let spanElement = document.createElement('span');
    spanElement.innerHTML = REPOSITORY_ICONS[icon];
    spanElement.title = repository[icon];
    divElement.appendChild(spanElement);
   }
}


setupInputListener();
