import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { SettingsManager } from './SettingsManager';
import { ELEMENTS } from './ElementRegistry';

export class SidebarProvider implements vscode.WebviewViewProvider {
  constructor(private readonly extensionUri: vscode.Uri) {}

  public async resolveWebviewView(webviewView: vscode.WebviewView): Promise<void> {
    try {
      await SettingsManager.loadBaseColors();
      webviewView.webview.options = { enableScripts: true };
      webviewView.webview.html = this.getHtml(webviewView.webview);

      const sendState = () => {
        const workspaceAvailable = !!vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0;
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
      };
      sendState();

      webviewView.webview.onDidReceiveMessage(async (msg) => {
        try {
          await this.handleWebviewMessage(msg, sendState);
        } catch (err) {
          console.error('Error handling message:', err);
        }
      });
    } catch (err) {
      console.error('Failed to resolve webview view:', err);
    }
  }

  private async handleWebviewMessage(msg: any, sendState: () => void): Promise<void> {
    switch (msg.type) {
      case 'hover':
        await SettingsManager.onHover(msg.key);
        break;
      case 'leave':
        await SettingsManager.onLeave(msg.key);
        break;
      case 'setColor':
        await SettingsManager.onSetColor(msg.key, msg.color);
        break;
      case 'setConfigTarget':
        SettingsManager.setConfigTarget(msg.target);
        sendState();
        break;
      case 'requestState':
        sendState();
        break;
      default:
        console.warn('Unknown message type:', msg.type);
    }
  }

  /**
   * Ensures the color value is a valid hex string.
   */
  private sanitizeHex(value?: string): string {
    if (!value) return '#000000';
    return /^#([0-9a-fA-F]{6})$/.test(value) ? value : '#000000';
  }

  /**
   * Generates the HTML for the sidebar webview.
   */
  private getHtml(webview: vscode.Webview): string {
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this.extensionUri, 'out', 'webview', 'sidebar.js')
    );
    const styleSidebarUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this.extensionUri, 'media', 'sidebar.css')
    );

    const itemsHtml = ELEMENTS.map((el) => {
      const color = this.sanitizeHex(SettingsManager.baseColors[el.key]);
      return `
        <div class="item" data-key="${el.key}">
          <span>${el.label}</span>
          <input type="color" class="picker" data-key="${el.key}" value="${color}" />
        </div>`;
    }).join('\n');

    const htmlPath = path.join(this.extensionUri.fsPath, 'src', 'webview', 'sidebar.html');
    let html = '';
    try {
      html = fs.readFileSync(htmlPath, 'utf8');
    } catch (err) {
      console.error('Failed to read sidebar.html:', err);
      return '<main><p>Failed to load sidebar UI.</p></main>';
    }

    return html
      .replace('{{cspSource}}', webview.cspSource)
      .replace('{{styleSidebarUri}}', styleSidebarUri.toString())
      .replace('{{itemsHtml}}', itemsHtml)
      .replace('{{scriptUri}}', scriptUri.toString());
  }
}
