const moment = require('moment')

exports.replaceString = function (string, searchString, replaceString) {
    return string.replace(searchString, replaceString);
}

exports.calculateSellTimeDiff = function (LastSellTime) {
    return moment(LastSellTime).fromNow()
}

exports.calculateBuyTimeDiff = function (LastBuyTime) {
    return moment(LastBuyTime).fromNow()
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