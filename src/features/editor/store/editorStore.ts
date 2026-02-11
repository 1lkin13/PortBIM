import { create } from 'zustand';

interface EditorState {
  selectedObjectId: string | null;
  hoveredObjectId: string | null;
  isAddingObject: boolean;
  
  // UI Panels
  isOutlinerOpen: boolean;
  isInspectorOpen: boolean;
  
  // Transform Controls
  transformMode: 'translate' | 'rotate' | 'scale' | 'none';
  
  setSelectedObjectId: (id: string | null) => void;
  setHoveredObjectId: (id: string | null) => void;
  setIsAddingObject: (isAdding: boolean) => void;
  setOutlinerOpen: (open: boolean) => void;
  setInspectorOpen: (open: boolean) => void;
  setTransformMode: (mode: 'translate' | 'rotate' | 'scale' | 'none') => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  selectedObjectId: null,
  hoveredObjectId: null,
  isAddingObject: false,
  isOutlinerOpen: true,
  isInspectorOpen: true,
  transformMode: 'translate',
  
  setSelectedObjectId: (id) => set({ selectedObjectId: id }),
  setHoveredObjectId: (id) => set({ hoveredObjectId: id }),
  setIsAddingObject: (isAdding) => set({ isAddingObject: isAdding }),
  setOutlinerOpen: (open) => set({ isOutlinerOpen: open }),
  setInspectorOpen: (open) => set({ isInspectorOpen: open }),
  setTransformMode: (mode) => set({ transformMode: mode }),
}));
