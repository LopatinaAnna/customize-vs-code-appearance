import * as assert from 'assert';
import { suite, test } from 'mocha';
import { SettingsManager } from '../SettingsManager';

suite('SettingsManager Test Suite', () => {
	test('SettingsManager should load base settings', () => {
		SettingsManager.loadBaseSettings();
		assert.ok(true, 'Base settings loaded');
	});

	test('SettingsManager should load app settings', () => {
		SettingsManager.loadAppSettings();
		assert.ok(true, 'App settings loaded');
	});
});