/*
 * File: netutils.js
 * Project: corner-concert
 * File Created: Sunday, 17th January 2021 1:57:47 am
 * Author: Jongyeon Yoon (0417yjy@naver.com)
 * Desc: HTTP 요청 생성, 문자 암호화 등 서버와 의사소통할 때 유용한 기능들을 제공하는 함수들
 * -----
 * Last Modified: Monday, 18th January 2021 3:34:20 am
 * Modified By: Jongyeon Yoon (0417yjy@naver.com>)
 * -----
 * Copyright 2021 Jongyeon Yoon
 */


const { net } = require('electron');
const config = require('./webinfo');
const crypto = require('crypto');

// web server variables
// const host = config.testsvr.host; // for developing use only
// const port = config.testsvr.port;
const host = config.stablesvr.host;
const port = config.stablesvr.port;
const ROOT_URL = 'http://' + host + ':' + port + '/';

module.exports = function () {
    return {
        method: {
            GET: 'GET',
            POST: 'POST',
            PUT: 'PUT',
            DELETE: 'DELETE'
        },

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

        make_http_request: function (method_selected, arg_path, body, option = {host: host, port: port}) {
            const request = net.request({
                method: method_selected,
                protocol: 'http:',
                hostname: option.host,
                port: option.port,
                path: arg_path
            })
            request.setHeader('content-type', 'application/json'); 
            if (body !== undefined) {
                request.write(body, 'utf-8');
            }
            return request;
        },

        hash: function (str) {
            return crypto.createHash('sha512').update(str).digest('base64');
        }
    }
}