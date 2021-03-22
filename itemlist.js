const fs = require('fs')
const axios = require('axios')

let InGameNames = [];
let ItemCodes = [];
let ItemCollection = {};
let TieredItemIndexes = [];

axios.get('https://raw.githubusercontent.com/broderickhyman/ao-bin-dumps/master/formatted/items.json').then( res => {
    
    let element = res.data

    element.forEach(item => {
        if (item.LocalizedNames !== null){
          InGameNames.push(item.LocalizedNames['EN-US'].toLowerCase());
          ItemCodes.push(item.UniqueName);          
        } 
    });

    let enchanted_items = ItemCodes.filter(item_code => item_code[item_code.length-2] === '@')
        
    enchanted_items.forEach(tiered_item =>{
        TieredItemIndexes.push(ItemCodes.indexOf(tiered_item))
    })
    TieredItemIndexes.forEach(index => {
        InGameNames[index] = InGameNames[index] + ` ${ItemCodes[index].charAt(ItemCodes[index].length-1)}`
    })
    for ( i = 0 ; i<InGameNames.length; i++){
        ItemCollection[InGameNames[i]] = ItemCodes[i]
    }
    
   var json = JSON.stringify(ItemCollection)
    fs.writeFile('ItemList.json', json, 'utf8', function(err) {
        if (err) throw err;
        console.log('complete');
    });
});


