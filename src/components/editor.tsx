import React, { useCallback, useRef, useState } from "react";
import { observer } from "mobx-react-lite";
import { appStore, type BooleanOperation } from "../store/app-store";
import {
  EditorContainer,
  Sidebar,
  SidebarSection,
  ShapeGrid,
  ShapeButton,
  BooleanOperationsGrid,
  BooleanButton,
  HistoryControls,
  HistoryButton,
  Canvas,
  CanvasShape,
  StatusBar,
  IntersectionIndicator,
  SelectionBox,
  ResizeHandle
} from "../styled";
import {
  CircleIcon,
  RectangleIcon,
  TriangleIcon,
  UndoIcon,
  RedoIcon,
  IntersectIcon,
  UnionIcon,
  SubtractIcon,
  DifferenceIcon
} from "./icons";

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
  }>({ isSelecting: false, startPos: { x: 0, y: 0 }, isMouseDown: false, mouseDownTime: 0 });

  const canvasRef = useRef<HTMLDivElement>(null);

  const handleAddShape = useCallback((type: 'circle' | 'rectangle' | 'triangle') => {
    // Add shape at center of canvas
    const canvasRect = canvasRef.current?.getBoundingClientRect();
    if (canvasRect) {
      const centerX = canvasRect.width / 2 - 50; // 50 is half of shape size
      const centerY = canvasRect.height / 2 - 50;
      appStore.addShape(type, { x: centerX, y: centerY });
    }
  }, []);

  const handleCanvasMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      // Clicked on empty canvas, start selection box
      const canvasRect = canvasRef.current?.getBoundingClientRect();
      if (!canvasRect) return;

      const canvasX = e.clientX - canvasRect.left;
      const canvasY = e.clientY - canvasRect.top;

      console.log('Canvas mouse down at:', canvasX, canvasY);
      
      appStore.startSelectionBox(canvasX, canvasY);
      setMouseState({ 
        isSelecting: true, 
        startPos: { x: canvasX, y: canvasY },
        isMouseDown: true,
        mouseDownTime: Date.now()
      });
    }
  }, []);

  const handleShapeMouseDown = useCallback((e: React.MouseEvent, shapeId: string) => {
    e.stopPropagation();
    
    // Cancel any active selection box
    appStore.cancelSelectionBox();
    
    const shape = appStore.shapes.find(s => s.id === shapeId);
    if (!shape) return;

    // Select the shape (no longer support multi-select with Ctrl)
    if (!shape.selected) {
      // Deselect all other shapes first
      appStore.shapes.forEach(s => s.selected = false);
      appStore.selectedShapes.splice(0, appStore.selectedShapes.length);
      // Then select this shape
      appStore.selectShape(shapeId, false);
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
        y: canvasY - shape.position.y
      }
    });

    // Reset mouse state since we're not selecting
    setMouseState({ 
      isSelecting: false, 
      startPos: { x: 0, y: 0 },
      isMouseDown: false,
      mouseDownTime: 0
    });
  }, []);

  const handleResizeMouseDown = useCallback((e: React.MouseEvent, shapeId: string, handle: 'nw' | 'ne' | 'sw' | 'se' | 'n' | 's' | 'e' | 'w') => {
    e.stopPropagation();
    
    // Cancel any active selection box
    appStore.cancelSelectionBox();
    
    const canvasRect = canvasRef.current?.getBoundingClientRect();
    if (!canvasRect) return;

    const canvasX = e.clientX - canvasRect.left;
    const canvasY = e.clientY - canvasRect.top;

    appStore.startResize(shapeId, handle);
    setMouseState({ 
      isSelecting: false, 
      startPos: { x: canvasX, y: canvasY },
      isMouseDown: true,
      mouseDownTime: Date.now()
    });
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const canvasRect = canvasRef.current?.getBoundingClientRect();
    if (!canvasRect) return;

    const canvasX = e.clientX - canvasRect.left;
    const canvasY = e.clientY - canvasRect.top;

    if (appStore.selectionBox.isActive && !dragState.isDragging && !appStore.resizeState.isResizing) {
      // Update selection box
      appStore.updateSelectionBox(canvasX, canvasY);
    } else if (dragState.isDragging && dragState.shapeId) {
      // Handle shape dragging
      const newPosition = {
        x: canvasX - dragState.offset.x,
        y: canvasY - dragState.offset.y
      };

      // Constrain to canvas bounds
      newPosition.x = Math.max(0, Math.min(newPosition.x, canvasRect.width - 100));
      newPosition.y = Math.max(0, Math.min(newPosition.y, canvasRect.height - 100));

      appStore.moveShape(dragState.shapeId, newPosition);
    } else if (appStore.resizeState.isResizing) {
      // Handle shape resizing
      const deltaX = canvasX - mouseState.startPos.x;
      const deltaY = canvasY - mouseState.startPos.y;
      appStore.updateResize(deltaX, deltaY);
    }
  }, [dragState, mouseState]);

  const handleMouseUp = useCallback((e: React.MouseEvent) => {
    const wasSelecting = appStore.selectionBox.isActive;
    const wasDragging = dragState.isDragging;
    const wasResizing = appStore.resizeState.isResizing;
    const clickDuration = Date.now() - mouseState.mouseDownTime;
    
    if (wasSelecting) {
      console.log('Finishing selection box');
      appStore.finishSelectionBox();
      setMouseState({ 
        isSelecting: false, 
        startPos: { x: 0, y: 0 },
        isMouseDown: false,
        mouseDownTime: 0
      });
    } else if (wasDragging) {
      appStore.saveToHistory();
      setDragState({ isDragging: false, shapeId: null, offset: { x: 0, y: 0 } });
    } else if (wasResizing) {
      appStore.finishResize();
    } else if (e.target === e.currentTarget && clickDuration < 200 && !wasSelecting && !wasDragging) {
      // Simple click on empty canvas - deselect all
      console.log('Simple click - deselecting all');
      appStore.shapes.forEach(shape => shape.selected = false);
      appStore.selectedShapes.splice(0, appStore.selectedShapes.length);
    }
    
    // Reset mouse state
    setMouseState(prev => ({ 
      ...prev, 
      isMouseDown: false,
      isSelecting: false
    }));
  }, [dragState, mouseState]);

  const handleBooleanOperation = useCallback(async (operation: BooleanOperation) => {
    await appStore.performBooleanOperation(operation);
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'z':
          e.preventDefault();
          if (e.shiftKey) {
            appStore.redo();
          } else {
            appStore.undo();
          }
          break;
        case 'y':
          e.preventDefault();
          appStore.redo();
          break;
      }
    }
    
    // Handle delete key without modifiers
    if (e.key === 'Delete' || e.key === 'Backspace') {
      e.preventDefault();
      appStore.deleteSelectedShapes();
    }
  }, []);

  // Add keyboard listeners and initialize paper.js
  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    
    // Initialize paper.js
    import('../utils/booleanOpreations').then(({ initializePaper }) => {
      initializePaper().catch(error => {
        console.error('Failed to initialize paper.js:', error);
      });
    });
    
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const renderShape = (shape: any) => {
    const isBeingDragged = dragState.isDragging && dragState.shapeId === shape.id;
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
        {shape.type === 'circle' ? (
          <svg 
           viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill={shape.color}
              stroke="#000"
              strokeWidth="0"
            />
          </svg>
        ) : shape.type === 'rectangle' ? (
          <svg width="100%" height="100%" viewBox="0 0 100 100">
            <rect
              x="5"
              y="5"
              width="90"
              height="90"
              rx="8"
              fill={shape.color}
              stroke="#000"
              strokeWidth="0"
            />
          </svg>
        ) : shape.type === 'triangle' ? (
          <svg width="100%" height="100%" viewBox="0 0 100 100">
            <path
              d="M50 10 L10 90 L90 90 Z"
              fill={shape.color}
              stroke="#000"
              strokeWidth="0"
              strokeLinejoin="round"
            />
          </svg>
        ) : shape.type === 'path' && shape.pathData ? (
          <svg 
            width="100%" 
            height="100%" 
            viewBox={`0 0 ${shape.size.width} ${shape.size.height}`}
            style={{ overflow: 'visible' }}
          >
            <path
              d={shape.pathData}
              fill={shape.color}
              stroke="#000"
              strokeWidth="0"
              fillRule="inherit"
            />
          </svg>
        ) : (
          // Fallback for unknown shape types
          <svg width="100%" height="100%" viewBox="0 0 100 100">
            <rect
              x="5"
              y="5"
              width="90"
              height="90"
              rx="8"
              fill={shape.color}
              stroke="#000"
              strokeWidth="2"
            />
          </svg>
        )}
        
        {/* Resize handles */}
        {isSelected && !isBeingDragged && (
          <>
            <ResizeHandle 
              position="nw" 
              visible={true} 
              onMouseDown={(e) => handleResizeMouseDown(e, shape.id, 'nw')} 
            />
            <ResizeHandle 
              position="ne" 
              visible={true} 
              onMouseDown={(e) => handleResizeMouseDown(e, shape.id, 'ne')} 
            />
            <ResizeHandle 
              position="sw" 
              visible={true} 
              onMouseDown={(e) => handleResizeMouseDown(e, shape.id, 'sw')} 
            />
            <ResizeHandle 
              position="se" 
              visible={true} 
              onMouseDown={(e) => handleResizeMouseDown(e, shape.id, 'se')} 
            />
            <ResizeHandle 
              position="n" 
              visible={true} 
              onMouseDown={(e) => handleResizeMouseDown(e, shape.id, 'n')} 
            />
            <ResizeHandle 
              position="s" 
              visible={true} 
              onMouseDown={(e) => handleResizeMouseDown(e, shape.id, 's')} 
            />
            <ResizeHandle 
              position="e" 
              visible={true} 
              onMouseDown={(e) => handleResizeMouseDown(e, shape.id, 'e')} 
            />
            <ResizeHandle 
              position="w" 
              visible={true} 
              onMouseDown={(e) => handleResizeMouseDown(e, shape.id, 'w')} 
            />
          </>
        )}
      </CanvasShape>
    );
  };

  const intersectingShapes = appStore.intersectingShapes;
  const hasIntersections = intersectingShapes.length > 0;

  return (
    <EditorContainer>
      <Sidebar>
        <SidebarSection>
          <h3>Shapes</h3>
          <ShapeGrid>
            <ShapeButton onClick={() => handleAddShape('circle')}>
              <CircleIcon size={32} />
              <span>Circle</span>
            </ShapeButton>
            <ShapeButton onClick={() => handleAddShape('rectangle')}>
              <RectangleIcon size={32} />
              <span>Rectangle</span>
            </ShapeButton>
            <ShapeButton onClick={() => handleAddShape('triangle')}>
              <TriangleIcon size={32} />
              <span>Triangle</span>
            </ShapeButton>
          </ShapeGrid>
        </SidebarSection>

        <SidebarSection>
          <h3>Boolean Operations</h3>
          <BooleanOperationsGrid>
            <BooleanButton
              disabled={!appStore.canPerformBooleanOperations}
              onClick={() => handleBooleanOperation('union')}
            >
              <UnionIcon /> Union
            </BooleanButton>
            <BooleanButton
              disabled={!appStore.canPerformBooleanOperations}
              onClick={() => handleBooleanOperation('intersect')}
            >
              <IntersectIcon /> Intersect
            </BooleanButton>
            <BooleanButton
              disabled={!appStore.canPerformBooleanOperations}
              onClick={() => handleBooleanOperation('subtract')}
            >
              <SubtractIcon /> Subtract
            </BooleanButton>
            <BooleanButton
              disabled={!appStore.canPerformBooleanOperations}
              onClick={() => handleBooleanOperation('difference')}
            >
              <DifferenceIcon /> Difference
            </BooleanButton>
          </BooleanOperationsGrid>
        </SidebarSection>

        <SidebarSection>
          <h3>History</h3>
          <HistoryControls>
            <HistoryButton
              disabled={!appStore.canUndo}
              onClick={() => appStore.undo()}
            >
              <UndoIcon /> Undo
            </HistoryButton>
            <HistoryButton
              disabled={!appStore.canRedo}
              onClick={() => appStore.redo()}
            >
              <RedoIcon /> Redo
            </HistoryButton>
          </HistoryControls>
        </SidebarSection>
      </Sidebar>

      <Canvas
        ref={canvasRef}
        onMouseDown={handleCanvasMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {appStore.shapes.map(renderShape)}
        
        {/* Selection box */}
        <SelectionBox
          isActive={appStore.selectionBox.isActive}
          startX={appStore.selectionBox.startX}
          startY={appStore.selectionBox.startY}
          endX={appStore.selectionBox.endX}
          endY={appStore.selectionBox.endY}
        />
        
        <IntersectionIndicator visible={hasIntersections}>
          ⚠️ Intersecting shapes detected
        </IntersectionIndicator>

        <StatusBar>
          <span>Shapes: {appStore.shapes.length}</span>
          <span>Selected: {appStore.selectedShapes.length}</span>
          <span>History: {appStore.currentHistoryIndex + 1}/{appStore.history.length}</span>
          {hasIntersections && (
            <span style={{ color: '#ffd700' }}>
              ⚠️ {intersectingShapes.length} shapes intersecting - Boolean operations available
            </span>
          )}
          <span style={{ color: '#a0aec0', fontSize: '11px' }}>
            Drag: Select area | Click shape: Select | Resize handles when selected | Delete: Remove | Ctrl+Z/Y: Undo/Redo
          </span>
          <button onClick={() => console.log(appStore.shapes)}>Log Shapes</button>
        </StatusBar>
      </Canvas>
    </EditorContainer>
  );
});