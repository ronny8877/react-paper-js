import type { Shape } from "../store/shape-store";

export class PersistenceManager {
  static saveShapes(shapes: Shape[], id?: string): string {
    const saveId = id || `shapes-store-${Date.now()}`;
    localStorage.setItem(saveId, JSON.stringify(shapes));
    return saveId;
  }

  static loadShapes(id: string): Shape[] | null {
    const shapeData = localStorage.getItem(id);
    if (shapeData) {
      try {
        const shapes: Shape[] = JSON.parse(shapeData);
        return shapes.map((shape) => ({
          ...shape,
          selected: false, // Reset selection state
        }));
      } catch (error) {
        console.error(`Failed to parse shapes data for ID: ${id}`, error);
        return null;
      }
    }
    return null;
  }

  static getAllSavedShapeIds(): string[] {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("shapes-store-")) {
        keys.push(key);
      }
    }
    return keys;
  }

  static deleteSavedShapes(id: string): boolean {
    try {
      localStorage.removeItem(id);
      return true;
    } catch (error) {
      console.error(`Failed to delete shapes with ID: ${id}`, error);
      return false;
    }
  }
}
