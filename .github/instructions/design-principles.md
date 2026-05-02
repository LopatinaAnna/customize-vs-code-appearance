# Design Principles & Patterns

## SOLID Principles
- **S**ingle Responsibility: Each class has one reason to change
- **O**pen/Closed: Open for extension, closed for modification
- **L**iskov Substitution: Derived classes must be substitutable for base classes
- **I**nterface Segregation: Clients depend on specific interfaces, not general ones
- **D**ependency Inversion: Depend on abstractions, not concrete implementations

## Clean Code Principles
- **DRY** (Don't Repeat Yourself): Extract common functionality into reusable modules
- **YAGNI** (You Aren't Gonna Need It): Don't add features or code you don't need yet
- **KISS** (Keep It Simple, Stupid): Prefer simple solutions over complex ones
- Document exceptions to these principles with clear justification

## Design Patterns

### Applicable Patterns
- **Provider Pattern**: WebView provider for UI
- **Manager Pattern**: Manage specific concerns
- **Configuration Pattern**: Central configuration handling
- **Observer Pattern**: Event-driven updates and notifications
- **Adapter Pattern**: Adapt VS Code API for internal use

### Pattern Usage Guidelines
- Apply recognized design patterns only when solving a real, existing problem
- Document the pattern and its rationale in comments or design documents
- Don't use patterns prematurely; refactor when the need becomes clear
- Ensure the pattern solves the actual problem, not adds unnecessary complexity

## Architecture

### Separation of Concerns
- **Extension Layer**: Activation, deactivation, entry point
- **Service Layer**: Business logic, settings management, element registry
- **UI Layer**: WebView provider, sidebar presentation
- **Type Layer**: Interfaces, types, data models
- **Utility Layer**: Helper functions, common utilities

### Interfaces as Contracts
- Define clear interfaces for module boundaries
- Document what each interface expects and provides
- Keep interfaces focused and cohesive
- Use interfaces to enable testing and mocking

## Security Principles
- Implement secure-by-design: security is not an afterthought
- Validate all user inputs (colors, settings values)
- Sanitize data before display or storage
- Handle sensitive information appropriately
- Document any security assumptions in code comments
