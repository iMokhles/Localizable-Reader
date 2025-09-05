import type { BrowserWindow, IpcMainInvokeEvent } from "electron";

import type { registerRoute } from "lib/electron-router-dom";

export type BrowserWindowOrNull = Electron.BrowserWindow | null;

type Route = Parameters<typeof registerRoute>[0];

export interface WindowProps extends Electron.BrowserWindowConstructorOptions {
  id: Route["id"];
  query?: Route["query"];
}

export interface WindowCreationByIPC {
  channel: string;
  window(): BrowserWindowOrNull;
  callback(window: BrowserWindow, event: IpcMainInvokeEvent): void;
}

// Localization types - defined in main process and re-exported here
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

export interface SearchFilters {
  query: string;
  fileFilter: string;
}

export interface LocalizationState {
  // Data
  project: LocalizationProject | null;
  isLoading: boolean;
  error: string | null;

  // UI State
  searchFilters: SearchFilters;
  selectedFile: string | null;

  // Pagination
  currentPage: number;
  pageSize: number;

  // Actions
  loadProject: (path: string) => Promise<void>;
  setSearchQuery: (query: string) => void;
  setFileFilter: (file: string) => void;
  setSelectedFile: (file: string | null) => void;
  setCurrentPage: (page: number) => void;
  clearError: () => void;
}
