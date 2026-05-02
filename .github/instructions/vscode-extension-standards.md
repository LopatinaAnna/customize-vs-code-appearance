# VS Code Extension Development Standards

## Extension Activation & Lifecycle
- Keep activation lightweight; defer heavy operations
- Use `activation` API properly with correct `activationEvents`
- Always implement `deactivate()` to clean up resources
- Subscribe to context items for proper cleanup:
  ```typescript
  context.subscriptions.push(provider, disposable1, disposable2);
  ```

## WebView Development

### Message Passing
- Define strict message schemas for extension ↔ WebView communication
- Use unique message types to identify intent
- Validate all messages before processing
- Handle both directions of communication gracefully

Message Structure:
```typescript
interface WebViewMessage {
  type: 'action' | 'request' | 'response';
  action: string;
  data?: any;
  requestId?: string;
}
```

### WebView Security
- Use Content Security Policy (CSP) appropriately
- Avoid `eval()` and dangerous HTML/script injection
- Sanitize user input before displaying
- Use proper URI schemes for resources

### WebView HTML/CSS
- Use semantic HTML elements
- Keep CSS scoped to WebView context
- Use CSS variables for theme-aware styling
- Ensure accessibility with proper ARIA labels

## VS Code API Usage

### Configuration Management
- Use `vscode.workspace.getConfiguration()` for settings
- Support both `User` (Global) and `Workspace` scopes
- Listen to configuration change events:
  ```typescript
  vscode.workspace.onDidChangeConfiguration(event => {
    if (event.affectsConfiguration('your.extension')) {
      // Handle change
    }
  });
  ```

### Workspace Storage
- Use `ExtensionContext.workspaceState` for workspace-scoped data
- Use `ExtensionContext.globalState` for global data
- Store JSON-serializable data only
- Clear old storage keys during migrations

### Command Registration
- Use unique command IDs with extension prefix: `customize-appearance.command`
- Register all commands during activation
- Handle command errors appropriately

### UI Integration
- Use appropriate notification methods:
  - `vscode.window.showInformationMessage()` - Info
  - `vscode.window.showWarningMessage()` - Warnings  
  - `vscode.window.showErrorMessage()` - Errors
- Provide action buttons when offering choices

## Theme & Color Handling

### Color Validation
- Validate color formats (hex, rgb, hsl)
- Support various color input formats
- Reject invalid color values with clear messages

### Theme Configuration
- Store theme settings in workspace settings file (`.vscode/settings.json`)
- Support theme switching without extension restart
- Apply changes incrementally to avoid flicker
- Provide preview mechanism for testing changes

### Theme-Aware UI
- Detect current VS Code theme (light, dark, high-contrast)
- Adapt sidebar UI colors based on theme
- Use VS Code theme colors in WebView CSS when possible

## TypeScript Configuration
- Use strict mode: `"strict": true` in `tsconfig.json`
- Enable strict null checks
- Use proper type annotations, avoid `any`
- Leverage VS Code types and interfaces

## Testing VS Code Extensions
- Mock VS Code API in unit tests
- Use `@vscode/test-electron` for integration tests
- Test both Desktop and Web targets
- Verify WebView communication in tests

## Cross-Platform Compatibility
- Support Windows, macOS, Linux
- Support VS Code Desktop and Web
- Use proper path handling (not hardcoded backslashes)
- Test in all target environments
