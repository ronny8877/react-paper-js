import { makeAutoObservable } from "mobx";
import type { ShapeStore, Shape } from "./shape-store";

export class SelectionStore {
  selectedShapeIds: string[] = [];
  private shapeStore: ShapeStore;

  // Selection box state
  selectionBox = {
    isActive: false,
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
  };

  constructor(shapeStore: ShapeStore) {
    this.shapeStore = shapeStore;
    makeAutoObservable(this);
  }

  get selectedShapes(): Shape[] {
    return this.selectedShapeIds
      .map((id) => this.shapeStore.findShape(id))
      .filter(Boolean) as Shape[];
  }

  selectShape(shapeId: string, multiSelect: boolean = false) {
    if (!multiSelect) {
      this.clearSelection();
    }

    const shape = this.shapeStore.findShape(shapeId);
    if (!shape) return;

    const isSelected = this.selectedShapeIds.includes(shapeId);

    if (isSelected) {
      this.deselectShape(shapeId);
    } else {
      this.selectedShapeIds.push(shapeId);
      shape.selected = true;
    }
  }

  deselectShape(shapeId: string) {
    const index = this.selectedShapeIds.indexOf(shapeId);
    if (index > -1) {
      this.selectedShapeIds.splice(index, 1);
      const shape = this.shapeStore.findShape(shapeId);
      if (shape) {
        shape.selected = false;
      }
    }
  }

  clearSelection() {
    this.selectedShapeIds.forEach((id) => {
      const shape = this.shapeStore.findShape(id);
      if (shape) {
        shape.selected = false;
      }
    });
    this.selectedShapeIds = [];
  }

  selectMultipleShapes(shapeIds: string[]) {
    this.clearSelection();
    shapeIds.forEach((id) => this.selectShape(id, true));
  }

  deleteSelected() {
    this.selectedShapeIds.forEach((id) => {
      this.shapeStore.deleteShape(id);
    });
    this.selectedShapeIds = [];
  }

  updateSelectedShapeColors(color: string) {
    this.selectedShapeIds.forEach((id) => {
      this.shapeStore.setShapeColor(id, color);
    });
  }

  // Selection box methods
  startSelectionBox(x: number, y: number) {
    this.selectionBox = {
      isActive: true,
      startX: x,
      startY: y,
      endX: x,
      endY: y,
    };
  }

  updateSelectionBox(x: number, y: number) {
    if (this.selectionBox.isActive) {
      this.selectionBox.endX = x;
      this.selectionBox.endY = y;
    }
  }

  finishSelectionBox() {
    if (!this.selectionBox.isActive) return;

    const minX = Math.min(this.selectionBox.startX, this.selectionBox.endX);
    const maxX = Math.max(this.selectionBox.startX, this.selectionBox.endX);
    const minY = Math.min(this.selectionBox.startY, this.selectionBox.endY);
    const maxY = Math.max(this.selectionBox.startY, this.selectionBox.endY);

    const selectionWidth = maxX - minX;
    const selectionHeight = maxY - minY;

    if (selectionWidth > 5 || selectionHeight > 5) {
      const intersectingShapeIds: string[] = [];

      this.shapeStore.shapes.forEach((shape) => {
        const shapeLeft = shape.position.x;
        const shapeRight = shape.position.x + shape.size.width;
        const shapeTop = shape.position.y;
        const shapeBottom = shape.position.y + shape.size.height;

        const intersects = !(
          shapeRight < minX ||
          shapeLeft > maxX ||
          shapeBottom < minY ||
          shapeTop > maxY
        );

        if (intersects) {
          intersectingShapeIds.push(shape.id);
        }
      });

      this.selectMultipleShapes(intersectingShapeIds);
    }

    this.selectionBox.isActive = false;
  }

  cancelSelectionBox() {
    this.selectionBox.isActive = false;
  }
}
