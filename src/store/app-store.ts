import { makeAutoObservable } from "mobx";

export interface Shape {
  id: string;
  type: 'circle' | 'rectangle' | 'triangle' | 'path';
  position: { x: number; y: number };
  size: { width: number; height: number };
  color: string;
  selected: boolean;
  pathData?: string; // For complex shapes created by boolean operations
}

export interface EditorState {
  shapes: Shape[];
  selectedShapes: string[];
}

export type BooleanOperation = 'intersect' | 'union' | 'subtract' | 'difference';

class AppStore {
  isDarkMode: boolean = false;

  // Editor state
  shapes: Shape[] = [];
  selectedShapes: string[] = [];
  history: EditorState[] = [];
  currentHistoryIndex: number = -1;
  draggedShape: string | null = null;
  
  // Selection box state
  selectionBox: {
    isActive: boolean;
    startX: number;
    startY: number;
    endX: number;
    endY: number;
  } = {
    isActive: false,
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0
  };

  // Resize state
  resizeState: {
    isResizing: boolean;
    shapeId: string | null;
    handle: 'nw' | 'ne' | 'sw' | 'se' | 'n' | 's' | 'e' | 'w' | null;
    originalBounds: { x: number; y: number; width: number; height: number } | null;
  } = {
    isResizing: false,
    shapeId: null,
    handle: null,
    originalBounds: null
  };

  constructor() {
    makeAutoObservable(this);
    this.saveToHistory();
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
  }

  // Shape management
  addShape(type: 'circle' | 'rectangle' | 'triangle', position: { x: number; y: number }) {
    const newShape: Shape = {
      id: `${type}-${Date.now()}`,
      type,
      position,
      size: { width: 100, height: 100 },
      color: type === 'circle' ? '#3B82F6' : type === 'rectangle' ? '#EF4444' : '#10B981',
      selected: false
    };
    
    this.shapes.push(newShape);
    this.saveToHistory();
  }

  selectShape(shapeId: string, multiSelect: boolean = false) {
    if (!multiSelect) {
      this.shapes.forEach(shape => shape.selected = false);
      this.selectedShapes.splice(0, this.selectedShapes.length); // Clear array properly
    }
    
    const shape = this.shapes.find(s => s.id === shapeId);
    if (shape) {
      shape.selected = !shape.selected;
      if (shape.selected) {
        if (!this.selectedShapes.includes(shapeId)) {
          this.selectedShapes.push(shapeId);
        }
      } else {
        const index = this.selectedShapes.indexOf(shapeId);
        if (index > -1) {
          this.selectedShapes.splice(index, 1);
        }
      }
    }
  }

  // Selection box methods
  startSelectionBox(x: number, y: number) {
    console.log(`Starting selection box at: ${x}, ${y}`);
    this.selectionBox = {
      isActive: true,
      startX: x,
      startY: y,
      endX: x,
      endY: y
    };
  }

  updateSelectionBox(x: number, y: number) {
    if (this.selectionBox.isActive) {
      this.selectionBox.endX = x;
      this.selectionBox.endY = y;
      console.log(`Updating selection box to: ${x}, ${y}`);
    }
  }

  finishSelectionBox() {
    if (!this.selectionBox.isActive) return;

    const minX = Math.min(this.selectionBox.startX, this.selectionBox.endX);
    const maxX = Math.max(this.selectionBox.startX, this.selectionBox.endX);
    const minY = Math.min(this.selectionBox.startY, this.selectionBox.endY);
    const maxY = Math.max(this.selectionBox.startY, this.selectionBox.endY);

    // Only proceed if the selection box has some minimum size (avoid accidental clicks)
    const selectionWidth = maxX - minX;
    const selectionHeight = maxY - minY;
    
    if (selectionWidth > 5 || selectionHeight > 5) {
      // Clear current selection
      this.shapes.forEach(shape => shape.selected = false);
      this.selectedShapes = [];

      // Select shapes that intersect with selection box
      this.shapes.forEach(shape => {
        const shapeLeft = shape.position.x;
        const shapeRight = shape.position.x + shape.size.width;
        const shapeTop = shape.position.y;
        const shapeBottom = shape.position.y + shape.size.height;

        // Check if shape intersects with selection box
        const intersects = !(shapeRight < minX || shapeLeft > maxX || shapeBottom < minY || shapeTop > maxY);
        
        console.log(`Shape ${shape.id} at [${shapeLeft},${shapeTop}] to [${shapeRight},${shapeBottom}] intersects: ${intersects}`);
        
        if (intersects) {
          shape.selected = true;
          this.selectedShapes.push(shape.id);
        }
      });

      console.log(`Selection box: ${minX},${minY} to ${maxX},${maxY}`);
      console.log(`Selected ${this.selectedShapes.length} shapes:`, this.selectedShapes);
    }

    this.selectionBox.isActive = false;
  }

  cancelSelectionBox() {
    this.selectionBox.isActive = false;
  }

  // Resize methods
  startResize(shapeId: string, handle: 'nw' | 'ne' | 'sw' | 'se' | 'n' | 's' | 'e' | 'w') {
    const shape = this.shapes.find(s => s.id === shapeId);
    if (!shape) return;

    this.resizeState = {
      isResizing: true,
      shapeId,
      handle,
      originalBounds: {
        x: shape.position.x,
        y: shape.position.y,
        width: shape.size.width,
        height: shape.size.height
      }
    };
  }

  updateResize(deltaX: number, deltaY: number) {
    if (!this.resizeState.isResizing || !this.resizeState.shapeId || !this.resizeState.originalBounds) return;

    const shape = this.shapes.find(s => s.id === this.resizeState.shapeId);
    if (!shape) return;

    const { originalBounds, handle } = this.resizeState;
    const minSize = 20; // Minimum size

    let newX = originalBounds.x;
    let newY = originalBounds.y;
    let newWidth = originalBounds.width;
    let newHeight = originalBounds.height;

    switch (handle) {
      case 'nw':
        newX = originalBounds.x + deltaX;
        newY = originalBounds.y + deltaY;
        newWidth = originalBounds.width - deltaX;
        newHeight = originalBounds.height - deltaY;
        break;
      case 'ne':
        newY = originalBounds.y + deltaY;
        newWidth = originalBounds.width + deltaX;
        newHeight = originalBounds.height - deltaY;
        break;
      case 'sw':
        newX = originalBounds.x + deltaX;
        newWidth = originalBounds.width - deltaX;
        newHeight = originalBounds.height + deltaY;
        break;
      case 'se':
        newWidth = originalBounds.width + deltaX;
        newHeight = originalBounds.height + deltaY;
        break;
      case 'n':
        newY = originalBounds.y + deltaY;
        newHeight = originalBounds.height - deltaY;
        break;
      case 's':
        newHeight = originalBounds.height + deltaY;
        break;
      case 'w':
        newX = originalBounds.x + deltaX;
        newWidth = originalBounds.width - deltaX;
        break;
      case 'e':
        newWidth = originalBounds.width + deltaX;
        break;
    }

    // Enforce minimum size
    if (newWidth < minSize) {
      if (handle && handle.includes('w')) newX = originalBounds.x + originalBounds.width - minSize;
      newWidth = minSize;
    }
    if (newHeight < minSize) {
      if (handle && handle.includes('n')) newY = originalBounds.y + originalBounds.height - minSize;
      newHeight = minSize;
    }

    shape.position = { x: newX, y: newY };
    shape.size = { width: newWidth, height: newHeight };
  }

  finishResize() {
    if (this.resizeState.isResizing) {
      this.saveToHistory();
      this.resizeState = {
        isResizing: false,
        shapeId: null,
        handle: null,
        originalBounds: null
      };
    }
  }

  moveShape(shapeId: string, position: { x: number; y: number }) {
    const shape = this.shapes.find(s => s.id === shapeId);
    if (shape) {
      shape.position = position;
    }
  }

  deleteSelectedShapes() {
    this.shapes = this.shapes.filter(shape => !shape.selected);
    this.selectedShapes = [];
    this.saveToHistory();
  }

  // Boolean operations
  get canPerformBooleanOperations(): boolean {
    return this.selectedShapes.length >= 2;
  }

  get intersectingShapes(): Shape[] {
    const selected = this.shapes.filter(shape => shape.selected);
    if (selected.length < 2) return [];
    
    // Use synchronous bounding box intersection for real-time UI
    const result: Shape[] = [];
    for (let i = 0; i < selected.length; i++) {
      for (let j = i + 1; j < selected.length; j++) {
        if (this.shapesIntersect(selected[i], selected[j])) {
          if (!result.includes(selected[i])) result.push(selected[i]);
          if (!result.includes(selected[j])) result.push(selected[j]);
        }
      }
    }
    return result;
  }

  private shapesIntersect(shape1: Shape, shape2: Shape): boolean {
    // Fallback bounding box intersection for synchronous checks
    const rect1 = {
      left: shape1.position.x,
      right: shape1.position.x + shape1.size.width,
      top: shape1.position.y,
      bottom: shape1.position.y + shape1.size.height
    };
    
    const rect2 = {
      left: shape2.position.x,
      right: shape2.position.x + shape2.size.width,
      top: shape2.position.y,
      bottom: shape2.position.y + shape2.size.height
    };

    return !(rect1.right < rect2.left || 
             rect2.right < rect1.left || 
             rect1.bottom < rect2.top || 
             rect2.bottom < rect1.top);
  }

  async performBooleanOperation(operation: BooleanOperation) {
    if (!this.canPerformBooleanOperations) {
      console.log('Cannot perform boolean operation: need at least 2 selected shapes');
      return;
    }
    
    const selectedShapes = this.shapes.filter(shape => shape.selected);
    if (selectedShapes.length < 2) {
      console.log('Cannot perform boolean operation: need at least 2 selected shapes');
      return;
    }

    console.log(`Attempting ${operation} on ${selectedShapes.length} shapes:`, selectedShapes.map(s => s.id));

    try {
      // Import the boolean operations utility
      const { performBooleanOperation: performOp } = await import('../utils/booleanOpreations');
      
      // Perform the operation
      const resultShape = await performOp(selectedShapes, operation);
      
      if (resultShape) {
        console.log('Boolean operation successful, removing original shapes and adding result');
        
        // Remove the original shapes
        this.shapes = this.shapes.filter(shape => !shape.selected);
        
        // Add the new combined shape
        resultShape.selected = true; // Select the new shape
        this.shapes.push(resultShape);
        
        // Update selected shapes array
        this.selectedShapes.splice(0, this.selectedShapes.length);
        this.selectedShapes.push(resultShape.id);
        
        this.saveToHistory();
        console.log('Boolean operation completed successfully');
      } else {
        console.log('Boolean operation returned null - no result created');
      }
    } catch (error) {
      console.error('Boolean operation failed with error:', error);
      
      // Show error to user by temporarily changing colors
      selectedShapes.forEach(shape => {
        const originalColor = shape.color;
        shape.color = '#FF0000'; // Red to indicate error
        setTimeout(() => {
          shape.color = originalColor;
        }, 1000);
      });
    }
  }

  // History management
  saveToHistory() {
    const state: EditorState = {
      shapes: JSON.parse(JSON.stringify(this.shapes)),
      selectedShapes: [...this.selectedShapes]
    };
    
    // Remove any history after current index
    this.history = this.history.slice(0, this.currentHistoryIndex + 1);
    this.history.push(state);
    this.currentHistoryIndex++;
    
    // Limit history size
    if (this.history.length > 50) {
      this.history.shift();
      this.currentHistoryIndex--;
    }
  }

  undo() {
    if (this.currentHistoryIndex > 0) {
      this.currentHistoryIndex--;
      this.restoreFromHistory();
    }
  }

  redo() {
    if (this.currentHistoryIndex < this.history.length - 1) {
      this.currentHistoryIndex++;
      this.restoreFromHistory();
    }
  }

  private restoreFromHistory() {
    const state = this.history[this.currentHistoryIndex];
    if (state) {
      this.shapes = JSON.parse(JSON.stringify(state.shapes));
      this.selectedShapes = [...state.selectedShapes];
    }
  }

  get canUndo(): boolean {
    return this.currentHistoryIndex > 0;
  }

  get canRedo(): boolean {
    return this.currentHistoryIndex < this.history.length - 1;
  }
}

export const appStore = new AppStore();