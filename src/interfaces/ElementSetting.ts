export interface ElementSetting {
  label: string;
  key: string;
  type: 'color' | 'number' | 'string';
  description?: string;
  options?: string[];
}
