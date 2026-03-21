import { ElementSetting } from "./ElementSetting";

export interface ElementDefinition {
  label: string;
  description: string;
  settings: ElementSetting[];
}
