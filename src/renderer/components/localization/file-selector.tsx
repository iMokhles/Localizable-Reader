import { FolderOpen, Loader2, Upload } from 'lucide-react'
import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

import { Button } from 'renderer/components/ui/button'
import { useLocalizationStore } from 'renderer/lib/stores/localization-store'

export function FileSelector() {
  const [isLoading, setIsLoading] = useState(false)
  const [dragMessage, setDragMessage] = useState<string | null>(null)
  const { loadProject, project, error, clearError } = useLocalizationStore()

  const handleSelectFolder = async () => {
    try {
      setIsLoading(true)
      clearError()
      
      const folderPath = await window.App.selectFolder()
      if (folderPath) {
        await loadProject(folderPath)
      }
    } catch (err) {
      console.error('Failed to load project:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const onDrop = useCallback(async (acceptedFiles: File[], fileRejections: any[]) => {
    console.log('React Dropzone - Files:', acceptedFiles)
    console.log('React Dropzone - Accepted files:', acceptedFiles.length)
    console.log('React Dropzone - Rejected files:', fileRejections.length)
    
    if (fileRejections.length > 0) {
      console.log('File rejections:', fileRejections)
    }

    if (acceptedFiles.length === 0) {
      // No files accepted, likely a folder drop
      console.log('No files accepted - likely a folder drop. Opening folder selection...')
      setDragMessage('Folder detected. Opening folder selection...')
      
      try {
        setIsLoading(true)
        clearError()
        const folderPath = await window.App.selectFolder()
        if (folderPath) {
          await loadProject(folderPath)
        }
      } catch (err) {
        console.error('Failed to load project:', err)
      } finally {
        setIsLoading(false)
        setDragMessage(null)
      }
      return
    }

    // Debug: Log file properties to understand the path structure
    console.log('First file properties:', {
      name: acceptedFiles[0].name,
      path: acceptedFiles[0].path,
      webkitRelativePath: acceptedFiles[0].webkitRelativePath,
      type: acceptedFiles[0].type,
      size: acceptedFiles[0].size
    })

    // Check if any files have .strings extension
    const stringsFiles = acceptedFiles.filter(file => file.name.endsWith('.strings'))
    
    if (stringsFiles.length > 0) {
      // Check if this looks like a folder drop with multiple .strings files
      const firstFile = stringsFiles[0]
      const isFolderDrop = stringsFiles.length > 1 || 
                          (firstFile.path && firstFile.path.includes('.lproj') && !firstFile.path.startsWith('/Users/'))
      
      if (isFolderDrop) {
        console.log('Detected folder drop with .strings files, opening folder selection...')
        setDragMessage('Folder with .strings files detected. Opening folder selection...')
        
        try {
          setIsLoading(true)
          clearError()
          const folderPath = await window.App.selectFolder()
          if (folderPath) {
            await loadProject(folderPath)
          }
        } catch (err) {
          console.error('Failed to load project:', err)
        } finally {
          setIsLoading(false)
          setDragMessage(null)
        }
      } else if (firstFile.path && firstFile.path.startsWith('/Users/')) {
        // Full absolute path available (starts with /Users/ on macOS)
        const fullPath = firstFile.path.replace(firstFile.name, '')
        console.log('Loading project from .strings file (absolute path):', fullPath)
        
        try {
          setIsLoading(true)
          clearError()
          await loadProject(fullPath)
        } catch (err) {
          console.error('Failed to load project with absolute path:', err)
          // Fall back to folder selection if absolute path fails
          console.log('Absolute path failed, falling back to folder selection')
          setDragMessage('Path extraction failed. Opening folder selection...')
          
          try {
            const folderPath = await window.App.selectFolder()
            if (folderPath) {
              await loadProject(folderPath)
            }
          } catch (folderErr) {
            console.error('Failed to load project via folder selection:', folderErr)
          } finally {
            setDragMessage(null)
          }
        } finally {
          setIsLoading(false)
        }
      } else {
        console.log('No valid absolute path available for .strings file, falling back to folder selection')
        setDragMessage('File detected but path not available. Opening folder selection...')
        
        try {
          setIsLoading(true)
          clearError()
          const folderPath = await window.App.selectFolder()
          if (folderPath) {
            await loadProject(folderPath)
          }
        } catch (err) {
          console.error('Failed to load project:', err)
        } finally {
          setIsLoading(false)
          setDragMessage(null)
        }
      }
    } else {
      // Check if this looks like a folder drop
      const firstFile = acceptedFiles[0]
      const isLikelyFolder = !firstFile.path && 
                            firstFile.type === '' && 
                            (firstFile.name.endsWith('.lproj') || firstFile.name.includes('lproj'))
      
      if (isLikelyFolder) {
        console.log('Detected folder drop (.lproj folder), opening folder selection...')
        setDragMessage('Folder detected. Opening folder selection...')
        
        try {
          setIsLoading(true)
          clearError()
          const folderPath = await window.App.selectFolder()
          if (folderPath) {
            await loadProject(folderPath)
          }
        } catch (err) {
          console.error('Failed to load project:', err)
        } finally {
          setIsLoading(false)
          setDragMessage(null)
        }
      } else if (firstFile.path) {
        const fullPath = firstFile.path.replace(firstFile.name, '')
        console.log('Loading project from any file:', fullPath)
        
        try {
          setIsLoading(true)
          clearError()
          await loadProject(fullPath)
        } catch (err) {
          console.error('Failed to load project:', err)
        } finally {
          setIsLoading(false)
        }
      } else {
        console.log('No path available for file, falling back to folder selection')
        setDragMessage('File detected but path not available. Opening folder selection...')
        
        try {
          setIsLoading(true)
          clearError()
          const folderPath = await window.App.selectFolder()
          if (folderPath) {
            await loadProject(folderPath)
          }
        } catch (err) {
          console.error('Failed to load project:', err)
        } finally {
          setIsLoading(false)
          setDragMessage(null)
        }
      }
    }
  }, [loadProject, clearError])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true, // Disable click to open file dialog
    noKeyboard: true, // Disable keyboard navigation
    multiple: true, // Allow multiple files
    accept: {
      'text/plain': ['.strings'],
      'application/octet-stream': ['.strings']
    }
  })

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white mb-2">
          LocalizableReader
        </h1>
        <p className="text-gray-400">
          Select a .lproj folder to view and search localization strings
        </p>
      </div>

      <div
        {...getRootProps()}
        className={`relative border-2 border-dashed rounded-lg p-8 transition-colors cursor-pointer ${
          isDragActive
            ? 'border-teal-400 bg-teal-400/10'
            : 'border-gray-600 hover:border-gray-500'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-2">
            <Upload className="w-8 h-8 text-gray-400" />
            <FolderOpen className="w-8 h-8 text-gray-400" />
          </div>
          
          <div className="text-center">
            <p className="text-white font-medium mb-1">
              {isDragActive ? 'Drop the folder here' : 'Drag & drop a .lproj folder'}
            </p>
            <p className="text-gray-400 text-sm">
              {isDragActive ? 'Release to open folder selection' : 'or click the button below'}
            </p>
          </div>

          <Button
            onClick={handleSelectFolder}
            disabled={isLoading}
            className="bg-teal-600 hover:bg-teal-700 text-white"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <FolderOpen className="w-4 h-4 mr-2" />
            )}
            {isLoading ? 'Loading...' : 'Select .lproj Folder'}
          </Button>
        </div>
      </div>

      {project && (
        <div className="text-center text-sm text-gray-300">
          <p>Loaded: <span className="font-mono text-teal-400">{project.name}</span></p>
          <p>{project.files.length} files found</p>
        </div>
      )}

      {dragMessage && (
        <div className="text-teal-400 text-sm text-center max-w-md">
          {dragMessage}
        </div>
      )}

      {error && (
        <div className="text-red-400 text-sm text-center max-w-md">
          {error}
        </div>
      )}
    </div>
  )
}
