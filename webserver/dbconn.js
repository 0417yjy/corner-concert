const mysql = require('mysql');
const config = require('./info');

module.exports = function () {
    return {
        init: function () {
            return mysql.createConnection(config.db)
        },

        open: function (conn) {
            conn.connect(function (err, callback) {
                if (err) {
                    console.log("[ERROR] Cannot connect to MySQL!: " + err);
                } else {
                    console.log("[SUCCESS] Connected to MySQL!");
                }
            })
        },

        close: function (conn) {
            conn.end(function (err) {
                if (err) conn.destroy();
                console.log("[SUCCESS] Disconnected to MySQL.");
            })
        },

        execute: function (conn, sql, args, callback) {
            return conn.query(sql, args, (error, results, fields) => {
                if (error) {
                    callback(true, error)
                }
                else {
                    callback(false, results)
                }
            });
        }
    }
}