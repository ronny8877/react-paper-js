import { makeAutoObservable } from "mobx";
import type { Shape } from "./shape-store";

export interface EditorState {
  shapes: Shape[];
  selectedShapeIds: string[];
}

export class HistoryStore {
  private history: EditorState[] = [];
  private currentIndex = -1;
  private readonly maxHistorySize = 50;

  constructor() {
    makeAutoObservable(this);
  }

  saveState(shapes: Shape[], selectedShapeIds: string[]) {
    const state: EditorState = {
      shapes: JSON.parse(JSON.stringify(shapes)),
      selectedShapeIds: [...selectedShapeIds],
    };

    // Remove any history after current index
    this.history = this.history.slice(0, this.currentIndex + 1);
    this.history.push(state);
    this.currentIndex++;

    // Limit history size
    if (this.history.length > this.maxHistorySize) {
      this.history.shift();
      this.currentIndex--;
    }
  }

  undo(): EditorState | null {
    if (this.canUndo) {
      this.currentIndex--;
      return this.getCurrentState();
    }
    return null;
  }

  redo(): EditorState | null {
    if (this.canRedo) {
      this.currentIndex++;
      return this.getCurrentState();
    }
    return null;
  }

  private getCurrentState(): EditorState | null {
    return this.history[this.currentIndex] || null;
  }

  get canUndo(): boolean {
    return this.currentIndex > 0;
  }

  get canRedo(): boolean {
    return this.currentIndex < this.history.length - 1;
  }

  clear() {
    this.history = [];
    this.currentIndex = -1;
  }
}
