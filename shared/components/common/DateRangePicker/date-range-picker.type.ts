export interface DateRange {
  start: string;
  end: string;
}

export interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onChange: (range: DateRange) => void;
  className?: string;
}
