import React from "react";
import { Input, Button, Chip } from "@heroui/react";
import { Search, Plus } from "lucide-react";
import { RowsPerPageSelect } from "../../shared/components/ui";

interface DesignersControlsProps {
  filterValue: string;
  onFilterChange: (value: string) => void;
  rowsPerPage: number;
  onRowsPerPageChange: (value: number) => void;
  totalDesigners: number;
  onAddClick: () => void;
}

export const DesignersControls: React.FC<DesignersControlsProps> = ({
  filterValue,
  onFilterChange,
  rowsPerPage,
  onRowsPerPageChange,
  totalDesigners,
  onAddClick,
}) => {
  return (
    <div className="p-4 border-b border-gray-100 bg-gray-50/10">
      {/* Desktop Controls: All in one row */}
      <div className="hidden sm:flex justify-between items-center gap-4">
        <div className="flex-1 max-w-[400px]">
          <Input
            isClearable
            classNames={{
              inputWrapper:
                "border-1 bg-white h-11 rounded-xl shadow-sm border-gray-100 focus-within:border-primary transition-colors",
            }}
            labelPlacement="outside"
            placeholder="Search designers..."
            size="md"
            startContent={
              <Search className="text-text-secondary/40" size={18} />
            }
            value={filterValue}
            onClear={() => onFilterChange("")}
            onValueChange={onFilterChange}
            variant="bordered"
          />
        </div>
        <div className="flex items-center gap-3">
          <RowsPerPageSelect
            value={rowsPerPage}
            onChange={onRowsPerPageChange}
          />
          <Chip
            size="lg"
            variant="flat"
            color="primary"
            className="h-11 px-4 rounded-xl border border-primary/10 bg-primary/5 text-primary font-bold text-xs"
          >
            {totalDesigners} designers
          </Chip>
        </div>
      </div>

      {/* Mobile Controls: Inspiration Layout */}
      <div className="flex sm:hidden flex-col gap-4">
        <Input
          isClearable
          classNames={{
            inputWrapper:
              "border-1 bg-white h-11 rounded-xl shadow-sm border-gray-100",
          }}
          labelPlacement="outside"
          placeholder="Search..."
          size="md"
          startContent={<Search size={18} className="text-text-secondary/40" />}
          value={filterValue}
          onValueChange={onFilterChange}
          variant="bordered"
        />
        <div className="flex items-center gap-3">
          <Button
            isIconOnly
            color="primary"
            onPress={onAddClick}
            className="w-12 h-11 rounded-xl shadow-lg shadow-primary/30 shrink-0"
          >
            <Plus size={24} strokeWidth={3} />
          </Button>
          <div className="flex-1">
            <RowsPerPageSelect
              value={rowsPerPage}
              onChange={onRowsPerPageChange}
            />
          </div>
          <Chip
            size="lg"
            variant="flat"
            color="primary"
            className="h-11 px-4 rounded-xl font-bold text-xs shrink-0"
          >
            {totalDesigners} designers
          </Chip>
        </div>
      </div>
    </div>
  );
};
