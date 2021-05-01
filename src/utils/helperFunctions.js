const moment = require('moment')
const firebase = require('firebase')

exports.replaceString = function (string, searchString, replaceString) {
    return string.replace(searchString, replaceString);
}

exports.calculateSellTimeDiff = function (LastSellTime) {
    return moment(LastSellTime).fromNow()
}

exports.calculateBuyTimeDiff = function (LastBuyTime) {
    return moment(LastBuyTime).fromNow()
}

exports.getTimeDifference = function (currentTime, lastTime) {
    return moment.duration(currentTime.diff(lastTime));
}

exports.divideNumbersWithDot = function (number) {
    return number.toString().replace(/(\d)(?=(\d{3})+$)/g, '$1' + ".")
}

exports.saveAllSellPriceInfo = function (sellCityArray, sellPriceArray, sellTimeArray, city, quality, sellPrices, sellTimeDiffs) {
    return sellCityArray.push(city + ` (${quality})`) && sellPriceArray.push(sellPrices) && sellTimeArray.push(sellTimeDiffs)
}

exports.saveAllBuyPriceInfo = function (buyCityArray, buyPriceArray, buyTimeArray, city, quality, buyPrices, buyTimeDiffs) {
    return buyCityArray.push(city + ` (${quality})`) && buyPriceArray.push(buyPrices) && buyTimeArray.push(buyTimeDiffs)
}

exports.checkIfHasPriceCommand = function (string, priceCommand) {
    if (!string.startsWith(priceCommand)) {
        return;
    }
    else {
        string = string.replace(priceCommand, '')
        return string
    }
}

exports.checkIfHasTaxCommand = function (string, taxCommand) {
    if (!string.startsWith(taxCommand)) {
        return;
    }
    else {
        string = string.replace(taxCommand, '')
        return string
    }
}

exports.checkIfEnchanted = function (string) {
    if (string[2] !== '.') {
        return string;
    } else {
        let addedEnchant = string[3]
        string = string.replace(string[2] + addedEnchant, '')
        string = string + ` ${addedEnchant}`

        return string
    }

}

exports.removeDotsFromNumbers = function (number) {
    let numberWithoutDots = number.toString().split('.').join("");
    return numberWithoutDots
}

exports.getSilverToFameRatio = function (string) {
    let splitMessage = string.split(" ")
    let checkIfHasRatio = string.includes('to')
    let fameIndex = splitMessage.indexOf('to') - 1
    let silverIndex = splitMessage.indexOf('to') + 1
    let SilverToFameRatio;
    if (checkIfHasRatio) {
        SilverToFameRatio = splitMessage[silverIndex] / splitMessage[fameIndex]
        return SilverToFameRatio
    } else {
        return;
    }
}

exports.removeSilverToFameRatio = function (string) {
    let splitMessage = string.split(" ")
    let checkIfHasRatio = string.includes('to')
    let ratio;
    let fameIndex = splitMessage.indexOf('to') - 1
    let silverIndex = splitMessage.indexOf('to') + 1
    if (checkIfHasRatio) {
        ratio = ' ' + splitMessage[fameIndex] + ' ' + splitMessage[splitMessage.indexOf('to')] + ' ' + splitMessage[silverIndex]
        string = string.replace(ratio, '')
        return string
    } else {
        return string;
    }

}

exports.getBottomLimit = function (string){
    let splitMessage = string.toUpperCase().split(" ")
    let HasLimit;
    if (string.toUpperCase().includes('K')){
        HasLimit = true;
    } else if (string.toUpperCase().includes('M')){
        HasLimit = true;
    } else {
        HasLimit = false;
    }
    let limitIndex = splitMessage.indexOf(splitMessage[splitMessage.length-1])
    let limit;
    if (HasLimit){
        limit = splitMessage[limitIndex]
        return limit
    } else {
        return;
    }
}

exports.nFormatter = function (num, digits) {
    var si = [
        { value: 1, symbol: "" },
        { value: 1E3, symbol: "k" },
        { value: 1E6, symbol: "M" },
        { value: 1E9, symbol: "G" },
        { value: 1E12, symbol: "T" },
        { value: 1E15, symbol: "P" },
        { value: 1E18, symbol: "E" }
    ];
    var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    var i;
    for (i = si.length - 1; i > 0; i--) {
        if (num >= si[i].value) {
            break;
        }
    }
    return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
}

removeMarks = function(string){
    string = string.replace(/['"]+/g, '')
    string = string.replace('\r', '')
    return string
}

parseByTag = function(array){
    array = array.split('\t')
    let newArray = []
    array.forEach(string => {
        string = removeMarks(string)
        newArray.push(string)
    })
    return newArray
}

exports.finalFormat = function(array){
    let newArray = [];
    array.forEach(arr => {
        arr = parseByTag(arr)
        newArray.push(arr)
    })
    return newArray
}

exports.initFireBase = function (){
    let config = {
        apiKey: process.env.apiKey,
        authDomain: process.env.authDomain,
        databaseURL: process.env.databaseURL,
        projectId: process.env.projectId,
        storageBucket: process.env.storageBucket,
        messagingSenderId: process.env.messagingSenderId,
        appId: process.env.appId,
        measurementId: process.env.measurementId
    }

    if (firebase.app.length === 0){
        return firebase.initializeApp(config)
    }
}