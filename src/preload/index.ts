import { contextBridge, ipcRenderer } from "electron";

declare global {
  interface Window {
    App: typeof API;
  }
}

const API = {
  sayHelloFromBridge: () => console.log("\nHello from bridgeAPI! 👋\n\n"),
  username: process.env.USER,

  // File operations
  selectFolder: () => ipcRenderer.invoke("select-folder"),
  findStringsFiles: (folderPath: string) =>
    ipcRenderer.invoke("find-strings-files", folderPath),
  convertStringsToJson: (filePath: string) =>
    ipcRenderer.invoke("convert-strings-to-json", filePath),
  loadLocalizationProject: (projectPath: string) =>
    ipcRenderer.invoke("load-localization-project", projectPath),
};

contextBridge.exposeInMainWorld("App", API);
