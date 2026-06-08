import React, { ReactNode, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Calendar, X, AlertCircle } from "lucide-react";
import DatePicker, {
  DateObject as RmdpDateObject,
} from "react-multi-date-picker";
import persian_fa from "react-date-object/locales/persian_fa";
import persian from "react-date-object/calendars/persian";
import { MultiSelect } from "../ui/multi-select";
import { cn } from "@/lib/utils"; // Make sure you have this utility

// ---------- Types ----------
interface Option {
  value: string | number;
  label: string;
}

type InputType =
  | "multiSelect"
  | "select"
  | "text"
  | "textarea"
  | "date"
  | "number"
  | "decimal";

interface CustomInputProps {
  type: InputType;
  onChange?: (value: any) => void;
  value?: string | number | string[] | null | RmdpDateObject | RmdpDateObject[];
  label?: string;
  placeholder?: string;
  options?: Option[];
  className?: string;
  inputClassName?: string;
  error?: string | boolean | string[] | any; // Accept string error message or boolean
  [key: string]: any; // allow extra props (like {...props} for DatePicker/Input)
}

// ---------- Component ----------
const CustomInput: React.FC<CustomInputProps> = ({
  type,
  onChange,
  options = [],
  placeholder = "",
  value,
  label,
  className = "",
  inputClassName = "",
  error,
  ...props
}) => {
  const [selectedDate, setSelectedDate] = useState(value);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const hasError = Boolean(error);
  const errorMessage = typeof error === 'string' ? error : hasError ? 'این فیلد الزامی است' : '';

  const handleDateChange = (date: RmdpDateObject | RmdpDateObject[] | null) => {
    if (!date) {
      setSelectedDate(null);
      onChange?.(null);
      return;
    }

    if (Array.isArray(date)) {
      // Date range
      const start = date[0]
        ? date[0].toDate().toISOString().split("T")[0]
        : null;
      const end = date[1] ? date[1].toDate().toISOString().split("T")[0] : null;

      setSelectedDate(date);
      onChange?.([start, end]);
    } else {
      // Single date
      const miladiDate = date.toDate().toISOString().split("T")[0];
      setSelectedDate(date);
      onChange?.(miladiDate);
    }
  };

  const clearDate = () => {
    setSelectedDate(null);
    onChange?.(null);
  };

  // Handle integer number input (only digits 0-9)
  const handleIntegerInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // Only allow digits 0-9, and empty string for backspace/delete
    if (inputValue === "" || /^\d+$/.test(inputValue)) {
      // Always keep as string to preserve leading zeros and formatting
      onChange?.(inputValue);
    }
    // If the input contains non-digit characters, don't update the value
  };

  const handleDecimalInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // Allow digits and single decimal point
    if (inputValue === "" || /^\d*\.?\d*$/.test(inputValue)) {
      onChange?.(inputValue); // Keep as string
    }
  };

  const multiSelectOptions = options?.map((option) => ({
    ...option,
    value: String(option.value), // Convert numbers to strings
  }));

  // Common error styles
  const errorClasses = "border-red-500 focus:border-red-500 focus:ring-red-500";
  const normalClasses = "border-gray-300 focus:border-blue-500 focus:ring-blue-500";

  return (
    <div className={cn("flex flex-col gap-2 w-full", className)}>
      {type === "multiSelect" && (
        <>
          {label && <label className="text-sm font-medium">{label}</label>}
          <MultiSelect
            options={multiSelectOptions}
            defaultValue={Array.isArray(value) ? value.map(String) : []}
            onValueChange={onChange}
            placeholder={placeholder}
            className={cn(
              "text-right transition-colors",
              hasError && "border-red-500"
            )}
            dir="rtl"
            style={{ direction: "rtl" }}
            {...props}
          />
          {hasError && (
            <div className="flex items-center gap-1 text-red-500 text-xs mt-1">
              <AlertCircle size={12} />
              <span>{errorMessage}</span>
            </div>
          )}
        </>
      )}

      {type === "select" && (
        <>
          {label && <label className="text-sm font-medium">{label}</label>}
          <Select value={value?.toString()} onValueChange={onChange}>
            <SelectTrigger className={cn(
              inputClassName,
              "transition-colors",
              hasError && errorClasses
            )}>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value.toString()}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {hasError && (
            <div className="flex items-center gap-1 text-red-500 text-xs mt-1">
              <AlertCircle size={12} />
              <span>{errorMessage}</span>
            </div>
          )}
        </>
      )}

      {type === "text" && (
        <>
          {label && <label className="text-sm font-medium">{label}</label>}
          <Input
            value={value as string}
            onChange={(e) => onChange?.(e.target.value)}
            placeholder={placeholder}
            className={cn(
              "transition-colors",
              hasError && errorClasses
            )}
            {...props}
          />
          {hasError && (
            <div className="flex items-center gap-1 text-red-500 text-xs mt-1">
              <AlertCircle size={12} />
              <span>{errorMessage}</span>
            </div>
          )}
        </>
      )}

      {type === "textarea" && (
        <>
          {label && <label className="text-sm font-medium">{label}</label>}
          <Textarea
            value={value as string}
            onChange={(e) => onChange?.(e.target.value)}
            placeholder={placeholder}
            className={cn(
              "transition-colors",
              hasError && errorClasses
            )}
            {...props}
          />
          {hasError && (
            <div className="flex items-center gap-1 text-red-500 text-xs mt-1">
              <AlertCircle size={12} />
              <span>{errorMessage}</span>
            </div>
          )}
        </>
      )}

      {type === "number" && (
        <>
          {label && <label className="text-sm font-medium">{label}</label>}
          <Input
            type="text" // keep as text to fully control input behavior
            inputMode="numeric"
            value={value as number | string}
            onChange={(e) => {
              const inputValue = e.target.value;

              // Only allow digits
              if (inputValue === "" || /^\d+$/.test(inputValue)) {
                // If min/max length props exist, enforce them
                if (
                  (props.minLength && inputValue.length < props.minLength) ||
                  (props.maxLength && inputValue.length > props.maxLength)
                ) {
                  return; // stop updates if outside range
                }
                onChange?.(inputValue);
              }
            }}
            placeholder={placeholder}
            className={cn(
              "transition-colors",
              hasError && errorClasses
            )}
            {...props}
          />
          {/* Optional visual helper (shows length/limit if defined) */}
          {props.maxLength && (
            <span className="text-xs text-gray-400 text-right">
              {String(value || "").length}/{props.maxLength}
            </span>
          )}
          {hasError && (
            <div className="flex items-center gap-1 text-red-500 text-xs mt-1">
              <AlertCircle size={12} />
              <span>{errorMessage}</span>
            </div>
          )}
        </>
      )}

      {type === "decimal" && (
        <>
          {label && <label className="text-sm font-medium">{label}</label>}
          <Input
            type="text" // Use text type to have full control over input
            inputMode="decimal" // Show decimal keyboard on mobile
            value={value as number | string}
            onChange={handleDecimalInput}
            placeholder={placeholder}
            className={cn(
              "transition-colors",
              hasError && errorClasses
            )}
            {...props}
          />
          {hasError && (
            <div className="flex items-center gap-1 text-red-500 text-xs mt-1">
              <AlertCircle size={12} />
              <span>{errorMessage}</span>
            </div>
          )}
        </>
      )}

      {type === "date" && (
        <>
          {label && <Label className="text-sm font-medium">{label}</Label>}

          <div className="relative h-12 w-full">
            <DatePicker
              // @ts-ignore
              value={selectedDate || ""}
              onChange={handleDateChange}
              format="YYYY/MM/DD"
              calendar={persian}
              locale={persian_fa}
              render={<Input className={cn(
                "w-full h-full transition-colors",
                hasError && errorClasses
              )} />}
              containerClassName="w-full h-full"
              style={{
                position: "absolute",
                top: "0",
                right: "0",
                left: "0",
                bottom: "0",
              }}
              {...props}
            />

            {selectedDate ? (
              <X
                onClick={clearDate}
                className="absolute top-1/3 left-2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-gray-600"
                size={18}
              />
            ) : (
              <Calendar
                className="absolute top-1/3 left-2 -translate-y-1/2 text-gray-400 pointer-events-none"
                size={20}
              />
            )}
          </div>
          {hasError && (
            <div className="flex items-center gap-1 text-red-500 text-xs mt-1">
              <AlertCircle size={12} />
              <span>{errorMessage}</span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CustomInput;