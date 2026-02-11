import { Button } from "@heroui/react";
import { Trash2, Layers } from "lucide-react";
import { Object3D } from "../../../core/domain/models/Object3D";
import { cn } from "@heroui/react";

interface ObjectsListProps {
  objects: Object3D[];
  selectedObjectId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

export const ObjectsList: React.FC<ObjectsListProps> = ({
  objects,
  selectedObjectId,
  onSelect,
  onDelete,
}) => {
  return (
    <div className="h-full flex flex-col bg-white overflow-hidden w-full">
      <div className="p-4 border-b border-gray-100 bg-gray-50/50 sticky top-0 z-10">
        <h2 className="text-sm font-semibold text-gray-700">Objects</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {objects.length === 0 ? (
          <div className="h-48 flex flex-col items-center justify-center text-gray-400 text-center gap-3">
            <Layers size={32} className="opacity-20" />
            <p className="text-sm text-gray-500">No objects</p>
          </div>
        ) : (
          <div className="grid gap-2">
            {objects.map((obj) => (
              <div
                key={obj.id}
                className={cn(
                  "group relative p-3 rounded-lg border transition-all cursor-pointer flex items-center justify-between",
                  selectedObjectId === obj.id
                    ? "bg-primary/5 border-primary"
                    : "bg-white border-gray-100 hover:border-gray-200 hover:bg-gray-50/50",
                )}
                onClick={() => onSelect(obj.id)}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded shadow-sm border border-black/5"
                    style={{ backgroundColor: obj.color }}
                  />
                  <span
                    className={cn(
                      "text-sm font-medium truncate max-w-[160px]",
                      selectedObjectId === obj.id
                        ? "text-primary"
                        : "text-gray-700 group-hover:text-gray-900",
                    )}
                  >
                    {obj.name}
                  </span>
                </div>

                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  className="w-7 h-7 min-w-0 text-gray-400 hover:text-danger md:opacity-0 md:group-hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(obj.id);
                  }}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
