import * as path from 'path';
import { runTests } from '@vscode/test-electron';

async function main(): Promise<void> {
  try {
    const extensionDevelopmentPath = path.resolve(__dirname, '..', '..');
    const extensionTestsPath = path.resolve(__dirname, 'suite', 'index.js');

    await runTests({
      extensionDevelopmentPath,
      extensionTestsPath,
      version: '1.118.1'
    });
  } catch (err) {
    console.error('Failed to run extension tests:', err);
    process.exit(1);
  }
}

main();
