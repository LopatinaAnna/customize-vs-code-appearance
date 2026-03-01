# VS Code Appearance Customizer

A VS Code extension that provides an intuitive sidebar interface for customizing VS Code's appearance. Customize colors for UI elements, editor settings, and layout preferences with live preview.
**Preview version. Development is in progress.**

## Features

- **Visual Color Picker**: Change colors for title bar, activity bar, editor, status bar, and more directly from a user-friendly sidebar
- **Live Preview**: See color changes instantly as you adjust them with automatic preview highlighting
- **Dual-Target Configuration**: Apply customizations to either Global (all workspaces) or Workspace (current folder) scope
- **Per-Element Reset**: Reset individual UI element colors without affecting other customizations
- **Per-Scope Reset**: Clear all customizations for the selected scope (Global or Workspace)
- **Theme-Aware UI**: The sidebar adapts to VS Code's current theme (light, dark, or high-contrast) for seamless integration
- **Extended Customizations**:
  - Editor font size and font family
  - Activity bar, sidebar, and panel positioning
  - Color customizations for multiple UI elements

## Supported Elements

### UI Colors
- **Title Bar**: Background and foreground colors for active/inactive states
- **Activity Bar**: Background and status indicator colors
- **Editor**: Background, line number, and other editor colors
- **Status Bar**: Background and foreground colors
- **Sidebar**: Background, foreground, and border colors
- **Terminal**: Background and foreground colors
- **Notifications**: Background and foreground colors
- **Input/Select**: Background, foreground, and border colors

### Editor Settings
- Font family (system-wide or workspace)
- Font size (system-wide or workspace)

### Layout Settings
- Activity bar position (side/top/hidden)
- Sidebar position (left/right)
- Panel position (bottom/right)

## Usage

1. Open the **Customize Appearance** sidebar from the activity bar
2. Select your configuration target:
   - **Global**: Changes apply to all workspaces
   - **Workspace**: Changes apply only to the current folder (if one is open)
3. Browse UI element categories and adjust colors using the color picker, input font size or select positioning
4. Hover over elements to preview changes
5. Click the **⟳** icon next to an element to reset it to defaults
6. Click the **⟳** icon next to a scope to reset all settings in that scope

## Configuration

This extension modifies the following VS Code settings:
- `workbench.colorCustomizations`: All color settings
- `editor.fontSize`: Editor font size
- `editor.fontFamily`: Editor font family
- `workbench.activityBar.location`: Activity bar positioning
- `workbench.sideBar.location`: Sidebar positioning
- `workbench.panel.defaultLocation`: Panel positioning

All changes are made through VS Code's native settings system and can be manually edited in `settings.json`.

## Workspace vs Global

- **Global**: Settings stored in `~/.config/Code/user/settings.json` (or Windows/Mac equivalent), apply to all workspaces
- **Workspace**: Settings stored in `.vscode/settings.json`, apply only to the current workspace
- The Global button is disabled when a workspace is open to prevent conflicts

## Reset Functionality

- **Element Reset**: Click the **⟳** icon next to any UI element to reset its related settings
- **Scope Reset**: Click the **⟳** icon next to Global or Workspace to reset all colors in that scope
- Resets are permanent and immediately applied

## Tips

- Color changes are applied instantly without requiring a VS Code restart
- You can combine Global and Workspace customizations (Workspace overrides Global for conflicts)
- Use the preview highlighting feature to see which colors affect which areas of the UI
- Export your customizations by copying the content of `.vscode/settings.json` (workspace) or `settings.json` (global)

## Requirements

- VS Code 1.60 or later
- No additional dependencies required

## Release Notes

### 1.0.0

Initial release of VS Code Appearance Customizer with color customization support, live preview, dual-target configuration (Global/Workspace), and reset functionality.
