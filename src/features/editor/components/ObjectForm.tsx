import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Autocomplete,
  AutocompleteItem,
  RadioGroup,
  Radio,
  cn,
} from "@heroui/react";
import { ObjectSize } from "../../../core/domain/models/Object3D";
import { useDesigners } from "../../designers/hooks/designers.hooks";

const objectSchema = z.object({
  name: z.string().min(1, "Name is required"),
  attachedDesignerId: z.string().min(1, "Designer selection is required"),
  color: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid color hex"),
  size: z.enum([ObjectSize.SMALL, ObjectSize.NORMAL, ObjectSize.LARGE]),
});

type ObjectFormData = z.infer<typeof objectSchema>;

interface ObjectFormProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSubmit: (data: ObjectFormData) => void;
  initialData?: Partial<ObjectFormData>;
  title: string;
}

export const ObjectForm: React.FC<ObjectFormProps> = ({
  isOpen,
  onOpenChange,
  onSubmit,
  initialData,
  title,
}) => {
  const { data: designers } = useDesigners();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ObjectFormData>({
    resolver: zodResolver(objectSchema),
    defaultValues: {
      name: "New Object",
      color: "#6366F1", // Default Object Color from palette
      size: ObjectSize.NORMAL,
      ...initialData,
    },
  });

  // Watch color to update custom radio selection visually if needed
  const selectedColor = watch("color");

  // Preset colors from palette + some extras
  const colorPresets = [
    "#111827", // Text Primary / Dark
    "#FFFFFF", // White
    "#6366F1", // Primary
    "#10B981", // Success
    "#F59E0B", // Warning
    "#EF4444", // Error
  ];

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const handleFormSubmit = (data: ObjectFormData) => {
    onSubmit(data);
    onOpenChange(false);
    reset();
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="center"
      backdrop="blur"
    >
      <ModalContent className="bg-background-paper p-2">
        {(onClose) => (
          <>
            <form onSubmit={handleSubmit(handleFormSubmit)}>
              <ModalHeader className="flex flex-col gap-1 text-text-primary">
                {title}
              </ModalHeader>
              <ModalBody className="gap-6">
                <Input
                  label="Object Name"
                  placeholder="e.g. Modern Chair v2"
                  variant="bordered"
                  labelPlacement="outside"
                  {...register("name")}
                  isInvalid={!!errors.name}
                  errorMessage={errors.name?.message}
                  classNames={{
                    label: "text-text-secondary font-medium",
                    inputWrapper:
                      "bg-gray-50 border-border hover:border-primary/50",
                  }}
                />

                <Autocomplete
                  label="Designer"
                  placeholder="Select a designer..."
                  variant="bordered"
                  labelPlacement="outside"
                  selectedKey={watch("attachedDesignerId")}
                  onSelectionChange={(key) =>
                    setValue("attachedDesignerId", key as string)
                  }
                  isInvalid={!!errors.attachedDesignerId}
                  errorMessage={errors.attachedDesignerId?.message}
                  defaultItems={designers ?? []}
                  classNames={{
                    selectorButton: "text-text-secondary",
                  }}
                  inputProps={{
                    classNames: {
                      inputWrapper:
                        "bg-gray-50 border-border hover:border-primary/50 data-[hover=true]:border-primary/50 group-data-[focus=true]:border-primary",
                      label: "text-text-secondary font-medium",
                    },
                  }}
                >
                  {(designer) => (
                    <AutocompleteItem
                      key={designer.id}
                      textValue={designer.fullName}
                    >
                      <div className="flex flex-col">
                        <span className="text-small">{designer.fullName}</span>
                        <span className="text-tiny text-text-secondary">
                          {designer.workingHours}
                        </span>
                      </div>
                    </AutocompleteItem>
                  )}
                </Autocomplete>

                <div>
                  <label className="block text-small font-medium text-text-secondary mb-2">
                    Color
                  </label>
                  <div className="flex gap-3 items-center flex-wrap">
                    {colorPresets.map((c) => (
                      <button
                        key={c}
                        type="button"
                        className={cn(
                          "w-8 h-8 rounded-full border-2 transition-transform hover:scale-110",
                          selectedColor === c
                            ? "border-primary ring-2 ring-primary/20"
                            : "border-transparent",
                        )}
                        style={{ backgroundColor: c }}
                        onClick={() => setValue("color", c)}
                      />
                    ))}
                    <div className="relative ml-2">
                      <input
                        type="color"
                        className="w-8 h-8 p-0 border-0 rounded-full overflow-hidden cursor-pointer"
                        {...register("color")}
                      />
                    </div>
                    <span className="text-xs text-text-secondary ml-auto">
                      {selectedColor}
                    </span>
                  </div>
                  {errors.color && (
                    <p className="text-tiny text-error mt-1">
                      {errors.color.message}
                    </p>
                  )}
                </div>

                <RadioGroup
                  label="Size"
                  orientation="horizontal"
                  classNames={{
                    label: "text-small font-medium text-text-secondary",
                  }}
                  value={watch("size")}
                  onValueChange={(val) => setValue("size", val as any)}
                >
                  <Radio value={ObjectSize.SMALL}>Small</Radio>
                  <Radio value={ObjectSize.NORMAL}>Normal</Radio>
                  <Radio value={ObjectSize.LARGE}>Large</Radio>
                </RadioGroup>
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="flat" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  type="submit"
                  className="shadow-lg shadow-primary/20"
                >
                  {initialData ? "Save Changes" : "Add Object"}
                </Button>
              </ModalFooter>
            </form>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
