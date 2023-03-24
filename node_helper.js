var NodeHelper = require('node_helper');
const axios = require('axios');
var cheerio = require('cheerio');

module.exports = NodeHelper.create({
    start: function () {
        console.log("Starting node_helper for: " + this.name);
    },

    getWordOfTheDay: function ($) {
        let element = {}, todayWord = [];
        $(".r101-wotd-widget__word").each((index, p) => {
            element.id = index;
            element.word = p.firstChild.data;
            todayWord.push(element.word);
        })

        return wotd;
    },

    getEngData: function ($) {
        let lement = {}, englishWords = [];
        $(".r101-wotd-widget__english").each((index, p) => {
            lement.id = index;
            lement.word = p.firstChild.data;
            englishWords.push(lement.word);
        })

        return englishWords;
    },

    getWotdData: async function (languages) {
        const promises = languages.map(language => {
            return axios.get(`https://www.${language}pod101.com/${language}-phrases/`).then(({data}) => {
                const $ = cheerio.load(data, null, true);
                // get the word of the day
                const wordOftheDay = this.getWordOfTheDay($);
                // get the english translation
                const english = this.getEngData($);

                return {
                    "language": language,
                    "word": wordOftheDay[0],
                    "translation": english[0],
                    "examples": {
                        "wordex": wordOftheDay[1],
                        "wordextr": english[1],
                        "wordextr2": english[2]
                    }
                }
            })
        })

        const results = await Promise.all(promises);

        const combinedResults = {};

        results.forEach(result => {
            if (!combinedResults[result.language]) {
                combinedResults[result.language] = {
                    "language": result.language,
                    "data": []
                }
            }
            combinedResults[result.language].data.push(result);
        })
        return Object.values(combinedResults);
    },

    fetchData: function (languages) {
        mydata = [];
        mydata = this.getWotdData(languages)
        .then((result) => {
            result.forEach(languageResult => {

            })
            var self = this;
            this.sendSocketNOtification("WOTD_DATA", result)
        })
        .catch ((error) => {
            console.error(error)
        })
    },

    socketNotificationReceived: function (notification, payload) {
        var languages = payload.language
        this.fetchData(languages)

    }
})