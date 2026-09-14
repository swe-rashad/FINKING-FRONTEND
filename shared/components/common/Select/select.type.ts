export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectChangeEvent {
  target: {
    name: string;
    value: string;
  };
}

export interface SelectProps {
  id?: string;
  name?: string;
  label?: string;
  value?: string;
  options: SelectOption[];
  error?: string;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
  onChange?: (event: SelectChangeEvent) => void;
}
