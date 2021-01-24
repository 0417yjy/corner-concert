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
    // console.log(`STATUS: ${response.statusCode}`);
    // console.log(`HEADERS: ${JSON.stringify(response.headers)}`);
    // response.on('data', (chunk) => {
    //   console.log(`BODY: ${chunk}`);
    //   win.webContents.send("callFunction", "login", JSON.parse(chunk));
    // });
    switch (response.statusCode) {
      case 200:
        // 로그인 성공
        response.on('data', (chunk) => {
          chunk = JSON.parse(chunk);
          chunk.success = true;
          win.webContents.send("callFunction", "login", chunk);
        });
        break;
      case 403:
        // 로그인 실패
        response.on('data', (chunk) => {
          chunk = JSON.parse(chunk);
          chunk.success = false;
          win.webContents.send("callFunction", "login", chunk);
        });
        break;
      default:
        // 서버 오류
        response.on('data', (chunk) => {
          chunk = JSON.parse(chunk);
          chunk.success = false;
          win.webContents.send("callFunction", "login", chunk);
        });
        break;
    }
  });

  request.on('error', (error) => {
    console.log(`ERROR: ${JSON.stringify(error)}`)
  });

  request.end();
});

ipcMain.on('sendveri', (event, args) => {
  const body = JSON.stringify({ email: args });
  const request = coco_net.make_http_put_request('/user/register/sendveri', body);
  request.on('response', (response) => {
    //console.log(`STATUS: ${response.statusCode}`); 
        // console.log(`HEADERS: ${JSON.stringify(response.headers)}`); 
        response.on('data', (chunk) => { 
          console.log(`BODY: ${chunk}`);
        }); 
  })
  request.on('error', (error) => {
    console.log(`ERROR: ${JSON.stringify(error)}`) 
  })
  request.end();
})

ipcMain.on('confirmveri', (event, args) => {
  let win = BrowserWindow.getFocusedWindow();

  const body = JSON.stringify(args);
  const request = coco_net.make_http_post_request('/user/register/confirmveri/', body);
  request.on('response', (response) => {
    //console.log(`STATUS: ${response.statusCode}`); 
        // console.log(`HEADERS: ${JSON.stringify(response.headers)}`); 
        response.on('data', (chunk) => { 
          // console.log(`BODY: ${chunk}`);
          let obj = JSON.parse(chunk);
          win.webContents.send("callFunction", "checkVerified", obj.success);
        }); 
  })
  request.on('error', (error) => {
    // console.log(`ERROR: ${JSON.stringify(error)}`)
    win.webContents.send("callFunction", "checkVerified", false);
  })
  request.end();
})

ipcMain.on('checkdup', (event, args) => {
  let win = BrowserWindow.getFocusedWindow();
  const request = coco_net.make_http_get_request('/user/register/checkdup/' + args);
  request.on('response', (response) => {
    //console.log(`STATUS: ${response.statusCode}`); 
        // console.log(`HEADERS: ${JSON.stringify(response.headers)}`); 
        response.on('data', (chunk) => { 
          // console.log(`BODY: ${chunk}`);
          let obj = JSON.parse(chunk);
          win.webContents.send("callFunction", "checkDuplicate", obj.success);
        }); 
  })
  request.on('error', (error) => {
    // console.log(`ERROR: ${JSON.stringify(error)}`)
    win.webContents.send("callFunction", "checkDuplicate", false);
  })
  request.end();
});

ipcMain.on('addNewUser', (event, args) => {
  let win = BrowserWindow.getFocusedWindow();
  // console.log('Add new user: ' + args);

  args.pw = coco_net.hash(args.pw); // client-side encryption
  const body = JSON.stringify(args);
  const request = coco_net.make_http_post_request('/user/register', body);
  request.on('response', (response) => {
    //console.log(`STATUS: ${response.statusCode}`); 
        // console.log(`HEADERS: ${JSON.stringify(response.headers)}`); 
        response.on('data', (chunk) => { 
          // console.log(`BODY: ${chunk}`);
          let obj = JSON.parse(chunk);
          win.webContents.send("callFunction", "register", obj.success);
        }); 
  })
  request.on('error', (error) => {
    // console.log(`ERROR: ${JSON.stringify(error)}`)
    win.webContents.send("callFunction", "register", false);
  })
  request.end();
});
/* ---------------------------- IPC 함수 끝 ---------------------------*/

let mainWindow;
let roomWindow;

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

function createRoom() {
  roomWindow = new BrowserWindow({
    parent: mainWindow,
    show: false,
    minWidth: 900,
    minHeight: 300,
    frame: false, // 메뉴 삭제
    backgroundColor: '#FFF', // subpixel anti-aliasing enabled (https://github.com/electron/electron/issues/6344#issuecomment-420371918)
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
    }
  })
  roomWindow.maximize(); // 켤 때 최대화
  roomWindow.show();
  
  roomWindow.loadFile('room.html');

  roomWindow.on('closed', () => {
    roomWindow = null;
  });
}


app.whenReady().then(createWindow)
// app.whenReady().then(createRoom)

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