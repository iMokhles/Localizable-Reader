import { readdir } from "node:fs/promises";
import { join, extname } from "node:path";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export interface LocalizationEntry {
  key: string;
  value: string;
  file: string;
}

export interface LocalizationFile {
  name: string;
  path: string;
  entries: LocalizationEntry[];
}

export interface LocalizationProject {
  name: string;
  path: string;
  files: LocalizationFile[];
}

export class LocalizationService {
  /**
   * Load a localization project from a .lproj folder path
   */
  static async loadProject(projectPath: string): Promise<LocalizationProject> {
    try {
      // Get all .strings files in the .lproj folder
      const stringsFiles = await this.findStringsFiles(projectPath);

      if (stringsFiles.length === 0) {
        throw new Error("No .strings files found in the selected folder");
      }

      const files: LocalizationFile[] = [];

      // Process each .strings file
      for (const filePath of stringsFiles) {
        try {
          const fileName =
            filePath.split("/").pop() ||
            filePath.split("\\").pop() ||
            "unknown";

          console.log(`Processing file: ${fileName}`);
          const entries = await this.parseStringsFile(filePath);
          console.log(`Parsed ${entries.length} entries from ${fileName}`);

          if (entries.length > 0) {
            files.push({
              name: fileName,
              path: filePath,
              entries,
            });
            console.log(
              `Successfully added ${fileName} with ${entries.length} entries`
            );
          } else {
            console.log(`Skipping ${fileName} - no entries found`);
          }
        } catch (error) {
          console.warn(`Failed to parse ${filePath}:`, error);
          // Continue with other files even if one fails
        }
      }

      const projectName =
        projectPath.split("/").pop() ||
        projectPath.split("\\").pop() ||
        "Localization Project";

      return {
        name: projectName,
        path: projectPath,
        files,
      };
    } catch (error) {
      throw new Error(
        `Failed to load localization project: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Find all .strings files in a folder
   */
  static async findStringsFiles(folderPath: string): Promise<string[]> {
    try {
      const files = await readdir(folderPath);
      const stringsFiles = files
        .filter((file) => extname(file) === ".strings")
        .map((file) => join(folderPath, file));

      return stringsFiles;
    } catch (error) {
      throw new Error(
        `Failed to read folder: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Parse a .strings file using plutil -convert json
   */
  static async parseStringsFile(
    filePath: string
  ): Promise<LocalizationEntry[]> {
    try {
      // Use plutil to convert .strings to JSON
      const jsonContent = await this.convertStringsToJson(filePath);

      if (!jsonContent) {
        throw new Error("Failed to convert strings file to JSON");
      }

      console.log(`JSON content length: ${jsonContent.length}`);
      const parsed = JSON.parse(jsonContent);
      console.log(`Parsed JSON keys: ${Object.keys(parsed).length}`);

      const entries: LocalizationEntry[] = [];

      // Extract entries from the parsed JSON
      for (const [key, value] of Object.entries(parsed)) {
        if (typeof value === "string") {
          entries.push({
            key,
            value,
            file:
              filePath.split("/").pop() ||
              filePath.split("\\").pop() ||
              "unknown",
          });
        }
      }

      console.log(`Extracted ${entries.length} string entries`);
      return entries;
    } catch (error) {
      console.error(`Error parsing ${filePath}:`, error);
      throw new Error(
        `Failed to parse strings file: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Convert .strings file to JSON using plutil
   */
  static async convertStringsToJson(filePath: string): Promise<string> {
    try {
      const { stdout, stderr } = await execAsync(
        `plutil -convert json -o - "${filePath}"`
      );

      if (stderr) {
        console.warn("plutil stderr:", stderr);
      }

      return stdout;
    } catch (error) {
      throw new Error(
        `Failed to convert strings file: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }
}
