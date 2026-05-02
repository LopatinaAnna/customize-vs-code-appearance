# Naming Conventions

## General Rules
- Use **PascalCase** for component names, interfaces, type aliases, and classes
- Use **camelCase** for variables, functions, methods, and properties
- Prefix private class members with underscore (`_`)
- Use **ALL_CAPS** for constants and enums
- Use descriptive names that convey intent and avoid abbreviations
- Avoid generic names like "data", "info", or "temp" unless they are truly temporary variables
- Use singular names for classes and interfaces, and plural names for collections (e.g., `User` vs `Users`)

## TypeScript Specific
- Interface names should start with `I` (optional but recommended for clarity): `IElementDefinition`, `IElementSetting`
- Type aliases should use PascalCase: `ColorConfig`, `ElementMap`
- Enum names in PascalCase: `ElementType`, `SettingScope`
- Enum values in ALL_CAPS: `GLOBAL_SCOPE`, `WORKSPACE_SCOPE`

## VS Code Extension Specific
- Provider classes: `{Feature}Provider` (e.g., `SidebarProvider`, `SettingsProvider`)
- Manager classes: `{Feature}Manager` (e.g., `SettingsManager`, `ElementRegistry`)
- Service classes: `{Feature}Service` (e.g., `ConfigService`, `StorageService`)
- Utility functions: descriptive verb-noun pairs (e.g., `validateColorValue()`, `parseColorString()`)
- Event handlers: `on{Event}` or `handle{Event}` (e.g., `onColorChange`, `handleSave`)

## WebView Specific
- DOM element IDs: `kebab-case` (e.g., `color-picker`, `element-list`)
- CSS class names: `kebab-case` (e.g., `.element-container`, `.color-input`)
- JavaScript variables for DOM elements: `camelCase` prefixed with element type (e.g., `colorPickerInput`, `elementListContainer`)
