import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Grid,
  PerspectiveCamera,
  Environment,
  ContactShadows,
} from "@react-three/drei";
import { SceneObject } from "./SceneObject";
import { useObjects, useUpdateObject } from "../../hooks/objects.hooks";
import { useEditorStore } from "../../store/editorStore";
import { Position } from "../../../../core/domain/valueObjects/Position";
import { Object3D } from "../../../../core/domain/models/Object3D";

interface Scene3DProps {
  objects?: Object3D[];
  selectedObjectId?: string | null;
  onObjectSelect?: (id: string | null) => void;
  onCanvasClick?: (pos: any) => void;
  onCanvasDoubleClick?: (pos: Position) => void;
  onDoubleClick?: (pos: Position) => void; // Keeping for backward compatibility or direct usage
}

export const Scene3D: React.FC<Scene3DProps> = ({
  objects: propObjects,
  selectedObjectId: propSelectedObjectId,
  onObjectSelect,
  onCanvasDoubleClick,
  onDoubleClick,
}) => {
  // Use props if provided, otherwise fallback to internal hooks
  const { data: hookObjects } = useObjects();
  const objects = propObjects || hookObjects;

  const {
    selectedObjectId: storeSelectedObjectId,
    hoveredObjectId,
    setSelectedObjectId: setStoreSelectedObjectId,
  } = useEditorStore();

  // Prioritize props over store for controlled mode
  const selectedObjectId =
    propSelectedObjectId !== undefined
      ? propSelectedObjectId
      : storeSelectedObjectId;
  const handleSelect = onObjectSelect || setStoreSelectedObjectId;

  const { mutate: updateObject } = useUpdateObject();

  const handleUpdatePosition = (
    id: string,
    x: number,
    y: number,
    z: number,
  ) => {
    updateObject({
      id,
      data: { position: new Position(x, y, z) },
    });
  };

  const handleDoubleClick = (e: any) => {
    // Stop event propagation to prevent triggering on objects if handled there
    // But double click usually happens on the grid/background in our logic
    if (!e.intersections || e.intersections.length === 0) {
      if (onCanvasDoubleClick) onCanvasDoubleClick(new Position(0, 0.5, 0));
      else if (onDoubleClick) onDoubleClick(new Position(0, 0.5, 0));
    } else {
      // If clicking on grid intersection
      const gridIntersection = e.intersections.find(
        (i: any) =>
          i.object.type === "GridHelper" || i.object.name === "ground",
      );
      if (gridIntersection) {
        const pos = new Position(
          gridIntersection.point.x,
          0.5,
          gridIntersection.point.z,
        );
        if (onCanvasDoubleClick) onCanvasDoubleClick(pos);
        else if (onDoubleClick) onDoubleClick(pos);
      }
    }
  };

  return (
    <Canvas
      shadows
      className="bg-[#FAFAFA]"
      style={{
        background: "linear-gradient(180deg, #FFFFFF 0%, #F3F4F6 100%)",
      }}
      onDoubleClick={handleDoubleClick}
    >
      <Suspense fallback={null}>
        <PerspectiveCamera makeDefault position={[8, 8, 8]} fov={50} />
        <OrbitControls
          makeDefault
          enableDamping
          dampingFactor={0.05}
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 1.75}
        />

        {/* High quality environment and lighting */}
        <Environment preset="city" />
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1} castShadow />

        {/* Scene Objects */}
        <group>
          {objects?.map((obj: Object3D) => (
            <SceneObject
              key={obj.id}
              object={obj}
              isSelected={selectedObjectId === obj.id}
              isHovered={hoveredObjectId === obj.id}
              onSelect={() => handleSelect(obj.id)}
              onUpdatePosition={(x, y, z) =>
                handleUpdatePosition(obj.id, x, y, z)
              }
            />
          ))}
        </group>

        {/* Visual Aids - Professional Light Grid */}
        <Grid
          infiniteGrid
          fadeDistance={30}
          fadeStrength={5}
          cellSize={1}
          sectionSize={5}
          sectionThickness={1}
          sectionColor="#E5E7EB"
          cellColor="#F3F4F6"
          position={[0, 0, 0]}
        />

        {/* Ground Plane for Shadows */}
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -0.001, 0]}
          receiveShadow
          name="ground"
        >
          <planeGeometry args={[100, 100]} />
          <shadowMaterial opacity={0.05} />
        </mesh>

        <ContactShadows
          opacity={0.2}
          scale={20}
          blur={2}
          far={4.5}
          color="#6366F1"
        />
      </Suspense>
    </Canvas>
  );
};
