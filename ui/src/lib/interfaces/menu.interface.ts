export type CheckboxState = 'deselected' | 'selected' | 'indeterminate';

export interface MenuItem {
  id?: string | number;
  text: string;
  checked?: boolean;
  type?: CheckboxState;
  disabled?: boolean;
}

export interface MenuChangeEvent {
  index: number;
  item: MenuItem;
  kind: 'radio' | 'checkbox';
  value: boolean | CheckboxState;
}
