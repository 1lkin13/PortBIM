import React from "react";
import { Scene3D } from "../features/editor/components/Scene3D/Scene3D";
import { useEditorStore } from "../features/editor/store/editorStore";
import {
  useObjects,
  useCreateObject,
  useUpdateObject,
  useDeleteObject,
} from "../features/editor/hooks/objects.hooks";
import { ObjectsList } from "../features/editor/components/ObjectsList";
import { Position } from "../core/domain/valueObjects/Position";
import { Object3D } from "../core/domain/models/Object3D";
import { ObjectPropertiesPanel } from "../features/editor/components/ObjectPropertiesPanel";
import { ObjectCreateModal } from "../features/editor/components/ObjectCreateModal";
import { ObjectDeleteModal } from "../features/editor/components/ObjectDeleteModal";
import { Layers, Settings2, Plus } from "lucide-react";
import { cn, useDisclosure, Button } from "@heroui/react";
import { toast } from "sonner";

const EditorPage: React.FC = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [spawnPosition, setSpawnPosition] = React.useState<Position>(
    new Position(0, 0.5, 0),
  );
  const {
    selectedObjectId,
    setSelectedObjectId,
    isOutlinerOpen,
    setOutlinerOpen,
    isInspectorOpen,
    setInspectorOpen,
  } = useEditorStore();

  const { data: objects } = useObjects();
  const { mutate: createObject } = useCreateObject();
  const { mutate: updateObject } = useUpdateObject();
  const { mutate: deleteObject } = useDeleteObject();

  const selectedObject = objects?.find(
    (o: Object3D) => o.id === selectedObjectId,
  );

  const handleCanvasDoubleClick = (pos: Position) => {
    setSpawnPosition(pos);
    onOpen();
  };

  const handleAddNewObject = () => {
    setSpawnPosition(new Position(0, 0.5, 0));
    onOpen();
  };

  const handleCreateSubmit = (data: any) => {
    const promise = new Promise((resolve, reject) => {
      createObject(
        {
          ...data,
          position: spawnPosition,
        },
        {
          onSuccess: (newObj) => {
            setSelectedObjectId(newObj.id);
            resolve(newObj);
          },
          onError: (error) => {
            reject(error);
          },
        },
      );
    });

    toast.promise(promise, {
      loading: "Creating object...",
      success: "Object created successfully",
      error: "Failed to create object",
    });
  };

  const handleUpdateSubmit = (data: any) => {
    if (selectedObjectId) {
      const promise = new Promise((resolve, reject) => {
        updateObject(
          { id: selectedObjectId, data },
          {
            onSuccess: () => resolve(true),
            onError: (error) => reject(error),
          },
        );
      });

      toast.promise(promise, {
        loading: "Updating object...",
        success: "Object updated successfully",
        error: "Failed to update object",
      });
    }
  };

  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onOpenChange: onDeleteOpenChange,
  } = useDisclosure();
  const [objectToDeleteId, setObjectToDeleteId] = React.useState<string | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleDelete = (id: string) => {
    setObjectToDeleteId(id);
    onDeleteOpen();
  };

  const confirmDelete = () => {
    if (objectToDeleteId) {
      setIsDeleting(true);
      const promise = new Promise((resolve, reject) => {
        deleteObject(objectToDeleteId, {
          onSuccess: () => {
            if (selectedObjectId === objectToDeleteId) {
              setSelectedObjectId(null);
            }
            setIsDeleting(false);
            onDeleteOpenChange();
            resolve(true);
          },
          onError: (error) => {
            setIsDeleting(false);
            reject(error);
          },
        });
      });

      toast.promise(promise, {
        loading: "Deleting object...",
        success: "Object deleted successfully",
        error: "Failed to delete object",
      });
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-full w-full bg-[#FAFAFA] overflow-hidden select-none text-gray-900">
      {/* 1. Global Navigation Sidebar (Narrow) */}
      <div className="hidden md:flex w-16 h-full bg-white border-r border-gray-100 flex-col items-center py-6 gap-4 z-30 shadow-sm">
        <div
          className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer transition-all border",
            isOutlinerOpen
              ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
              : "bg-transparent text-gray-400 border-transparent hover:text-gray-600 hover:bg-gray-50",
          )}
          onClick={() => setOutlinerOpen(!isOutlinerOpen)}
          title="Object List"
        >
          <Layers size={20} />
        </div>

        <div
          className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer transition-all border",
            isInspectorOpen
              ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
              : "bg-transparent text-gray-400 border-transparent hover:text-gray-600 hover:bg-gray-50",
          )}
          onClick={() => setInspectorOpen(!isInspectorOpen)}
          title="Inspector"
        >
          <Settings2 size={20} />
        </div>

        <Button
          isIconOnly
          size="sm"
          variant="solid"
          color="primary"
          className="w-10 h-10 rounded-xl"
          onClick={handleAddNewObject}
          title="Add Object"
        >
          <Plus size={18} />
        </Button>
      </div>

      {/* Mobile Top Bar */}
      <div className="md:hidden w-full h-14 bg-white border-b border-gray-100 flex items-center justify-between px-4 z-30 shadow-sm shrink-0">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer transition-all border",
              isOutlinerOpen
                ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                : "bg-transparent text-gray-400 border-transparent hover:text-gray-600 hover:bg-gray-50",
            )}
            onClick={() => setOutlinerOpen(!isOutlinerOpen)}
          >
            <Layers size={20} />
          </div>
        </div>

        <span className="font-bold text-lg text-primary">PORTBIM</span>

        <div className="flex items-center gap-2">
          <Button
            isIconOnly
            size="sm"
            variant="solid"
            color="primary"
            className="w-10 h-10 rounded-xl"
            onClick={handleAddNewObject}
          >
            <Plus size={18} />
          </Button>

          <div
            className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer transition-all border",
              isInspectorOpen
                ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                : "bg-transparent text-gray-400 border-transparent hover:text-gray-600 hover:bg-gray-50",
            )}
            onClick={() => setInspectorOpen(!isInspectorOpen)}
          >
            <Settings2 size={20} />
          </div>
        </div>
      </div>

      {/* 2. Object List Panel */}
      <div
        className={cn(
          "bg-white border-r border-gray-100 flex flex-col transition-all duration-300 ease-in-out z-20",
          "fixed md:relative inset-y-0 left-0 h-full shadow-xl md:shadow-none",
          isOutlinerOpen
            ? "translate-x-0 w-64 opacity-100"
            : "-translate-x-full md:translate-x-0 md:w-0 md:opacity-0 pointer-events-none md:pointer-events-auto",
        )}
        style={{ top: "3.5rem", height: "calc(100% - 3.5rem)" }} // Adjust for mobile header
        // Reset styles for desktop to avoid fixed positioning issues
        {...(window.innerWidth >= 768 && { style: {} })}
      >
        <ObjectsList
          objects={objects || []}
          selectedObjectId={selectedObjectId}
          onSelect={setSelectedObjectId}
          onDelete={handleDelete}
        />
      </div>

      {/* Mobile Backdrop for Panels */}
      {(isOutlinerOpen || isInspectorOpen) && (
        <div
          className="md:hidden fixed inset-0 bg-black/20 z-10"
          onClick={() => {
            setOutlinerOpen(false);
            setInspectorOpen(false);
          }}
        />
      )}

      {/* 3. Main Canvas Area */}
      <div className="flex-1 relative bg-gray-50 h-full w-full overflow-hidden">
        <React.Suspense
          fallback={
            <div className="w-full h-full flex items-center justify-center bg-gray-50">
              <div className="flex flex-col items-center gap-6">
                <div className="relative">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2 h-2 bg-primary rounded-full animate-ping"></div>
                  </div>
                </div>
                <span className="text-[10px] font-black text-gray-400 animate-pulse uppercase tracking-[0.4em]">
                  Initialising Engine...
                </span>
              </div>
            </div>
          }
        >
          <Scene3D
            objects={selectedObject ? [selectedObject] : []}
            selectedObjectId={selectedObjectId}
            onObjectSelect={setSelectedObjectId}
            onCanvasClick={(pos) => console.log("Canvas clicked at", pos)}
            onCanvasDoubleClick={handleCanvasDoubleClick}
          />
        </React.Suspense>

        {/* Helper overlay when no objects */}
        {(!objects || objects.length === 0) && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-100 max-w-md text-center">
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Empty Scene
              </h3>
              <p className="text-gray-500 mb-4">
                Start by adding objects using the + icon
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 4. Properties Panel (Inspector) */}
      <div
        className={cn(
          "bg-white border-l border-gray-100 flex flex-col transition-all duration-300 ease-in-out z-20",
          "fixed md:relative inset-y-0 right-0 h-full shadow-xl md:shadow-none",
          isInspectorOpen
            ? "translate-x-0 w-80 opacity-100"
            : "translate-x-full md:translate-x-0 md:w-0 md:opacity-0 pointer-events-none md:pointer-events-auto",
        )}
        style={{ top: "3.5rem", height: "calc(100% - 3.5rem)" }} // Adjust for mobile header
        // Reset styles for desktop
        {...(window.innerWidth >= 768 && { style: {} })}
      >
        <ObjectPropertiesPanel
          selectedObject={selectedObject || null}
          onUpdate={handleUpdateSubmit}
          onDelete={handleDelete}
        />
      </div>

      <ObjectCreateModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onSubmit={handleCreateSubmit}
        initialPosition={spawnPosition}
      />

      <ObjectDeleteModal
        isOpen={isDeleteOpen}
        onOpenChange={onDeleteOpenChange}
        objectName={
          objects?.find((o: Object3D) => o.id === objectToDeleteId)?.name ||
          "Object"
        }
        onConfirm={confirmDelete}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default EditorPage;
