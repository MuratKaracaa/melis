const Discord = require('discord.js');
const client = new Discord.Client();
const priceCommand = "!price "
const helpCommand = "!help"
const taxCommand = '!gathertax '
const commands = [priceCommand, helpCommand, taxCommand];
const priceSearch = require('./src/baseFunctions/priceSearch').priceSearch
const gatherTax = require('./src/baseFunctions/gatherTax').gatherTax

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', messageObject => {
    if (messageObject.content.startsWith(priceCommand)) return priceSearch(messageObject, priceCommand);
    if (messageObject.content.startsWith(taxCommand)) return gatherTax(messageObject, taxCommand);
    if (messageObject.content.startsWith(helpCommand)) return messageObject.reply(`Commands you can use are ${commands}`)
});

client.login("ODIzNTk3Mjk2MTcxMDg5OTc0.YFjIwQ.4kV899EZCWaSr4S_oXgz-lJujpM");
