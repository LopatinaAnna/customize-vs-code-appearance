import * as vscode from 'vscode';

const HIGHLIGHT_COLOR = '#9a9a9aff';
const CONFIG_KEY = 'workbench.colorCustomizations';

type ColorsMap = Record<string, string | undefined>;
type ConfigTarget = 'Global' | 'Workspace';

export class SettingsManager {
  private static tempHighlights: Record<string, string> = {};
  private static pendingWrite: NodeJS.Timeout | null = null;
  private static lastWritePromise: Promise<void> = Promise.resolve();
  private static configTarget: ConfigTarget = 'Global';
  public static baseColors: ColorsMap = {};

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

  public static getConfigTarget(): ConfigTarget {
    return this.configTarget;
  }

  /**
   * Loads the current base colors from the VS Code configuration.
   */
  public static async loadBaseColors(): Promise<void> {
    const cfg = vscode.workspace.getConfiguration();
    const current = cfg.get<Record<string, string>>(CONFIG_KEY) || {};
    this.baseColors = { ...current };
  }

  /**
   * Temporarily highlights an element on hover.
   */
  public static async onHover(key: string): Promise<void> {
    if (this.tempHighlights[key]) return;
    this.tempHighlights[key] = HIGHLIGHT_COLOR;
    await this.applyEffectiveColors();
  }

  /**
   * Removes the temporary highlight when the mouse leaves.
   */
  public static async onLeave(key: string): Promise<void> {
    if (!this.tempHighlights[key]) return;
    delete this.tempHighlights[key];
    await this.applyEffectiveColors();
  }

  /**
   * Sets a persistent color for an element.
   */
  public static async onSetColor(key: string, color: string): Promise<void> {
    if (!color || color.trim() === '') {
      delete this.baseColors[key];
    } else {
      this.baseColors[key] = color.trim();
    }
    await this.applyEffectiveColors();
  }

  /**
   * Handles other number settings like font size.
   */
  public static async onSetNumber(key: string, value: number): Promise<void> {
    if (key === 'editor.fontSize') {
      const fontSize = value && !isNaN(Number(value)) ? Number(value) : undefined;
      const config = vscode.workspace.getConfiguration('editor');
      if (fontSize) {
        await config.update('fontSize', fontSize, SettingsManager.toVscodeConfigTarget(SettingsManager.getConfigTarget()));
      }
      return;
    }
  }

  /**
   * Handles string settings like font family.
   */
  public static async onSetString(key: string, value: string): Promise<void> {
    if (key === 'editor.fontFamily') {
      const config = vscode.workspace.getConfiguration('editor');
      if (value && value.trim()) {
        await config.update('fontFamily', value.trim(), SettingsManager.toVscodeConfigTarget(SettingsManager.getConfigTarget()));
      }
      return;
    } 
    
    if (key === 'workbench.activityBar.location') {
      const config = vscode.workspace.getConfiguration('workbench');
      await config.update('activityBar.location', value, SettingsManager.toVscodeConfigTarget(SettingsManager.getConfigTarget()));
    } 
    
    if (key === 'workbench.sideBar.location') {
      const config = vscode.workspace.getConfiguration('workbench');
      await config.update('sideBar.location', value, SettingsManager.toVscodeConfigTarget(SettingsManager.getConfigTarget()));
    } 
    
    if (key === 'workbench.panel.defaultLocation') {
      const config = vscode.workspace.getConfiguration('workbench');
      await config.update('panel.defaultLocation', value, SettingsManager.toVscodeConfigTarget(SettingsManager.getConfigTarget()));
    }
  }

  /**
   * Remove any settings the extension has written, returning VS Code to defaults.
   */
  public static async resetAll(): Promise<void> {
    console.log('resetAll called for target:', SettingsManager.getConfigTarget());
    const cfg = vscode.workspace.getConfiguration();
    // clear colors in both global and workspace
    try {
      await cfg.update(CONFIG_KEY, {}, vscode.ConfigurationTarget.Workspace);
      await cfg.update(CONFIG_KEY, {}, vscode.ConfigurationTarget.Global);
      console.log('Cleared workbench.colorCustomizations at both levels');
    } catch (err) {
      console.error('Failed to clear color customizations:', err);
    }

    // clear other settings we may have modified at both levels
    try {
      const editorCfg = vscode.workspace.getConfiguration('editor');
      await editorCfg.update('fontSize', undefined, vscode.ConfigurationTarget.Workspace);
      await editorCfg.update('fontSize', undefined, vscode.ConfigurationTarget.Global);
      await editorCfg.update('fontFamily', undefined, vscode.ConfigurationTarget.Workspace);
      await editorCfg.update('fontFamily', undefined, vscode.ConfigurationTarget.Global);
      const workbench = vscode.workspace.getConfiguration('workbench');
      await workbench.update('activityBar.location', undefined, vscode.ConfigurationTarget.Workspace);
      await workbench.update('activityBar.location', undefined, vscode.ConfigurationTarget.Global);
      await workbench.update('sideBar.location', undefined, vscode.ConfigurationTarget.Workspace);
      await workbench.update('sideBar.location', undefined, vscode.ConfigurationTarget.Global);
      await workbench.update('panel.defaultLocation', undefined, vscode.ConfigurationTarget.Workspace);
      await workbench.update('panel.defaultLocation', undefined, vscode.ConfigurationTarget.Global);
      console.log('Cleared editor and workbench settings at both levels');
    } catch (err) {
      console.error('Failed to reset other settings:', err);
    }
    // clear internal caches
    this.baseColors = {};
    this.tempHighlights = {};
  }

  /**
   * Reset only a specific set of color keys, leaving other customizations untouched.
   */
  public static async resetGroup(keys: string[]): Promise<void> {
    if (!keys || keys.length === 0) {
      console.warn('resetGroup called with no keys');
      return;
    }
    console.log('resetGroup called with keys:', keys);

    // remove keys from workspace/global individually
    const cfg = vscode.workspace.getConfiguration();
    const inspect = cfg.inspect<Record<string,string>>(CONFIG_KEY);
    const newWorkspace: Record<string,string> = { ...(inspect?.workspaceValue || {}) };
    const newGlobal: Record<string,string> = { ...(inspect?.globalValue || {}) };
    keys.forEach(k => {
      console.log('Deleting key from both levels:', k);
      delete newWorkspace[k];
      delete newGlobal[k];
      delete this.baseColors[k];
      delete this.tempHighlights[k];
    });
    try {
      await cfg.update(CONFIG_KEY, newWorkspace, vscode.ConfigurationTarget.Workspace);
      await cfg.update(CONFIG_KEY, newGlobal, vscode.ConfigurationTarget.Global);
      console.log('Successfully updated configs after group reset');
    } catch (err) {
      console.error('Failed to update color customizations after group reset:', err);
    }
  }

  /**
   * Reset the given configuration target only.
   */
  public static async resetScope(scope: 'Global' | 'Workspace'): Promise<void> {
    console.log('resetScope called for', scope);
    const target = scope === 'Workspace' ? vscode.ConfigurationTarget.Workspace : vscode.ConfigurationTarget.Global;
    const cfg = vscode.workspace.getConfiguration();
    try {
      await cfg.update(CONFIG_KEY, {}, target);
      console.log(`Cleared ${CONFIG_KEY} at ${scope}`);
    } catch (err) {
      console.error(`Failed to clear ${CONFIG_KEY} at ${scope}`, err);
    }

    try {
      const editorCfg = vscode.workspace.getConfiguration('editor');
      await editorCfg.update('fontSize', undefined, target);
      await editorCfg.update('fontFamily', undefined, target);
      const workbench = vscode.workspace.getConfiguration('workbench');
      await workbench.update('activityBar.location', undefined, target);
      await workbench.update('sideBar.location', undefined, target);
      await workbench.update('panel.defaultLocation', undefined, target);
      console.log(`Cleared editor/workbench settings at ${scope}`);
    } catch (err) {
      console.error(`Failed to reset other settings at ${scope}:`, err);
    }
    // clear caches so reload picks up changes
    this.baseColors = {};
    this.tempHighlights = {};
  }

  /**
   * Applies the effective color customizations to VS Code.
   */
  public static async applyEffectiveColors(): Promise<void> {
    if (this.pendingWrite) clearTimeout(this.pendingWrite);
    this.pendingWrite = setTimeout(() => {
      this.pendingWrite = null;
      const config = vscode.workspace.getConfiguration();
      // Only include keys that are set in baseColors or tempHighlights
      const effective: ColorsMap = {};

      // Apply persistent colors
      Object.entries(this.baseColors).forEach(([k, v]) => {
        if (v !== undefined) effective[k] = v;
      });

      // Apply temporary highlights (overrides persistent)
      Object.entries(this.tempHighlights).forEach(([k, v]) => {
        effective[k] = v;
      });

      this.lastWritePromise = this.lastWritePromise
        .then(() => config.update(CONFIG_KEY, effective, this.toVscodeConfigTarget(this.configTarget)))
        .catch((err) => console.error('Failed to update:', err));
    }, 10);
  }
}
