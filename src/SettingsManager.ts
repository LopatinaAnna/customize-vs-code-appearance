import * as vscode from "vscode";

const HIGHLIGHT_COLOR = "#9a9a9aff";
const CONFIG_KEY = "workbench.colorCustomizations";

type ColorsMap = Record<string, string | undefined>;

export class SettingsManager {
  private static tempHighlights: Record<string, string> = {};
  private static pendingWrite: NodeJS.Timeout | null = null;
  private static lastWritePromise: Promise<void> = Promise.resolve();

  public static baseColors: ColorsMap = {};

  static async loadBaseColors(): Promise<void> {
    const cfg = vscode.workspace.getConfiguration();
    const current = cfg.get<Record<string, string>>(CONFIG_KEY) || {};
    this.baseColors = { ...current };
  }

  static async onHover(key: string) {
    if (this.tempHighlights[key]) return;
    this.tempHighlights[key] = HIGHLIGHT_COLOR;
    await this.applyEffectiveColors();
  }

  static async onLeave(key: string) {
    if (!this.tempHighlights[key]) return;
    delete this.tempHighlights[key];
    await this.applyEffectiveColors();
  }

  static async onSetColor(key: string, color: string) {
    if (!color || color.trim() === "") {
      delete this.baseColors[key];
    } else {
      this.baseColors[key] = color.trim();
    }
    await this.applyEffectiveColors();
  }

  static async applyEffectiveColors(): Promise<void> {
    if (this.pendingWrite) {
      clearTimeout(this.pendingWrite);
    }

    this.pendingWrite = setTimeout(() => {
      this.pendingWrite = null;

      const config = vscode.workspace.getConfiguration();
      const currentSettings = config.get<Record<string, string>>(CONFIG_KEY) || {};

      const effective: Record<string, string | undefined> = { ...currentSettings };

      // persistent
      for (const k of Object.keys(this.baseColors)) {
        const v = this.baseColors[k];
        if (v === undefined) delete effective[k];
        else effective[k] = v;
      }

      // temporary highlights
      for (const k of Object.keys(this.tempHighlights)) {
        effective[k] = this.tempHighlights[k];
      }

      const cleaned: Record<string, string> = {};
      Object.entries(effective).forEach(([k, v]) => {
        if (v !== undefined) cleaned[k] = v;
      });

      this.lastWritePromise = this.lastWritePromise
        .then(() => {
          console.log("Update config");
          config.update(CONFIG_KEY, cleaned, vscode.ConfigurationTarget.Global)
        })
        .catch((err) => console.error("Failed to update:", err));
    }, 10);
  }
}
