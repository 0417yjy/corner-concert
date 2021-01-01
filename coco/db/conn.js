const mysql = require('mysql');
const config = require('./dbinfo');
const { BrowserWindow } = require('electron');

module.exports = function () {
    return {
        init: function () {
            return mysql.createConnection(config.local)
        },

        open: function (conn) {
            const mainWindow = BrowserWindow.getFocusedWindow();
            conn.connect(function (err, callback) {
                if (err) {
                    console.log("[ERROR] Cannot connect to MySQL!: " + err);
                    mainWindow.webContents.send('callFunction', 'connect', false);
                } else {
                    console.log("[SUCCESS] Connected to MySQL!");
                    mainWindow.webContents.send('callFunction', 'connect', true);
                }
            })
        },

        close: function (conn) {
            conn.end(function (err) {
                if (err) con.destroy();
                console.log("[SUCCESS] Disconnected to MySQL.");
                mainWindow.webContents.send('callFunction', 'disconnect', true);
            })
        }
    }
}