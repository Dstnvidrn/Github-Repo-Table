let combined = [];
let sortedNames = [];
let sortedIds = [];
let urlArray = [];
const tableBody = document.querySelector("#table-body");
const table = document.querySelector("table");
const tableHeadings = document.querySelectorAll(".table-heading");
const blurOverlay = document.querySelector("#overlay");
const loader = document.querySelector("#loader");
const submitButton = document.querySelector(".btn--submit");
const searchBar = document.querySelector(".search-bar");
const searchForm = document.querySelector("#search-form");
const errorMessage = document.querySelector('#error-message');

searchBar.addEventListener("keyup", () => {
  if (searchBar.value && !searchBar.value.startsWith(" ")) {
    submitButton.removeAttribute("disabled");
  } else {
    submitButton.setAttribute("disabled", "disabled");
  }
});

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  tableBody.innerHTML = "";
  combined = [];
  getRepos(searchBar.value);
});

tableHeadings.forEach((heading) => {
  heading.addEventListener("click", (e) => {
    if (e.currentTarget.id === "heading-name") {
      sortTable("name");
    } else if (e.currentTarget.id === "heading-id") {
      sortTable("id");
    }
  });
});

function getRepos(user) {
  fetch(`https://api.github.com/users/${user}/repos`)
    .then((response) => {
      blurOverlay.classList.add("overlay");
      loader.classList.add("loader");
      if (!response.ok) {        
        errorMessage.textContent = `Profile "${user}" was not found.`
        errorMessage.classList.add('fade');
        errorMessage.classList.remove('hidden')
        throw new Error(`Profile ${user} not found`);     
      }
      errorMessage.classList.remove('fade');
      errorMessage.classList.add('hidden');
      return response.json();
    })
    .then((data) => {
      if (!data) {
        throw new Error(`Profile ${user} not found`);
      }

      data.forEach((repo, index) => {
        populateCombinedArray(repo.name, repo.id, repo.html_url, index);
        buildTable(repo.name, repo.id, repo.html_url);
      });
    })
    .catch((error) => {
      console.error(error);
    })
    .finally(() => {
      setTimeout(() => {
        table.classList.remove("hidden");
        loader.classList.remove("loader");
        blurOverlay.classList.remove("overlay");
      }, 1200);
    });
}

function buildTable(name, id, link) {
  tableBody.insertAdjacentHTML(
    "beforeend",
    `
    <tr>
    <td>${name}</td>
    <td>${id}</td>
    <td><a href="${link}" class="btn" target="_blank">View</a></td>
    </tr>`
  );
}
let idsAscending = true;
let namesAscending = true;

function sortTable(sortBy = "name") {
  if (sortBy === "name") {
    tableBody.innerHTML = "";
    if (namesAscending) {
      addSortArrows(sortBy, namesAscending);
      combined.sort((a, b) =>
        a[0].toLowerCase() === b[0].toLowerCase()
          ? 0
          : a[0].toLowerCase() > b[0].toLowerCase()
          ? -1
          : 1
      );
      namesAscending = !namesAscending;
      sortCombined();
    } else {
      addSortArrows(sortBy, namesAscending);
      combined.sort((a, b) =>
        a[0].toLowerCase() === b[0].toLowerCase()
          ? 0
          : a[0].toLowerCase() < b[0].toLowerCase()
          ? -1
          : 1
      );
      namesAscending = !namesAscending;
      sortCombined();
    }
  } else if (sortBy === "id") {
    tableBody.innerHTML = "";
    if (idsAscending) {
      addSortArrows(sortBy, idsAscending);
      combined.sort((a, b) => a[1] - b[1]);
      idsAscending = !idsAscending;
    } else {
      addSortArrows(sortBy, idsAscending);
      combined.sort((a, b) => b[1] - a[1]);
      idsAscending = !idsAscending;
    }
    sortCombined(combined);
  }

  function sortCombined() {
    sortedIds = [];
    sortedNames = [];
    urlArray = [];
    combined.forEach((item, index) => {
      sortedNames.push(item[0]);
      sortedIds.push(item[1]);
      urlArray.push(item[2]);
      buildTable(sortedNames[index], sortedIds[index], urlArray[index]);
    });
  }
}
function populateCombinedArray(name, id, url) {
  combined.push([name, Number(id), url]);
}
function addSortArrows(sortby, isAscending) {
  if (sortby === "name" && isAscending) {
    document.querySelector("#heading-name").innerHTML = "Name &downarrow;";
    document.querySelector("#heading-id").textContent = "ID";
  } else if (sortby === "name" && !isAscending) {
    document.querySelector("#heading-name").innerHTML = "Name &uparrow;";
    document.querySelector("#heading-id").textContent = "ID";
  } else if (sortby === "id" && isAscending) {
    document.querySelector("#heading-id").innerHTML = "ID &uparrow;";
    document.querySelector("#heading-name").textContent = "Name";
  } else if (sortby === "id" && !isAscending) {
    document.querySelector("#heading-id").innerHTML = "ID &downarrow;";
    document.querySelector("#heading-name").textContent = "Name";
  }
}



