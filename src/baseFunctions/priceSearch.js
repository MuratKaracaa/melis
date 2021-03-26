const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
var constants = require('../constants')
const helperFunctions = require('../utils').helperFunctions;
const API = require('../apis');
const didyoumean = require('didyoumean')
const { calculateSellTimeDiff, calculateBuyTimeDiff, saveSellPrices, divideNumbersWithDot } = require('../utils/helperFunctions');

exports.priceSearch = function (messageObj, priceCommand) {


    let message = messageObj.content;
    message = helperFunctions.checkIfHasPriceCommand(message, priceCommand) // see if the message has price command and remove it
    message = helperFunctions.checkIfEnchanted(message) // see if the user is looking for an echanted item and make the necessary formatting

    let SearchedItem = ''
    let ItemName = ''
    let sell_city_info = []
    let buy_city_info = []
    let sell_price_info = []
    let buy_price_info = []
    let sell_time_info = []
    let buy_time_info = []
    let first_word_of_message = message.split(" ")[0]
    let tierList = constants.tierList()

    Object.entries(tierList).forEach(tier => {
        if (tier[0] === first_word_of_message) {
            message = helperFunctions.replaceString(message, first_word_of_message, tier[1]);
        }
    }) // see if the user has used the in game name correctly or used a name commong among players t4 cleric etc


    fs.readFile('./ItemList.json', 'utf8', function (err, data) {
        if (err) throw err;

        let list = Object.keys(JSON.parse(data))
        let checkIfCorrectName = list.find(item => item === message)
        let correctName = didyoumean(message, list)
        let notNullReply = correctName !== null
        if (!notNullReply) {
            return messageObj.reply("Please search your items in the following format : !price t4.1 cleric robe/adept's cleric robe 1, if you are looking for raw materials, use the full in game name")
        } // basically warn the user to use a more understandable item name
        if (!checkIfCorrectName && notNullReply) {
            message = correctName
            messageObj.reply('I think you are looking for this')
        } // attempt to find the item anyway even if the user makes typos

        Object.entries(JSON.parse(data)).forEach(entry => {
            if (entry[0] === message) {
                ItemName = entry[0]
                SearchedItem = entry[1]
            }
        }) // look for the item id in the database so the item price can be fetched
        API.getItemPrice(SearchedItem).then(res => {
            let data = res.data
            data.forEach(price => {

                const {
                    sell_price_min,
                    sell_price_min_date,
                    buy_price_max_date,
                    buy_price_max,
                    city
                } = price

                let qualityList = constants.qualityList()

                let quality = qualityList[price.quality]
                let sell_time_diff = calculateSellTimeDiff(sell_price_min_date) // calculates time difference
                let buy_time_diff = calculateBuyTimeDiff(buy_price_max_date) // calculates time difference
                if (sell_price_min > 0) {
                    helperFunctions.saveAllSellPriceInfo(sell_city_info, sell_price_info, sell_time_info, city, quality, divideNumbersWithDot(sell_price_min), sell_time_diff)
                }

                if (buy_price_max > 0) {
                    helperFunctions.saveAllBuyPriceInfo(buy_city_info, buy_price_info, buy_time_info, city, quality, divideNumbersWithDot(buy_price_max), buy_time_diff)
                }
            })
            let fieldsArray = [];
            for (let i = 0; i <= 5; i++) {
                let name, value = [], inline = true;
                switch (i) {
                    case 0: name = 'City'; value = sell_city_info; break;
                    case 1: name = 'Sell Price'; value = sell_price_info; break;
                    case 2: name = 'Last Update'; value = sell_time_info; break;
                    case 3: name = 'City'; value = buy_city_info; break;
                    case 4: name = 'Buy Price'; value = buy_price_info; break;
                    case 5: name = 'Last Update'; value = buy_time_info; break;
                }
                if (value.length > 0) {
                    fieldsArray.push(
                        { name, value, inline }
                    )
                }
            } // basically creates your price message

            const priceEmbed = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle(ItemName)
                .setThumbnail("https://render.albiononline.com/v1/item/" + SearchedItem)
                .addFields(fieldsArray)
            messageObj.reply(priceEmbed);

        })

    })
}
