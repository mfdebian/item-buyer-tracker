import { firebaseInit } from './firebase.js'

firebaseInit();

fetch('./data/items.json')
  .then(response => response.json())
  .then(data => {
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

    printItemsInDom(itemsArrayByBuyer);
  });
}

const printItemsInDom = (items) => {
  let rootDiv = document.getElementById("root");
  
  items.forEach((item, index) => {
    if(index === 0) {
      rootDiv.appendChild(document.createElement("hr"));

      let buyer = document.createElement("span");
      buyer.textContent = item.buyer;
      buyer.setAttribute("class", "buyer");

      rootDiv.appendChild(buyer);
      rootDiv.appendChild(document.createElement("br"));
    }
    
    let name = document.createElement("span");
    name.setAttribute("class", "name");
    name.textContent = item.name;
    rootDiv.appendChild(name);
    
    let value = document.createElement("span");
    value.setAttribute("class", "value");
    value.textContent = item.value + "k";
    rootDiv.appendChild(value);

    rootDiv.appendChild(document.createElement("br"));
  });

}
