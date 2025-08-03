import { makeAutoObservable } from "mobx";

export class CanvasStore {
  canvasOptions = {
    showGrid: true,
  };

  constructor() {
    makeAutoObservable(this);
  }

  toggleGrid() {
    this.canvasOptions.showGrid = !this.canvasOptions.showGrid;
  }

  setGridVisibility(visible: boolean) {
    this.canvasOptions.showGrid = visible;
  }
}
