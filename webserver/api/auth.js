const express  = require('express');
const router = express.Router();
var db = require('../dbconn')();
const jwt = require('jsonwebtoken');
const util = require('../util');

router.get('/', (req, res) => {
    console.log('Got request');
    res.send('Sent response');
})

router.post('/login', (req, res) => {
    const args = new Array(req.body.id, req.body.pw);
    // console.log(args);
    
    let sql = "CALL TRY_LOGIN(?, ?)";
    db.execute(sql, args, (err, results) => {
        //console.log(results);
        
        if (err) {
            // 로그인 실패
            res.status(403).json({
                message: '[ERROR] ' + results.message,
            });
        }
        else if (results[0][0]) {
            // 로그인 성공
            const user_data = {
                id: results[0][0].login_id,
                nickname: results[0][0].nickname,
                email: results[0][0].email,
                bio: results[0][0].bio
            };

            // token 발급
            const token = jwt.sign(user_data, process.env.JWT_SECRET, {
                expiresIn: '7d'
            });

            res.status(200).json({
                message: 'A token has been granted.',
                user_data,
                token
            });
        }
        else {
            // 로그인 실패
            res.status(403).json({
                message: '[ERROR] No results',
            });
        }
    });
});

module.exports = router;