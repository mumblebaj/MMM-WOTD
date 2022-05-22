var NodeHelper = require('node_helper');
const axios = require('axios');
const es = require('./es.js');
const pt = require('./pt.js');
const wotd = require('./de.js');

module.exports = NodeHelper.create ({
    start: function() {
        console.log("Starting node_helper for: " + this.name);
    },

    getESData: function() {
        var self = this;

        es.getesData(function(translationData) {
            self.sendSocketNotification("WOTD_ESP_DATA", translationData)
        });
    },

    getPTData: function() {
        var self = this;
        
        pt.getptData(function(translationData) {
            self.sendSocketNotification("WOTD_PT_DATA", translationData)
        });        
    },

    getData: function(url) {
        var self = this;
        
        wotd.getData(function(translationData, url) {
            self.sendSocketNotification("WOTD_DATA", translationData)
        });        
    },

    socketNotificationReceived: function(notification, payload) {
        const language = this.payload.language
        language.foreach(lang => {
            var url = `https://www.${lang}pod101.com/${lang}-phrases/`
            this.getData(url)
        })
    }
})