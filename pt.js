var axios = require('axios');
var cheerio = require('cheerio');

module.exports = {
    url: "https://www.portuguesepod101.com/portuguese-phrases/",

    getPorData: function($) {
        let element = {}, portugueseWords = [];
        $(".r101-wotd-widget__word").each((index, p) => {
            element.id = index;
            element.word = p.firstChild.data;
            portugueseWords.push(element.word);
        })

        return portugueseWords;
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

    getptData: function(callback) {
        axios.get(this.url).then(({ data }) => {
            const $ = cheerio.load(data, null, true);

            let translationData = [];

            const portuguese = this.getPorData($);

            const english = this.getEngData($);

            translationData.push({
                "word": portuguese[0],
                "translation": english[0],
                "examples": {
                    "wordex": portuguese[1],
                    "wordextr": english[1],
                }
            })
            callback(translationData);
        })

        
    }
}