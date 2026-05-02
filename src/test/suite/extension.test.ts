import * as assert from 'assert';
import { suite, test } from 'mocha';
import * as vscode from 'vscode';
import { SettingsManager } from '../../SettingsManager';

suite('SettingsManager Suite', () => {
  test('toVscodeConfigTarget maps Global and Workspace correctly', () => {
    assert.strictEqual(SettingsManager.toVscodeConfigTarget('Global'), vscode.ConfigurationTarget.Global);
    assert.strictEqual(SettingsManager.toVscodeConfigTarget('Workspace'), vscode.ConfigurationTarget.Workspace);
  });

  test('setConfigTarget and getConfigTarget store the correct value', () => {
    SettingsManager.setConfigTarget('Workspace');
    assert.strictEqual(SettingsManager.getConfigTarget(), 'Workspace');
    assert.strictEqual(SettingsManager.getVscodeConfigTarget(), vscode.ConfigurationTarget.Workspace);

    SettingsManager.setConfigTarget('Global');
    assert.strictEqual(SettingsManager.getConfigTarget(), 'Global');
    assert.strictEqual(SettingsManager.getVscodeConfigTarget(), vscode.ConfigurationTarget.Global);
  });

  test('getAppSettingValue returns configured application settings', () => {
    const appSettings = { enableHoverHighlight: false, customFlag: true };
    (SettingsManager as any).appSettings = appSettings;

    assert.strictEqual(SettingsManager.getAppSettingValue('enableHoverHighlight'), false);
    assert.strictEqual(SettingsManager.getAppSettingValue('customFlag'), true);
    assert.strictEqual(SettingsManager.getAppSettingValue('nonExistentKey'), undefined);
  });
});
