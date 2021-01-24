const express = require('express');
const app = express();
const bodyParser = require('body-parser');
var db = require('./dbconn')();
require('dotenv').config(); 

// init db connection
db.init();
db.open();

// Other settings
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(function (req, res, next) { // 1
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'content-type, x-access-token');
  next();
});

// 서버 체크용 URI
app.get('/status', (req, res) => res.send('Server is on'));
// 라우트 설정
app.use('/user', require('./api/user'));
app.use('/auth', require('./api/auth'));

app.listen(3000, () => {
    console.log('CoCo Web server running on port 3000');
})