var axios = require('axios');
var cheerio = require('cheerio');

module.exports = {
    // url: "https://www.germanpod101.com/german-phrases/",

    getDEData: function($) {
        let element = {}, germanWords = [];
        $(".r101-wotd-widget__word").each((index, p) => {
            element.id = index;
            element.word = p.firstChild.data;
            germanWords.push(element.word);
        })

        return germanWords;
    },

    getEngData: function($) {
        let lement = {}, englishWords = [];
        $(".r101-wotd-widget__english").each((index, p) => {
            lement.id = index;
            lement.word = p.firstChild.data;
            englishWords.push(lement.word);
        })

        return englishWords;
    },

    getData: function(callback, obj) {
        url = obj
        axios.get(url).then(({ data }) => {
            const $ = cheerio.load(data, null, true);

            let translationData = [];

            const german = this.getDEData($);

            const english = this.getEngData($);

            translationData.push({
                "word": german[0],
                "translation": english[0],
                "examples": {
                    "wordex": german[1],
                    "wordextr": english[1],
                }
            })
            callback(translationData);
        })

        
    }
}