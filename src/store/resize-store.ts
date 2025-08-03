import { makeAutoObservable } from "mobx";
import type { ShapeStore } from "./shape-store";

export type ResizeHandle = "nw" | "ne" | "sw" | "se" | "n" | "s" | "e" | "w";

export class ResizeStore {
  private shapeStore: ShapeStore;
  isResizing = false;
  shapeId: string | null = null;
  handle: ResizeHandle | null = null;
  originalBounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  } | null = null;

  constructor(shapeStore: ShapeStore) {
    this.shapeStore = shapeStore;
    makeAutoObservable(this);
  }

  startResize(shapeId: string, handle: ResizeHandle) {
    const shape = this.shapeStore.findShape(shapeId);
    if (!shape) return;

    this.isResizing = true;
    this.shapeId = shapeId;
    this.handle = handle;
    this.originalBounds = {
      x: shape.position.x,
      y: shape.position.y,
      width: shape.size.width,
      height: shape.size.height,
    };
  }

  updateResize(deltaX: number, deltaY: number) {
    if (
      !this.isResizing ||
      !this.shapeId ||
      !this.originalBounds ||
      !this.handle
    )
      return;

    const { originalBounds, handle } = this;
    const minSize = 20;

    let newX = originalBounds.x;
    let newY = originalBounds.y;
    let newWidth = originalBounds.width;
    let newHeight = originalBounds.height;

    switch (handle) {
      case "nw":
        newX = originalBounds.x + deltaX;
        newY = originalBounds.y + deltaY;
        newWidth = originalBounds.width - deltaX;
        newHeight = originalBounds.height - deltaY;
        break;
      case "ne":
        newY = originalBounds.y + deltaY;
        newWidth = originalBounds.width + deltaX;
        newHeight = originalBounds.height - deltaY;
        break;
      case "sw":
        newX = originalBounds.x + deltaX;
        newWidth = originalBounds.width - deltaX;
        newHeight = originalBounds.height + deltaY;
        break;
      case "se":
        newWidth = originalBounds.width + deltaX;
        newHeight = originalBounds.height + deltaY;
        break;
      case "n":
        newY = originalBounds.y + deltaY;
        newHeight = originalBounds.height - deltaY;
        break;
      case "s":
        newHeight = originalBounds.height + deltaY;
        break;
      case "w":
        newX = originalBounds.x + deltaX;
        newWidth = originalBounds.width - deltaX;
        break;
      case "e":
        newWidth = originalBounds.width + deltaX;
        break;
    }

    // Enforce minimum size
    if (newWidth < minSize) {
      if (handle.includes("w")) {
        newX = originalBounds.x + originalBounds.width - minSize;
      }
      newWidth = minSize;
    }
    if (newHeight < minSize) {
      if (handle.includes("n")) {
        newY = originalBounds.y + originalBounds.height - minSize;
      }
      newHeight = minSize;
    }

    this.shapeStore.resizeShape(
      this.shapeId,
      { width: newWidth, height: newHeight },
      { x: newX, y: newY },
    );
  }

  finishResize() {
    this.isResizing = false;
    this.shapeId = null;
    this.handle = null;
    this.originalBounds = null;
  }

  cancelResize() {
    if (this.isResizing && this.shapeId && this.originalBounds) {
      // Restore original bounds
      this.shapeStore.resizeShape(
        this.shapeId,
        {
          width: this.originalBounds.width,
          height: this.originalBounds.height,
        },
        { x: this.originalBounds.x, y: this.originalBounds.y },
      );
    }
    this.finishResize();
  }
}
