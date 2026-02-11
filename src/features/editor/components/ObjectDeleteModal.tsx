import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";

interface ObjectDeleteModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  objectName: string | null;
  onConfirm: () => void;
  isLoading: boolean;
}

export const ObjectDeleteModal: React.FC<ObjectDeleteModalProps> = ({
  isOpen,
  onOpenChange,
  objectName,
  onConfirm,
  isLoading,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="sm"
      backdrop="blur"
      classNames={{
        backdrop: "bg-black/30",
        base: "border-none shadow-2xl rounded-2xl",
        header: "border-b border-gray-100 p-6",
        body: "p-6 py-8 flex flex-col gap-6",
        footer: "border-t border-gray-100 p-6",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <span className="text-lg font-bold text-gray-900">
                Delete Object
              </span>
            </ModalHeader>
            <ModalBody>
              <p className="text-sm text-gray-500">
                Are you sure you want to delete{" "}
                <span className="font-bold text-gray-900">{objectName}</span>?
                This action cannot be undone.
              </p>
            </ModalBody>
            <ModalFooter>
              <Button
                variant="light"
                onPress={onClose}
                className="font-semibold"
              >
                Cancel
              </Button>
              <Button
                color="danger"
                onPress={onConfirm}
                isLoading={isLoading}
                className="font-bold shadow-lg shadow-danger/20"
              >
                Delete
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
