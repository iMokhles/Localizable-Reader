import { ipcMain, dialog } from "electron";

import { LocalizationService } from "../services/localization-service";

export function registerFileHandlers() {
  // Select folder dialog
  ipcMain.handle("select-folder", async () => {
    const result = await dialog.showOpenDialog({
      properties: ["openDirectory"],
      title: "Select .lproj folder",
      buttonLabel: "Select Folder",
    });

    if (result.canceled || result.filePaths.length === 0) {
      return null;
    }

    return result.filePaths[0];
  });

  // Find all .strings files in a folder
  ipcMain.handle("find-strings-files", async (_, folderPath: string) => {
    try {
      return await LocalizationService.findStringsFiles(folderPath);
    } catch (error) {
      throw new Error(
        `Failed to read folder: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  });

  // Convert .strings file to JSON using plutil
  ipcMain.handle("convert-strings-to-json", async (_, filePath: string) => {
    try {
      return await LocalizationService.convertStringsToJson(filePath);
    } catch (error) {
      throw new Error(
        `Failed to convert strings file: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  });

  // Load entire localization project
  ipcMain.handle(
    "load-localization-project",
    async (_, projectPath: string) => {
      try {
        return await LocalizationService.loadProject(projectPath);
      } catch (error) {
        throw new Error(
          `Failed to load project: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }
  );
}
