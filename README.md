# MMM-WOTD


Yet another Word of the Day module for [MagicMirror²](https://magicmirror.builders). Difference with this one is that you can select `Spanish` or `Portuguese` and some other lamguages. See config section for supported languages.

[![license](https://img.shields.io/github/license/mashape/apistatus.svg)](LICENSE)

## Support
If you like my module you can support my work by giving me a star ir buy me a coffee.

<a href="https://www.buymeacoffee.com/mumblebaj" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy Me A Beer" style="height: 45px !important;width: 180px !important;" ></a>

## Spanish Example
![Example](image-1.png) 

## Portuguese Example
![Example](image-2.png) 

## German Example
![Example](image-3.png) 


## Dependencies
- axios@0.27.2
- cheerio@1.0.0-rc.10

## Updates
- Added support for multiple languages
- You can now add multiple languages as an input array ["spanish", "german", "arabic", "dutch"] or use a single language ["spanish"]
- Added a rotateInterval which would swop between the languages selected. Has to be in milli-seconds, i.e. 1000*30 = 30 second interval

## Installation

In your terminal, go to your MagicMirror's Module folder:
````
cd ~/MagicMirror/modules
````

Clone this repository:
````
git clone https://github.com/mumblebaj/MMM-WOTD.git
````
````
cd MMM-WOTD
npm install
````

Add the module to the modules array in the `config/config.js` file:
````javascript
        {
            module: 'MMM-WOTD',
            position: 'middle_center',
            config: {
                        updateInterval: 86400000,
                        retryDelay: 5000,
                        showExamples: true,
                        showExampleTranslations: true,
                        language: ["spanish", "german", "arabic", "dutch"]
                    }
        },
````

## Configuration options

The following properties can be configured:


| Option                       | Description
| ---------------------------- | -----------
| `updateInterval`             | As this is a "Word of the Day" it is recommended to set the value to 24hrs (86400000)
| `retryDelay`                 | How long to wait before retry
| `rotateInterval`             | Interval at which to roate between languages when multiple languages have been selected
| `showExamples`               | If you would like to see some example usages of the word set this to `true`. Default is `true` <br><br> **Possible values:** `true` or `false`
| `showExampleTranslations`    | If you want the example with its English translation set this to `true` <br><br> **Possible values:** `true` or `false`,
| `language`                   | An Array of Languages. Which language WOTD would you like? Various Languages supported<br><br> **Possible values:** `afrikaans`, `arabic`, `bulgarian`, `dutch`, `english`, `filipino`, `finnish`, `french`, `german`, `greek`, `hebrew`, `hindi`, `hungarian`, `indonesian`, `italian`, `japanese`, `korean`, `norwegian`, `persian`, `polish`, `portuguese`, `romanian`, `russian`, `spanish`, `swahili`, `swedish`, `thai`, `turkish`, `urdu`, `vietnamese`

## Updating

To update the module to the latest version, use your terminal to go to your MMM-WOTD module folder and type the following command:

````
cd MMM-WOTD
git pull
npm install
```` 

