import React, { useState, useEffect, useRef } from "react";
import { Input } from "@heroui/react";

interface TimeRangeInputProps {
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  isInvalid?: boolean;
  errorMessage?: string;
}

export const TimeRangeInput: React.FC<TimeRangeInputProps> = ({
  value = "",
  onChange,
  label = "Working Hours",
  isInvalid,
  errorMessage,
}) => {
  const [internalValue, setInternalValue] = useState(value);
  const isDeleting = useRef(false);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const formatValue = (raw: string, deleting: boolean) => {
    if (deleting) return raw;

    const digits = raw.replace(/\D/g, "");

    let formatted = "";
    if (digits.length > 0) {
      const h1 = digits.substring(0, 2);
      formatted += h1;
      if (h1.length === 2) {
        if (parseInt(h1) > 24) formatted = "24";
        formatted += ":";
      }
    }

    if (digits.length > 2) {
      const m1 = digits.substring(2, 4);
      const minuteValue = parseInt(m1);
      const validatedM1 = m1.length === 2 && minuteValue > 59 ? "59" : m1;
      formatted += validatedM1;

      if (validatedM1.length === 2) {
        formatted += "-";
      }
    }

    if (digits.length > 4) {
      const h2 = digits.substring(4, 6);
      const validatedH2 = h2.length === 2 && parseInt(h2) > 24 ? "24" : h2;
      formatted += validatedH2;

      if (validatedH2.length === 2) {
        formatted += ":";
      }
    }

    if (digits.length > 6) {
      const m2 = digits.substring(6, 8);
      const validatedM2 = m2.length === 2 && parseInt(m2) > 59 ? "59" : m2;
      formatted += validatedM2;
    }

    return formatted;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" || e.key === "Delete") {
      isDeleting.current = true;
    } else {
      isDeleting.current = false;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const formatted = formatValue(rawValue, isDeleting.current);

    setInternalValue(formatted);
    if (onChange) {
      onChange(formatted);
    }
  };

  return (
    <Input
      value={internalValue}
      onKeyDown={handleKeyDown}
      onChange={handleChange}
      label={label}
      variant="bordered"
      isInvalid={isInvalid}
      errorMessage={errorMessage}
      autoComplete="off"
    />
  );
};
