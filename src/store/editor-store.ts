import { makeAutoObservable } from "mobx";
import { SHAPE_TYPES } from "../utils/constants";
import { ShapeStore } from "./shape-store";
import { SelectionStore } from "./selection-store";
import { ResizeStore } from "./resize-store";
import { HistoryStore } from "./history-store";
import { CanvasStore } from "./canvas-store";
import { PersistenceManager } from "../utils/presistence";
import type { AppStore } from "./app-store";
import type { BooleanOperation } from "../utils/booleanOpreations";

export class EditorStore {
  public appStore: AppStore;
  shapeStore: ShapeStore;
  selectionStore: SelectionStore;
  resizeStore: ResizeStore;
  historyStore: HistoryStore;
  canvasStore: CanvasStore;

  constructor(appStore: AppStore) {
    this.appStore = appStore;
    this.shapeStore = new ShapeStore();
    this.selectionStore = new SelectionStore(this.shapeStore);
    this.resizeStore = new ResizeStore(this.shapeStore);
    this.historyStore = new HistoryStore();
    this.canvasStore = new CanvasStore();

    makeAutoObservable(this);
    this.saveToHistory();
  }

  // Convenience getters for backward compatibility
  get shapes() {
    return this.shapeStore.shapes;
  }
  get selectedShapes() {
    return this.selectionStore.selectedShapeIds;
  }
  get selectionBox() {
    return this.selectionStore.selectionBox;
  }
  get resizeState() {
    return this.resizeStore;
  }
  get canvasOptions() {
    return this.canvasStore.canvasOptions;
  }

  // Convenience methods that delegate to appropriate stores
  addShape(
    type: "circle" | "rectangle" | "triangle" | "tree",
    position: { x: number; y: number },
  ) {
    const shape = this.shapeStore.addShape(type, position, SHAPE_TYPES[type]);
    this.saveToHistory();
    return shape;
  }

  selectShape(shapeId: string, multiSelect: boolean = false) {
    this.selectionStore.selectShape(shapeId, multiSelect);
  }

  moveShape(shapeId: string, position: { x: number; y: number }) {
    this.shapeStore.moveShape(shapeId, position);
  }

  deleteSelectedShapes() {
    this.selectionStore.deleteSelected();
    this.saveToHistory();
  }

  duplicateSelectedShape() {
    if (this.selectedShapes.length !== 1) {
      alert("Please select only one shape to duplicate");
      return;
    }

    const duplicated = this.shapeStore.duplicateShape(this.selectedShapes[0]);
    if (duplicated) {
      this.selectionStore.clearSelection();
      this.selectionStore.selectShape(duplicated.id);
      this.saveToHistory();
    }
  }

  updateSelectedShapeColor(color: string) {
    this.selectionStore.updateSelectedShapeColors(color);
    this.saveToHistory();
  }

  // Selection box delegation
  startSelectionBox(x: number, y: number) {
    this.selectionStore.startSelectionBox(x, y);
  }

  updateSelectionBox(x: number, y: number) {
    this.selectionStore.updateSelectionBox(x, y);
  }

  finishSelectionBox() {
    this.selectionStore.finishSelectionBox();
  }

  cancelSelectionBox() {
    this.selectionStore.cancelSelectionBox();
  }

  // Resize delegation
  startResize(
    shapeId: string,
    handle: "nw" | "ne" | "sw" | "se" | "n" | "s" | "e" | "w",
  ) {
    this.resizeStore.startResize(shapeId, handle);
  }

  updateResize(deltaX: number, deltaY: number) {
    this.resizeStore.updateResize(deltaX, deltaY);
  }

  finishResize() {
    this.resizeStore.finishResize();
    this.saveToHistory();
  }

  // Canvas options
  toggleGrid() {
    this.canvasStore.toggleGrid();
  }

  // History methods
  saveToHistory() {
    this.historyStore.saveState(this.shapes, this.selectedShapes);
  }

  undo() {
    const state = this.historyStore.undo();
    if (state) {
      this.restoreState(state);
    }
  }

  redo() {
    const state = this.historyStore.redo();
    if (state) {
      this.restoreState(state);
    }
  }

  private restoreState(state: { shapes: any[]; selectedShapeIds: string[] }) {
    this.shapeStore.shapes = JSON.parse(JSON.stringify(state.shapes));
    this.selectionStore.selectedShapeIds = [...state.selectedShapeIds];

    // Update selection state on shapes
    this.shapes.forEach((shape) => {
      shape.selected = this.selectedShapes.includes(shape.id);
    });
  }

  get canUndo() {
    return this.historyStore.canUndo;
  }
  get canRedo() {
    return this.historyStore.canRedo;
  }

  // Persistence methods
  saveShapesToLocalStorage() {
    return PersistenceManager.saveShapes(this.shapes);
  }

  loadShapesFromLocalStorage(id: string) {
    const shapes = PersistenceManager.loadShapes(id);
    if (shapes) {
      this.shapeStore.shapes = shapes;
      this.selectionStore.clearSelection();
      this.saveToHistory();
    } else {
      console.error(`No shapes found for ID: ${id}`);
    }
  }

  clearSelection() {
    this.selectionStore.clearSelection();
  }

  // Boolean operations (simplified)
  get canPerformBooleanOperations(): boolean {
    return this.selectionStore.selectedShapes.length >= 2;
  }

  async performBooleanOperation(operation: BooleanOperation) {
    if (!this.canPerformBooleanOperations) return;

    try {
      const { performBooleanOperation: performOp } = await import(
        "../utils/booleanOpreations"
      );
      const selectedShapes = this.selectionStore.selectedShapes;
      const resultShape = await performOp(selectedShapes, operation);

      if (resultShape) {
        // Remove original shapes
        selectedShapes.forEach((shape) =>
          this.shapeStore.deleteShape(shape.id),
        );

        // Add result shape
        this.shapeStore.shapes.push(resultShape);

        // Select the new shape
        this.selectionStore.clearSelection();
        this.selectionStore.selectShape(resultShape.id);

        this.saveToHistory();
      }
    } catch (error) {
      console.error("Boolean operation failed:", error);
    }
  }
}

export type { Shape } from "./shape-store";
export default EditorStore;
