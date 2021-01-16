const { net } = require('electron');
const config = require('./webinfo');

// web server variables
const host = config.testsvr.host; // for debug use only
const port = config.testsvr.port;
// const host = config.stablesvr.host;
// const port = config.stablesvr.port;
const ROOT_URL = 'http://' + host + ':' + port + '/';

module.exports = function () {
    return {
        check_server_on: function () {
            // check server is on
            let request = net.request(ROOT_URL + 'status');
            request.on('response', (response) => {
                console.log("[SUCCESS] Web server is on.")
            });
            request.on('error', (error) => {
                console.log("[ERROR] Response has error: " + error);
            })
            request.end();
        },

        make_http_get_request: function (path) {
            const request = net.request({
                method: 'GET',
                protocol: 'http:',
                hostname: host,
                path: path
            })
        },

        make_http_post_request: function (path) {
            const request = net.request({
                method: 'POST',
                protocol: 'http:',
                hostname: host,
                path: path
            })
        }
    }
}