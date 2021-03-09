const fs = require('fs')
const axios = require('axios')
const didyoumean = require('didyoumean')

let InGameNames = [];
let ItemCodes = [];
let ItemCollection = {};
let TieredItemIndexes = [];
let fullJournalsIndexes = []
let emptyJournalsIndexes = []
let partiallyFullJournalsIndexes = []
let adeptsEmptyIndexes = []
let adeptsFullIndexes = []
let adeptsPartiallyFullIndexes = []
let eldersEmptyIndexes = []
let eldersFullIndexes = []
let eldersPartiallyFullIndexes = []

let tierList = ["novice's", "journeyman's", "expert's", "master's", "grandmaster's"]

axios.get('https://raw.githubusercontent.com/broderickhyman/ao-bin-dumps/master/formatted/items.json').then(res => {

    let element = res.data

    element.forEach(item => {
        if (item.LocalizedNames !== null) {
            InGameNames.push(item.LocalizedNames['EN-US'].toLowerCase());
            ItemCodes.push(item.UniqueName);
        }
    });

    let enchanted_items = ItemCodes.filter(item_code => item_code[item_code.length - 2] === '@')
    let fullJournals = InGameNames.filter(item_name => item_name.split(" ").reverse()[0] == '(full)')
    let emptyJournals = InGameNames.filter(item_name => item_name.split(" ").reverse()[0] == '(empty)')
    let partiallyFullJournals = InGameNames.filter(item_name => item_name.split(" ").reverse()[0] == '(partially full)')
    let adeptsFull = InGameNames.filter(item_name => item_name.split(" ").reverse()[0] == '(full)' && item_name.split(" ")[0] == 'adept')
    let eldersFull = InGameNames.filter(item_name => item_name.split(" ").reverse()[0] == '(full)' && item_name.split(" ")[0] == 'elder')
    let adeptsEmpty = InGameNames.filter(item_name => item_name.split(" ").reverse()[0] == '(empty)' && item_name.split(" ")[0] == 'adept')
    let eldersEmpty = InGameNames.filter(item_name => item_name.split(" ").reverse()[0] == '(empty)' && item_name.split(" ")[0] == 'elder')
    let adeptsPartiallyFull = InGameNames.filter(item_name => item_name.split(" ").reverse()[0] == '(partially full)' && item_name.split(" ")[0] == 'adept')
    let eldersPartiallyFull = InGameNames.filter(item_name => item_name.split(" ").reverse()[0] == '(partially full)' && item_name.split(" ")[0] == 'elder')

    enchanted_items.forEach(tiered_item => {
        TieredItemIndexes.push(ItemCodes.indexOf(tiered_item))
    })
    fullJournals.forEach(journal => {
        fullJournalsIndexes.push(InGameNames.indexOf(journal))
    })
    emptyJournals.forEach(journal => {
        emptyJournalsIndexes.push(InGameNames.indexOf(journal))
    })
    partiallyFullJournals.forEach(journal => {
        partiallyFullJournalsIndexes.push(InGameNames.indexOf(journal))
    })
    adeptsFull.forEach(journal => {
        adeptsFullIndexes.push(InGameNames.indexOf(journal))
    })
    adeptsEmpty.forEach(journal => {
        adeptsEmptyIndexes.push(InGameNames.indexOf(journal))
    })
    adeptsPartiallyFull.forEach(journal => {
        adeptsPartiallyFullIndexes.push(InGameNames.indexOf(journal))
    })
    eldersFull.forEach(journal => {
        eldersFullIndexes.push(InGameNames.indexOf(journal))
    })
    eldersEmpty.forEach(journal => {
        eldersEmptyIndexes.push(InGameNames.indexOf(journal))
    })
    eldersPartiallyFull.forEach(journal => {
        eldersPartiallyFullIndexes.push(InGameNames.indexOf(journal))
    })
    TieredItemIndexes.forEach(index => {
        InGameNames[index] = InGameNames[index] + ` ${ItemCodes[index].charAt(ItemCodes[index].length - 1)}`
    })
    fullJournalsIndexes.forEach(index => {
        let firstWordOfJournals = InGameNames[index].split(" ")[0];
        let correctFirstWord = didyoumean(firstWordOfJournals, tierList)
        if (correctFirstWord !== null) {
            InGameNames[index] = InGameNames[index].replace(firstWordOfJournals, correctFirstWord)
        }
    })
    emptyJournalsIndexes.forEach(index => {
        let firstWordOfJournals = InGameNames[index].split(" ")[0];
        let correctFirstWord = didyoumean(firstWordOfJournals, tierList)
        if (correctFirstWord !== null) {
            InGameNames[index] = InGameNames[index].replace(firstWordOfJournals, correctFirstWord)
        }
    })
    partiallyFullJournalsIndexes.forEach(index => {
        let firstWordOfJournals = InGameNames[index].split(" ")[0];
        let correctFirstWord = didyoumean(firstWordOfJournals, tierList)
        if (correctFirstWord !== null) {
            InGameNames[index] = InGameNames[index].replace(firstWordOfJournals, correctFirstWord)
        }
    })

    adeptsFullIndexes.forEach(index => {
        let firstWordOfJournals = InGameNames[index].split(" ")[0];
        InGameNames[index] = InGameNames[index].replace(firstWordOfJournals, "adept's")
    })
    adeptsEmptyIndexes.forEach(index => {
        let firstWordOfJournals = InGameNames[index].split(" ")[0];
        InGameNames[index] = InGameNames[index].replace(firstWordOfJournals, "adept's")
    })
    adeptsPartiallyFullIndexes.forEach(index => {
        let firstWordOfJournals = InGameNames[index].split(" ")[0];
        InGameNames[index] = InGameNames[index].replace(firstWordOfJournals, "adept's")
    })
    eldersFullIndexes.forEach(index => {
        let firstWordOfJournals = InGameNames[index].split(" ")[0];
        InGameNames[index] = InGameNames[index].replace(firstWordOfJournals, "elder's")
    })
    eldersEmptyIndexes.forEach(index => {
        let firstWordOfJournals = InGameNames[index].split(" ")[0];
        InGameNames[index] = InGameNames[index].replace(firstWordOfJournals, "elder's")
    })
    eldersPartiallyFullIndexes.forEach(index => {
        let firstWordOfJournals = InGameNames[index].split(" ")[0];
        InGameNames[index] = InGameNames[index].replace(firstWordOfJournals, "elder's")
    })


    for (i = 0; i < InGameNames.length; i++) {
        ItemCollection[InGameNames[i]] = ItemCodes[i]
    }

    var json = JSON.stringify(ItemCollection)
    fs.writeFile('ItemList.json', json, 'utf8', function (err) {
        if (err) throw err;
        console.log('complete');
    });
});