const { app, BrowserWindow, ipcMain } = require('electron');
const coco_net = require('./netutils')();
const cmd = require('node-cmd');
const { spawn } = require('child_process');

var child_server = null;
var server_port = 3001;
var hosted = false;

/* ---------------------------- IPC 함수 시작 --------------------------*/
ipcMain.on('checkServer', (event, arg) => {
  coco_net.check_server_on();
})

ipcMain.on('tryLogin', (event, args) => {
  let win = BrowserWindow.getFocusedWindow();

  args.pw = coco_net.hash(args.pw); // client-side encryption
  const body = JSON.stringify(args);
  const request = coco_net.make_http_request(coco_net.method.POST, '/auth/login', body);
  request.on('response', (response) => {
    // console.log(`STATUS: ${response.statusCode}`);
    // console.log(`HEADERS: ${JSON.stringify(response.headers)}`);
    // response.on('data', (chunk) => {
    //   console.log(`BODY: ${chunk}`);
    //   win.webContents.send("login", JSON.parse(chunk));
    // });
    switch (response.statusCode) {
      case 200:
        // 로그인 성공
        response.on('data', (chunk) => {
          chunk = JSON.parse(chunk);
          chunk.success = true;
          win.webContents.send("login", chunk);
        });
        break;
      case 403:
        // 로그인 실패
        response.on('data', (chunk) => {
          chunk = JSON.parse(chunk);
          chunk.success = false;
          console.log('403: ' + chunk.message);
          win.webContents.send("login", chunk);
        });
        break;
      default:
        // 서버 오류
        response.on('data', (chunk) => {
          chunk = JSON.parse(chunk);
          chunk.success = false;
          console.log(response.statusCode + ': ' + chunk.message);
          win.webContents.send("login", chunk);
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
  const request = coco_net.make_http_request(coco_net.method.PUT, '/user/register/sendveri', body);
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
  const request = coco_net.make_http_request(coco_net.method.POST, '/user/register/confirmveri/', body);
  request.on('response', (response) => {
    //console.log(`STATUS: ${response.statusCode}`); 
        // console.log(`HEADERS: ${JSON.stringify(response.headers)}`); 
        response.on('data', (chunk) => { 
          // console.log(`BODY: ${chunk}`);
          let obj = JSON.parse(chunk);
          win.webContents.send("checkVerified", obj.success);
        }); 
  })
  request.on('error', (error) => {
    // console.log(`ERROR: ${JSON.stringify(error)}`)
    win.webContents.send("checkVerified", false);
  })
  request.end();
})

ipcMain.on('checkdup', (event, args) => {
  let win = BrowserWindow.getFocusedWindow();
  const request = coco_net.make_http_request(coco_net.method.GET, '/user/register/checkdup/' + args);
  request.on('response', (response) => {
    //console.log(`STATUS: ${response.statusCode}`); 
        // console.log(`HEADERS: ${JSON.stringify(response.headers)}`); 
        response.on('data', (chunk) => { 
          // console.log(`BODY: ${chunk}`);
          let obj = JSON.parse(chunk);
          win.webContents.send("checkDuplicate", obj.success);
        }); 
  })
  request.on('error', (error) => {
    // console.log(`ERROR: ${JSON.stringify(error)}`)
    win.webContents.send("checkDuplicate", false);
  })
  request.end();
});

ipcMain.on('addNewUser', (event, args) => {
  let win = BrowserWindow.getFocusedWindow();
  // console.log('Add new user: ' + args);

  args.pw = coco_net.hash(args.pw); // client-side encryption
  const body = JSON.stringify(args);
  const request = coco_net.make_http_request(coco_net.method.POST, '/user/register', body);
  request.on('response', (response) => {
    //console.log(`STATUS: ${response.statusCode}`); 
        // console.log(`HEADERS: ${JSON.stringify(response.headers)}`); 
        response.on('data', (chunk) => { 
          // console.log(`BODY: ${chunk}`);
          let obj = JSON.parse(chunk);
          win.webContents.send("register", obj.success);
        }); 
  })
  request.on('error', (error) => {
    // console.log(`ERROR: ${JSON.stringify(error)}`)
    win.webContents.send("register", false);
  })
  request.end();
});

ipcMain.on('deleteUser', (event, args) => {
  let win = BrowserWindow.getFocusedWindow();
  // console.log('Add new user: ' + args);

  const request = coco_net.make_http_request(coco_net.method.DELETE, '/user/' + args.id, body);
  request.on('response', (response) => {
    //console.log(`STATUS: ${response.statusCode}`); 
        // console.log(`HEADERS: ${JSON.stringify(response.headers)}`); 
        response.on('data', (chunk) => { 
          // console.log(`BODY: ${chunk}`);
          let obj = JSON.parse(chunk);
          win.webContents.send("delete_user", obj.success);
        }); 
  })
  request.on('error', (error) => {
    // console.log(`ERROR: ${JSON.stringify(error)}`)
    win.webContents.send("delete_user", false);
  })
  request.end();
});

ipcMain.on('createConcertWindow', (event, args) => {
  cmd.run('node webrtc/server.js');
  createRoom();
})

ipcMain.on('hostServer', (event, args) => {
  console.log('hosting express server..');
  const server_process = spawn('cmd', ['node', 'webrtc\\server.js']);

  server_process.on('error', (error) => {
    console.log(error);
  })

  server_process.stdout.on('data', (data) => {
    console.log(data);
  });

  server_process.stderr.on('data', (data) => {
    console.log(data);
  });

  child_server = server_process;
  hosted = true;
})
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

  mainWindow.on('close', () => {
    console.log('main is closed');
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

  roomWindow.on('close', () => {
    roomWindow = null;
    console.log('concertorom closed');
    if (hosted) {
      console.log('killing server process...');
      // console.log(child_server);
      child_server.kill();

      hosted = false;
      child_server = null;
    }
  });
}


app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (hosted) {
    child_server.kill();
  }
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})