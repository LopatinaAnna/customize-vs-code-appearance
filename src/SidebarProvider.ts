import * as vscode from 'vscode';
import { SettingsManager } from './SettingsManager';
import { ELEMENTS } from './ElementRegistry';
import { ElementDefinition } from './interfaces/ElementDefinition';
import { ElementSetting } from './interfaces/ElementSetting';

export class SidebarProvider implements vscode.WebviewViewProvider {
  private themeColors: Record<string, string> = {};
  private currentTheme: string = '';

  constructor(private readonly extensionUri: vscode.Uri) { }

  public async resolveWebviewView(webviewView: vscode.WebviewView): Promise<void> {
    try {
      SettingsManager.loadBaseSettings();
      SettingsManager.loadAppSettings();
      webviewView.webview.options = { enableScripts: true };
      webviewView.webview.html = await this.getHtml(webviewView.webview, ELEMENTS);

      this.currentTheme = SettingsManager.getColorTheme();
      this.setupThemeListener(webviewView);
      this.setupStateManagement(webviewView);
      this.setupMessageHandler(webviewView);
    } catch (err) {
      console.error('Failed to resolve webview view:', err);
    }
  }

  private refreshWorkspaceAvailability(webviewView: vscode.WebviewView): void {
    const workspaceAvailable = !!vscode.workspace.workspaceFolders?.length || vscode.workspace.workspaceFile;
    if (workspaceAvailable && SettingsManager.getConfigTarget() === 'Global') {
      SettingsManager.setConfigTarget('Workspace');
    }
    if (!workspaceAvailable && SettingsManager.getConfigTarget() !== 'Global') {
      SettingsManager.setConfigTarget('Global');
    }
    webviewView.webview.postMessage({
      type: 'workspaceAvailability',
      available: workspaceAvailable,
      configTarget: SettingsManager.getConfigTarget(),
    });
  }

  private setupThemeListener(webviewView: vscode.WebviewView): void {
    this.requestFreshThemeColors(webviewView);

    webviewView.onDidChangeVisibility(async () => {
      if (webviewView.visible) {
        this.requestFreshThemeColors(webviewView);
      }
    });

    vscode.window.onDidChangeActiveColorTheme(async e => {
      const newTheme = await SettingsManager.getColorTheme();
      if (this.currentTheme !== newTheme) {
        console.log('Active color theme changed:', e.kind);
        this.currentTheme = newTheme;
        this.requestFreshThemeColors(webviewView);
      }
    });
  }

  private requestFreshThemeColors(webviewView: vscode.WebviewView, setting?: ElementSetting, groupLabel?: string): void {
    const themeClass = vscode.window.activeColorTheme.kind === vscode.ColorThemeKind.Dark ? 'vscode-dark'
      : vscode.window.activeColorTheme.kind === vscode.ColorThemeKind.Light ? 'vscode-light'
      : 'vscode-high-contrast';
    
    const colorKeys: string[] = [];
    const colorsToUpdateFromBase: Record<string, string> = {};
    
    if (setting) {
      // Compute color for the single element being reset
      if (setting.type === 'color') {
        const baseSettingValue = SettingsManager.getSettingValue(setting.section, setting.key);
        if (baseSettingValue) {
          colorsToUpdateFromBase[setting.key] = baseSettingValue;
        } else {
          colorKeys.push(this.toThemeFormat(setting.key));
        }
      }
    } else if (groupLabel) {
      // Compute colors for the group being reset
      const group = ELEMENTS.find(el => el.label === groupLabel);
      if (group) {
        group.settings.forEach(s => {
          if (s.type === 'color') {
            const baseSettingValue = SettingsManager.getSettingValue(s.section, s.key);
            if (baseSettingValue) {
              colorsToUpdateFromBase[s.key] = baseSettingValue;
            } else {
              colorKeys.push(this.toThemeFormat(s.key));
            }
          }
        });
      }
    } else {
      // Compute all colors (for full scope resets and theme changes)
      ELEMENTS.forEach(el => {
        el.settings.forEach(s => {
          if (s.type === 'color') {
            const baseSettingValue = SettingsManager.getSettingValue(s.section, s.key);
            if (baseSettingValue) {
              colorsToUpdateFromBase[s.key] = baseSettingValue;
            } else {
              colorKeys.push(this.toThemeFormat(s.key));
            }
          }
        });
      });
    }

    if (Object.keys(colorsToUpdateFromBase).length > 0) {
      for (const key in colorsToUpdateFromBase) {
        const element = ELEMENTS.flatMap(g => g.settings).find(setting => setting.key  === this.toConfigFormat(key));
        if (element) {
          this.themeColors[key] = colorsToUpdateFromBase[key];
          this.refreshElementUI(webviewView, element);
        }
      }
    }

    if (colorKeys.length > 0) {
      webviewView.webview.postMessage({ 
        type: 'setTheme', 
        theme: themeClass,
        colorKeys: colorKeys
      });
    }
  }

  private setupStateManagement(webviewView: vscode.WebviewView): void {
    this.refreshWorkspaceAvailability(webviewView);
  }

  private setupMessageHandler(webviewView: vscode.WebviewView): void {
    webviewView.webview.onDidReceiveMessage(async (msg) => {
      try {
        switch (msg.type) {
          case 'toggleHighlighting':
            await SettingsManager.setAppSetting('enableHoverHighlight', msg.enabled);
            break;
          case 'hover':
            await SettingsManager.onHover(msg.key);
            break;
          case 'leave':
            await SettingsManager.onLeave(msg.key);
            break;
          case 'setColor':
            await SettingsManager.onSetColor(msg.setting, msg.color);
            break;
          case 'setNumber':
            await SettingsManager.onSetNumber(msg.setting, msg.value);
            break;
          case 'setString':
            await SettingsManager.onSetString(msg.setting, msg.value);
            break;
          case 'setConfigTarget':
            SettingsManager.setConfigTarget(msg.target);
            this.refreshWorkspaceAvailability(webviewView);
            break;
          case 'requestState':
            this.refreshWorkspaceAvailability(webviewView);
            break;
          case 'resetScope':
            this.withConfirmation(`Are you sure you want to reset ${msg.target} settings?`, async () => {
              SettingsManager.resetScope(msg.target);
              await SettingsManager.applyEffectiveColors();
              this.requestFreshThemeColors(webviewView);
            });
            break;
          case 'resetGroup':
            this.withConfirmation(`Are you sure you want to reset ${msg.label} settings?`, async () => {
              SettingsManager.resetGroup(msg.label);
              await SettingsManager.applyEffectiveColors();
              this.requestFreshThemeColors(webviewView, undefined, msg.label);
            });
            break;
          case 'resetElement':
            SettingsManager.resetElement(msg.setting);
            await SettingsManager.applyEffectiveColors();
            if (msg.setting.type === 'color') {
              this.requestFreshThemeColors(webviewView, msg.setting);
            } else {
              this.refreshElementUI(webviewView, msg.setting);
            }
            break;
          case 'themeColorsReady':
            this.refreshUI(webviewView, msg.colors);
            break;
          case 'consoleLog':
            console.log(msg.message);
            break;
          case 'consoleError':
            console.error(msg.message);
            break;
          default:
            console.warn('Unknown message type:', msg.type);
        }
      } catch (err) {
        console.error('Error handling message:', err);
      }
    });
  }

  private async withConfirmation(message: string, action: () => Promise<void>, isModal: boolean = true): Promise<void> {
    const result = await vscode.window.showInformationMessage(message, { modal: isModal }, 'Yes');
    if (result === 'Yes') {
      await action();
    }
  }

  private refreshUI(webviewView: vscode.WebviewView, newColors: Record<string, string>): void {
    vscode.window.withProgress({
      location: vscode.ProgressLocation.Notification,
      title: "Refreshing settings...",
      cancellable: true
    }, async (progress, token) => {
      token.onCancellationRequested(() => {
          console.warn("User cancelled the operation");
      });
      for (const key in newColors) {
        const element = ELEMENTS.flatMap(g => g.settings).find(setting => setting.key  === this.toConfigFormat(key));
        if (element) {
          this.themeColors[key] = newColors[key];
          this.refreshElementUI(webviewView, element);
        }
      }
    });
  }

  private refreshElementUI(webviewView: vscode.WebviewView, setting: ElementSetting): void {
    //console.log(`Refreshing UI for element: ${setting.section}.${setting.key}`);
    const elementHtml = this.getInputHtml(setting);
    webviewView.webview.postMessage({
      type: 'replaceElement',
      newHtml: elementHtml,
      section: setting.section,
      key: setting.key,
      elementType: setting.type,
      options: setting.options
    });
  }

  /**
   * Ensures the color value is a valid hex string (6 or 8 digits for RGBA).
   */
  private sanitizeHex(value?: string): string {
    if (!value) return ''; // no customization defined
    // Accept both 6-digit (#RRGGBB) and 8-digit (#RRGGBBAA) hex colors
    return /^#([0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(value) ? value : '';
  }

  /**
   * Gets the theme color for a specific color key.
   * Converts the key format (e.g., "titleBar.activeBackground") to theme format (e.g., "titleBar-activeBackground").
   */
  private getThemeColor(colorKey: string): string | undefined {
    const themeKey = this.toThemeFormat(colorKey);
    return this.themeColors[themeKey];
  }
  
  private toConfigFormat(key: string): string {
    return key.replace(/-/g, '.');
  }
  
  private toThemeFormat(key: string): string {
    return key.replace(/\./g, '-');
  }

  private async getHtml(webview: vscode.Webview, elements: ElementDefinition[]): Promise<string> {
    const scriptUri = this.getScriptUri(webview);
    const styleSidebarUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this.extensionUri, 'media', 'sidebar.css')
    );

    const itemsHtml = elements.map((el, idx) => this.generateElementHtml(el, idx)).join('\n');
    return this.loadAndReplaceTemplate(webview.cspSource, styleSidebarUri.toString(), itemsHtml, scriptUri.toString());
  }

  private getScriptUri(webview: vscode.Webview): vscode.Uri {
    return webview.asWebviewUri(
      vscode.Uri.joinPath(this.extensionUri, 'out', 'webview', 'sidebar.js')
    );
  }

  private generateElementHtml(el: ElementDefinition, idx: number): string {
    const settingsHtml = el.settings.map(setting => `
      <div class="setting-container">
        <div class="setting-item" data-key="${setting.key}">
          <div class="setting-label" data-key="${setting.key}" title="${setting.description}">
            ${setting.label}
          </div>
          ${this.getInputHtml(setting)}
        </div>
      </div>`).join('');

    return `
      <div class="element-group" data-group="${idx}" data-label="${el.label}">
        <div class="element-group-container">
          <button class="element-header" tabindex="0" data-group="${idx}">
            <div class="element-header-icons">
              <span class="expand-icon">+</span>
            </div>
            <span class="element-header-title">${el.label}</span>
            <span class="reset-group" title="Reset all the customizations for the ${el.label}">&#x21bb;</span>
          </button>
          <div class="element-group-description">${el.description}</div>
        </div>
        <div class="element-settings" style="display:none;">
          ${settingsHtml}
        </div>
      </div>`;
  }

  private loadAndReplaceTemplate(cspSource: string, styleSidebarUri: string, itemsHtml: string, scriptUri: string): string {
    const htmlTemplate = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta http-equiv="Content-Security-Policy" content="img-src https: data:; style-src 'unsafe-inline' ${cspSource};">
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <link href="${styleSidebarUri}" rel="stylesheet">
          <title>Customize VS Code Appearance</title>
        </head>
        <body class="vscode-light">
          <main>
            <nav aria-label="Configuration target" class="button-group">
              <div class="scope-control">
                <button id="btn-global" type="button" class="config-btn" aria-pressed="false">Global (User)</button>
                <span class="scope-reset" data-target="Global" title="Reset customizations for elements listed below in the Global (User) scope.">&#x21bb;</span>
              </div>
              <div class="scope-control">
                <button id="btn-workspace" type="button" class="config-btn" aria-pressed="false">Workspace/Folder</button>
                <span class="scope-reset" data-target="Workspace" title="Reset customizations for elements listed below in the Workspace/Folder scope.">&#x21bb;</span>
              </div>
              <div class="scope-control">
                <input type="checkbox" id="enableHighlighting" class="checkbox-input" ${SettingsManager.getAppSettingValue('enableHoverHighlight') ? 'checked' : ''} />
                <label for="enableHighlighting">Enable Highlighting</label>
              </div>
            </nav>
            <section aria-label="Color Customizations" class="element-list">
              ${itemsHtml}
            </section>
          </main>
          <script src="${scriptUri}"><\/script>
        </body>
      </html>`;
    return htmlTemplate;
  }

  private getInputHtml(setting: ElementSetting): string {
    switch (setting.type) {
      case 'color':
        return this.getColorInput(setting);
      case 'number':
        return this.getNumberInput(setting);
      case 'string':
        return setting.options ? this.getSelectInput(setting) : this.getTextInput(setting);
      default:
        return '';
    }
  }

  private getColorInput(setting: ElementSetting): string {
    const color = this.sanitizeHex(SettingsManager.getSettingValue(setting.section, setting.key));
    // Use theme color as default if no custom color is set
    const themeColor = this.getThemeColor(setting.key);
    const defaultColor = themeColor || '#000000';

    // Extract RGB (6 chars) and alpha (2 chars) from the color value
    let rgbColor = defaultColor; // default RGB
    let alphaPercent = '100'; // default opacity
    
    if (color) {
      if (color.length === 9) {
        // 8-digit hex: #RRGGBBAA
        rgbColor = color.substring(0, 7);
        const alphaHex = color.substring(7, 9);
        alphaPercent = String(Math.round((parseInt(alphaHex, 16) / 255) * 100));
      } 
      if (color.length === 7) {
        // 6-digit hex: #RRGGBB
        rgbColor = color;
      }
    } else if (themeColor && themeColor.length >= 7) {
      if (themeColor.length === 9) {
        rgbColor = themeColor.substring(0, 7);
        const alphaHex = themeColor.substring(7, 9);
        alphaPercent = String(Math.round((parseInt(alphaHex, 16) / 255) * 100));
      } 
      if (themeColor.length === 7) {
        rgbColor = themeColor;
      }
    }
    
    return `
      <div id="${setting.section}.${setting.key}" class="element-row" data-is-modified="${!!color}" data-setting="${encodeURIComponent(JSON.stringify(setting))}">
        <div class="color-input-group">
          <input type="color" class="picker color-rgb input-style" title="${!color ? "Using theme color. Click to customize." : rgbColor}" value="${rgbColor}" />
          <div class="opacity-control">
            <input
              type="range"
              id="opacity-${setting.key}"
              class="opacity-slider"
              title="Opacity: ${alphaPercent}%"
              min="0"
              max="100"
              value="${alphaPercent}" />
          </div>
          <span class="reset-element" title="Reset">&#x21bb;</span>
        </div>
      </div>`;
  }

  private getNumberInput(setting: ElementSetting): string {
    const currentValue = SettingsManager.getSettingValue(setting.section, setting.key);
    const value: number = currentValue ? parseInt(currentValue) || 0 : 0;
    return `
      <div id="${setting.section}.${setting.key}" class="element-row" data-is-modified="${!!currentValue && currentValue !== setting.defaultValue}" data-setting="${encodeURIComponent(JSON.stringify(setting))}">
        <div class="number-input-wrapper">
          <input
            type="number"
            class="number-input input-style"
            value="${value ? value : setting.defaultValue || ''}"
            min="6"
            max="100"
            step="1" />
          <button type="button" class="number-up" title="Increase">▲</button>
          <button type="button" class="number-down" title="Decrease">▼</button>
        </div>
        <span class="reset-element" title="Reset">&#x21bb;</span>
      </div>`;
  }

  private getSelectInput(setting: ElementSetting): string {
    const value = SettingsManager.getSettingValue(setting.section, setting.key) || setting.defaultValue || '';
    const options = (setting.options || []).map(opt =>
      `<option value="${opt}" ${opt === value || opt === setting.defaultValue ? 'selected' : ''}>
        ${opt.charAt(0).toUpperCase() + opt.slice(1)}
      </option>`
    ).join('');
    return `
      <div id="${setting.section}.${setting.key}" class="element-row" data-is-modified="${!!value && value !== setting.defaultValue}" data-setting="${encodeURIComponent(JSON.stringify(setting))}">
        <select class="select-input input-style">
          <option selected value="" disabled>
          </option>${options}
        </select>
        <span class="reset-element" title="Reset">&#x21bb;</span>
      </div>`;
  }

  private getTextInput(setting: ElementSetting): string {
    const value = SettingsManager.getSettingValue(setting.section, setting.key) || setting.defaultValue || '';
    return `
      <div id="${setting.section}.${setting.key}" class="element-row" data-is-modified="${!!value && value !== setting.defaultValue}" data-setting="${encodeURIComponent(JSON.stringify(setting))}">
        <input
          type="text"
          class="string-input input-style"
          value="${value}" />
        <span class="reset-element" title="Reset">&#x21bb;</span>
      </div>`;
  }
}
