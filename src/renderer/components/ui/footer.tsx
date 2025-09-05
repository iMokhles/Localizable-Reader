export function Footer() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="flex-shrink-0 border-t border-gray-800 bg-gray-900 px-4 py-2">
      <div className="flex items-center justify-between text-xs text-gray-400">
        <div className="flex items-center gap-2">
          <span>© {currentYear}</span>
          <a 
            href="https://imokhles.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-teal-400 hover:text-teal-300 transition-colors"
          >
            Mokhlas Hussein ( @iMokhles )
          </a>
          <span className="text-gray-600">•</span>
          <span>LocalizableReader v1.0.0</span>
        </div>
        <div className="flex items-center gap-2">
          <span>Built with</span>
          <a 
            href="https://github.com/daltonmenezes/electron-app" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-teal-400 hover:text-teal-300 transition-colors"
          >
            Electron App Boilerplate
          </a>
          <span>by</span>
          <a 
            href="https://github.com/daltonmenezes" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-teal-400 hover:text-teal-300 transition-colors"
          >
            Dalton Menezes
          </a>
        </div>
      </div>
    </footer>
  )
}
