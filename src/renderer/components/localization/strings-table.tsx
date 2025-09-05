import { Copy, FileText, Key, MessageSquare } from 'lucide-react'
import { useState } from 'react'

import { Button } from 'renderer/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from 'renderer/components/ui/table'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from 'renderer/components/ui/tooltip'
import { useLocalizationStore } from 'renderer/lib/stores/localization-store'
import { Pagination } from './pagination'

export function StringsTable() {
  const { paginatedEntries, filteredEntries, project, searchFilters, selectedFile } = useLocalizationStore()
  const [copiedItem, setCopiedItem] = useState<{ type: 'key' | 'value', key: string } | null>(null)

  const entries = paginatedEntries()
  const totalEntries = filteredEntries().length

  const copyToClipboard = async (text: string, key: string, type: 'key' | 'value') => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedItem({ type, key })
      setTimeout(() => setCopiedItem(null), 2000)
    } catch (err) {
      console.error('Failed to copy to clipboard:', err)
    }
  }

  if (!project) {
    return null
  }

  if (totalEntries === 0) {
    const hasSearchQuery = searchFilters.query && searchFilters.query.trim()
    
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-400">
        <FileText className="w-12 h-12 mb-4 opacity-50" />
        <p className="text-lg font-medium">
          {hasSearchQuery ? "No entries found" : "No entries available"}
        </p>
        <p className="text-sm">
          {hasSearchQuery 
            ? "Try adjusting your search or file filter" 
            : "This project doesn't contain any localization entries"
          }
        </p>
      </div>
    )
  }

  return (
    <TooltipProvider>
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between p-4 border-b border-gray-700 flex-shrink-0">
          <h2 className="text-lg font-semibold text-white">
            Localization Entries ({totalEntries})
          </h2>
        </div>
      
      <div className="flex-1 overflow-auto min-h-0 bg-gray-900">
        <div className="relative">
          <Table className="bg-gray-900">
            <TableHeader className="sticky top-0 bg-gray-900 z-10">
              <TableRow className="border-gray-700 bg-gray-900">
                <TableHead className="text-gray-300 font-medium bg-gray-900">Key</TableHead>
                <TableHead className="text-gray-300 font-medium bg-gray-900">Value</TableHead>
                <TableHead className="text-gray-300 font-medium w-24 bg-gray-900">Copy</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="bg-gray-900">
              {entries.map((entry, index) => (
                <TableRow key={`${entry.file}-${entry.key}-${index}`} className="border-gray-800 hover:bg-gray-800/50 bg-gray-900">
                  <TableCell className="font-mono text-sm text-gray-300 max-w-xs bg-gray-900">
                    <div className="truncate" title={entry.key}>
                      {entry.key}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {entry.file}
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-100 max-w-md bg-gray-900">
                    <div className="break-words whitespace-pre-wrap">
                      {entry.value}
                    </div>
                  </TableCell>
                  <TableCell className="bg-gray-900">
                    <div className="flex flex-col gap-1">
                      <div className="flex gap-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => copyToClipboard(entry.key, entry.key, 'key')}
                              className="h-8 w-8 text-gray-400 hover:text-teal-400 transition-colors group"
                            >
                              <div className="flex items-center gap-1">
                                <Key className="w-3 h-3" />
                                <Copy className="w-2 h-2" />
                              </div>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Copy localization key to clipboard</p>
                          </TooltipContent>
                        </Tooltip>
                        
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => copyToClipboard(entry.value, entry.key, 'value')}
                              className="h-8 w-8 text-gray-400 hover:text-teal-400 transition-colors group"
                            >
                              <div className="flex items-center gap-1">
                                <MessageSquare className="w-3 h-3" />
                                <Copy className="w-2 h-2" />
                              </div>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Copy localization value to clipboard</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      {copiedItem?.key === entry.key && (
                        <div className="text-xs text-teal-400 font-medium">
                          {copiedItem.type === 'key' ? 'Key copied!' : 'Value copied!'}
                        </div>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      
        <Pagination />
      </div>
    </TooltipProvider>
  )
}
