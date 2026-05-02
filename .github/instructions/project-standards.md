# Project-Specific Standards for Customize VS Code Appearance

## Project Overview
This extension allows users to customize VS Code's appearance by modifying colors and layout settings. It provides a visual sidebar interface with live preview capabilities, supporting both Global (all workspaces) and Workspace (current folder) customization scopes.

## Key Architecture Components

### ElementRegistry (Element Management)
- Maintains the registry of customizable UI elements
- Provides element definitions and metadata
- Validates element selections
- **Standards**: Keep registry up-to-date, use consistent element names, document new element categories

### SettingsManager (Configuration Persistence)
- Handles reading/writing settings to VS Code workspace configuration
- Manages both Global and Workspace scopes
- Provides settings validation and default values
- **Standards**: Always validate before saving, handle scope conflicts gracefully, maintain backward compatibility

### SidebarProvider (WebView Provider)
- Manages the WebView panel in the sidebar
- Handles bidirectional communication with WebView
- Controls state synchronization
- **Standards**: Keep WebView messages minimal, batch updates, handle WebView disposal properly

### WebView Frontend (sidebar.js)
- Provides the visual color picker interface
- Manages user interactions and preview
- Communicates element/color changes to extension
- **Standards**: Keep logic minimal, use event delegation, avoid heavy DOM manipulations

## Element Definition Standards

### Adding New Elements
When adding customizable UI elements:

1. Define in ElementRegistry with:
   - Unique element ID
   - Display name (user-friendly)
   - Category (UI Elements, Editor, Terminal, etc.)
   - VS Code configuration key
   - Color format (hex expected)
   - Default value (if applicable)

2. Update type definitions in `interfaces/ElementDefinition.ts`

3. Add documentation in README.md

4. Create tests for new element validation

### Element Categories
- **UI Elements**: Title bar, activity bar, sidebar, status bar, etc.
- **Editor**: Text colors, syntax highlighting, cursors, selections
- **Terminal**: Tab styling, colors
- **Notifications**: Message center, toast colors
- **Controls**: Input fields, buttons, dropdowns
- **Other**: Badges, minimap, scrollbar

## Settings Format Standards

### Configuration Structure
Settings are stored in `settings.json` with the following structure:
```json
{
  "workbench.colorCustomizations": {
		"panelTitleBadge.background": "#9da00eFF",
		"titleBar.activeBackground": "#1b215fFF"
	},
	"editor.tokenColorCustomizations": {
		"comments": "#21a192FF"
	}
}
```

### Storage Best Practices
- Store colors in uppercase hex format: `#AABBCC`
- Use consistent element ID format: `kebab-case`
- Validate before persisting
- Handle migration from old formats gracefully

## Color Input & Validation

### Supported Formats
- Hex: `#RRGGBB`, `#RRGGBBAA` (alpha)
- RGB: `rgb(r, g, b)`, `rgba(r, g, b, a)`
- HSL: `hsl(h, s, l)`, `hsla(h, s, l, a)`
- Named colors: Only if explicitly supported

### Validation Rules
- All colors must be valid CSS color values
- Normalize to uppercase hex for storage
- Reject invalid formats with specific error messages
- Provide color picker for user-friendly input

### Color Application
- Convert stored colors to VS Code configuration format
- Apply through `vscode.workspace.getConfiguration().update()`
- Handle partial updates (only changed colors)
- Provide undo mechanism through VS Code's undo stack

## Live Preview Behavior

### Preview Requirements
- Show changes immediately in VS Code UI
- Don't require save/reload
- Allow rapid changes without lag
- Provide visual feedback during editing

### Preview Implementation
- Update configuration in memory first
- Apply to VS Code UI
- Batch rapid updates using debounce
- Maintain preview state separate from saved state
- Provide cancel mechanism to revert preview

## Scope Handling (Global vs Workspace)

### Global Scope
- Stored in user settings directory
- Affects all workspaces
- Settings file location: User's VS Code settings
- Can be overridden by workspace scope

### Workspace Scope
- Stored in `.vscode/settings.json` in current workspace
- Only affects current workspace
- Takes precedence over global settings
- Can be committed to version control

### Scope Conflict Resolution
- Workspace settings override global settings
- Merge rather than replace when possible
- Display both scope values in UI
- Allow independent management of each scope

## WebView Message Protocol

### Message Types
- **ColorChange**: User changes a color
- **ElementToggle**: User selects/deselects an element
- **ScopeChange**: User switches between Global/Workspace
- **Save**: User saves customizations
- **Reset**: User resets to defaults
- **StateSync**: Request current state

### Message Format
```typescript
interface Message {
  type: 'ColorChange' | 'ElementToggle' | 'ScopeChange' | 'Save' | 'Reset' | 'StateSync';
  elementId?: string;
  color?: string;
  scope?: 'global' | 'workspace';
  timestamp: number;
}
```

## Testing Requirements for This Project

### Unit Tests
- ElementRegistry: Lookup, validation, metadata
- SettingsManager: Load, save, reset operations
- Color validation functions
- Scope conflict resolution

### Integration Tests
- Settings persist and reload correctly
- Global/Workspace scope behavior
- WebView message passing
- Settings apply to VS Code UI

### Manual Testing Checklist
- [ ] Color changes appear immediately in VS Code UI
- [ ] Global scope customizations persist across workspaces
- [ ] Workspace scope overrides global settings
- [ ] Reset functions work for individual elements and full scope
- [ ] All 100+ elements can be customized
- [ ] Works in light, dark, and high-contrast themes
- [ ] WebView closes without errors
- [ ] Extension activates/deactivates cleanly
- [ ] Works in VS Code Web and Desktop

## Documentation for This Project
- README.md: Features, usage, supported elements
- Code comments: Element categories, color formats, scope logic
- Type definitions: Clear interfaces for elements and settings
- CHANGELOG.md: Track feature additions and bug fixes
