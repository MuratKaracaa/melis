const Discord = require('discord.js');
const client = new Discord.Client();
const priceCommand = "!price "
const helpCommand = "!help"
const commands = [priceCommand, helpCommand];
const config = require('./config.json')
const priceSearch = require('./src/baseFunctions/priceSearch').priceSearch

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', messageObject => {
    if (messageObject.content.startsWith(priceCommand)) return priceSearch(messageObject, priceCommand);
    if (messageObject.content.startsWith(helpCommand)) return messageObject.reply(`Kullanabileceğiniz komutlar ${commands}`)
});

client.login(config.token);