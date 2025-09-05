import { create } from "zustand";
import { devtools } from "zustand/middleware";

import type {
  LocalizationState,
  SearchFilters,
  LocalizationProject,
  LocalizationEntry,
} from "shared/types";

interface LocalizationStore extends LocalizationState {
  // Computed getters
  filteredEntries: () => LocalizationEntry[];
  paginatedEntries: () => LocalizationEntry[];
  totalPages: () => number;
  availableFiles: () => string[];
}

export const useLocalizationStore = create<LocalizationStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      project: null,
      isLoading: false,
      error: null,
      searchFilters: {
        query: "",
        fileFilter: "",
      },
      selectedFile: null,
      currentPage: 1,
      pageSize: 10,

      // Actions
      loadProject: async (path: string) => {
        set({ isLoading: true, error: null });

        try {
          // This will be implemented with the file service
          const project = await window.App.loadLocalizationProject(path);
          set({
            project,
            isLoading: false,
            selectedFile: project?.files[0]?.name || null,
          });
        } catch (error) {
          set({
            error:
              error instanceof Error ? error.message : "Failed to load project",
            isLoading: false,
          });
        }
      },

      setSearchQuery: (query: string) => {
        set((state) => ({
          searchFilters: { ...state.searchFilters, query },
          currentPage: 1, // Reset to first page when searching
        }));
      },

      setFileFilter: (file: string) => {
        set((state) => ({
          searchFilters: { ...state.searchFilters, fileFilter: file },
        }));
      },

      setSelectedFile: (file: string | null) => {
        set({ selectedFile: file, currentPage: 1 }); // Reset to first page when changing file
      },

      setCurrentPage: (page: number) => {
        set({ currentPage: page });
      },

      clearError: () => {
        set({ error: null });
      },

      // Computed getters
      filteredEntries: () => {
        const { project, searchFilters, selectedFile } = get();

        if (!project) return [];

        let entries: LocalizationEntry[] = [];

        // First, determine which files to include
        if (selectedFile) {
          // If a specific file is selected, only show entries from that file
          const selectedFileData = project.files.find(
            (f) => f.name === selectedFile
          );
          if (selectedFileData) {
            entries = selectedFileData.entries;
          }
        } else {
          // Show all entries from all files
          entries = project.files.flatMap((file) => file.entries);
        }

        // Filter by search query (only if there's a query)
        if (searchFilters.query && searchFilters.query.trim()) {
          const query = searchFilters.query.toLowerCase();
          entries = entries.filter(
            (entry) =>
              entry.key.toLowerCase().includes(query) ||
              entry.value.toLowerCase().includes(query)
          );
        }
        return entries;
      },

      paginatedEntries: () => {
        const { currentPage, pageSize } = get();
        const allEntries = get().filteredEntries();
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginated = allEntries.slice(startIndex, endIndex);
        return paginated;
      },

      totalPages: () => {
        const { pageSize } = get();
        const allEntries = get().filteredEntries();
        return Math.ceil(allEntries.length / pageSize);
      },

      availableFiles: () => {
        const { project } = get();
        return project?.files.map((file) => file.name) || [];
      },
    }),
    {
      name: "localization-store",
    }
  )
);
