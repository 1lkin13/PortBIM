import React from "react";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Select,
  SelectItem,
} from "@heroui/react";
import { designerSchema } from "../schemas/designer.schema";
import type { DesignerFormData } from "../schemas/designer.schema";
import { TimeRangeInput, ControlledInput } from "../../shared/components/ui";
import { useCreateDesigner, useUpdateDesigner } from "../hooks/designers.hooks";

interface DesignerFormProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  initialData?: DesignerFormData & { id: string };
}

export const DesignerForm: React.FC<DesignerFormProps> = ({
  isOpen,
  onOpenChange,
  initialData,
}) => {
  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<DesignerFormData>({
    resolver: zodResolver(designerSchema) as any,
    defaultValues: {
      fullName: initialData?.fullName || "",
      workingHours: initialData?.workingHours || "",
      status:
        (initialData?.status?.toLowerCase() as "active" | "inactive") ||
        "active",
      avatarUrl: initialData?.avatarUrl || undefined,
    },
  });

  React.useEffect(() => {
    if (initialData) {
      reset({
        fullName: initialData.fullName,
        workingHours: initialData.workingHours,
        status:
          (initialData.status?.toLowerCase() as "active" | "inactive") ||
          "active",
      });
    } else {
      reset({
        fullName: "",
        workingHours: "",
        status: "active",
      });
    }
  }, [initialData, reset, isOpen]);

  const { mutate: createDesigner, isPending: isCreating } = useCreateDesigner();
  const { mutate: updateDesigner, isPending: isUpdating } = useUpdateDesigner();

  const isEditing = !!initialData;
  const isLoading = isCreating || isUpdating;

  /* DEBUG: Check initial status */
  React.useEffect(() => {
    if (initialData) {
      console.log("DesignerForm initialData:", initialData);
      console.log(
        "DesignerForm normalized status:",
        (initialData.status?.toLowerCase() as "active" | "inactive") ||
          "active",
      );
    }
  }, [initialData]);

  const onSubmit = (data: DesignerFormData) => {
    if (isEditing && initialData) {
      const promise = new Promise((resolve, reject) => {
        updateDesigner(
          { id: initialData.id, data },
          {
            onSuccess: () => {
              reset();
              onOpenChange(false);
              resolve(true);
            },
            onError: (error) => reject(error),
          },
        );
      });

      toast.promise(promise, {
        loading: "Updating designer...",
        success: "Designer updated successfully",
        error: "Failed to update designer",
      });
    } else {
      const promise = new Promise((resolve, reject) => {
        createDesigner(data, {
          onSuccess: () => {
            reset();
            onOpenChange(false);
            resolve(true);
          },
          onError: (error) => reject(error),
        });
      });

      toast.promise(promise, {
        loading: "Creating designer...",
        success: "Designer created successfully",
        error: "Failed to create designer",
      });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="center"
      backdrop="blur"
      size="md"
      classNames={{
        backdrop: "bg-black/30",
        base: "border-none shadow-2xl rounded-3xl",
        header: "border-b border-gray-100 p-6",
        body: "p-6 py-8 flex flex-col gap-6",
        footer: "border-t border-gray-100 p-6",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <form onSubmit={handleSubmit(onSubmit)}>
              <ModalHeader>
                <div className="flex flex-col">
                  <span className="text-xl font-bold text-text-primary">
                    {isEditing ? "Edit Designer" : "Add New Designer"}
                  </span>
                  <p className="text-xs text-text-secondary font-normal mt-1">
                    Please fill in the information below
                  </p>
                </div>
              </ModalHeader>
              <ModalBody>
                <ControlledInput
                  name="fullName"
                  control={control}
                  autoFocus
                  label="Full Name"
                  variant="bordered"
                  placeholder="e.g. Ilkin Emiraslanov"
                  classNames={{
                    label: "font-semibold text-text-primary",
                    inputWrapper:
                      "h-12 border-gray-100 bg-white hover:border-primary transition-colors",
                  }}
                />

                <Controller
                  name="workingHours"
                  control={control}
                  render={({ field }) => (
                    <TimeRangeInput
                      {...field}
                      isInvalid={!!errors.workingHours}
                      errorMessage={errors.workingHours?.message}
                    />
                  )}
                />

                {isEditing && (
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <Select
                        label="Status"
                        variant="bordered"
                        placeholder="Select status"
                        selectedKeys={field.value ? [field.value] : []}
                        onSelectionChange={(keys) =>
                          field.onChange(Array.from(keys)[0])
                        }
                        classNames={{
                          label: "font-semibold text-text-primary",
                          trigger:
                            "h-12 border-gray-100 bg-white hover:border-primary transition-colors",
                        }}
                      >
                        <SelectItem key="active">Active</SelectItem>
                        <SelectItem key="inactive">Inactive</SelectItem>
                      </Select>
                    )}
                  />
                )}
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={onClose}
                  className="font-semibold"
                >
                  Cancel
                </Button>
                <Button
                  color="primary"
                  type="submit"
                  isLoading={isLoading}
                  className="px-8 font-bold shadow-lg shadow-primary/30"
                >
                  {isEditing ? "Update" : "Save Designer"}
                </Button>
              </ModalFooter>
            </form>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
