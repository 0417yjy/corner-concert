const mysql = require('mysql');
const config = require('./info');

module.exports = function () {
    return {
        init: function () {
            conn = mysql.createConnection(config.db);
        },

        open: function () {
            conn.connect(function (err, callback) {
                if (err) {
                    console.log("[ERROR] Cannot connect to MySQL!: " + err);
                } else {
                    console.log("[SUCCESS] Connected to MySQL!");
                }
            })
        },

        close: function () {
            conn.end(function (err) {
                if (err) conn.destroy();
                console.log("[SUCCESS] Disconnected to MySQL.");
            })
        },

        execute: function (sql, args, callback) {
            return conn.query(sql, args, (error, results, fields) => {
                if (error) {
                    callback(true, error)
                }
                else {
                    callback(false, results)
                }
            });
        },

        is_open: function () {
            conn.ping((err) => {
                return "[ERROR] Disconnected to DB!";
            })
            return "[SUCCESS] DB is ready!";
        }
    }
}