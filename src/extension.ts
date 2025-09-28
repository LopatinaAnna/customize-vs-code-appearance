import * as vscode from "vscode";
import { SidebarProvider } from "./SidebarProvider";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider("styleCustomizerView", new SidebarProvider(context.extensionUri))
  );
}

export function deactivate() { }
