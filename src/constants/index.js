exports.tierList = function () {
    const tierList = {
        "t4": "adept's",
        "t5": "expert's",
        "t6": "master's",
        "t7": "grandmaster's",
        "t8": "elder's"
    }
    return tierList
}

exports.qualityList = function () {
    const qualityList = {
        1: 'Norm.',
        2: 'Good',
        3: 'Outs.',
        4: 'Exc.',
        5: 'MP'
    }
    return qualityList
}

// Bu kısmı exportlayamadım, reference edemiyorum

exports.priceConstants = function(){
    const {
        sell_price_min,
        sell_price_min_date,
        buy_price_max_date,
        buy_price_max,
        city
    } = price

    return price
}