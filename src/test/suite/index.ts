import * as fs from 'fs';
import * as path from 'path';
import Mocha = require('mocha');

function findTestFiles(dir: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const testFiles: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      testFiles.push(...findTestFiles(fullPath));
    } else if (entry.name.endsWith('.test.js')) {
      testFiles.push(fullPath);
    }
  }

  return testFiles;
}

export function run(): Promise<void> {
  const mocha = new Mocha({ ui: 'bdd', color: true });
  const testsRoot = path.resolve(__dirname);
  const testFiles = findTestFiles(testsRoot);

  for (const file of testFiles) {
    mocha.addFile(file);
  }

  return new Promise((resolve, reject) => {
    try {
      mocha.run((failures: number) => {
        if (failures > 0) {
          reject(new Error(`${failures} test(s) failed.`));
        } else {
          resolve();
        }
      });
    } catch (err) {
      reject(err);
    }
  });
}
