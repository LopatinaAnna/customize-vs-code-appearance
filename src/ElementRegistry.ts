
export interface ElementDefinition {
  label: string;
  key: string;
}

export const ELEMENTS: ElementDefinition[] = [
  { label: 'Title Bar', key: 'titleBar.activeBackground' },
  { label: 'Activity Bar', key: 'activityBar.background' },
  { label: 'Side Bar', key: 'sideBar.background' },
  { label: 'Command Center', key: 'commandCenter.background' },
];
