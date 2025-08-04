import { makeAutoObservable } from "mobx";
import { BASE_SHAPE_COLORS } from "../utils/constants";

export interface Shape {
  id: string;
  type: "circle" | "rectangle" | "triangle" | "tree" | "path";
  position: { x: number; y: number };
  size: { width: number; height: number };
  color: string;
  selected: boolean;
  pathData: string;
}

export class ShapeStore {
  shapes: Shape[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  addShape(
    type: "circle" | "rectangle" | "triangle" | "tree",
    position: { x: number; y: number },
    pathData: string,
  ) {
    const newShape: Shape = {
      id: `${type}-${Date.now()}`,
      type,
      position,
      pathData,
      size: { width: 100, height: 100 },
      color: BASE_SHAPE_COLORS[this.shapes.length % BASE_SHAPE_COLORS.length],
      selected: false,
    };

    this.shapes.push(newShape);
    return newShape;
  }

  deleteShape(shapeId: string) {
    this.shapes = this.shapes.filter((shape) => shape.id !== shapeId);
  }

  updateShape(shapeId: string, updates: Partial<Shape>) {
    const shape = this.shapes.find((s) => s.id === shapeId);
    if (shape) {
      Object.assign(shape, updates);
    }
  }

  findShape(shapeId: string): Shape | undefined {
    return this.shapes.find((s) => s.id === shapeId);
  }

  moveShape(shapeId: string, position: { x: number; y: number }) {
    const shape = this.findShape(shapeId);
    if (shape) {
      shape.position = position;
    }
  }

  resizeShape(
    shapeId: string,
    size: { width: number; height: number },
    position?: { x: number; y: number },
  ) {
    const shape = this.findShape(shapeId);
    if (shape) {
      shape.size = size;
      if (position) {
        shape.position = position;
      }
    }
  }

  setShapeColor(shapeId: string, color: string) {
    const shape = this.findShape(shapeId);
    if (shape) {
      shape.color = color;
    }
  }

  duplicateShape(shapeId: string): Shape | null {
    const shape = this.findShape(shapeId);
    if (!shape) return null;

    const newShape: Shape = {
      ...shape,
      id: `${shape.type}-${Date.now()}`,
      position: {
        x: shape.position.x + 50,
        y: shape.position.y + 50,
      },
      selected: false,
    };

    this.shapes.push(newShape);
    return newShape;
  }
}
