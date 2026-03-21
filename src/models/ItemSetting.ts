export class ItemSetting {
  constructor(section: string, key: string, value: any) {
    this.section = section;
    this.key = key;
    this.value = value;
  }
  section: string;
  key: string;
  value: any;
};