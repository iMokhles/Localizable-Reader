import { app } from "electron";

import { makeAppWithSingleInstanceLock } from "lib/electron-app/factories/app/instance";
import { makeAppSetup } from "lib/electron-app/factories/app/setup";
import { registerFileHandlers } from "./ipc/file-handlers";
import { MainWindow } from "./windows/main";

makeAppWithSingleInstanceLock(async () => {
  await app.whenReady();

  // Register IPC handlers
  registerFileHandlers();

  await makeAppSetup(MainWindow);
});
