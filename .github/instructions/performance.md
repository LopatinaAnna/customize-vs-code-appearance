# Performance Standards

## General Approach
- Optimize for readability and maintainability first
- Address performance issues with profiling data, not speculation
- Document performance optimizations and their impact on code
- Avoid premature optimization that sacrifices clarity

## Algorithms & Data Structures
- Use efficient algorithms appropriate to the problem domain
- Choose suitable data structures for the use case
- Document the rationale for algorithm/structure choices
- Consider scalability for potential future growth

## WebView Performance
- Minimize DOM manipulation; batch changes when possible
- Use event delegation for many similar elements
- Avoid layout thrashing (alternating reads and writes)
- Cache DOM references when used repeatedly
- Load only necessary data into the WebView

## Settings & Configuration
- Cache configuration values to avoid repeated file reads
- Debounce rapid setting updates
- Batch multiple setting changes when possible
- Lazy-load features not immediately needed

## Memory Management
- Unsubscribe from events and dispose of resources in `deactivate()`
- Clear references to large objects when done
- Monitor memory usage in long-running operations
- Address memory issues with concrete measurements, not guesses

## Color & Theme Operations
- Cache parsed color values
- Minimize VS Code API calls for configuration updates
- Batch theme updates rather than applying one at a time
- Consider impact on UI responsiveness during live preview

## Optimization Patterns
```typescript
// Cache configuration results
let cachedConfig: Config | null = null;
function getConfig(): Config {
  if (!cachedConfig) {
    cachedConfig = loadConfigFromDisk();
  }
  return cachedConfig;
}

// Debounce rapid updates
const debouncedSave = debounce(() => {
  saveSettings();
}, 500);

// Batch operations
async function updateMultipleSettings(updates: SettingUpdate[]) {
  const merged = mergeUpdates(updates);
  await saveSettings(merged);
}
```

## Monitoring & Measurement
- Profile code before optimizing
- Measure improvements with concrete metrics
- Document performance regressions when discovered
- Continue monitoring after optimization to catch regressions
