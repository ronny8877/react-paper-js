import React, { useRef } from "react";
import { observer } from "mobx-react-lite";
import { appStore } from "../store/app-store";
import AppSidebar from "./navs/sidebar";
import { Canvas, EditorContainer, SelectionBox } from "./ui/canvas";
import UtilityWindow from "./navs/utility-window";
import { AppTitle } from "./ui/typography";
import { ShapeItem } from "./shape-item";
import { useCanvasInteractions } from "../hooks/useCanvasInteractions";

export const Editor = observer(() => {
  const canvasRef = useRef<HTMLDivElement>(null);

  const {
    dragState,
    handleCanvasMouseDown,
    handleShapeMouseDown,
    handleResizeMouseDown,
    handleMouseMove,
    handleMouseUp,
  } = useCanvasInteractions(canvasRef as React.RefObject<HTMLDivElement>);

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
          {appStore.editorStore.shapes.map((shape) => (
            <ShapeItem
              key={shape.id}
              shape={shape}
              isBeingDragged={
                dragState.isDragging && dragState.shapeId === shape.id
              }
              onShapeMouseDown={handleShapeMouseDown}
              onResizeMouseDown={handleResizeMouseDown}
            />
          ))}

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
