import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import React, { useMemo } from 'react'

import { Button } from 'renderer/components/ui/button'
import { useLocalizationStore } from 'renderer/lib/stores/localization-store'

export function Pagination() {
  const { 
    currentPage, 
    totalPages, 
    setCurrentPage, 
    filteredEntries 
  } = useLocalizationStore()
  
  const get = useLocalizationStore.getState

  const totalEntries = filteredEntries().length
  const hasEntries = totalEntries > 0


  // Generate page numbers to display
  const pageNumbers = useMemo(() => {
    const pages: (number | 'ellipsis')[] = []
    const maxVisiblePages = 5

    if (totalPages() <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages(); i++) {
        pages.push(i)
      }
    } else {
      // Show first page
      pages.push(1)

      if (currentPage > 3) {
        pages.push('ellipsis')
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages() - 1, currentPage + 1)

      for (let i = start; i <= end; i++) {
        if (i !== 1 && i !== totalPages()) {
          pages.push(i)
        }
      }

      if (currentPage < totalPages() - 2) {
        pages.push('ellipsis')
      }

      // Show last page
      if (totalPages() > 1) {
        pages.push(totalPages())
      }
    }

    return pages
  }, [currentPage, totalPages()])

  if (!hasEntries || totalPages() <= 1) {
    return null
  }

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages()) {
      setCurrentPage(page)
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1
      useLocalizationStore.setState({ currentPage: newPage })
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages()) {
      const newPage = currentPage + 1
      useLocalizationStore.setState({ currentPage: newPage })
    }
  }

  const startEntry = (currentPage - 1) * 10 + 1
  const endEntry = Math.min(currentPage * 10, totalEntries)

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-700 bg-gray-900">
      <div className="text-sm text-gray-400">
        Showing {startEntry} to {endEntry} of {totalEntries} entries
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="h-8 w-8 p-0 text-gray-400 hover:text-teal-600 disabled:opacity-50"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        {pageNumbers.map((page, index) => (
          <div key={index}>
            {page === 'ellipsis' ? (
              <div className="flex items-center justify-center w-8 h-8 text-gray-400">
                <MoreHorizontal className="w-4 h-4" />
              </div>
            ) : (
              <Button
                variant={currentPage === page ? "default" : "ghost"}
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handlePageChange(page);
                }}
                className={`h-8 w-8 p-0 ${
                  currentPage === page
                    ? 'bg-teal-600 text-white hover:bg-teal-700'
                    : 'text-gray-400 hover:text-teal-600'
                }`}
              >
                {page}
              </Button>
            )}
          </div>
        ))}

        <Button
          variant="ghost"
          size="sm"
          onClick={handleNextPage}
          disabled={currentPage === totalPages()}
          className="h-8 w-8 p-0 text-gray-400 hover:text-teal-600 disabled:opacity-50"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
