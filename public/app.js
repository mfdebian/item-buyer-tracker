import { firebaseInit } from './firebase.js'

firebaseInit();
const rootDiv = document.getElementById("root");

fetch('./data/items.json')
  .then(response => response.json())
  .then(data => {
    headerSection();
    searchSection(data.items);
    subHeaderSection();
    let items = processData(data.items);
    printItemsInDom(rootDiv, items);
  })
  .catch(err => {
    console.log(err);
  });

  const headerSection = () => {
    let header = document.createElement("div");
    header.setAttribute("class", "header");
    header.textContent = "Item Buyers";
    rootDiv.appendChild(header);
  }

  const subHeaderSection = () => {
    let subHeader = document.createElement("div");
    subHeader.setAttribute("class", "subHeader");
    subHeader.textContent = "All items:";
    rootDiv.appendChild(subHeader);
  }

/* 
  searchSection() creates the search bar, the search button
  and the search results div. It attaches events that'll trigger
  the search function.
*/
const searchSection = (itemsArray) => {
  let searchResultsDiv = document.createElement("div");

  let searchBarDiv = document.createElement("div");
  searchBarDiv.setAttribute("class", "searchBarContainer");

  let searchBar = document.createElement("input");
  searchBar.type = "text";
  searchBar.setAttribute("class", "searchBar");
  searchBar.placeholder = "Type to search";
  
  searchBarDiv.appendChild(searchBar);
  rootDiv.appendChild(searchBarDiv);
  rootDiv.appendChild(searchResultsDiv);
  
  searchBar.addEventListener("keydown", (event) => {
    if(event.key === "Enter") {
      search();
    }
  }, false);
  
  searchBar.addEventListener("keyup", (event) => {
    if (!/[!^+%&/()=?_\-~`;#$½{[\]}\\|<>@,]/gi.test(event.key)) {
      search();
    }
  }, false);

  /*
    search() filters the items by the user's input.
    Then calls the function to process the data and 
    lastly the function to display it.
  */
  const search = () => {
    let searchResultsText = document.createElement("span");
    searchResultsText.setAttribute("class", "searchResultsText");
    searchResultsText.textContent = "Search results:";
    
    searchResultsDiv.textContent = "";
    searchResultsDiv.setAttribute("class", "searchResultsDiv");
    searchResultsDiv.appendChild(searchResultsText);
    let searchInput = searchBar.value.toLowerCase();
    
    if(searchInput.length === 0) {
      searchResultsDiv.textContent = "";
      searchResultsDiv.classList.remove("searchResultsDiv");
    } else {
      let searchResults = itemsArray.filter(item =>
        Object.keys(item).some(() => item.name.toLowerCase().includes(searchInput)));
        
      let items = processData(searchResults);
        
      if(items && Object.keys(items).length === 0 && Object.getPrototypeOf(items) === Object.prototype) {
        searchResultsText.setAttribute("class", "searchResultsTextEmpty");
        searchResultsText.textContent += ' Empty.'
      }

      printItemsInDom(searchResultsDiv, items);
    }
  }
}

/*
  processData() will receive an items' array and return
  an items object in which every key will be a buyer and
  it's corresponding items will be the values.
*/
const processData = (itemsArray) => {
  itemsArray = itemsArray.sort((item, nextItem) => {
    return (item.name > nextItem.name) ? 1 : ((nextItem.name > item.name) ? -1 : 0);
  });

  return itemsArray.reduce((acc, currentValue) => {
    let key = currentValue['buyer'];
    acc[key] ? null : acc[key] = [];
    acc[key].push(currentValue)
    return acc
  }, {})

}

/*
  printItemsInDom() will receive the container in which
  to display data and the item's object to display
  data by buyer.
*/
const printItemsInDom = (container, itemsObject) => {

  let buyers = Object.keys(itemsObject);
  buyers = buyers.sort();

  buyers.forEach(buyer => {
    itemsObject[buyer].forEach((item, index) => {
      if(index === 0) {
        container.appendChild(document.createElement("hr"));
  
        let buyer = document.createElement("span");
        buyer.textContent = item.buyer;
        buyer.setAttribute("class", "buyer");
  
        container.appendChild(buyer);
        container.appendChild(document.createElement("br"));
      }
      
      let name = document.createElement("span");
      name.setAttribute("class", "name");
      name.textContent = item.name;
      container.appendChild(name);
      
      let value = document.createElement("span");
      value.setAttribute("class", "value");
      value.textContent = item.value + "k";
      container.appendChild(value);
  
      container.appendChild(document.createElement("br"));
    });
  });
}
