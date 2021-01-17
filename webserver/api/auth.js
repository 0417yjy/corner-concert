var express  = require('express');
var router = express.Router();

router.get('/', (req, res) => {
    console.log('Got request');
    res.send('Sent response');
})

router.post('/login', (req, res) => {
    console.log(req);
    res.send('Got request!');
    
    // let sql = "CALL TRY_LOGIN(?, ?)";
    // db.execute(connection, sql, args, (err, results) => {
    //     //console.log(results);
    //     var user_data = {
    //         success: false,
    //         id: null,
    //         nickname: null,
    //         email: null,
    //         bio: null
    //     };

    //     if (results[0][0]) {
    //         // 로그인 성공
    //         // user_data 새로 초기화
    //         user_data.success = true;
    //         user_data.id = results[0][0].login_id;
    //         user_data.nickname = results[0][0].nickname;
    //         user_data.email = results[0][0].email;
    //         user_data.bio = results[0][0].bio;
    //     }
    //     else {
    //         // 로그인 실패
    //         console.log('Login failed');
    //     }
    //     res.json(user_data);
    // });
});

module.exports = router;