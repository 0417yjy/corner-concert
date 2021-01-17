var express = require('express');
var router = express.Router();

router.get('/:userid', function (req, res, next) {

});

router.post('/register', function (req, res, next) {
    let sql = "INSERT INTO user(nickname, login_id, email, bio, pw) VALUES (?, ?, ?, NULL, SHA2(?, 256))";
    db.execute(connection, sql, args, (err, results) => {
        if (err) {
            console.log("[ERROR] Register failed during executing sql state: " + results);
            win.webContents.send("callFunction", "register", false);
        } else {
            // console.log(results);
            win.webContents.send("callFunction", "register", true);
        }
    });
})

module.exports = router;