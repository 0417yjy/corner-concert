var express = require('express');
var router = express.Router();
const config = require('../info');
const nodemailer = require('nodemailer');
var db = require('../dbconn')();

// init nodemailer service
var transporter = nodemailer.createTransport(config.mail);

router.get('/:userid', function (req, res, next) {

});

router.post('/register', function (req, res, next) {


    let sql = "INSERT INTO user(nickname, login_id, email, bio, pw) VALUES (?, ?, ?, NULL, SHA2(?, 256))";
    db.execute(sql, args, (err, results) => {
        if (err) {
            console.log("[ERROR] Register failed during executing sql state: " + results);
            win.webContents.send("callFunction", "register", false);
        } else {
            // console.log(results);
            win.webContents.send("callFunction", "register", true);
        }
    });
});

router.put('/register/sendveri', function (req, res, next) {
    const args = req.body.email;
    // 코드 생성
    let sql = "CALL MAKE_VERIFICATION_CODE(?)";
    db.execute(sql, args, (err, results) => {
        // console.log(results);
    });

    // 코드 이메일로 전송
    sql = "SELECT GET_VERIFICATION_CODE(?) as code";
    db.execute(sql, args, (err, results) => {
        // console.log(results);
        if (results) {
            transporter.sendMail({
                from: "'CoCo Team' <coco-dev@naver.com>",
                to: args,
                subject: '[CoCo] 인증번호 입력',
                html: `
          <h3>CoCo에 오신 걸 환영합니다.</h3>
          <p>
            다음 인증코드를 해당 란에 입력하십시오: <br><br>

            ` + results[0].code + ` <br><br>

            '확인' 버튼을 눌러 인증을 완료 후 '회원가입' 버튼을 누르면 정상적으로 계정이 생성됩니다. <br><br>

            CoCo 팀 드림
          </p>
        `,
            }, function (err, info) {
                if (err) {
                    // console.log(err);
                } else {
                    // console.log('Message sent to: %s', info.messageId);
                }
            });
        }
        else {
            // results가 없는 경우
            // console.log('No results');
        }
    });
});

router.post('/register/confirmveri/', function (req, res, next) {
    const args = new Array(req.body.email, req.body.code);
    let sql = "SELECT GET_VERIFICATION_CODE(?) as code";
    db.execute(sql, args[0], (err, results) => {
        // console.log(results);
        let body = {
            success: false
        };
        if (results) {
            if (args[1] == results[0].code) {
                // 코드가 일치하는 경우
                body.success = true;
                res.send(body);
            } else {
                // 코드가 불일치하는 경우
                // console.log('Not same');
                res.send(body);
            }
        }
        else {
            // results가 없는 경우
            // console.log('No results');
            res.send(body);
        }
    });
});

router.get('/register/checkdup/:loginid', function (req, res, next) {
    const args = req.params.loginid;
    let sql = "SELECT CHECK_DUPLICATE_ID(?) as res";
    db.execute(sql, args, (err, results) => {
        let body = {
            success: false
        };
        if (results[0].res == 1) {
            // 중복되는 경우
            res.send(body);
        } else {
            // 중복되는 것이 없는 경우
            body.success = true;
            res.send(body);
        }
    });
})

module.exports = router;