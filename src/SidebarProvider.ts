import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { SettingsManager } from "./SettingsManager";
import { ELEMENTS } from "./ElementRegistry";

export class SidebarProvider implements vscode.WebviewViewProvider {
  constructor(private readonly extensionUri: vscode.Uri) { }

  async resolveWebviewView(webviewView: vscode.WebviewView) {
    await SettingsManager.loadBaseColors();
    
    webviewView.webview.options = { enableScripts: true };
    webviewView.webview.html = this.getHtml(webviewView.webview);

    webviewView.webview.onDidReceiveMessage(async (msg) => {
      try {
        switch (msg.type) {
          case "hover":
            await SettingsManager.onHover(msg.key);
            break;
          case "leave":
            await SettingsManager.onLeave(msg.key);
            break;
          case "setColor":
            await SettingsManager.onSetColor(msg.key, msg.color);
            break;
        }
      } catch (err) {
        console.error("Error handling message:", err);
      }
    });
  }

  private sanitizeHex(value: string | undefined): string {
    if (!value) return "#000000";
    const match = /^#([0-9a-fA-F]{6})$/.exec(value);
    return match ? value : "#000000";
  }

  private getHtml(webview: vscode.Webview): string {
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this.extensionUri, "out", "webview", "sidebar.js")
    );
    
    const styleSidebarUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this.extensionUri, "media", "sidebar.css")
    );

    const itemsHtml = ELEMENTS
      .map((el) => {
        const color = this.sanitizeHex(SettingsManager.baseColors[el.key]);
        return `
        <div class="item" data-key="${el.key}">
          <span>${el.label}</span>
          <input type="color" class="picker" data-key="${el.key}" value="${color}" />
        </div>`;
      })
      .join("\n");

    const htmlPath = path.join(this.extensionUri.fsPath, "src", "webview", "sidebar.html");
    let html = fs.readFileSync(htmlPath, "utf8");

    html = html
      .replace("{{cspSource}}", webview.cspSource)
      .replace("{{styleSidebarUri}}", styleSidebarUri.toString())
      .replace("{{itemsHtml}}", itemsHtml.toString())
      .replace("{{scriptUri}}", scriptUri.toString());

    return html;
  }
}
