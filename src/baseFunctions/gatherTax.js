const Discord = require('discord.js');
const helperFunctions = require('../utils/helperFunctions')
const axios = require('axios')

exports.gatherTax = async function (messageObject, taxCommand) {
    let message = messageObject.content;
    let guildName = messageObject.attachments.first().name
    guildName = guildName.replace(/\.[^/.]+$/, "")
    message = helperFunctions.checkIfHasTaxCommand(message, taxCommand); // see if the message has tax command and remove it
    let silverToFameRatio = helperFunctions.getSilverToFameRatio(message);
    let bottomLimit = helperFunctions.getBottomLimit(message)
    let inputData = (await axios.get(messageObject.attachments.first().url)).data.split('\n')
    let fameStartIndex;
    let paymentStartIndex;
    let fameData = [];
    let paymentData = [];
    let paymentArray = [];
    let fameDiffArray = []
    inputData = helperFunctions.finalFormat(inputData)
    let translations = []
    translations['english'] = { 'rank': 'Rank', 'date': 'Date' }
    translations['spanish'] = { 'rank': 'Rango', 'date': 'Fecha' }
    translations['portuguese'] = { 'rank': 'Classificação', 'date': 'Data' }
    translations['french'] = { 'rank': 'Rang', 'date': 'Date' }
    translations['russian'] = { 'rank': 'Ранг', 'date': 'Дата' }
    translations['polish'] = { 'rank': 'Ranga', 'date': 'Data' }
    translations['asian'] = { 'rank': '级别', 'date': '日期' }
    translations['asian2'] = { 'rank': '랭크', 'date': '날짜' }

    inputData.forEach(element => {
        let values = Object.values(translations)
        let ranks = []
        let dates = []
        values.map(val => {
            let rank = val.rank
            let date = val.date
            ranks.push(rank)
            dates.push(date)
        })
        let rankFound = ranks.find(rank => rank === element[0])

        let dateFound = dates.find(date => date === element[0])
        if (rankFound !== undefined) {
            fameStartIndex = inputData.indexOf(element)
        }

        if (dateFound !== undefined) {
            paymentStartIndex = inputData.indexOf(element)
        }
    })

    fameData.push(inputData.slice(fameStartIndex + 1, paymentStartIndex))
    paymentData.push(inputData.slice(paymentStartIndex + 1, inputData.length))



    fameData[0].forEach(datum => {
        let playerName = datum[1]
        let fameDiffAmount = datum[3]
        fameDiffArray.push({
            name: playerName,
            fameDiff: parseFloat(fameDiffAmount),
            taxAmount: fameDiffAmount * silverToFameRatio
        })
        fameDiffArray = fameDiffArray.filter(function (element) { return element.name !== undefined && element.fameDiff !== undefined && element.taxAmount !== 'NaN' })
    })


    paymentData[0].forEach(datum => {
        let playerName = datum[1]
        let deposit = datum[3]
        paymentArray.push({
            name: playerName,
            balance: parseFloat(deposit)
        })
    })

    let paymentArrayToUse = []
    paymentArray.forEach(function (a) {
        if (!this[a.name]) {
            this[a.name] = { name: a.name, balance: 0 };
            paymentArrayToUse.push(this[a.name]);
        }
        this[a.name].balance += a.balance;
    }, Object.create(null));

    let paymentArrayToUseMapped = new Map(paymentArrayToUse.map(({ name, fame }) => ([name, fame])));
    let mergedInfo = fameDiffArray.map(obj => ({
        name: obj.name,
        fameDiff: obj.fameDiff,
        taxAmount: obj.taxAmount,
        balance: paymentArrayToUseMapped.get(obj.name) || null
    }))

    let taxedPlayers = []
    let taxAmo = []
    let fieldsArray = []
    mergedInfo.map(obj => {
        const { name,
            fameDiff,
            taxAmount,
            balance } = obj
        let paymentStatus = balance - taxAmount
        let limit = 0;

        if (bottomLimit) {
            if (bottomLimit.charAt(bottomLimit.length - 1) === 'K') {
                bottomLimit = bottomLimit.replace('K', '')
                bottomLimit += '000'
            } else if (bottomLimit.charAt(bottomLimit.length - 1) === 'M') {
                bottomLimit = bottomLimit.replace('M', '')
                bottomLimit += '000000'
            }

            limit = -Math.abs(bottomLimit)
        }


        if (paymentStatus < limit) {
            taxedPlayers.push(name)
            taxAmo.push(helperFunctions.nFormatter(Math.abs(paymentStatus)))
        }
    })

    for (let i = 0; i < 2; i++) {
        let name, value, inline = true;
        switch (i) {
            case 0:
                name = 'Players';
                value = taxedPlayers;
                break;
            case 1:
                name = 'Tax Debt';
                value = taxAmo;
                break;
        }
        if (value.length > 0) {
            fieldsArray.push({ name, value, inline })
        }
    }

    const embedMessage = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle(`Tax Debts of ${guildName}`)
        .addFields(fieldsArray)
        .setTimestamp()

    messageObject.reply(embedMessage)
}

