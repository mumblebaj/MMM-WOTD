Module.register("MMM-WOTD", {
    defaults: {
        updateInterval: 86400000,
        retryDelay: 5000,
        showExamples: true,
        showExampleTranslations: true,
        language: "spanish"  //spanish or portuguese
    },

    start: function() {
        Log.info(`Starting module: ${this.name}`);
        suspended = false;
        this.apiData = null;

        this.getData();
        this.scheduleUpdate();
    },

    stop: function () {
        Log.info('Stopping module ' + this.name);
      },
    
      resume: function () {
        Log.info('Resuming module ' + this.name);
        Log.debug('with config: ' + JSON.stringify(this.config));
        this.suspended = false;
        this.updateDom()
      },
    
      suspend: function () {
        Log.info('Suspending module ' + this.name);
        this.suspended = true;
      },

    getHeader: function() {
        return `Word of the Day`
    },
    
    getData: function() {
        this.sendSocketNotification("WOTD_GET_DATA", this.config)
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
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "WOTD_DATA") {
            console.log('received:', payload);
            this.apiData = payload;
            this.updateDom();
        } else {
            Log.log("No Data Received");
            return;
        }
    },

    getDom: function() {
        const wrapper = document.createElement("div");
        wrapper.id = "wotd"
        if(this.apiData) {

            const word = document.createElement("div");
            word.innerHTML = this.apiData[0].word
            word.className = "bold large"
            wrapper.appendChild(word);

            const translation = document.createElement("div")
            translation.innerHTML = this.apiData[0].translation
            translation.className = "bright medium"
            wrapper.appendChild(translation);

            if(this.config.showExamples) {
                const list = document.createElement('ol')
                list.className = "small"

                const listItem = document.createElement('li')

                const wr = document.createElement('div')
                wr.innerHTML = this.apiData[0].examples.wordex
                listItem.appendChild(wr)

                if(this.config.showExampleTranslations) {
                    const we = document.createElement('div')
                    we.innerHTML = this.apiData[0].examples.wordextr
                    listItem.appendChild(we)

                    const we2 = document.createElement('div')
                    we2.innerHTML = this.apiData[0].examples.wordextr2
                    listItem.appendChild(we2)

                }
                list.appendChild(listItem)

                wrapper.appendChild(list)
            }
        } else {
            wrapper.innerHTML = "Loading..."
        }
        return wrapper
    }
})