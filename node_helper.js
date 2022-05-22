var NodeHelper = require('node_helper');
const axios = require('axios');
const wotd = require('./wotd.js');

module.exports = NodeHelper.create ({
    start: function() {
        console.log("Starting node_helper for: " + this.name);
    },

    getwotdData: function(url) {
        var self = this;
        
        wotd.getWotdData(function(translationData) {
            self.sendSocketNotification("WOTD_DATA", translationData)
        }, url);        
    },

    socketNotificationReceived: function(notification, payload) {

        const language = payload.language
        language.forEach(lang => {
            var url = `https://www.${lang}pod101.com/${lang}-phrases/`
            this.getwotdData(url)
        })
    }
})