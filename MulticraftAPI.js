const crypto = require("crypto");
const axios = require("axios");

const url = "";
const userDef = "";
const keyDef = "";

/** 
 * Send a request to Multicraft's API
 * @param {String} method - The API method, https://www.multicraft.org/site/docs/api
 * @param {Object} params - Any params that are needed for the method, ID for example.
 * @param {String} user - The user to use for the API request. Default can be set in the module
 * @param {String} key - API Key for the user. Default can be set in the module
*/
module.exports = async (method = "", params = {}, user = "", key = "") => {
    if (method == "")
        throw new Error("No method specified");
    user = user ? user : userDef;
    key = key ? key : keyDef;
    params._MulticraftAPIUser = user;
    params._MulticraftAPIMethod = method;
    var str;
    var query;
    for(var param in params) {
        if(!params.hasOwnProperty(param)) continue;
        str += param + params[param].toString();
        query += `&${encodeURI(param)}=${encodeURI(params[param])}`
    }
    var hmacKey = crypto.createHmac('sha256', key);
    hmacKey.update(str);
    query += `&${encodeURI("_MulticraftAPIKey")}=${encodeURI(hmacKey.digest('hex'))}`
    try {
        return (await axios.post(url, query)).data;
    } catch (e) {
        throw new Error(e.message);
    }
}
