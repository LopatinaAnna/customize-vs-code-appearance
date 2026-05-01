import * as vscode from 'vscode';
import { ELEMENTS } from './ElementRegistry';
import { ItemSetting } from './models/ItemSetting';
import { ElementSetting } from './interfaces/ElementSetting';

const HIGHLIGHT_COLOR = '#9a9a9aff';
const COLOR_CUSTOMIZATION_KEY = 'workbench.colorCustomizations';
const TOKEN_COLOR_CUSTOMIZATIONS_KEY = 'editor.tokenColorCustomizations';
const COLOR_THEME_KEY = 'workbench.colorTheme';
const APP_SETTINGS_KEY = 'customizeVsCodeAppearance';

type SettingsMap = Record<string, any>;
type ConfigTarget = 'Global' | 'Workspace';

export class SettingsManager {
  private static tempHighlights: Record<string, string> = {};
  private static pendingWrite: NodeJS.Timeout | null = null;
  private static lastWritePromise: Promise<void> = Promise.resolve();
  private static configTarget: ConfigTarget = 'Global';
  private static baseSettings: ItemSetting[] = [];
  private static appSettings: Record<string, any> = {};

  /**
   * Maps a string config target to the corresponding VS Code enum.
   */
  public static toVscodeConfigTarget(target: ConfigTarget): vscode.ConfigurationTarget {
    return target === 'Workspace' ? vscode.ConfigurationTarget.Workspace : vscode.ConfigurationTarget.Global;
  }

  /**
   * Sets the configuration target for updates.
   */
  public static setConfigTarget(target: ConfigTarget): void {
    this.configTarget = target;
  }

  /**
   * Gets the current configuration target.
   */
  public static getConfigTarget(): ConfigTarget {
    return this.configTarget;
  }

  /**
   * Gets the current configuration target in VS Code enum form.
   */
  public static getVscodeConfigTarget(): vscode.ConfigurationTarget {
    return this.toVscodeConfigTarget(this.configTarget);
  }

  /**
   * Loads the current base settings from the VS Code configuration.
   */
  public static loadBaseSettings(): void {
    try {
      const config = vscode.workspace.getConfiguration();
      ELEMENTS.forEach(element => {
        element.settings.forEach(setting => {
          const settings = config.get<Record<string, string>>(setting.section, {});
          Object.entries(settings || {}).forEach(([key, value]) => {
            if (setting.key === key) {
              console.log(`Push setting: ${setting.section} ${key} ${value}`);
              this.baseSettings.push(new ItemSetting(setting.section, key, value));
              return;
            }
          });
        });
      });
      console.log(`Loaded ${this.baseSettings.length} base settings`);
    } catch (err) {
      console.error('Error loading base settings:', err);
    }
  }

  public static loadAppSettings(): void {
    try {
      const config = vscode.workspace.getConfiguration();
      const settings = config.get<Record<string, string | boolean>>(APP_SETTINGS_KEY, {});
      Object.entries(settings || {}).forEach(([key, value]) => {
        console.log(`Push setting: ${APP_SETTINGS_KEY} ${key} ${value}`);
        this.appSettings[key] = value;
      });
    } catch (err) {
      console.error('Error loading app settings:', err);
    }
  }

  public static getAppSettingValue(key: string): any {
    return this.appSettings[key];
  }

  public static async setAppSetting(key: string, value: any): Promise<void> {
    const config = vscode.workspace.getConfiguration();
    await config.update(`${APP_SETTINGS_KEY}.${key}`, value, vscode.ConfigurationTarget.Global);
    this.appSettings[key] = value;
  }

  /**
   * Temporarily highlights an element on hover.
   */
  public static async onHover(key: string): Promise<void> {
    if (!this.getAppSettingValue('enableHoverHighlight') || this.tempHighlights[key]) return;
    this.tempHighlights[key] = HIGHLIGHT_COLOR;
    await this.applyEffectiveColors();
  }

  /**
   * Removes the temporary highlight when the mouse leaves.
   */
  public static async onLeave(key: string): Promise<void> {
    if (!this.getAppSettingValue('enableHoverHighlight') || !this.tempHighlights[key]) return;
    delete this.tempHighlights[key];
    await this.applyEffectiveColors();
  }

  /**
   * Sets a persistent color for an element.
   */
  public static async onSetColor(setting: ElementSetting, color: string): Promise<void> {
    if (!color || color.trim() === '') {
      this.removeSetting(setting.section, setting.key);
    } else {
      this.addOrUpdateSetting(setting.section, setting.key, color);
    }
    await this.applyEffectiveColors();
  }

  /**
   * Handles other number settings like font size.
   */
  public static async onSetNumber(setting: ElementSetting, value: string): Promise<void> {
    this.addOrUpdateSetting(setting.section, setting.key, value);
    const config = vscode.workspace.getConfiguration(setting.section);
    await config.update(setting.key, parseInt(value), SettingsManager.getVscodeConfigTarget());
  }

  /**
   * Handles string settings like font family.
   */
  public static async onSetString(setting: ElementSetting, value: string): Promise<void> {
    this.addOrUpdateSetting(setting.section, setting.key, value);
    const config = vscode.workspace.getConfiguration(setting.section);
    await config.update(setting.key, value, SettingsManager.getVscodeConfigTarget());
  }

  /**
   * Reset all settings in the given group (element) to their defaults.
   */
  public static resetGroup(groupLabel: string): void {
    console.log(`Resetting group: ${groupLabel}`);
    if (!groupLabel) {
      return;
    }

    let elementsToReset = ELEMENTS.find(g => g.label === groupLabel);
    if (!elementsToReset) {
      console.warn(`No group found with label ${groupLabel}`);
      return;
    }

    const config = vscode.workspace.getConfiguration();
    elementsToReset.settings.forEach(setting => {
      this.resetElement(setting, config);
    });
  }

  /**
   * Reset a specific element setting to its default value.
   */
  public static resetElement(setting: ElementSetting, config?: vscode.WorkspaceConfiguration): void {
    config = config || vscode.workspace.getConfiguration();
    //console.log(`Resetting element: ${setting.section}.${setting.key}`);
    config.update(`${setting.section}.${setting.key}`, undefined, SettingsManager.getVscodeConfigTarget());
    this.removeSetting(setting.section, setting.key);
    delete this.tempHighlights[setting.key];
  }

  /**
   * Reset the given configuration target only.
   */
  public static resetScope(scope: 'Global' | 'Workspace'): void {
    console.log(`Resetting scope: ${scope}`);
    ELEMENTS.map(e => e.label).forEach(group => {
      this.resetGroup(group);
    });
    this.baseSettings = [];
    this.tempHighlights = {};
  }

  /**
   * Applies the effective color customizations to VS Code.
   */
  public static async applyEffectiveColors(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (this.pendingWrite) clearTimeout(this.pendingWrite);
      this.pendingWrite = setTimeout(async () => {
        try {
          this.pendingWrite = null;
          const config = vscode.workspace.getConfiguration();
          const effectiveColors: SettingsMap = {};
          const effectiveTokenColors: SettingsMap = {};

          // Apply persistent colors
          this.baseSettings.forEach((setting) => {
            if (setting.value !== undefined) {
              if (setting.section === COLOR_CUSTOMIZATION_KEY) {
                effectiveColors[setting.key] = setting.value;
              } else if (setting.section === TOKEN_COLOR_CUSTOMIZATIONS_KEY) {
                effectiveTokenColors[setting.key] = setting.value;
              }
            }
          });

          // Apply temporary highlights (overrides persistent)
          Object.entries(this.tempHighlights).forEach(([key, value]) => {
            const isTokenColorKey = ELEMENTS.some(element =>
              element.settings.some(setting => 
                setting.section === TOKEN_COLOR_CUSTOMIZATIONS_KEY && setting.key === key
              )
            );
            
            if (isTokenColorKey) {
              effectiveTokenColors[key] = value;
            } else {
              effectiveColors[key] = value;
            }
          });

          this.lastWritePromise = this.lastWritePromise
            .then(() => {
              console.log('UPDATING color customizations with:', effectiveColors);
              return config.update(COLOR_CUSTOMIZATION_KEY, effectiveColors, this.toVscodeConfigTarget(this.configTarget));
            })
            .then(() => {
              console.log('UPDATING token color customizations with:', effectiveTokenColors);
              return config.update(TOKEN_COLOR_CUSTOMIZATIONS_KEY, effectiveTokenColors, this.toVscodeConfigTarget(this.configTarget));
            })
            .catch((err) => console.error('Failed to update color customizations:', err))
            .finally(() => resolve());
        } catch (err) {
          console.error('Error in applyEffectiveColors:', err);
          resolve();
        }
      }, 10);
    });
  }

  public static getColorTheme(): string {
    const config = vscode.workspace.getConfiguration();
    return config.get<string>(COLOR_THEME_KEY) || 'Default';
  }

  /**
   * Gets the current value of a setting from the base settings.
   */
  public static getSettingValue(section: string, key: string): string | undefined {
    return this.baseSettings.find(s => s.section === section && s.key === key)?.value;
  }

  private static removeSetting(section: string, key: string): void {
    this.baseSettings = this.baseSettings.filter(s => !(s.section === section && s.key === key));
  }

  private static addOrUpdateSetting(section: string, key: string, value: string): void {
    console.log(`Push setting: ${section} ${key} ${value}`);
    const existing = this.baseSettings.find(s => s.section === section && s.key === key);
    if (existing) {
      existing.value = value;
    } else {
      this.baseSettings.push(new ItemSetting(section, key, value));
    }
  }
}
