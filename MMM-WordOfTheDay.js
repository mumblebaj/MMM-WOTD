Module.register("MMM-WordOfTheDay", {
    defaults: {
        updateInterval: 86400000,
        retryDelay: 5000,
        showExamples: true,
        showExampleTranslations: true,
        language: "spanish"  //spanish or portuguese
    },

    start: function() {
        Log.info(`Starting module: ${this.name}`);

        this.apiData = null;

        this.getData();
        this.scheduleUpdate();
    },

    getData: function() {
        if(this.config.language === "spanish") {
            this.sendSocketNotification("WOTD_GET_ES_DATA", this.config)
        } else  if (this.config.language === "portuguese") {
            this.sendSocketNotification("WOTD_GET_PT_DATA", this.config)
        }
    },

    scheduleUpdate: function(delay) {
        var nextUpdate = this.config.updateInterval
        if(typeof delay != "undefined" && delay >= 0) {
            nextUpdate = delay
        }

        var self = this;
        setInterval(function() {
            self.getData();
        }, nextUpdate)
    }
})