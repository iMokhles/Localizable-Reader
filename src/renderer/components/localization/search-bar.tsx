import { Search, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useDebounce } from 'use-debounce'

import { Button } from 'renderer/components/ui/button'
import { Input } from 'renderer/components/ui/input'
import { useLocalizationStore } from 'renderer/lib/stores/localization-store'

export function SearchBar() {
  const { searchFilters, setSearchQuery, setSelectedFile, availableFiles, selectedFile } = useLocalizationStore()
  const [localQuery, setLocalQuery] = useState(searchFilters.query)
  const [debouncedQuery] = useDebounce(localQuery, 300)

  // Update the store when debounced query changes
  useEffect(() => {
    setSearchQuery(debouncedQuery)
  }, [debouncedQuery, setSearchQuery])

  const handleSearchChange = (value: string) => {
    setLocalQuery(value)
  }

  const handleFileSelectionChange = (value: string) => {
    setSelectedFile(value || null)
  }

  const clearSearch = () => {
    setLocalQuery('')
  }

  const files = availableFiles()

  return (
    <div className="flex flex-col gap-4 p-4 bg-gray-900/50 rounded-lg">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search keys and values..."
            value={localQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10 pr-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-teal-500"
          />
          {localQuery && (
            <Button
              variant="ghost"
              size="icon"
              onClick={clearSearch}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {files.length > 0 && (
        <div className="flex gap-2">
          <select
            value={selectedFile || ""}
            onChange={(e) => handleFileSelectionChange(e.target.value)}
            className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white text-sm focus:border-teal-500 focus:outline-none"
          >
            <option value="">All files</option>
            {files.map((file) => (
              <option key={file} value={file}>
                {file}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  )
}
