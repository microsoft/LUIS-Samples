// The exported functions in this module makes a call to Bing Spell Check API that returns spelling corrections.
// For more info, check out the API reference:
// https://docs.microsoft.com/en-us/rest/api/cognitiveservices/bing-spell-check-api-v7-reference
var request = require('request');
var SPELL_CHECK_API_URL = "https://api.cognitive.microsoft.com/bing/v7.0/spellcheck",
  SPELL_CHECK_API_KEY = process.env.BING_SPELL_CHECK_API_KEY,
  SPELL_CHECK_MODE = 'spell';


/**
 * Gets the correct spelling for the given text
 * @param {string} text The text to be corrected
 * @returns {Promise} Promise with corrected text if succeeded, error otherwise.
 */
exports.getCorrectedText = text => {
    return new Promise(
        (resolve, reject) => {
            if (text) {
                const requestData = {
                    url: SPELL_CHECK_API_URL,
                    headers: {
                        "Ocp-Apim-Subscription-Key": SPELL_CHECK_API_KEY
                    },
                    form: {

                        text: text,
                        mode: SPELL_CHECK_MODE

                    },
                    json: true
                };
                request.post(requestData, (error, response, body) => {
                    if (error) {
                        reject(error);
                    } else if (response.statusCode !== 200) {
                        reject(body);
                    } else {
                        let previousOffset = 0;
                        let result = '';
                        body.flaggedTokens.forEach(element => {
                            // Append the text from the previous offset to the current misspelled word offset
                            result += text.substring(previousOffset, element.offset);
                            // Append the corrected word instead of the misspelled word
                            result += element.suggestions[0].suggestion;
                            // Increment the offset by the length of the misspelled word
                            previousOffset = element.offset + element.token.length;
                        });
                        // Append the text after the last misspelled word.
                        if (previousOffset < text.length) {
                            result += text.substring(previousOffset);
                        }
                        resolve(result);
                    }
                });
            } else {
                resolve(text);
            }
        }
    )
}
