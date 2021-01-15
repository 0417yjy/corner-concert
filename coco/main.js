const { app, BrowserWindow } = require('electron')

let mainWindow;
let roomWindow;

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

function createRoom() {
  roomWindow = new BrowserWindow({
    parent: mainWindow,
    show: false,
    width: 1920,
    height: 1080,
    frame: false, // 메뉴 삭제
    backgroundColor: '#FFF', // subpixel anti-aliasing enabled (https://github.com/electron/electron/issues/6344#issuecomment-420371918)
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true
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
app.whenReady().then(createRoom)

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