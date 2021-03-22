const axios = require('axios');

exports.getItemPrice = function (itemUniqueName) {
    return axios.get("https://www.albion-online-data.com/api/v2/stats/prices/" + itemUniqueName)
}

exports.getGuildId = function (GuildName) {
    return axios.get('https://gameinfo.albiononline.com/api/gameinfo/search?q=' + GuildName)
}

exports.getGuildPlayers = function (GuildId){
    return axios.get('https://gameinfo.albiononline.com/api/gameinfo/guilds/' + GuildId + '/members')
}