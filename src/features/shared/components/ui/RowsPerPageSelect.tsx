import React from "react";
import { Select, SelectItem } from "@heroui/react";

interface RowsPerPageSelectProps {
  value: number;
  onChange: (value: number) => void;
  options?: number[];
  className?: string;
  ariaLabel?: string;
}

const DEFAULT_OPTIONS = [3, 5, 10];

export const RowsPerPageSelect: React.FC<RowsPerPageSelectProps> = ({
  value,
  onChange,
  options = DEFAULT_OPTIONS,
  className = "w-20",
  ariaLabel = "Rows per page",
}) => {
  return (
    <div className="flex items-center gap-1 shrink-0">
      <Select
        size="sm"
        onSelectionChange={(keys) => {
          const selected = Number(Array.from(keys)[0]);
          if (!Number.isNaN(selected)) onChange(selected);
        }}
        selectedKeys={new Set([String(value)])}
        className={className}
        aria-label={ariaLabel}
        variant="bordered"
        disallowEmptySelection
        classNames={{
          trigger: "min-h-9 h-9 rounded-xl border-gray-100 bg-white shadow-sm",
          value: "text-xs font-bold text-text-primary",
        }}
      >
        {options.map((n) => (
          <SelectItem key={String(n)} textValue={String(n)}>
            {n}
          </SelectItem>
        ))}
      </Select>
    </div>
  );
};
