# LocalizableReader

A powerful desktop application for reading, searching, and managing iOS/macOS localization strings from `.lproj` folders. Built with Electron and React, LocalizableReader provides an intuitive interface for developers working with multiple language localizations.

![LocalizableReader](https://img.shields.io/badge/version-1.0.0-teal?style=for-the-badge&logo=electron)
![Platform](https://img.shields.io/badge/platform-macOS%20%7C%20Windows%20%7C%20Linux-lightgrey?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)

## ✨ Features

### 🔍 **Smart File Parsing**
- **Automatic Detection**: Automatically finds and parses `.strings` files in `.lproj` folders
- **plutil Integration**: Uses macOS's native `plutil` command for reliable JSON conversion
- **Multiple File Support**: Handles projects with hundreds of localization files

### 🎯 **Powerful Search & Filter**
- **Real-time Search**: Search through localization values with debounced input
- **File Filtering**: Filter entries by specific `.strings` files
- **Smart Pagination**: Efficiently handle large datasets with 10 entries per page

### 🖱️ **Intuitive Interface**
- **Drag & Drop**: Simply drag your `.lproj` folder to get started
- **Modern UI**: Clean, dark-themed interface built with Tailwind CSS
- **Responsive Design**: Optimized for different screen sizes

### 📋 **Copy & Export**
- **One-Click Copy**: Copy individual keys or values to clipboard
- **Tooltip Guidance**: Clear visual indicators for each action

### 🚀 **Performance**
- **Fast Loading**: Optimized for large localization projects
- **Memory Efficient**: Pagination prevents memory issues with huge datasets
- **Smooth Scrolling**: Sticky headers and smooth table navigation

## 📋 Roadmap

### 🚧 **In Progress**
- **🪟 Windows Support**: Full Windows compatibility testing and optimization
- **🐧 Linux Support**: Complete Linux distribution support and testing

### 🔮 **Future Features**
- **📊 Export Options**: Export to CSV, JSON, or Excel formats
- **🔍 Advanced Search**: Regex search and advanced filtering options
- **📱 Mobile Support**: iOS and Android companion apps
- **☁️ Cloud Sync**: Sync projects across devices
- **🎨 Theme Customization**: Light/dark theme options

## 🛠️ Technologies

- **🔋 Electron** - Cross-platform desktop framework
- **⚛️ React 19** - Modern UI library with hooks
- **💙 TypeScript 5** - Type-safe development
- **🎨 Tailwind CSS 4** - Utility-first styling
- **🎯 shadcn/ui** - Beautiful, accessible components
- **🍦 Lucide Icons** - Consistent iconography
- **📦 Zustand** - Lightweight state management
- **🔄 React Dropzone** - Drag and drop functionality

## 📦 Installation

### Prerequisites
- Node.js 20 or higher
- pnpm 10 or higher

### Development Setup
```bash
# Clone the repository
git clone https://github.com/imokhles/localizable-reader.git
cd localizable-reader

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

### Building for Production
```bash
# Build for all platforms
pnpm build

# Build for specific platform
pnpm build --mac
pnpm build --win
pnpm build --linux
```

## 🚀 Usage

### Getting Started
1. **Launch LocalizableReader**
2. **Select a .lproj folder** by:
   - Dragging and dropping the folder onto the app
   - Clicking "Select .lproj Folder" and browsing to your folder
3. **Browse your localizations** in the table view
4. **Search and filter** using the search bar and file dropdown
5. **Copy keys or values** using the copy buttons

### Supported File Types
- `.strings` files (iOS/macOS localization format)
- `.lproj` folders containing multiple `.strings` files

### Keyboard Shortcuts
- **Cmd/Ctrl + F**: Focus search bar
- **Escape**: Clear search
- **Arrow Keys**: Navigate table rows
- **Enter**: Copy selected item

## 📁 Project Structure

```
localizable-reader/
├── src/
│   ├── main/                 # Electron main process
│   │   ├── services/        # Localization parsing service
│   │   └── ipc/            # Inter-process communication
│   ├── renderer/            # React renderer process
│   │   ├── components/      # UI components
│   │   ├── lib/            # Utilities and stores
│   │   └── screens/        # Main application screens
│   ├── shared/             # Shared types and constants
│   └── resources/          # Icons and assets
├── dist/                   # Built applications
└── docs/                   # Documentation
```

## 🔧 Development

### Available Scripts
```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Preview built app
pnpm lint         # Run linter
pnpm lint:fix     # Fix linting issues
```

### Architecture
- **MVVM Pattern**: Clean separation of concerns
- **Zustand Store**: Centralized state management
- **IPC Communication**: Secure main-renderer communication
- **TypeScript**: Full type safety throughout

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Guidelines
1. Follow the existing code style
2. Add tests for new features
3. Update documentation as needed
4. Ensure all checks pass

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

This project is built using the excellent [Electron App Boilerplate](https://github.com/daltonmenezes/electron-app) by [Dalton Menezes](https://github.com/daltonmenezes). 

The boilerplate provides:
- 🔥 Fast and ready-to-go structure with React 19, TypeScript 5, and Tailwind CSS 4
- 🚀 Auto reload for main process and Fast Refresh for renderer
- 🎉 Window/Screen routing with Electron Router DOM
- 🔮 GitHub Action releases for Windows, Mac, and Linux
- 🔒 Source code protection support
- 🍪 Absolute paths support

Special thanks to Dalton for creating such a comprehensive and well-maintained boilerplate that makes Electron development a breeze! 🌟

---

**Made with ❤️ for the iOS/macOS development community**