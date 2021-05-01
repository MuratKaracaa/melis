const Discord = require('discord.js')
const priceCommand = "!price "
const helpCommand = "!help"
const taxCommand = '!gathertax '
let commands = [helpCommand,priceCommand,taxCommand]
let parameters = ['none', 'e.g. t8.1 hunter shoes/uncommon slate', 'Log info in a .txt file(necessary) + Fame to Silver ratio(necessary) + min. tax amount(optional)']
let descriptions = ['lets you know what commands you can use', 'finds the prices you are looking for', 'Reads the logs and shows you who hasnt paid their taxes yet. ']
let fieldsArray = []
exports.help = async function(messageObject){
    for (let i =0; i<3; i++){
        let name,value, inline = true;
        switch (i){
            case 0:
                name = 'Commands';
                value = commands;
                break;
            case 1:
                name ='Parameters';
                value = parameters;
                break;
            case 2:
                name ='Description';
                value = descriptions;
                break;
        }
        fieldsArray.push({name,value,inline})
    }
    const embedMessage = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Commands you can use')
        .addFields(fieldsArray)
    messageObject.reply(embedMessage);
}