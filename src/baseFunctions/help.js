const Discord = require('discord.js')
const priceCommand = "!price "
const helpCommand = "!help"
const taxCommand = '!gathertax '
let fieldsArray = []
exports.help = async function(messageObject){
    for (let i =0; i<3; i++){
        let name,value;
        switch (i){
            case 0:
                name = helpCommand;
                value = 'Use this to see available commands';
                break;
            case 1:
                name =priceCommand;
                value = "E.g. t8.2 boltcasters/uncommon slate, find the items' price easily, also fixes typos as long as it has the right number of words, it fixes bltcstr but fails at shadow caller cuz it's supposed to be 1 word";
                break;
            case 2:
                name =taxCommand;
                value = 'Upload a .txt file containing the fame logs on top and deposit logs on the bottom, input a fame to silver ratio (e.g. 100 to 200) along with a minimum tax display amount ( e.g. 100k so you do not see 6k tax debts, which is optional, you can leave it out), \n e.g !gathertax 100 to 200 100k or !gathertax 100 to 200 and the .txt file \n registering guild members to send automated messages is in development!';
                break;
        }
        fieldsArray.push({name,value})
    }
    const embedMessage = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Commands you can use')
        .addFields(fieldsArray)
    messageObject.reply(embedMessage);
}