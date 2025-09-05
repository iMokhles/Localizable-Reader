import { useEffect } from 'react'

import { FileSelector } from 'renderer/components/localization/file-selector'
import { SearchBar } from 'renderer/components/localization/search-bar'
import { StringsTable } from 'renderer/components/localization/strings-table'
import { useLocalizationStore } from 'renderer/lib/stores/localization-store'

// The "App" comes from the context bridge in preload/index.ts
const { App } = window

export function MainScreen() {
  const { project } = useLocalizationStore()

  useEffect(() => {
    // check the console on dev tools
    App.sayHelloFromBridge()
  }, [])

  return (
    <main className="flex flex-col h-screen bg-black">
      {!project ? (
        <FileSelector />
      ) : (
        <div className="flex flex-col h-full min-h-0">
          <div className="p-4 border-b border-gray-800 flex-shrink-0">
            <SearchBar />
          </div>
          <div className="flex-1 min-h-0">
            <StringsTable />
          </div>
        </div>
      )}
    </main>
  )
}
