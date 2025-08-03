import React, { useCallback, useRef, useState } from "react";
import { observer } from "mobx-react-lite";
import { appStore } from "../store/app-store";
import AppSidebar from "./navs/sidebar";
import {
  Canvas,
  CanvasShape,
  EditorContainer,
  ResizeHandle,
  SelectionBox,
} from "./ui/canvas";
import UtilityWindow from "./navs/utility-window";
import { AppTitle } from "./ui/typography";
import type { Shape } from "../store/editor-store";

export const Editor = observer(() => {
  const [dragState, setDragState] = useState<{
    isDragging: boolean;
    shapeId: string | null;
    offset: { x: number; y: number };
  }>({ isDragging: false, shapeId: null, offset: { x: 0, y: 0 } });

  const [mouseState, setMouseState] = useState<{
    isSelecting: boolean;
    startPos: { x: number; y: number };
    isMouseDown: boolean;
    mouseDownTime: number;
  }>({
    isSelecting: false,
    startPos: { x: 0, y: 0 },
    isMouseDown: false,
    mouseDownTime: 0,
  });

  const canvasRef = useRef<HTMLDivElement>(null);

  const handleCanvasMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      // Clicked on empty canvas, start selection box
      const canvasRect = canvasRef.current?.getBoundingClientRect();
      if (!canvasRect) return;

      const canvasX = e.clientX - canvasRect.left;
      const canvasY = e.clientY - canvasRect.top;

      console.log("Canvas mouse down at:", canvasX, canvasY);

      appStore.editorStore.startSelectionBox(canvasX, canvasY);
      setMouseState({
        isSelecting: true,
        startPos: { x: canvasX, y: canvasY },
        isMouseDown: true,
        mouseDownTime: Date.now(),
      });
    }
  }, []);

  const handleShapeMouseDown = useCallback(
    (e: React.MouseEvent, shapeId: string) => {
      e.stopPropagation();

      // Cancel any active selection box
      appStore.editorStore.cancelSelectionBox();

      const shape = appStore.editorStore.shapes.find((s) => s.id === shapeId);
      if (!shape) return;

      // Select the shape (no longer support multi-select with Ctrl)
      if (!shape.selected) {
        // Deselect all other shapes first
        appStore.editorStore.shapes.forEach((s) => (s.selected = false));
        appStore.editorStore.selectedShapes.splice(
          0,
          appStore.editorStore.selectedShapes.length,
        );
        // Then select this shape
        appStore.editorStore.selectShape(shapeId, false);
      }

      // Calculate offset relative to canvas
      const canvasRect = canvasRef.current?.getBoundingClientRect();
      if (!canvasRect) return;

      const canvasX = e.clientX - canvasRect.left;
      const canvasY = e.clientY - canvasRect.top;

      // Start dragging
      setDragState({
        isDragging: true,
        shapeId,
        offset: {
          x: canvasX - shape.position.x,
          y: canvasY - shape.position.y,
        },
      });

      // Reset mouse state since we're not selecting
      setMouseState({
        isSelecting: false,
        startPos: { x: 0, y: 0 },
        isMouseDown: false,
        mouseDownTime: 0,
      });
    },
    [],
  );

  const handleResizeMouseDown = useCallback(
    (
      e: React.MouseEvent,
      shapeId: string,
      handle: "nw" | "ne" | "sw" | "se" | "n" | "s" | "e" | "w",
    ) => {
      e.stopPropagation();

      // Cancel any active selection box
      appStore.editorStore.cancelSelectionBox();

      const canvasRect = canvasRef.current?.getBoundingClientRect();
      if (!canvasRect) return;

      const canvasX = e.clientX - canvasRect.left;
      const canvasY = e.clientY - canvasRect.top;

      appStore.editorStore.startResize(shapeId, handle);
      setMouseState({
        isSelecting: false,
        startPos: { x: canvasX, y: canvasY },
        isMouseDown: true,
        mouseDownTime: Date.now(),
      });
    },
    [],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const canvasRect = canvasRef.current?.getBoundingClientRect();
      if (!canvasRect) return;

      const canvasX = e.clientX - canvasRect.left;
      const canvasY = e.clientY - canvasRect.top;

      if (
        appStore.editorStore.selectionBox.isActive &&
        !dragState.isDragging &&
        !appStore.editorStore.resizeState.isResizing
      ) {
        // Update selection box
        appStore.editorStore.updateSelectionBox(canvasX, canvasY);
      } else if (dragState.isDragging && dragState.shapeId) {
        // Handle shape dragging
        const newPosition = {
          x: canvasX - dragState.offset.x,
          y: canvasY - dragState.offset.y,
        };

        // Constrain to canvas bounds
        newPosition.x = Math.max(
          0,
          Math.min(newPosition.x, canvasRect.width - 100),
        );
        newPosition.y = Math.max(
          0,
          Math.min(newPosition.y, canvasRect.height - 100),
        );

        appStore.editorStore.moveShape(dragState.shapeId, newPosition);
      } else if (appStore.editorStore.resizeState.isResizing) {
        // Handle shape resizing
        const deltaX = canvasX - mouseState.startPos.x;
        const deltaY = canvasY - mouseState.startPos.y;
        appStore.editorStore.updateResize(deltaX, deltaY);
      }
    },
    [dragState, mouseState],
  );

  const handleMouseUp = useCallback(
    (e: React.MouseEvent) => {
      const wasSelecting = appStore.editorStore.selectionBox.isActive;
      const wasDragging = dragState.isDragging;
      const wasResizing = appStore.editorStore.resizeState.isResizing;
      const clickDuration = Date.now() - mouseState.mouseDownTime;

      if (wasSelecting) {
        console.log("Finishing selection box");
        appStore.editorStore.finishSelectionBox();
        setMouseState({
          isSelecting: false,
          startPos: { x: 0, y: 0 },
          isMouseDown: false,
          mouseDownTime: 0,
        });
      } else if (wasDragging) {
        appStore.editorStore.saveToHistory();
        setDragState({
          isDragging: false,
          shapeId: null,
          offset: { x: 0, y: 0 },
        });
      } else if (wasResizing) {
        appStore.editorStore.finishResize();
      } else if (
        e.target === e.currentTarget &&
        clickDuration < 200 &&
        !wasSelecting &&
        !wasDragging
      ) {
        // Simple click on empty canvas - deselect all
        console.log("Simple click - deselecting all");
        appStore.editorStore.shapes.forEach(
          (shape) => (shape.selected = false),
        );
        appStore.editorStore.selectedShapes.splice(
          0,
          appStore.editorStore.selectedShapes.length,
        );
      }

      // Reset mouse state
      setMouseState((prev) => ({
        ...prev,
        isMouseDown: false,
        isSelecting: false,
      }));
    },
    [dragState, mouseState],
  );

  const renderShape = (shape: Shape) => {
    const isBeingDragged =
      dragState.isDragging && dragState.shapeId === shape.id;
    const isSelected = shape.selected;

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
        onMouseDown={(e) => handleShapeMouseDown(e, shape.id)}
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
            <ResizeHandle
              position="nw"
              visible={true}
              onMouseDown={(e) => handleResizeMouseDown(e, shape.id, "nw")}
            />
            <ResizeHandle
              position="ne"
              visible={true}
              onMouseDown={(e) => handleResizeMouseDown(e, shape.id, "ne")}
            />
            <ResizeHandle
              position="sw"
              visible={true}
              onMouseDown={(e) => handleResizeMouseDown(e, shape.id, "sw")}
            />
            <ResizeHandle
              position="se"
              visible={true}
              onMouseDown={(e) => handleResizeMouseDown(e, shape.id, "se")}
            />
            <ResizeHandle
              position="n"
              visible={true}
              onMouseDown={(e) => handleResizeMouseDown(e, shape.id, "n")}
            />
            <ResizeHandle
              position="s"
              visible={true}
              onMouseDown={(e) => handleResizeMouseDown(e, shape.id, "s")}
            />
            <ResizeHandle
              position="e"
              visible={true}
              onMouseDown={(e) => handleResizeMouseDown(e, shape.id, "e")}
            />
            <ResizeHandle
              position="w"
              visible={true}
              onMouseDown={(e) => handleResizeMouseDown(e, shape.id, "w")}
            />
          </>
        )}
      </CanvasShape>
    );
  };

  return (
    <EditorContainer>
      <AppSidebar />
      <div style={{ width: "100%", height: "100%", overflow: "hidden" }}>
        <AppTitle align="center">React Paper \^o^/ </AppTitle>
        <Canvas
          id="canvas"
          grid={appStore.editorStore.canvasOptions.showGrid}
          ref={canvasRef}
          onMouseDown={handleCanvasMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {appStore.editorStore.shapes.map(renderShape)}

          {/* Selection box */}
          <SelectionBox
            isActive={appStore.editorStore.selectionBox.isActive}
            startX={appStore.editorStore.selectionBox.startX}
            startY={appStore.editorStore.selectionBox.startY}
            endX={appStore.editorStore.selectionBox.endX}
            endY={appStore.editorStore.selectionBox.endY}
          />
        </Canvas>
      </div>
      <UtilityWindow />
    </EditorContainer>
  );
});
