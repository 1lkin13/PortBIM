import React, { useRef } from "react";
import { Mesh } from "three";
import { Object3D, ObjectSize } from "../../../../core/domain/models/Object3D";
import { useEditorStore } from "../../store/editorStore";

interface SceneObjectProps {
  object: Object3D;
  isSelected: boolean;
  isHovered: boolean;
  onSelect: () => void;
  onUpdatePosition: (x: number, y: number, z: number) => void;
}

import { PivotControls } from "@react-three/drei";
import { Vector3 } from "three";
import * as THREE from "three";

export const SceneObject: React.FC<SceneObjectProps> = ({
  object,
  isSelected,
  onSelect,
  onUpdatePosition,
}) => {
  const meshRef = useRef<Mesh>(null);
  const setHovered = useEditorStore((state) => state.setHoveredObjectId);

  // Size mapping
  const sizeMap = {
    [ObjectSize.SMALL]: 0.5,
    [ObjectSize.NORMAL]: 1,
    [ObjectSize.LARGE]: 2,
  };

  const scale = sizeMap[object.size] || 1;

  const getGeometry = () => {
    switch (object.shape) {
      case "sphere":
        return <sphereGeometry args={[scale / 2, 32, 32]} />;
      case "cylinder":
        return <cylinderGeometry args={[scale / 2, scale / 2, scale, 32]} />;
      case "torus":
        return <torusGeometry args={[scale / 2.5, scale / 6, 16, 100]} />;
 case "heart":
  const shape = new THREE.Shape();
  const x = -0.25;
  const y = -0.5;
  shape.moveTo(x + 0.25, y + 0.70);
  shape.bezierCurveTo(x + 0.25, y + 0.70, x + 0.2, y + 0.95, x, y + 0.95);
  shape.bezierCurveTo(x - 0.3, y + 0.95, x - 0.3, y + 0.60, x - 0.3, y + 0.60);
  shape.bezierCurveTo(
    x - 0.3,
    y + 0.40,
    x - 0.1,
    y + 0.18,
    x + 0.25,
    y + 0,
  );
  shape.bezierCurveTo(
    x + 0.6,
    y + 0.18,
    x + 0.8,
    y + 0.40,
    x + 0.8,
    y + 0.60,
  );
  shape.bezierCurveTo(x + 0.8, y + 0.60, x + 0.8, y + 0.95, x + 0.5, y + 0.95);
  shape.bezierCurveTo(
    x + 0.35,
    y + 0.95,
    x + 0.25,
    y + 0.70,
    x + 0.25,
    y + 0.70,
  );

        const extrudeSettings = {
          depth: 0.4,
          bevelEnabled: true,
          bevelSegments: 2,
          steps: 2,
          bevelSize: 0.05,
          bevelThickness: 0.05,
        };

        return <extrudeGeometry args={[shape, extrudeSettings]} />;
      default:
        return <boxGeometry args={[scale, scale, scale]} />;
    }
  };

  const { transformMode } = useEditorStore();

  const handleDragEnd = () => {
    if (meshRef.current) {
      const position = new Vector3();
      meshRef.current.getWorldPosition(position);
      onUpdatePosition(position.x, position.y, position.z);
    }
  };

  const MeshComponent = (
    <mesh
      ref={meshRef}
      position={[object.position.x, object.position.y, object.position.z]}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(object.id);
      }}
      onPointerOut={() => {
        setHovered(null);
      }}
      castShadow
      receiveShadow
    >
      {getGeometry()}
      <meshStandardMaterial
        color={object.color}
        roughness={0.2}
        metalness={0.7}
        emissive={isSelected ? object.color : "#000000"}
        emissiveIntensity={isSelected ? 0.3 : 0}
      />

      {/* Selection Highlight (Silky Glow) */}
      {isSelected && (
        <mesh scale={[1.02, 1.02, 1.02]}>
          {getGeometry()}
          <meshBasicMaterial
            color="#6366f1"
            wireframe
            transparent
            opacity={0.2}
          />
        </mesh>
      )}
    </mesh>
  );

  if (isSelected && transformMode !== "none") {
    return (
      <PivotControls
        anchor={[0, 0, 0]}
        depthTest={false}
        lineWidth={3}
        activeAxes={[
          transformMode === "translate" ||
            transformMode === "rotate" ||
            transformMode === "scale",
          transformMode === "translate" ||
            transformMode === "rotate" ||
            transformMode === "scale",
          transformMode === "translate" ||
            transformMode === "rotate" ||
            transformMode === "scale",
        ]}
        disableAxes={false}
        disableSliders={transformMode !== "translate"}
        disableRotations={transformMode !== "rotate"}
        disableScaling={transformMode !== "scale"}
        scale={1.2}
        onDragEnd={handleDragEnd}
      >
        {MeshComponent}
      </PivotControls>
    );
  }

  return MeshComponent;
};
