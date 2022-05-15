const cheerio = require('cheerio');
const axios = require('axios');

module.exports = {
    url: "https://www.spanishpod101.com/spanish-phrases/",

    getESData: function($) {
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

    getesData: function(callback) {
        axios.get(this.url).then(({ data }) => {
            const $ = cheerio.load(data, null, true);

            let translationData = [];

            const german = this.getESData($);

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