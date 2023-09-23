function setFlashMessageFadeOut(flashMessageElement) {
  setTimeout(() => {
    let currentOpacity = 1.0;
    let timer = setInterval(() => {
      if (currentOpacity < 0.05) {
        clearInterval(timer);
        flashMessageElement.remove();
      }
      currentOpacity = currentOpacity - 0.05;
      flashMessageElement.style.opacity = currentOpacity;
    }, 50);
  }, 4000);
}

function addFlashFromFrontEnd(message) {
  let flashMessageDiv = document.createElement("div");
  let innerFlashDiv = document.createElement("div");
  innerTextNode = document.createTextNode(message);
  innerFlashDiv.appendChild(innerTextNode);
  flashMessageDiv.appendChild(innerFlashDiv);
  flashMessageDiv.setAttribute("id", "flash-message");
  innerFlashDiv.setAttribute("class", "alert alert-info");
  document.getElementsByTagName("body")[0], appendChild(flashMessageDiv);
}

function createCard(postData) {
  return `<div id="post-${postData.id}" class="card">
        <div class="card-body">
        <p class="card-title">${postData.title}</p>
        <p class="card-text">${postData.description}</p>
        <a href="/journal/${postData.id}" class="anchor-buttons">View Post</a>
    </div>
</div>`;
}

function executeSearch() {
  successPrint("yay");
  let searchTerm = document.getElementById("search-text").value;
  console.log(searchTerm);
  if (!searchTerm) {
    location.replace("/");
    return;
  }
  let mainContent = document.getElementById("mids-photos");
  let searchURL = `/music/search?search=${searchTerm}`;
  fetch(searchURL)
    .then((data) => {
      return data.json();
    })
    .then((data_json) => {
      let newMainContentHTML = "";
      data_json.results.forEach((row) => {
        newMainContentHTML += createCard(row);
      });
      mainContent.innerHTML = newMainContentHTML;
      if (data_json.message) {
        addFlashFromFrontEnd(data_json.message);
      }
    })
    .catch((err) => console.log(err));
}

let flashElement = document.getElementById("flash-message");
if (flashElement) {
  setFlashMessageFadeOut(flashElement);
}

let searchButton = document.getElementById("search-button");
if (searchButton) {
  searchButton.onclick = executeSearch;
}

$(document).ready(function() {
  $(window).keydown(function(event){
    if(event.keyCode == 13) {
      event.preventDefault();
      return false;
    }
  });
});