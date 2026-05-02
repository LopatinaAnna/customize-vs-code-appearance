# Testing Standards

## General Requirements
- Write unit tests for all functions and components
- Use descriptive test names that explain the behavior being tested
- Aim for high test coverage, especially for critical code paths (target: >80%)
- Use mocks and stubs to isolate tests from external dependencies
- Group related tests using `describe()` blocks

## Test File Organization
- Place test files next to source files or in `src/test/` directory
- Name test files: `{module}.test.ts` or `{module}.spec.ts`
- Use consistent test structure across the project

## Test Naming Conventions
- Descriptive names that read like specifications
- Format: `should {action} when {condition}`
- Examples:
  - `should return default settings when no user config exists`
  - `should validate color format and reject invalid values`
  - `should save settings to both global and workspace scopes`

## Testing Categories

### Unit Tests
- Test individual functions and methods in isolation
- Mock external dependencies (VS Code API, file system, etc.)
- Test both success and error scenarios
- Verify input validation

### Integration Tests
- Test interactions between modules
- Verify settings manager, registry, and provider work together
- Test WebView message passing

### Scenarios to Test
- **Settings Management**: Load, save, reset for both scopes
- **Color Validation**: Accept valid formats, reject invalid ones
- **Element Registry**: Lookup, update, validation
- **WebView Communication**: Message passing, state sync
- **Error Conditions**: Missing files, permission errors, invalid config
- **Edge Cases**: Empty configs, duplicate entries, special characters

## Mock Patterns
```typescript
// Mock VS Code API
jest.mock('vscode', () => ({
  window: {
    showErrorMessage: jest.fn(),
    showInformationMessage: jest.fn(),
  },
  workspace: {
    getConfiguration: jest.fn(),
  },
}));
```

## Coverage Goals
- Critical paths: 100% coverage
- Business logic: >80% coverage
- Utilities: >70% coverage
- UI rendering: >60% coverage (can be complex to test)
