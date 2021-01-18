const { app, BrowserWindow, ipcMain } = require('electron');
const coco_net = require('./netutils')();

/* ---------------------------- IPC 함수 시작 --------------------------*/
ipcMain.on('checkServer', (event, arg) => {
  coco_net.check_server_on();
})

ipcMain.on('tryLogin', (event, args) => {
  let win = BrowserWindow.getFocusedWindow();

  args.pw = coco_net.hash(args.pw); // client-side encryption
  const body = JSON.stringify(args);
  const request = coco_net.make_http_post_request('/auth/login', body);
  request.on('response', (response) => {
    console.log(`STATUS: ${response.statusCode}`); 
        // console.log(`HEADERS: ${JSON.stringify(response.headers)}`); 
        response.on('data', (chunk) => { 
          // console.log(`BODY: ${chunk}`);
          win.webContents.send("callFunction", "login", chunk);
        }); 
  })
  request.on('error', (error) => {
    console.log(`ERROR: ${JSON.stringify(error)}`) 
  })
  request.end();
});

ipcMain.on('sendveri', (event, args) => {
  // console.log(arg);

  // 코드 생성
  let sql = "CALL MAKE_VERIFICATION_CODE(?)";
  db.execute(connection, sql, args, (err, results) => {
    // console.log(results);
  });

  // 코드 이메일로 전송
  sql = "SELECT GET_VERIFICATION_CODE(?) as code";
  db.execute(connection, sql, args, (err, results) => {
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
          console.log(err);
        } else {
          console.log('Message sent to: %s', info.messageId);
        }
      });
    }
    else {
      // results가 없는 경우
      console.log('No results');
    }
  });
})

ipcMain.on('confirmveri', (event, args) => {
  let win = BrowserWindow.getFocusedWindow();
  let sql = "SELECT GET_VERIFICATION_CODE(?) as code";
  db.execute(connection, sql, args[0], (err, results) => {
    // console.log(results);
    if (results) {
      if (args[1] == results[0].code) {
        // 코드가 일치하는 경우
        win.webContents.send("callFunction", "checkVerified", true);
      } else {
        // 코드가 불일치하는 경우
        console.log('Not same');
        win.webContents.send("callFunction", "checkVerified", false);
      }
    }
    else {
      // results가 없는 경우
      console.log('No results');
      win.webContents.send("callFunction", "checkVerified", false);
    }
  });
})

ipcMain.on('checkdup', (event, args) => {
  let win = BrowserWindow.getFocusedWindow();
  let sql = "SELECT CHECK_DUPLICATE_ID(?) as res";
  db.execute(connection, sql, args, (err, results) => {
    if (results[0].res == 1) {
      // 중복되는 경우
      win.webContents.send("callFunction", "checkDuplicate", false);
    } else {
      // 중복되는 것이 없는 경우
      win.webContents.send("callFunction", "checkDuplicate", true);
    }
  });
});

ipcMain.on('addNewUser', (event, args) => {
  let win = BrowserWindow.getFocusedWindow();
  // console.log('Add new user: ' + args);
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
});
/* ---------------------------- IPC 함수 끝 ---------------------------*/

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false, // 메뉴 삭제
    backgroundColor: '#FFF', // subpixel anti-aliasing enabled (https://github.com/electron/electron/issues/6344#issuecomment-420371918)
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true
    }
  })

  mainWindow.loadFile('index.html');

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})