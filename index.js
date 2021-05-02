const Discord = require('discord.js');
const client = new Discord.Client();
const priceCommand = "!price "
const helpCommand = "!help"
const taxCommand = '!gathertax '
const officerRegistrationCommand = "!registerOfficers"
const priceSearch = require('./src/baseFunctions/priceSearch').priceSearch
const gatherTax = require('./src/baseFunctions/gatherTax').gatherTax
const registerOfficers = require('./src/adminFunctions/registerOfficers').registerOfficers
const help = require('./src/baseFunctions/help').help

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', messageObject => {
  if (messageObject.content.startsWith(priceCommand)) return priceSearch(messageObject, priceCommand);
  if (messageObject.content.startsWith(taxCommand)) return gatherTax(messageObject, taxCommand);
  if (messageObject.content.startsWith(officerRegistrationCommand)) return registerOfficers(messageObject);
  if (messageObject.content.startsWith(helpCommand)) return help(messageObject)
});

client.login(process.env.MelisKey);
