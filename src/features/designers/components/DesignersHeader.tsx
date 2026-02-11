import React from "react";
import { Button } from "@heroui/react";
import { Plus } from "lucide-react";

interface DesignersHeaderProps {
  onAddClick: () => void;
}

export const DesignersHeader: React.FC<DesignersHeaderProps> = ({
  onAddClick,
}) => {
  return (
    <div className="flex justify-between items-center gap-4 px-2">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-text-primary tracking-tight">
          Designers
        </h1>
        <p className="text-text-secondary text-xs sm:text-sm font-medium">
          Manage your design team and their tasks
        </p>
      </div>
      <Button
        color="primary"
        onPress={onAddClick}
        className="hidden sm:flex shadow-lg shadow-primary/20 font-semibold h-11 px-4 rounded-xl transition-transform hover:scale-[1.02] active:scale-[0.98]"
      >
        <Plus size={18} className="mr-2" />
        Add New Designer
      </Button>
    </div>
  );
};
