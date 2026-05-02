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
   *
   * @throws Errors are caught and logged; operation continues with defaults if load fails
   * @see resetScope
   * @see applyEffectiveColors
   */
  public static loadBaseSettings(): void {
    try {
      this.baseSettings = [];
      const config = vscode.workspace.getConfiguration();
      const uniqueSections = new Set<string>();

      // Collect unique sections.
      ELEMENTS.forEach(element => {
        element.settings.forEach(setting => uniqueSections.add(setting.section));
      });

      // Query each section once and load all relevant settings.
      uniqueSections.forEach(section => {
        try {
          const sectionSettings = config.get<Record<string, any>>(section, {});
          if (!sectionSettings || typeof sectionSettings !== 'object') {
            return;
          }

          ELEMENTS.forEach(element => {
            element.settings.forEach(setting => {
              if (setting.section !== section) {
                return;
              }

              if (!Object.prototype.hasOwnProperty.call(sectionSettings, setting.key)) {
                return;
              }

              const value = sectionSettings[setting.key];
              if (value === undefined || value === null) {
                return;
              }

              console.log(`Loaded setting: ${setting.section}.${setting.key} = ${value}`);
              this.baseSettings.push(new ItemSetting(setting.section, setting.key, value));
            });
          });
        } catch (innerErr) {
          console.error(`Failed to load config section "${section}":`, innerErr);
        }
      });

      console.log(`Loaded ${this.baseSettings.length} base settings`);
    } catch (err) {
      console.error('Failed to load base settings:', err);
      this.baseSettings = [];
    }
  }

  /**
   * Loads application settings (UI preferences, feature flags, etc.) from VS Code configuration.
   * These are extension-specific settings distinct from color customizations.
   *
   * @throws Errors are caught and logged; operation continues with defaults if load fails
   * @see getAppSettingValue
   * @see setAppSetting
   */
  public static loadAppSettings(): void {
    try {
      const config = vscode.workspace.getConfiguration();
      const settings = config.get<Record<string, string | boolean>>(APP_SETTINGS_KEY, {});
      Object.entries(settings || {}).forEach(([key, value]) => {
        console.log(`Loaded app setting: ${APP_SETTINGS_KEY} ${key} ${value}`);
        this.appSettings[key] = value;
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error('Failed to load app settings:', message);
    }
  }

  /**
   * Retrieves an application setting value by key.
   * Returns undefined if the setting has not been loaded or set.
   *
   * @param key - The setting key to retrieve
   * @returns The setting value or undefined if not found
   *
   * @example
   * const highlightEnabled = SettingsManager.getAppSettingValue('enableHoverHighlight');
   * if (highlightEnabled) { // show highlights }
   */
  public static getAppSettingValue(key: string): any {
    return this.appSettings[key];
  }

  /**
   * Sets an application setting and persists it to global VS Code configuration.
   * Application settings are stored at the User (Global) scope only.
   *
   * @param key - The setting key to set
   * @param value - The value to set (must be JSON serializable)
   * @throws Logs error if configuration update fails; setting may not persist
   *
   * @example
   * await SettingsManager.setAppSetting('enableHoverHighlight', true);
   */
  public static async setAppSetting(key: string, value: any): Promise<void> {
    try {
      const config = vscode.workspace.getConfiguration();
      await config.update(`${APP_SETTINGS_KEY}.${key}`, value, vscode.ConfigurationTarget.Global);
      this.appSettings[key] = value;
      console.log(`Updated app setting: ${APP_SETTINGS_KEY}.${key} = ${value}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`Failed to update app setting ${key}:`, message);
      throw new Error(`Failed to save setting '${key}': ${message}`);
    }
  }

  /**
   * Temporarily highlights an element when the user hovers over it.
   *
   * Applies a temporary highlight color that takes precedence over persistent color customizations.
   * The highlight is cleared when the mouse leaves the element via {@link onLeave}.
   * Respects the user's 'enableHoverHighlight' setting and ignores duplicate hovers.
   *
   * @param key - The element key (color setting key) to highlight
   * @throws Errors are caught and logged
   *
   * @see onLeave
   * @see HIGHLIGHT_COLOR
   */
  public static async onHover(key: string): Promise<void> {
    try {
      if (!this.getAppSettingValue('enableHoverHighlight') || this.tempHighlights[key]) {
        return;
      }
      this.tempHighlights[key] = HIGHLIGHT_COLOR;
      await this.applyEffectiveColors();
    } catch (err) {
      console.error(`Failed to apply hover highlight for key '${key}':`, err);
    }
  }

  /**
   * Removes the temporary highlight when the mouse leaves an element.
   *
   * Cleans up the temporary highlight applied by {@link onHover}.
   * Respects the user's 'enableHoverHighlight' setting and handles missing highlights gracefully.
   *
   * @param key - The element key (color setting key) to unhighlight
   * @throws Errors are caught and logged
   *
   * @see onHover
   */
  public static async onLeave(key: string): Promise<void> {
    try {
      if (!this.getAppSettingValue('enableHoverHighlight') || !this.tempHighlights[key]) {
        return;
      }
      delete this.tempHighlights[key];
      await this.applyEffectiveColors();
    } catch (err) {
      console.error(`Failed to remove hover highlight for key '${key}':`, err);
    }
  }

  /**
   * Sets a persistent color customization for a UI element.
   *
   * Stores the color value and applies it to VS Code configuration. Empty or whitespace-only
   * colors are treated as a reset (removal of customization).
   *
   * @param setting - The element setting definition (includes section and key)
   * @param color - The color value as a hex string (e.g., '#RRGGBB' or '#RRGGBBAA')
   * @throws Logs error if color application fails
   *
   * @example
   * const titleBarSetting = elementSettings.find(s => s.key === 'titleBar.activeBackground');
   * await SettingsManager.onSetColor(titleBarSetting, '#FF0000FF');
   *
   * @see sanitizeHex for color validation
   */
  public static async onSetColor(setting: ElementSetting, color: string): Promise<void> {
    try {
      if (!color || color.trim() === '') {
        this.removeSetting(setting.section, setting.key);
      } else {
        this.addOrUpdateSetting(setting.section, setting.key, color);
      }
      await this.applyEffectiveColors();
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`Failed to set color for ${setting.key}:`, message);
      throw new Error(`Failed to apply color customization: ${message}`);
    }
  }

  /**
   * Sets a numeric setting such as font size or editor line height.
   *
   * Parses the string value as an integer and applies to VS Code configuration
   * in the current configuration target (Global or Workspace).
   *
   * @param setting - The element setting definition (includes section and key)
   * @param value - The numeric value as a string (will be parsed as integer)
   * @throws Logs error if configuration update fails; setting may not persist
   *
   * @example
   * await SettingsManager.onSetNumber(fontSizeSetting, '14');
   */
  public static async onSetNumber(setting: ElementSetting, value: string): Promise<void> {
    try {
      this.addOrUpdateSetting(setting.section, setting.key, value);
      const config = vscode.workspace.getConfiguration(setting.section);
      await config.update(setting.key, parseInt(value), SettingsManager.getVscodeConfigTarget());
      console.log(`Updated Number setting: ${setting.section}.${setting.key} = ${parseInt(value)}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`Failed to set number for ${setting.key}:`, message);
      throw new Error(`Failed to apply number setting: ${message}`);
    }
  }

  /**
   * Sets a string setting such as font family or activity bar position.
   *
   * Applies the string value to VS Code configuration in the current target
   * (Global or Workspace).
   *
   * @param setting - The element setting definition (includes section and key)
   * @param value - The string value to set
   * @throws Logs error if configuration update fails; setting may not persist
   *
   * @example
   * await SettingsManager.onSetString(fontFamilySetting, 'Monospace');
   */
  public static async onSetString(setting: ElementSetting, value: string): Promise<void> {
    try {
      this.addOrUpdateSetting(setting.section, setting.key, value);
      const config = vscode.workspace.getConfiguration(setting.section);
      await config.update(setting.key, value, SettingsManager.getVscodeConfigTarget());
      console.log(`Updated String setting: ${setting.section}.${setting.key} = ${value}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`Failed to set string for ${setting.key}:`, message);
      throw new Error(`Failed to apply string setting: ${message}`);
    }
  }

  /**
   * Resets all customizations for a group (element category) to default values.
   *
   * For example, resetting the 'Activity Bar' group will reset all activity bar
   * color, position, and styling settings to their defaults in the current scope.
   *
   * @param groupLabel - The group label (e.g., 'Title Bar', 'Editor', 'Terminal')
   * @throws Errors are caught and logged; partial resets may occur if individual settings fail
   *
   * @see resetElement
   * @see resetScope
   */
  public static resetGroup(groupLabel: string): void {
    try {
      console.log(`Resetting group: ${groupLabel}`);
      if (!groupLabel) {
        console.warn('No group label provided for resetGroup');
        return;
      }

      const elementsToReset = ELEMENTS.find(g => g.label === groupLabel);
      if (!elementsToReset) {
        console.warn(`No group found with label '${groupLabel}'`);
        return;
      }

      const config = vscode.workspace.getConfiguration();
      elementsToReset.settings.forEach(setting => {
        this.resetElement(setting, config);
      });
      console.log(`Completed group reset: ${groupLabel}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`Failed to reset group '${groupLabel}':`, message);
    }
  }

  /**
   * Resets a single element setting to its default value.
   *
   * Removes the customization from the current configuration scope (Global or Workspace),
   * clears any temporary highlights, and reverts to the default VS Code value.
   *
   * @param setting - The element setting to reset
   * @param config - Optional pre-configured VS Code configuration object (for performance)
   * @throws Logs error if reset fails; may leave partial state if failure occurs
   *
   * @see resetGroup
   */
  public static resetElement(setting: ElementSetting, config?: vscode.WorkspaceConfiguration): void {
    try {
      config = config || vscode.workspace.getConfiguration();
      config.update(`${setting.section}.${setting.key}`, undefined, SettingsManager.getVscodeConfigTarget());
      this.removeSetting(setting.section, setting.key);
      delete this.tempHighlights[setting.key];
      console.log(`Completed element reset: ${setting.section}.${setting.key}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`Failed to reset element '${setting.key}':`, message);
    }
  }

  /**
   * Resets all customizations in the specified configuration scope.
   *
   * Removes all color customizations, number settings, and string settings
   * from either the Global (User) or Workspace scope. Also clears all temporary highlights.
   *
   * @param scope - The scope to reset: 'Global' for user settings or 'Workspace' for folder settings
   * @throws Logs errors but continues; may leave partial state if some resets fail
   *
   * @see resetGroup
   * @see resetElement
   */
  public static resetScope(scope: 'Global' | 'Workspace'): void {
    try {
      ELEMENTS.map(e => e.label).forEach(group => {
        this.resetGroup(group);
      });
      this.baseSettings = [];
      this.tempHighlights = {};
      console.log(`Completed scope reset: ${scope}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`Failed to reset scope '${scope}':`, message);
    }
  }

  /**
   * Applies all effective color customizations to VS Code.
   *
   * Combines persistent user colors with temporary highlights (hover effects)
   * and applies them to the current configuration scope (Global or Workspace).
   * Updates are debounced (10ms) to batch rapid changes and improve performance.
   *
   * Handles both `workbench.colorCustomizations` and `editor.tokenColorCustomizations`
   * sections, routing colors to the appropriate category.
   *
   * @throws Errors are caught and logged; applies what succeeded before failure
   *
   * @see onSetColor
   * @see onHover
   * @see resetScope
   */
  public static async applyEffectiveColors(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (this.pendingWrite) {
        clearTimeout(this.pendingWrite);
      }
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
              console.log('Updating color customizations with:', effectiveColors);
              return config.update(COLOR_CUSTOMIZATION_KEY, effectiveColors, this.toVscodeConfigTarget(this.configTarget));
            })
            .then(() => {
              console.log('Updated token color customizations with:', effectiveTokenColors);
              return config.update(TOKEN_COLOR_CUSTOMIZATIONS_KEY, effectiveTokenColors, this.toVscodeConfigTarget(this.configTarget));
            })
            .catch((err) => console.error('Failed to update color customizations:', err))
            .finally(() => resolve());
        } catch (err) {
          console.error('Failed to apply effective colors:', err);
          resolve();
        }
      }, 10);
    });
  }

  /**
   * Gets the current VS Code theme kind (light, dark, high-contrast).
   *
   * Used to adapt the sidebar UI to match the current theme appearance.
   * Returns 'Default' if no theme is explicitly set.
   *
   * @returns The color theme name or 'Default'
   *
   * @see SidebarProvider.setupThemeListener
   */
  public static getColorTheme(): string {
    try {
      const config = vscode.workspace.getConfiguration();
      return config.get<string>(COLOR_THEME_KEY) || 'Default';
    } catch (err) {
      console.error('Failed to get color theme:', err);
      return 'Default';
    }
  }

  /**
   * Retrieves the current value of a persisted color setting.
   *
   * Searches the in-memory base settings cache for a setting matching the section and key.
   * Returns undefined if the setting has not been customized.
   *
   * @param section - The configuration section (e.g., 'workbench.colorCustomizations')
   * @param key - The setting key (e.g., 'titleBar.activeBackground')
   * @returns The setting value or undefined if not found
   *
   * @see addOrUpdateSetting
   */
  public static getSettingValue(section: string, key: string): string | undefined {
    return this.baseSettings.find(s => s.section === section && s.key === key)?.value;
  }

  private static removeSetting(section: string, key: string): void {
    this.baseSettings = this.baseSettings.filter(s => !(s.section === section && s.key === key));
    console.log(`Removed base setting: ${section} ${key}`);
  }

  private static addOrUpdateSetting(section: string, key: string, value: string): void {
    const existing = this.baseSettings.find(s => s.section === section && s.key === key);
    if (existing) {
      existing.value = value;
      console.log(`Updated base setting: ${section} ${key} ${value}`);
    } else {
      this.baseSettings.push(new ItemSetting(section, key, value));
      console.log(`Added base setting: ${section} ${key} ${value}`);
    }
  }
}
