const { app, BrowserWindow, session } = require('electron');
const path = require('path');
const url = require('url');

const loadExtension = (mainWindow) => {
  return new Promise((resolve) => {
      session.defaultSession
          .loadExtension(path.resolve(__dirname, "./electron-extension-reload-test"))
          .then(({
              id: extensionId
          }) => {
              return mainWindow.loadURL(`chrome-extension://${extensionId}/test.html`);
          })
          .then(() => {
              resolve(true);
          });
  });
};

let win;

async function createWindow() {
  app.commandLine.appendSwitch("--disable-site-isolation-trials");

  win = new BrowserWindow({
      width: 800,
      height: 600
  })

  await loadExtension(win);

  win.webContents.openDevTools()

  win.on('closed', () => {
      win = null
  })
}


app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
      app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
});