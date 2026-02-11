import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import { Designer } from "../../../core/domain/models/Designer";

interface DesignersDeleteModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  designer: Designer | null;
  onConfirm: () => void;
  isLoading: boolean;
}

export const DesignersDeleteModal: React.FC<DesignersDeleteModalProps> = ({
  isOpen,
  onOpenChange,
  designer,
  onConfirm,
  isLoading,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="sm"
      backdrop="blur"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Confirm Delete
            </ModalHeader>
            <ModalBody>
              <p className="text-sm text-text-secondary">
                Are you sure you want to delete{" "}
                <span className="font-bold text-text-primary">
                  {designer?.fullName}
                </span>
                ? This action cannot be undone.
              </p>
            </ModalBody>
            <ModalFooter>
              <Button
                variant="light"
                onPress={onClose}
                size="sm"
                className="font-semibold"
              >
                Cancel
              </Button>
              <Button
                color="danger"
                onPress={onConfirm}
                size="sm"
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
