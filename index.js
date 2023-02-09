const combined = [];
let sortedNames = [];
let sortedIds = [];
let urlArray = [];
const tableBody = document.querySelector('#table-body');
const table = document.querySelector('table');
const tableHeadings = document.querySelectorAll('.table-heading');
const blurOverlay = document.querySelector("#overlay");
const loader = document.querySelector('#loader');
const submitButton = document.querySelector('.btn--submit');
const searchBar = document.querySelector('.search-bar');
const searchForm = document.querySelector('#search-form')
searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    tableBody.innerHTML = '';
    getRepos(searchBar.value);
    table.classList.remove('hidden');
})

tableHeadings.forEach(heading => {
    heading.addEventListener('click', (e) => {    
    if(e.currentTarget.textContent === 'Name') {
        sortTable('name');       
    }else if (e.currentTarget.textContent === 'ID') {
        sortTable('id')
    } 
})
})

function getRepos(user) {    
    fetch(`https://api.github.com/users/${user}/repos`)
        .then(response => {
            blurOverlay.classList.add('overlay');
            loader.classList.add('loader');
            if(!response.ok){
                throw new Error("User Profile not found")    
            }
            return response.json()

        })
        .then(data => {
            if(!data){
                throw new Error("User Profile not found")    
            }
            
            data.forEach((repo,index) => {
            buildTable(repo.name, repo.id, repo.html_url);
            populateCombinedArray(repo.name,repo.id, repo.html_url,index);
           });
        }).catch(error => {

            console.error(error);
        }).finally( () => {
            setTimeout( () => {
                loader.classList.remove('loader');
                blurOverlay.classList.remove('overlay');

            },1200)
        })
}

function buildTable(name, id, link) {   
    tableBody.insertAdjacentHTML('beforeend',`
    <tr>
    <td>${name}</td>
    <td>${id}</td>
    <td><a href="${link}" class="btn">View</a></td>
    </tr>`
    );
}
let idsAscending = true;
let namesAscending = true;


function sortTable(sortBy='name') {
  
    if (sortBy === 'name') {
        
        tableBody.innerHTML = '';              
        if(namesAscending) {
            combined.sort((a,b) => a[0].toLowerCase() === b[0].toLowerCase() ? 0 : a[0].toLowerCase() > b[0].toLowerCase() ? -1 : 1);
            namesAscending = !namesAscending;
            sortCombined();
            console.log(combined)
        } else {
            combined.sort((a,b) => a[0].toLowerCase() === b[0].toLowerCase() ? 0 : a[0].toLowerCase() < b[0].toLowerCase() ? -1 : 1);
            namesAscending = !namesAscending;
            sortCombined();
            console.log(combined)
        }      

    } else if (sortBy === 'id') {
        tableBody.innerHTML = '';
        // populateCombinedArray();
        if(idsAscending) {
            combined.sort((a,b) => a[1] - b[1]);
            idsAscending = !idsAscending;
        } else {
            combined.sort((a,b) => b[1] - a[1]);
            idsAscending = !idsAscending;            
        }        
        sortCombined(combined);
    }   
    
    function sortCombined(){
        sortedIds = [];
        sortedNames = [];
        urlArray = []
        combined.forEach((item,index) => {
            sortedNames.push(item[0]);
            sortedIds.push(item[1]);
            urlArray.push(item[2])
            buildTable(sortedNames[index], sortedIds[index], urlArray[index])
        })        
    }    
}
function populateCombinedArray(name, id, url, index) {    
    combined.push([name,Number(id), url]);
}
function searchUserRepo() {

}
searchUserRepo();