# TabSaver Chrome Extension

A sleek Chrome extension that saves all your open tabs with (1+1) clicks and reopens them later.

## Features

- Save all open tabs from all browser windows
- Real-time search through saved tabs
- Website favicons and tab numbering
- Individual tab deletion with hover delete button
- Modern dark theme with gradient title
- Persistent local storage

## Installation

1. Download this repository
2. Open Chrome → `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" → select TabSaver folder

## Usage

- **Save**: Click "Save All Tabs"
- **Search**: Use search box to filter tabs
- **Open**: Click any saved tab link
- **Delete**: Hover over a tab and click the red X button to delete individual tabs
- **Clear**: Click "Clear All" to remove all saved tabs

## File Structure

```
TabSaver/
├── manifest.json    # Extension configuration
├── popup.html      # Popup interface
├── popup.js        # Main functionality
├── popup.css       # Styling
├── README.md       # Documentation
├── LICENSE         # MIT License
└── images/         # Icon assets
```

## Technical Details

- Manifest V3
- Permissions: `tabs`, `storage`
- Local storage only (no external servers)
- Chrome favicon service with Google fallback

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
