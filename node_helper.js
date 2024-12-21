var NodeHelper = require('node_helper');
const axios = require('axios');
var cheerio = require('cheerio');

module.exports = NodeHelper.create({
    requiresVersion: '2.22.0',

    start: function () {
        console.log("Starting node_helper for: " + this.name);
    },
    
    getData: function ($) {
        let lement = {};

        // Get the data-wordday attribute from the #word_page element
        const wordDayData = $("#word_page").attr("data-wordday");

        if (wordDayData) {
            // Parse the JSON string into an object
            const wordDayObj = JSON.parse(wordDayData);

            // Extract the required fields
            lement.text = wordDayObj.text || null;
            lement.english = wordDayObj.english || null;
            lement.meaning = wordDayObj.meaning || null;

            // Get the first two samples, if available
            if (wordDayObj.samples && wordDayObj.samples.length >= 2) {
                lement.samples = wordDayObj.samples.slice(0, 2).map(sample => ({
                            text: sample.text,
                            english: sample.english,
                            audio: sample.audio_english
                        }));
            } else {
                lement.samples = []; // Handle cases where there are no or less than 2 samples
            }
        } else {
            console.error("No data-wordday attribute found on #word_page.");
        }

        //console.log("Extracted Data:", lement);
        return lement;
    },

    getWotdData: async function (languages) {
        var lang = "";
        const promises = languages.map(language => {

            if (language === "english") {
                lang = language + "class101"
                    return axios.get(`https://www.${lang}.com/${language}-phrases/`).then(({
                            data
                        }) => {

                        const $ = cheerio.load(data, null, true);
						
						// get the data
                        const english = this.getData($);

                        return {
                            "language": language,
                            "word": english.text,
                            "translation": english.english,
                            "examples": {
                                "wordex": "",
                                "wordextr": english.samples[0].text,
                                "wordextr2": english.samples[1].text
                            }
                        }
                    })
            } else {
                lang = language + "pod101"
                    return axios.get(`https://www.${lang}.com/${language}-phrases/`).then(({
                            data
                        }) => {

                        const $ = cheerio.load(data, null, true);

                        // get the data
                        const english = this.getData($);

                        return {
                            "language": language,
                            "word": english.text,
                            "translation": english.english,
                            "examples": {
                                "wordex": english.meaning,
                                "wordextr": english.samples[0].text,
                                "wordextr2": english.samples[0].english
                            }
                        }
                    })
            }

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
                result.forEach(languageResult => {})
                var self = this;
                this.sendSocketNotification("WOTD_DATA", result)
            })
            .catch((error) => {
                console.error(error)
            })
    },

    socketNotificationReceived: function (notification, payload) {
        var languages = payload.language
            this.fetchData(languages)

    }
})
