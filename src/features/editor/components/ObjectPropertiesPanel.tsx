import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Button,
  Input,
  Autocomplete,
  AutocompleteItem,
  RadioGroup,
  Radio,
  cn,
} from "@heroui/react";
import {
  Trash2,
  X,
  Box,
  Settings2,
  Plus,
  Circle,
  Hexagon,
  Octagon,
  Heart,
} from "lucide-react";
import {
  Object3D,
  ObjectSize,
  ObjectShape,
} from "../../../core/domain/models/Object3D";
import { useDesigners } from "../../designers/hooks/designers.hooks";
import { useEditorStore } from "../../editor/store/editorStore";

const objectSchema = z.object({
  name: z.string().min(1, "Name is required"),
  attachedDesignerId: z.string().min(1, "Designer selection is required"),
  color: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid color hex"),
  size: z.enum([ObjectSize.SMALL, ObjectSize.NORMAL, ObjectSize.LARGE]),
  shape: z.enum([
    ObjectShape.BOX,
    ObjectShape.SPHERE,
    ObjectShape.CYLINDER,
    ObjectShape.TORUS,
    ObjectShape.HEART,
  ]),
});

type ObjectFormData = z.infer<typeof objectSchema>;

interface ObjectPropertiesPanelProps {
  selectedObject: Object3D | null;
  onClose?: () => void;
  onUpdate: (data: ObjectFormData) => void;
  onDelete: (id: string) => void;
}

export const ObjectPropertiesPanel: React.FC<ObjectPropertiesPanelProps> = ({
  selectedObject,
  onClose,
  onUpdate,
  onDelete,
}) => {
  const { data: designers } = useDesigners();
  const { transformMode, setTransformMode } = useEditorStore();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { isDirty },
  } = useForm<ObjectFormData>({
    resolver: zodResolver(objectSchema),
    defaultValues: {
      name: "",
      color: "#6366F1",
      size: ObjectSize.NORMAL,
      shape: ObjectShape.BOX,
      attachedDesignerId: "",
    },
  });

  // Real-time Watch for Auto-Saving
  const watchedValues = watch();

  useEffect(() => {
    if (isDirty && selectedObject) {
      const timer = setTimeout(() => {
        handleSubmit((data) => {
          // Validate required fields before submitting
          if (!data.name || data.name.trim() === "") {
            setValue("name", selectedObject.name);
            return;
          }
          if (
            !data.attachedDesignerId ||
            data.attachedDesignerId.trim() === ""
          ) {
            setValue("attachedDesignerId", selectedObject.attachedDesignerId);
            return;
          }
          onUpdate(data);
        })();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [
    watchedValues,
    isDirty,
    selectedObject,
    handleSubmit,
    onUpdate,
    setValue,
  ]);

  const selectedColor = watchedValues.color;
  const selectedShape = watchedValues.shape;

  const shapes = [
    { id: ObjectShape.BOX, icon: Box, label: "Cube" },
    { id: ObjectShape.SPHERE, icon: Circle, label: "Sphere" },
    { id: ObjectShape.CYLINDER, icon: Hexagon, label: "Cylinder" },
    { id: ObjectShape.TORUS, icon: Octagon, label: "Torus" },
    { id: ObjectShape.HEART, icon: Heart, label: "Heart" },
  ];

  const colorPresets = [
    "#6366F1",
    "#11d3c6ff",
    "#0398f5ff",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
    "#EC4899",
    "#111827",
  ];

  useEffect(() => {
    if (selectedObject) {
      reset({
        name: selectedObject.name,
        color: selectedObject.color,
        size: selectedObject.size,
        shape: selectedObject.shape || ObjectShape.BOX,
        attachedDesignerId: selectedObject.attachedDesignerId,
      });
    }
  }, [selectedObject, reset]);

  if (!selectedObject) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-400 text-center p-8 bg-white w-full border-l border-gray-100">
        <Settings2 size={40} className="text-gray-200 mb-4" />
        <p className="text-sm text-gray-500">No object selected</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white w-80 shrink-0 overflow-hidden shadow-sm">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 sticky top-0 z-10">
        <h2 className="text-sm font-semibold text-gray-700">Properties</h2>
        <div className="flex items-center gap-2">
          <Button
            isIconOnly
            size="sm"
            variant="light"
            onClick={onClose}
            className="w-7 h-7 min-w-0 text-gray-400 hover:text-gray-900 hover:bg-gray-100"
          >
            <X size={14} />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 custom-scrollbar space-y-8">
        {/* Identity Section */}
        <section className="space-y-4">
          <Input
            label="Name"
            variant="bordered"
            isRequired
            {...register("name")}
            classNames={{
              label: "text-xs font-medium text-gray-700",
              input: "text-sm text-gray-900",
              inputWrapper:
                "border-gray-200 hover:border-primary transition-all rounded-lg",
            }}
          />

          <Autocomplete
            label="Designer"
            variant="bordered"
            isRequired
            selectedKey={watch("attachedDesignerId")}
            onSelectionChange={(key) =>
              setValue("attachedDesignerId", key as string, {
                shouldDirty: true,
              })
            }
            defaultItems={designers ?? []}
            inputProps={{
              classNames: {
                inputWrapper:
                  "border-gray-200 hover:border-primary transition-all rounded-lg",
                input: "text-sm text-gray-900",
                label: "text-xs font-medium text-gray-700",
              },
            }}
          >
            {(designer) => (
              <AutocompleteItem key={designer.id} textValue={designer.fullName}>
                <span className="text-sm font-medium">{designer.fullName}</span>
              </AutocompleteItem>
            )}
          </Autocomplete>
        </section>

        {/* Geometry Section */}
        <section className="space-y-4">
          <label className="text-xs font-medium text-gray-700">Shape</label>

          <div className="grid grid-cols-5 gap-2">
            {shapes.map((s) => (
              <button
                key={s.id}
                type="button"
                className={cn(
                  "aspect-square rounded-lg border flex flex-col items-center justify-center gap-1 transition-all",
                  selectedShape === s.id
                    ? "bg-primary/5 border-primary text-primary"
                    : "bg-gray-50 border-gray-200 text-gray-400 hover:bg-gray-100",
                )}
                onClick={() => setValue("shape", s.id, { shouldDirty: true })}
                title={s.label}
              >
                <s.icon size={16} strokeWidth={2} />
              </button>
            ))}
          </div>
        </section>

        {/* Appearance Section */}
        <section className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-3">
              Color
            </label>
            <div className="grid grid-cols-4 gap-3 mb-4">
              {colorPresets.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={cn(
                    "aspect-square rounded-lg border-2 transition-all hover:scale-105 active:scale-95",
                    selectedColor === c
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-transparent",
                  )}
                  style={{ backgroundColor: c }}
                  onClick={() => setValue("color", c, { shouldDirty: true })}
                />
              ))}
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-gray-50 border border-gray-200">
              <div className="relative w-6 h-6 shrink-0">
                <input
                  type="color"
                  className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                  {...register("color")}
                />
                <div
                  className="w-full h-full rounded border border-gray-300"
                  style={{ backgroundColor: selectedColor }}
                />
              </div>
              <span className="text-xs font-mono text-gray-600 flex-1">
                {selectedColor}
              </span>
            </div>
          </div>

          <RadioGroup
            label="Size"
            orientation="horizontal"
            classNames={{
              label: "text-xs font-medium text-gray-700 mb-3",
              wrapper: "gap-2",
            }}
            value={watch("size")}
            onValueChange={(val) =>
              setValue("size", val as any, { shouldDirty: true })
            }
          >
            {[ObjectSize.SMALL, ObjectSize.NORMAL, ObjectSize.LARGE].map(
              (size) => (
                <Radio
                  key={size}
                  value={size}
                  classNames={{
                    base: cn(
                      "inline-flex m-0 bg-gray-50 hover:bg-gray-100 items-center justify-between",
                      "flex-row-reverse max-w-[300px] cursor-pointer rounded-lg gap-2 p-2.5 border border-transparent transition-all",
                      "data-[selected=true]:border-primary data-[selected=true]:bg-primary/5",
                    ),
                    label:
                      "text-xs font-medium text-gray-600 data-[selected=true]:text-primary",
                  }}
                >
                  {size}
                </Radio>
              ),
            )}
          </RadioGroup>
        </section>

        {/* Transform Tools Section */}
        <section className="space-y-4">
          <label className="text-xs font-medium text-gray-700">
            Transform Mode
          </label>

          <div className="flex gap-2">
            {[
              { id: "translate", label: "Move", icon: Plus },
              { id: "rotate", label: "Rotate", icon: Settings2 },
              { id: "scale", label: "Scale", icon: Box },
              { id: "none", label: "None", icon: X },
            ].map((tool) => (
              <button
                key={tool.id}
                type="button"
                title={tool.label}
                onClick={() => setTransformMode(tool.id as any)}
                className={cn(
                  "flex-1 py-2.5 px-1 rounded-lg border flex flex-col items-center gap-1.5 transition-all",
                  transformMode === tool.id
                    ? "bg-primary border-primary text-white"
                    : "bg-gray-50 border-gray-200 text-gray-400 hover:bg-gray-100",
                )}
              >
                <tool.icon size={16} />
                <span className="text-[10px] font-medium">{tool.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Spatial Transform Info (Read Only) */}
        <section className="space-y-4">
          <label className="text-xs font-medium text-gray-700">Position</label>
          <div className="grid grid-cols-1 gap-2.5">
            {["x", "y", "z"].map((axis) => (
              <div
                key={axis}
                className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div
                  className={cn(
                    "w-5 h-5 rounded text-[10px] font-semibold flex items-center justify-center",
                    axis === "x"
                      ? "bg-red-100 text-red-600"
                      : axis === "y"
                        ? "bg-green-100 text-green-600"
                        : "bg-blue-100 text-blue-600",
                  )}
                >
                  {axis.toUpperCase()}
                </div>
                <span className="text-xs text-gray-600 flex-1">
                  {axis.toUpperCase()}
                </span>
                <span className="text-sm text-gray-900 font-mono">
                  {(
                    selectedObject.position[axis as "x" | "y" | "z"] as number
                  ).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="pt-4">
          <Button
            fullWidth
            variant="flat"
            color="danger"
            className="rounded-lg h-10 font-medium bg-danger/5"
            startContent={<Trash2 size={16} />}
            onClick={() => onDelete(selectedObject.id)}
          >
            Delete Object
          </Button>
        </section>
      </div>
    </div>
  );
};
