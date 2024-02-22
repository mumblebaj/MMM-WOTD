Module.register("MMM-WOTD", {
    defaults: {
        updateInterval: 86400000,
        retryDelay: 5000,
        rotateInterval: 1000 * 60,
        showExamples: true,
        showExampleTranslations: true,
        language: ["spanish"]  //spanish or portuguese
    },

    start: function () {
        Log.info(`Starting module: ${this.name}`);
        suspended = false;
        this.timer = null;
        this.index = 0;
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
        this.draw(this.apiData)
    },

    suspend: function () {
        Log.info('Suspending module ' + this.name);
        this.suspended = true;
    },

    // getHeader: function () {
    //     return `Word of the Day`
    // },

    getData: function () {
        this.sendSocketNotification("WOTD_GET_DATA", this.config)
    },

    scheduleUpdate: function (delay) {
        var nextUpdate = this.config.updateInterval
        if (typeof delay != "undefined" && delay >= 0) {
            nextUpdate = delay
        }

        var self = this;
        setInterval(function () {
            self.getData();
        }, nextUpdate)
    },

    socketNotificationReceived: function (notification, payload) {
        if (notification === "WOTD_DATA") {
            this.apiData = payload;
            this.draw(this.apiData);
        } else {
            Log.log("No Data Received");
            return;
        }
    },

    draw: function (payload) {
        clearTimeout(this.timer);
        wrapper = this.wrapper
        this.timer = null;
        payload = this.apiData
        var t = payload[this.index]

        if (payload.length > 1) {
            var mylang = document.getElementById("wotd-lang")
            var wotdword = document.getElementById("wotd-word")
            var translation = document.getElementById("wotd-translation")
            var wr = document.getElementById("wotd-wr")
            var we = document.getElementById("wotd-we")
            var we2 = document.getElementById("wotd-we2")
            mylang.innerHTML = "Language - " + `${t.language}`.toUpperCase()
            wotdword.innerHTML = "Word - " + `${t.data[0].word}`.toUpperCase()
            translation.innerHTML = "Meaning - " + (t.data[0].translation ? `${t.data[0].translation}`.toUpperCase() : "")
            wr.innerHTML = `${t.data[0].examples.wordex}`
            we.innerHTML = (t.data[0].examples.wordextr ? `${t.data[0].examples.wordextr}` : "")
            we2.innerHTML = (t.data[0].examples.wordextr2 ? `${t.data[0].examples.wordextr2}` : "")

            setTimeout(() => {

            }, 900)
            this.timer = setTimeout(() => {
                this.index++
                if (this.index >= this.apiData.length) this.index = 0
                this.draw()
            }, this.config.rotateInterval)
        } else {
            var mylang = document.getElementById("wotd-lang")
            var wotdword = document.getElementById("wotd-word")
            var translation = document.getElementById("wotd-translation")
            var wr = document.getElementById("wotd-wr")
            var we = document.getElementById("wotd-we")
            var we2 = document.getElementById("wotd-we2")
            mylang.innerHTML = "Language - " + `${t.language}`.toUpperCase()
            wotdword.innerHTML = "Word - " + `${t.data[0].word}`.toUpperCase()
            translation.innerHTML = "Meaning - " + `${t.data[0].translation}`.toUpperCase()
            wr.innerHTML = `- ${t.data[0].examples.wordex}`
            we.innerHTML = (t.data[0].examples.wordextr ? `${t.data[0].examples.wordextr}` : "")
            we2.innerHTML = (t.data[0].examples.wordextr2 ? `${t.data[0].examples.wordextr2}` : "")
        }
        return wrapper
    },

    getDom: function () {
        const wrapper = document.createElement("div");
        wrapper.id = "wotd"

        const lang = document.createElement("div");
        lang.id = "wotd-lang"
        lang.className = "bright small"
        wrapper.appendChild(lang);

        const word = document.createElement("div");
        word.id = "wotd-word"
        word.className = "bold bright medium"
        wrapper.appendChild(word);

        const translation = document.createElement("div")
        translation.id = "wotd-translation"
        translation.className = "medium"
        wrapper.appendChild(translation);

        if (this.config.showExamples) {
            const list = document.createElement('div')
            list.className = "small"

            const listItem = document.createElement('div')

            const wr = document.createElement('div')
            wr.id = "wotd-wr"
            listItem.appendChild(wr)

            if (this.config.showExampleTranslations) {
                const we = document.createElement('div')
                we.id = "wotd-we"
                listItem.appendChild(we)

                const we2 = document.createElement('div')
                we2.id = "wotd-we2"
                listItem.appendChild(we2)

            }
            list.appendChild(listItem)

            wrapper.appendChild(list)
        }
        this.wrapper = wrapper
        return this.wrapper
    }
})