import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Autocomplete,
  AutocompleteItem,
  Select,
  SelectItem,
  cn,
} from "@heroui/react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Box, Circle, Hexagon, Octagon, Heart } from "lucide-react";
import { ObjectSize, ObjectShape } from "../../../core/domain/models/Object3D";
import { useDesigners } from "../../designers/hooks/designers.hooks";
import { Position } from "../../../core/domain/valueObjects/Position";
import { ControlledInput } from "../../shared/components/ui";

const objectCreateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  attachedDesignerId: z.string().min(1, "Designer selection is required"),
  color: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid color hex"),
  size: z.nativeEnum(ObjectSize),
  shape: z.nativeEnum(ObjectShape),
});

type ObjectCreateData = z.infer<typeof objectCreateSchema>;

interface ObjectCreateModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSubmit: (data: ObjectCreateData) => void;
  initialPosition?: Position;
}

export const ObjectCreateModal: React.FC<ObjectCreateModalProps> = ({
  isOpen,
  onOpenChange,
  onSubmit,
}) => {
  const { data: designers } = useDesigners();
  const activeDesigners = React.useMemo(
    () => designers?.filter((d) => d.status === "active") || [],
    [designers],
  );

  const shapes = [
    { id: ObjectShape.BOX, icon: Box, label: "Box" },
    { id: ObjectShape.SPHERE, icon: Circle, label: "Sphere" },
    { id: ObjectShape.CYLINDER, icon: Hexagon, label: "Cylinder" },
    { id: ObjectShape.TORUS, icon: Octagon, label: "Torus" },
    { id: ObjectShape.HEART, icon: Heart, label: "Heart" },
  ];

  const colorPresets = [
    "#6366F1", // Indigo
    "#10B981", // Emerald
    "#F59E0B", // Amber
    "#EF4444", // Red
    "#8B5CF6", // Violet
    "#EC4899", // Pink
    "#0EA5E9", // Sky
    "#111827", // Gray 900
  ];

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ObjectCreateData>({
    resolver: zodResolver(objectCreateSchema),
    defaultValues: {
      name: "",
      color: "#6366F1",
      size: ObjectSize.NORMAL,
      shape: ObjectShape.BOX,
      attachedDesignerId: "",
    },
  });

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="md"
      classNames={{
        backdrop: "bg-black/30",
        base: "border-none shadow-2xl rounded-2xl",
        header: "border-b border-gray-100 p-6",
        body: "p-6 py-8 flex flex-col gap-6",
        footer: "border-t border-gray-100 p-6",
      }}
      backdrop="blur"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <form
              onSubmit={handleSubmit((data) => {
                onSubmit(data);
                onClose(); // Use the onClose provided by ModalContent
                reset();
              })}
            >
              <ModalHeader className="flex flex-col gap-1">
                <span className="text-xl font-bold text-gray-900">
                  Add New Object
                </span>
                <p className="text-xs text-gray-500 font-normal">
                  Configure the new 3D object properties
                </p>
              </ModalHeader>
              <ModalBody className="gap-6">
                <ControlledInput
                  name="name"
                  control={control}
                  autoFocus
                  label="Name"
                  variant="bordered"
                  classNames={{
                    label: "font-semibold text-gray-700",
                    inputWrapper:
                      "h-12 border-gray-200 hover:border-primary transition-colors bg-white",
                  }}
                />

                <Controller
                  name="attachedDesignerId"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      label="Designer"
                      variant="bordered"
                      selectedKey={field.value}
                      onSelectionChange={(key) => field.onChange(key as string)}
                      isInvalid={!!errors.attachedDesignerId}
                      errorMessage={errors.attachedDesignerId?.message}
                      classNames={{
                        base: "max-w-full",
                        listboxWrapper: "max-h-[320px]",
                        selectorButton: "text-gray-500",
                      }}
                      inputProps={{
                        classNames: {
                          input: "text-small",
                          inputWrapper:
                            "h-12 border-gray-200 hover:border-primary transition-colors bg-white",
                          label: "font-semibold text-gray-700",
                        },
                      }}
                    >
                      {activeDesigners.map((designer) => (
                        <AutocompleteItem
                          key={designer.id}
                          textValue={designer.fullName}
                        >
                          <div className="flex justify-between items-center">
                            <span>{designer.fullName}</span>
                            <span className="text-tiny text-gray-400">
                              {designer.workingHours}
                            </span>
                          </div>
                        </AutocompleteItem>
                      ))}
                    </Autocomplete>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <Controller
                    name="shape"
                    control={control}
                    render={({ field }) => (
                      <Select
                        label="Shape"
                        placeholder="Select shape"
                        variant="bordered"
                        selectedKeys={new Set([field.value])}
                        onSelectionChange={(keys) =>
                          field.onChange(Array.from(keys)[0])
                        }
                        classNames={{
                          label: "font-semibold text-gray-700",
                          trigger:
                            "h-12 border-gray-200 hover:border-primary transition-colors bg-white",
                        }}
                        renderValue={(items) => {
                          return items.map((item) => (
                            <div
                              key={item.key}
                              className="flex items-center gap-2"
                            >
                              {shapes.find((s) => s.id === item.key)?.icon &&
                                React.createElement(
                                  shapes.find((s) => s.id === item.key)!.icon,
                                  { size: 16 },
                                )}
                              <span>{item.textValue}</span>
                            </div>
                          ));
                        }}
                      >
                        {shapes.map((shape) => (
                          <SelectItem
                            key={shape.id}
                            textValue={shape.label}
                            startContent={<shape.icon size={16} />}
                          >
                            {shape.label}
                          </SelectItem>
                        ))}
                      </Select>
                    )}
                  />

                  <Controller
                    name="size"
                    control={control}
                    render={({ field }) => (
                      <Select
                        label="Size"
                        placeholder="Select size"
                        variant="bordered"
                        selectedKeys={new Set([field.value])}
                        onSelectionChange={(keys) =>
                          field.onChange(Array.from(keys)[0])
                        }
                        classNames={{
                          label: "font-semibold text-gray-700",
                          trigger:
                            "h-12 border-gray-200 hover:border-primary transition-colors bg-white",
                        }}
                      >
                        {Object.values(ObjectSize).map((size) => (
                          <SelectItem key={size} textValue={size}>
                            {size.charAt(0).toUpperCase() + size.slice(1)}
                          </SelectItem>
                        ))}
                      </Select>
                    )}
                  />
                </div>

                <Controller
                  name="color"
                  control={control}
                  render={({ field }) => (
                    <div className="flex flex-col gap-2">
                      <span className="text-small font-semibold text-gray-700">
                        Color
                      </span>
                      <div className="flex flex-wrap gap-3">
                        {colorPresets.map((c) => (
                          <button
                            key={c}
                            type="button"
                            className={cn(
                              "w-8 h-8 rounded-full border-2 transition-all hover:scale-110 focus:scale-110",
                              field.value === c
                                ? "border-primary ring-2 ring-primary/20 scale-110"
                                : "border-transparent",
                            )}
                            style={{ backgroundColor: c }}
                            onClick={() => field.onChange(c)}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  variant="light"
                  onPress={onClose}
                  className="font-semibold text-gray-500"
                >
                  Cancel
                </Button>
                <Button
                  color="primary"
                  type="submit"
                  isLoading={isSubmitting}
                  className="px-8 font-bold shadow-lg shadow-primary/30"
                >
                  Create Object
                </Button>
              </ModalFooter>
            </form>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
