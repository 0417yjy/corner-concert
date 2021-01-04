const { app, BrowserWindow, ipcMain } = require('electron');
const conn = require('./db/conn');
// try to connect database
var db = require('./db/conn')();
var connection;

/* ---------------------------- IPC 함수 시작 --------------------------*/
ipcMain.on('db_connect', (event, arg) => {
  connection = db.init();
  db.open(connection);
});

ipcMain.on('sendveri', (event, args) => {
  // console.log(arg);
  let sql = "CALL MAKE_VERIFICATION_CODE(?)";
  db.execute(connection, sql, args, (results) => {
    // console.log(results);
  });
})

ipcMain.on('confirmveri', (event, args) => {
  let win = BrowserWindow.getFocusedWindow();
  let sql = "SELECT GET_VERIFICATION_CODE(?) as code";
  db.execute(connection, sql, args[0], (results) => {
    console.log(results);
    if (results) {
      if (args[1] == results[0].code) {
        win.webContents.send("callFunction", "checkVerified", true);
      } else {
        win.webContents.send("callFunction", "checkVerified", false);
      }
    }
    else {
      win.webContents.send("callFunction", "checkVerified", false);
    }
  });
})
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