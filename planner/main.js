const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1600,
    height: 900,
    title: "COMMAND — ORBAT / Mission Planner",
    icon: path.join(__dirname, 'command-icon.ico'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js")
    }
  });

  win.setMenuBarVisibility(false);
  win.loadFile('index.html');
}

ipcMain.handle('presentation-tile', async (event, coord) => {
  if (event.senderFrame !== event.sender.mainFrame || event.senderFrame.url !== require('url').pathToFileURL(path.join(__dirname,'index.html')).href) throw Error('Unexpected sender');
  if (!coord || !['z','x','y'].every(k => Number.isInteger(coord[k])) || coord.z<0 || coord.z>5 || Math.abs(coord.x)>256 || Math.abs(coord.y)>256) throw Error('Invalid tile');
  const ctrl=new AbortController(),timer=setTimeout(()=>ctrl.abort(),12000);
  try {const r=await fetch(`https://reforger.recoil.org/map-tiles/everon/${coord.z}/${coord.x}/${coord.y}/tile.jpg`,{signal:ctrl.signal,redirect:'error'});if(!r.ok)throw Error('Terrain HTTP '+r.status);const buffer=Buffer.from(await r.arrayBuffer());if(buffer.length>4000000)throw Error('Oversized tile');return 'data:image/jpeg;base64,'+buffer.toString('base64');} finally {clearTimeout(timer)}
});
app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});