# Code Structure & Organization

## General Principles
- Organize code into logical modules and folders based on features or layers
- Keep functions small and focused on a single task (ideally 20 lines or less)
- Use descriptive names for functions and variables that explain their purpose
- Avoid deep nesting by using early returns and guard clauses
- Group related functions together and consider creating helper modules for shared logic
- Separate concerns by keeping UI components, business logic, and data access code in different layers
- Use index files to re-export modules for cleaner imports
- Avoid large files that contain multiple unrelated classes or functions

## File Organization

### Project Layout
```
src/
├── extension.ts          # Entry point, activation, deactivation
├── SidebarProvider.ts    # Webview provider
├── SettingsManager.ts    # Settings persistence and retrieval
├── ElementRegistry.ts    # Registry of customizable elements
├── interfaces/           # TypeScript interfaces and types
├── models/               # Data models
├── webview/              # Client-side code for sidebar
└── test/                 # Unit tests
```

### File Naming
- Extension activation: `extension.ts`
- WebView providers: `{Name}Provider.ts` (e.g., `SidebarProvider.ts`)
- Managers/Services: `{Name}Manager.ts` or `{Name}Service.ts`
- Utilities: `{feature}Utils.ts` or `{feature}Helpers.ts`
- Types/Interfaces: `{feature}.types.ts` or in `interfaces/` folder
- Tests: `{feature}.test.ts` or `{feature}.spec.ts`

## WebView Code Structure
- Keep HTML markup minimal and semantic
- Organize JavaScript into logical functions grouped by feature
- Use event delegation for DOM manipulation
- Separate concerns: UI rendering, event handling, state management

## Module Dependencies
- Layer 0 (Core): types, interfaces, constants
- Layer 1 (Utilities): helper functions, utility services
- Layer 2 (Business Logic): managers, registries, configuration handlers
- Layer 3 (UI/Entry): providers, webview, extension activation
- Avoid circular dependencies

## Code Formatting
- Use consistent indentation (2 or 4 spaces, configured in project)
- Include clear line breaks between logical sections
- Keep line length reasonable (80-120 characters)
- Use Prettier for automatic formatting
