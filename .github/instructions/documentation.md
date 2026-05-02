# Documentation Standards

## Code Documentation

### JSDoc Comments
- Document all public functions, classes, interfaces, and methods
- Include parameter descriptions with types
- Document return values
- Add usage examples for complex functionality
- Include `@throws` for functions that can throw errors

### JSDoc Template
```typescript
/**
 * Brief description of what this function does.
 *
 * Longer description if needed, explaining the purpose,
 * behavior, and any important details.
 *
 * @param paramName - Description of parameter
 * @param options - Configuration object
 * @param options.property - Description of property
 * @returns Description of return value
 * @throws {ErrorType} Description of when this is thrown
 *
 * @example
 * ```typescript
 * const result = functionName('value', { option: true });
 * ```
 */
```

### Inline Comments
- Use comments to explain "why", not "what"
- Explain non-obvious logic and complex algorithms
- Note important assumptions or constraints
- Reference related code or external docs

### Private Members
- Document private members if their purpose is non-obvious
- Explain implementation details that affect behavior
- Note any special handling or edge cases

## File Headers
- Include file purpose at the top
- Reference related files if applicable
- Include copyright or licensing info if needed

Example:
```typescript
/**
 * SettingsManager.ts
 *
 * Handles persistence and retrieval of user customization settings
 * for both Global and Workspace scopes.
 *
 * Related: ElementRegistry.ts, extension.ts
 */
```

## Keep Documentation Updated
- Update JSDoc when function signatures change
- Reflect behavioral changes in comments
- Remove outdated documentation
- Review docs during code reviews

## Project Documentation
- Maintain README with feature overview
- Document configuration file formats
- Include API reference for public interfaces
- Keep CHANGELOG.md updated with changes
- Document known issues and limitations
