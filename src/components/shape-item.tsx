import React, { useCallback } from "react";
import { observer } from "mobx-react-lite";
import { CanvasShape, ResizeHandle } from "./ui/canvas";
import type { Shape } from "../store/editor-store";

interface ShapeItemProps {
  shape: Shape;
  isBeingDragged: boolean;
  onShapeMouseDown: (e: React.MouseEvent, shapeId: string) => void;
  onResizeMouseDown: (
    e: React.MouseEvent,
    shapeId: string,
    handle: "nw" | "ne" | "sw" | "se" | "n" | "s" | "e" | "w",
  ) => void;
}

export const ShapeItem = observer(
  ({
    shape,
    isBeingDragged,
    onShapeMouseDown,
    onResizeMouseDown,
  }: ShapeItemProps) => {
    const isSelected = shape.selected;

    const handleResizeMouseDown = useCallback(
      (
        e: React.MouseEvent,
        handle: "nw" | "ne" | "sw" | "se" | "n" | "s" | "e" | "w",
      ) => {
        onResizeMouseDown(e, shape.id, handle);
      },
      [onResizeMouseDown, shape.id],
    );

    return (
      <CanvasShape
        key={shape.id}
        selected={isSelected}
        isDragging={isBeingDragged}
        style={{
          left: shape.position.x,
          top: shape.position.y,
          width: shape.size.width,
          height: shape.size.height,
        }}
        onMouseDown={(e) => onShapeMouseDown(e, shape.id)}
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{ overflow: "visible" }}
        >
          <path
            d={shape.pathData || "M5 5 L95 5 L95 95 L5 95 Z"}
            fill={shape.color}
            stroke="#000"
            strokeWidth="0"
            fillRule="evenodd"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {/* Resize handles */}
        {isSelected && !isBeingDragged && (
          <>
            {(["nw", "ne", "sw", "se", "n", "s", "e", "w"] as const).map(
              (position) => (
                <ResizeHandle
                  key={position}
                  position={position}
                  visible={true}
                  onMouseDown={(e) => handleResizeMouseDown(e, position)}
                />
              ),
            )}
          </>
        )}
      </CanvasShape>
    );
  },
);
