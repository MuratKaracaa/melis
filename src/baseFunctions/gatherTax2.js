const API = require("../apis");
const moment = require("moment");
const helperFunctions = require("../utils").helperFunctions;
const Discord = require('discord.js');
const firebase = require('firebase');
const firebaseConfig = {
    apiKey: process.env.apiKey,
    authDomain: process.env.authDomain,
    databaseURL: process.env.databaseURL,
    projectId: process.env.projectId,
    storageBucket: process.env.storageBucket,
    messagingSenderId: process.env.messagingSenderId,
    appId: process.env.appId,
    measurementId: process.env.measurementId
};

const app = firebase.initializeApp(firebaseConfig);

const db = app.database()

exports.gatherTax = function (messageObj, taxCommand) {
    let message = messageObj.content;
    message = helperFunctions.checkIfHasTaxCommand(message, taxCommand); // see if the message has tax command and remove it
    let silverToFameRatio = helperFunctions.getSilverToFameRatio(message);
    message = helperFunctions.removeSilverToFameRatio(message);

    message = helperFunctions.removeSilverToFameRatio(message);
    let fameCollection = [];
    let names = [];
    let fameDiff = [];
    let taxAmountInfo = [];
    let fieldsArray = [];

    API.getGuildId(message).then(res => {
        let guilds = res.data.guilds;
        let guildName = guilds[0].Name;
        let guildId = guilds[0].Id;

        API.getGuildPlayers(guildId).then(res => {
            let players = res.data;
            let names = [];
            let date = moment().format("DD-MM-YY");
            let gatherFame = [];

            players.forEach((player) => {
                names.push(player.Name);
                gatherFame.push(player.LifetimeStatistics.Gathering.All.Total);
            });

            for (i = 0; i < names.length - 1; i++) {
                let fameData = {
                    name: names[i],
                    fame: gatherFame[i]
                };
                fameCollection.push(fameData);
            }

            db.ref(`Guilds/${guildName}`).child(date).update({
                ...fameCollection,

            }).then(() => {
                db.ref(`Guilds/${guildName}`).orderByKey().limitToLast(2).once('value').then(value => {
                    let data = Object.values(value.val())
                    let previousFameData;
                    let currentFameData;
                    let fameDataToShow;
                    let dates = Object.keys(value.val())
                    if (dates.length > 1) {
                        previousFameData = data[0]
                        currentFameData = data[1]
                        let previousFameDataMap = new Map(previousFameData.map(({name, fame}) => ([name, fame])));
                        fameDataToShow = currentFameData.map(obj => ({
                            name: obj.name,
                            previousFame: previousFameDataMap.get(obj.name) || 0,
                            currentFame: obj.fame
                        }));
                        fameDataToShow.forEach(inf => {
                            const {
                                name,
                                previousFame,
                                currentFame,
                            } = inf
                            names.push(name)
                            let fameDiffFormula = currentFame - previousFame
                            let taxAmount = fameDiffFormula * silverToFameRatio
                            fameDiff.push(currentFame + ' - ' + previousFame + ' = ' + fameDiffFormula)
                            taxAmountInfo.push(taxAmount)

                        })
                        for (let i = 0; i <= 2; i++) {
                            let name, value = [], inline = true;
                            switch (i) {
                                case 0:
                                    name = 'Players';
                                    value = names;
                                    break;
                                case 1:
                                    name = `Fame Difference Between \n ${dates[0]} and ${dates[1]}`;
                                    value = fameDiff;
                                    break;
                                case 2:
                                    name = 'Tax Amount';
                                    value = taxAmountInfo ;
                                    break;
                            }
                            if (value.length > 0) {
                                fieldsArray.push(
                                    {name, value, inline}
                                )
                            }
                        }

                        const priceEmbed = new Discord.MessageEmbed()
                            .setColor('#0099ff')
                            .setTitle(`Gather Tax Info for ${guildName}`)
                            .addFields(fieldsArray)
                        messageObj.reply(priceEmbed);

                    } else if (dates.length === 1) {
                        currentFameData = data [0]
                    }
                })
            });
        })
    })
}
