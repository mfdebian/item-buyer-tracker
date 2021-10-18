import { firebaseInit } from './firebase.js'

firebaseInit();
const rootDiv = document.getElementById("root");


const search = (itemsArray) => {
  
  let searchBar = document.createElement("input");
  searchBar.type = "text";
  searchBar.placeholder = "Type your item here"

  let searchResultsDiv = document.createElement("p");

  let searchButton = document.createElement("button");
  searchButton.textContent = "Search"

  searchButton.addEventListener("click", () => {
    searchResultsDiv.textContent = "";
    let searchInput = searchBar.value.toLowerCase();
    let searchResults = getItems(itemsArray, searchInput);
    printItemsInDom(searchResultsDiv, searchResults);


  }, false);

  rootDiv.appendChild(searchBar);
  rootDiv.appendChild(searchButton);
  rootDiv.appendChild(searchResultsDiv);
}

 const getItems = (itemsArray, searchInput) => {
  let searchResults = itemsArray.filter(item =>
    Object.keys(item).some(key => item.name.toLowerCase().includes(searchInput)));

   return searchResults;
 }


fetch('./data/items.json')
.then(response => response.json())
.then(data => {
  search(data.items);
  processData(data.items);
})
.catch(err => {
  console.log(err);
});


const processData = (itemsArray) => {
  let uniqueBuyersInData = [...new Set(itemsArray.map(item => item.buyer))];
  uniqueBuyersInData = uniqueBuyersInData.sort();

  uniqueBuyersInData.forEach(buyer => {

    let itemsArrayByBuyer = itemsArray.filter(item => item.buyer === buyer);
    itemsArrayByBuyer = itemsArrayByBuyer.sort((item, nextItem) => {
      return (item.name > nextItem.name) ? 1 : ((nextItem.name > item.name) ? -1 : 0);
    });

    printItemsInDom(rootDiv, itemsArrayByBuyer);
  });
}

const printItemsInDom = (container, items) => {
  
  items.forEach((item, index) => {
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

}
