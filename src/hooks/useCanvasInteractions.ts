import { useCallback, useState } from "react";
import { appStore } from "../store/app-store";

interface DragState {
  isDragging: boolean;
  shapeId: string | null;
  offset: { x: number; y: number };
}

interface MouseState {
  isSelecting: boolean;
  startPos: { x: number; y: number };
  isMouseDown: boolean;
  mouseDownTime: number;
}

export function useCanvasInteractions(
  canvasRef: React.RefObject<HTMLDivElement>,
) {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    shapeId: null,
    offset: { x: 0, y: 0 },
  });

  const [mouseState, setMouseState] = useState<MouseState>({
    isSelecting: false,
    startPos: { x: 0, y: 0 },
    isMouseDown: false,
    mouseDownTime: 0,
  });

  const getCanvasCoordinates = useCallback(
    (e: React.MouseEvent) => {
      const canvasRect = canvasRef.current?.getBoundingClientRect();
      if (!canvasRect) return null;

      return {
        x: e.clientX - canvasRect.left,
        y: e.clientY - canvasRect.top,
      };
    },
    [canvasRef],
  );

  const handleCanvasMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.target !== e.currentTarget) return;

      const coords = getCanvasCoordinates(e);
      if (!coords) return;

      appStore.editorStore.startSelectionBox(coords.x, coords.y);
      setMouseState({
        isSelecting: true,
        startPos: coords,
        isMouseDown: true,
        mouseDownTime: Date.now(),
      });
    },
    [getCanvasCoordinates],
  );

  const handleShapeMouseDown = useCallback(
    (e: React.MouseEvent, shapeId: string) => {
      e.stopPropagation();
      appStore.editorStore.cancelSelectionBox();

      const shape = appStore.editorStore.shapes.find((s) => s.id === shapeId);
      if (!shape) return;

      if (!shape.selected) {
        appStore.editorStore.shapes.forEach((s) => (s.selected = false));
        appStore.editorStore.selectedShapes.splice(0);
        appStore.editorStore.selectShape(shapeId, false);
      }

      const coords = getCanvasCoordinates(e);
      if (!coords) return;

      setDragState({
        isDragging: true,
        shapeId,
        offset: {
          x: coords.x - shape.position.x,
          y: coords.y - shape.position.y,
        },
      });

      setMouseState({
        isSelecting: false,
        startPos: { x: 0, y: 0 },
        isMouseDown: false,
        mouseDownTime: 0,
      });
    },
    [getCanvasCoordinates],
  );

  const handleResizeMouseDown = useCallback(
    (
      e: React.MouseEvent,
      shapeId: string,
      handle: "nw" | "ne" | "sw" | "se" | "n" | "s" | "e" | "w",
    ) => {
      e.stopPropagation();
      appStore.editorStore.cancelSelectionBox();

      const coords = getCanvasCoordinates(e);
      if (!coords) return;

      appStore.editorStore.startResize(shapeId, handle);
      setMouseState({
        isSelecting: false,
        startPos: coords,
        isMouseDown: true,
        mouseDownTime: Date.now(),
      });
    },
    [getCanvasCoordinates],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const coords = getCanvasCoordinates(e);
      if (!coords) return;

      if (
        appStore.editorStore.selectionBox.isActive &&
        !dragState.isDragging &&
        !appStore.editorStore.resizeState.isResizing
      ) {
        appStore.editorStore.updateSelectionBox(coords.x, coords.y);
      } else if (dragState.isDragging && dragState.shapeId) {
        const canvasRect = canvasRef.current?.getBoundingClientRect();
        if (!canvasRect) return;

        const newPosition = {
          x: Math.max(
            0,
            Math.min(coords.x - dragState.offset.x, canvasRect.width - 100),
          ),
          y: Math.max(
            0,
            Math.min(coords.y - dragState.offset.y, canvasRect.height - 100),
          ),
        };

        appStore.editorStore.moveShape(dragState.shapeId, newPosition);
      } else if (appStore.editorStore.resizeState.isResizing) {
        const deltaX = coords.x - mouseState.startPos.x;
        const deltaY = coords.y - mouseState.startPos.y;
        appStore.editorStore.updateResize(deltaX, deltaY);
      }
    },
    [dragState, mouseState, getCanvasCoordinates],
  );

  const handleMouseUp = useCallback(
    (e: React.MouseEvent) => {
      const wasSelecting = appStore.editorStore.selectionBox.isActive;
      const wasDragging = dragState.isDragging;
      const wasResizing = appStore.editorStore.resizeState.isResizing;
      const clickDuration = Date.now() - mouseState.mouseDownTime;

      if (wasSelecting) {
        appStore.editorStore.finishSelectionBox();
      } else if (wasDragging) {
        appStore.editorStore.saveToHistory();
      } else if (wasResizing) {
        appStore.editorStore.finishResize();
      } else if (e.target === e.currentTarget && clickDuration < 200) {
        appStore.editorStore.shapes.forEach(
          (shape) => (shape.selected = false),
        );
        appStore.editorStore.selectedShapes.splice(0);
      }

      setDragState({
        isDragging: false,
        shapeId: null,
        offset: { x: 0, y: 0 },
      });
      setMouseState((prev) => ({
        ...prev,
        isMouseDown: false,
        isSelecting: false,
      }));
    },
    [dragState, mouseState],
  );

  return {
    dragState,
    handleCanvasMouseDown,
    handleShapeMouseDown,
    handleResizeMouseDown,
    handleMouseMove,
    handleMouseUp,
  };
}
