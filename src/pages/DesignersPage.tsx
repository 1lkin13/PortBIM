import React from "react";
import { toast } from "sonner";
import { useDisclosure, Pagination } from "@heroui/react";
import {
  useDesigners,
  useDeleteDesigner,
} from "../features/designers/hooks/designers.hooks";
import { DesignerForm } from "../features/designers/components/DesignerForm";
import { Designer } from "../core/domain/models/Designer";
import { DesignersHeader } from "../features/designers/components/DesignersHeader";
import { DesignersControls } from "../features/designers/components/DesignersControls";
import { DesignersTable } from "../features/designers/components/DesignersTable";
import { DesignersDeleteModal } from "../features/designers/components/DesignersDeleteModal";

const DesignersPage: React.FC = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onOpenChange: onDeleteOpenChange,
  } = useDisclosure();

  const { data: designers, isLoading } = useDesigners();
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedDesigner, setSelectedDesigner] =
    React.useState<Designer | null>(null);
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const filteredDesigners = React.useMemo(() => {
    let filtered = designers ?? [];
    if (filterValue) {
      filtered = filtered.filter((d: Designer) =>
        d.fullName.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }
    return filtered;
  }, [designers, filterValue]);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredDesigners.slice(start, end);
  }, [page, filteredDesigners, rowsPerPage]);

  const handleEdit = (designer: Designer) => {
    setSelectedDesigner(designer);
    onOpen();
  };

  const handleDeleteClick = (designer: Designer) => {
    setSelectedDesigner(designer);
    onDeleteOpen();
  };

  const { mutate: deleteDesigner, isPending: isDeleting } = useDeleteDesigner();

  const confirmDelete = () => {
    if (selectedDesigner) {
      const promise = new Promise((resolve, reject) => {
        deleteDesigner(selectedDesigner.id, {
          onSuccess: () => {
            onDeleteOpenChange();
            resolve(true);
          },
          onError: (error) => reject(error),
        });
      });

      toast.promise(promise, {
        loading: "Deleting designer...",
        success: "Designer deleted successfully",
        error: "Failed to delete designer",
      });
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full space-y-6 animate-in fade-in duration-500">
      <DesignersHeader
        onAddClick={() => {
          setSelectedDesigner(null);
          onOpen();
        }}
      />

      <div className="w-full max-w-full border-none shadow-sm bg-background-paper rounded-2xl border border-gray-100 overflow-hidden">
        <div className="p-0 w-full max-w-full overflow-hidden">
          <DesignersControls
            filterValue={filterValue}
            onFilterChange={(val) => {
              setFilterValue(val);
              setPage(1);
            }}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(val) => {
              setRowsPerPage(val);
              setPage(1);
            }}
            totalDesigners={filteredDesigners.length}
            onAddClick={() => {
              setSelectedDesigner(null);
              onOpen();
            }}
          />

          {/* Wrapper to force width constraint on the table */}
          <div className="w-full max-w-full overflow-hidden">
            <DesignersTable
              designers={items}
              isLoading={isLoading}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
            />
          </div>

          <div className="px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50/20">
            <div className="flex items-center gap-2">
              <span className="text-text-secondary text-xs font-semibold">
                Viewing {(page - 1) * rowsPerPage + 1}-
                {Math.min(page * rowsPerPage, filteredDesigners.length)} of{" "}
                {filteredDesigners.length}
              </span>
            </div>
            <Pagination
              isCompact
              showControls
              page={page}
              total={Math.ceil(filteredDesigners.length / rowsPerPage) || 1}
              onChange={setPage}
              size="sm"
              classNames={{
                wrapper: "gap-2",
                item: "text-text-secondary bg-transparent hover:bg-gray-100 font-medium",
                cursor: "bg-primary text-white font-bold",
                prev: "text-primary bg-primary/10 hover:bg-primary/20",
                next: "text-primary bg-primary/10 hover:bg-primary/20",
              }}
            />
          </div>
        </div>
      </div>

      <DesignerForm
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        initialData={
          selectedDesigner
            ? {
                fullName: selectedDesigner.fullName,
                workingHours: selectedDesigner.workingHours,
                status: selectedDesigner.status,
                avatarUrl: selectedDesigner.avatarUrl,
                id: selectedDesigner.id,
              }
            : undefined
        }
      />

      <DesignersDeleteModal
        isOpen={isDeleteOpen}
        onOpenChange={onDeleteOpenChange}
        designer={selectedDesigner}
        onConfirm={confirmDelete}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default DesignersPage;
