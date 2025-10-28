import * as React from "react";

export type DatePickerProps = React.InputHTMLAttributes<HTMLInputElement>;

export function DatePicker(props: DatePickerProps) {
  return <input type="date" {...props} />;
}

export default DatePicker;
