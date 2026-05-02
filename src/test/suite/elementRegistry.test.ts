import * as assert from 'assert';
import { suite, test } from 'mocha';
import { ELEMENTS } from '../../ElementRegistry';

/**
 * Test suite for ElementRegistry
 * 
 * Tests the element registry including:
 * - Element definition validity
 * - Element lookup functionality
 * - Setting metadata validation
 */
suite('ElementRegistry Test Suite', () => {
  // ========== Registry Structure Tests ==========

  suite('Registry Structure', () => {
    test('should have elements defined', () => {
      assert.ok(Array.isArray(ELEMENTS), 'ELEMENTS should be an array');
      assert.ok(ELEMENTS.length > 0, 'ELEMENTS should not be empty');
    });

    test('should contain expected element categories', () => {
      const labels = ELEMENTS.map(el => el.label);
      const expectedCategories = ['Title Bar', 'Activity Bar', 'Side Bar', 'Editor', 'Status Bar'];
      
      expectedCategories.forEach(category => {
        assert.ok(
          labels.includes(category),
          `Should contain '${category}' category`
        );
      });
    });
  });

  // ========== Element Definition Validation ==========

  suite('Element Definition Validation', () => {
    test('each element should have required properties', () => {
      ELEMENTS.forEach(element => {
        assert.ok(element.label, `Element should have label: ${JSON.stringify(element)}`);
        assert.ok(element.description, `Element should have description: ${element.label}`);
        assert.ok(Array.isArray(element.settings), `Element should have settings array: ${element.label}`);
        assert.ok(element.settings.length > 0, `Element should have at least one setting: ${element.label}`);
      });
    });

    test('each setting should have required properties', () => {
      ELEMENTS.forEach(element => {
        element.settings.forEach(setting => {
          assert.ok(setting.label, `Setting should have label in ${element.label}`);
          assert.ok(setting.section, `Setting should have section in ${element.label}: ${setting.label}`);
          assert.ok(setting.key, `Setting should have key in ${element.label}: ${setting.label}`);
          assert.ok(setting.type, `Setting should have type in ${element.label}: ${setting.label}`);
          assert.ok(['color', 'number', 'string'].includes(setting.type), 
            `Setting type should be valid in ${element.label}: ${setting.label} (got ${setting.type})`);
        });
      });
    });

    test('color settings should not have options', () => {
      ELEMENTS.forEach(element => {
        element.settings
          .filter(s => s.type === 'color')
          .forEach(setting => {
            assert.ok(!setting.options || setting.options.length === 0,
              `Color setting should not have options: ${element.label} / ${setting.label}`);
          });
      });
    });

    test('string settings can have options', () => {
      let foundStringSettings = false;
      ELEMENTS.forEach(element => {
        element.settings
          .filter(s => s.type === 'string' && s.options)
          .forEach(setting => {
            foundStringSettings = true;
            assert.ok(Array.isArray(setting.options), 
              `String setting options should be array: ${element.label} / ${setting.label}`);
            assert.ok(setting.options!.length > 0,
              `String setting options should not be empty: ${element.label} / ${setting.label}`);
            setting.options!.forEach(opt => {
              assert.ok(typeof opt === 'string', 
                `String options should be strings: ${element.label} / ${setting.label}`);
            });
          });
      });
      assert.ok(foundStringSettings, 'Should find at least some string settings with options');
    });
  });

  // ========== Color Customization Settings Tests ==========

  suite('Color Customization Settings', () => {
    test('should have valid section keys', () => {
      const validSections = ['workbench.colorCustomizations', 'editor.tokenColorCustomizations', 'workbench.activityBar', 'workbench.sideBar', 'editor'];
      ELEMENTS.forEach(element => {
        element.settings.forEach(setting => {
          assert.ok(
            validSections.includes(setting.section),
            `Invalid section '${setting.section}' in ${element.label} / ${setting.label}`
          );
        });
      });
    });

    test('should have color settings with proper naming', () => {
      ELEMENTS.forEach(element => {
        element.settings
          .filter(s => s.type === 'color')
          .forEach(setting => {
            // Color keys typically use dot notation (e.g., 'titleBar.activeBackground')
            assert.ok(
              setting.key.includes('.') || setting.key.match(/^[a-z]+/),
              `Color key should follow naming convention: ${element.label} / ${setting.key}`
            );
          });
      });
    });
  });

  // ========== Editor and Layout Settings Tests ==========

  suite('Editor and Layout Settings', () => {
    test('should have editor font size setting', () => {
      const editorElement = ELEMENTS.find(el => el.label === 'Editor');
      assert.ok(editorElement, 'Should have Editor element');
      
      const fontSizeSetting = editorElement!.settings.find(s => s.key === 'fontSize');
      assert.ok(fontSizeSetting, 'Should have font size setting');
      assert.strictEqual(fontSizeSetting!.type, 'number', 'Font size should be number type');
    });

    test('should have activity bar position setting', () => {
      const activityBarElement = ELEMENTS.find(el => el.label === 'Activity Bar');
      assert.ok(activityBarElement, 'Should have Activity Bar element');
      
      const positionSetting = activityBarElement!.settings.find(s => s.key === 'location');
      assert.ok(positionSetting, 'Should have location setting');
      assert.strictEqual(positionSetting!.type, 'string', 'Location should be string type');
      assert.ok(positionSetting!.options, 'Location should have options');
    });

    test('should have sidebar position setting', () => {
      const sidebarElement = ELEMENTS.find(el => el.label === 'Side Bar');
      assert.ok(sidebarElement, 'Should have Side Bar element');
      
      const positionSetting = sidebarElement!.settings.find(s => s.key === 'location');
      assert.ok(positionSetting, 'Should have location setting');
      assert.strictEqual(positionSetting!.type, 'string', 'Location should be string type');
      assert.ok(positionSetting!.options, 'Location should have options');
    });
  });

  // ========== Element Lookup Tests ==========

  suite('Element Lookup', () => {
    test('should find element by label', () => {
      const titleBarElement = ELEMENTS.find(el => el.label === 'Title Bar');
      assert.ok(titleBarElement, 'Should find Title Bar element');
      assert.ok(titleBarElement!.description, 'Found element should have description');
    });

    test('should find setting by key across all elements', () => {
      const allSettings = ELEMENTS.flatMap(el => el.settings);
      const fontSizeSetting = allSettings.find(s => s.key === 'fontSize');
      
      assert.ok(fontSizeSetting, 'Should find font size setting');
      assert.strictEqual(fontSizeSetting!.type, 'number', 'Font size should be number type');
    });

    test('should find color settings by VS Code configuration key', () => {
      const colorSettings = ELEMENTS.flatMap(el =>
        el.settings.filter(s => s.type === 'color')
      );
      
      assert.ok(colorSettings.length > 1, `Should have many color settings, found ${colorSettings.length}`);
    });
  });

  // ========== Setting Type Consistency Tests ==========

  suite('Setting Type Consistency', () => {
    test('should have consistent defaultValue types', () => {
      ELEMENTS.forEach(element => {
        element.settings.forEach(setting => {
          if (setting.defaultValue !== undefined) {
            const typeMatches = 
              (setting.type === 'color' && typeof setting.defaultValue === 'string') ||
              (setting.type === 'number' && typeof setting.defaultValue === 'number') ||
              (setting.type === 'string' && typeof setting.defaultValue === 'string');
            
            assert.ok(
              typeMatches,
              `Default value type should match setting type in ${element.label} / ${setting.label}`
            );
          }
        });
      });
    });

    test('all number settings should have reasonable defaults', () => {
      const numberSettings = ELEMENTS.flatMap(el =>
        el.settings.filter(s => s.type === 'number')
      );
      
      numberSettings.forEach(setting => {
        if (setting.defaultValue !== undefined) {
          assert.ok(
            typeof setting.defaultValue === 'number' && setting.defaultValue > 0,
            `Number setting should have positive default: ${setting.label}`
          );
        }
      });
    });
  });

  // ========== Data Integrity Tests ==========

  suite('Data Integrity', () => {
    test('should have unique element labels', () => {
      const labels = ELEMENTS.map(el => el.label);
      const uniqueLabels = new Set(labels);
      assert.strictEqual(
        labels.length,
        uniqueLabels.size,
        'Element labels should be unique'
      );
    });

    test('should not have duplicate settings within an element', () => {
      ELEMENTS.forEach(element => {
        const keys = element.settings.map(s => s.key);
        const uniqueKeys = new Set(keys);
        assert.strictEqual(
          keys.length,
          uniqueKeys.size,
          `Duplicate keys in ${element.label}: ${keys.filter((k, i) => keys.indexOf(k) !== i).join(', ')}`
        );
      });
    });

    test('should have non-empty descriptions for all elements and settings', () => {
      ELEMENTS.forEach(element => {
        assert.ok(element.description && element.description.length > 10, 
          `Element description too short: ${element.label}`);
        
        element.settings.forEach(setting => {
          assert.ok(setting.description && setting.description.length > 5,
            `Setting description too short: ${element.label} / ${setting.label}`);
        });
      });
    });
  });
});
