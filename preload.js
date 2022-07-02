const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    startProcess: ( pep ) => ipcRenderer.send('startProcess', pep )
});

console.log("Exposed API to mainworld")
