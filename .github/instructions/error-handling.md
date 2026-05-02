# Error Handling Standards

## General Principles
- Use try/catch blocks for all async operations
- Always log errors with contextual information
- Avoid swallowing errors without handling or providing feedback
- Provide user-friendly error messages when appropriate
- Avoid exposing sensitive information in error messages
- Document known error scenarios and their handling strategies

## Error Logging
- Use `console.error()` with context: `console.error('Failed to load settings:', error)`
- Include stack traces in logs for debugging
- Add user action context in error messages
- Log the original error object for technical troubleshooting

## User-Facing Errors
- Display errors through VS Code notification API: `vscode.window.showErrorMessage()`
- Use clear, actionable messages: "Failed to save settings. Check file permissions."
- Provide recovery suggestions when possible
- Avoid technical jargon in user messages

## Extension-Specific Error Handling
- **Settings Load Failures**: Fall back to defaults and notify user
- **WebView Communication**: Handle message passing errors gracefully
- **Configuration Errors**: Validate config format before applying
- **Theme Application**: Catch and log theme update failures
- **File System Operations**: Handle permission and access errors

## Error Recovery
```typescript
try {
  // operation
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error('Operation failed:', message);
  vscode.window.showErrorMessage(`Operation failed: ${message}`);
  // Optionally provide recovery mechanism
}
```

## Async Operation Patterns
- Chain `.catch()` on promises to handle rejections
- Use proper async/await with try/catch blocks
- Handle timeouts for long-running operations
- Cancel operations when extension deactivates
