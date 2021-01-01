const { app, BrowserWindow } = require('electron')
// try to connect database
const ipcMain = require('electron').ipcMain;
var db = require('./db/conn')();
ipcMain.on('connect', (event, arg) => {
    var conn = db.init();
    db.open(conn);
})

let mainWindow;

function createWindow () {
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