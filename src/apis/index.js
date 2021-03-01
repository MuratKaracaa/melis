const axios = require('axios');

exports.getItemPrice = function(itemUniqueName){
    return axios.get("https://www.albion-online-data.com/api/v2/stats/prices/" + itemUniqueName)
}

