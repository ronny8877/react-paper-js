import type { Shape } from "../store/editor-store";

export type BooleanOperation =
  | "intersect"
  | "union"
  | "subtract"
  | "difference";

// Dynamic import for paper.js
let paper: any = null;

// Initialize paper.js (call this once when the app starts)
export async function initializePaper() {
  try {
    if (!paper) {
      console.log("Loading paper.js");
      // Use dynamic import to load paper.js
      paper = await import("paper");
      // Handle both default and named exports
      if (paper.default) {
        paper = paper.default;
      }
      console.log("Paper.js loaded:", paper);
    }

    if (!paper.project || !paper.project.activeLayer) {
      console.log("Initializing paper.js");

      // Create a canvas element for paper.js
      const canvas = document.createElement("canvas");
      canvas.width = 1000;
      canvas.height = 1000;
      canvas.style.display = "none"; // Hidden canvas
      canvas.id = "paper-canvas";
      document.body.appendChild(canvas);

      paper.setup(canvas);
      console.log("Paper.js initialized successfully");
    } else {
      console.log("Paper.js already initialized");
    }
  } catch (error) {
    console.error("Failed paper.js:", error);
    throw error;
  }
}

// Clean up paper.js resources
export function cleanupPaper() {
  try {
    if (paper.project) {
      paper.project.clear();
      paper.project.remove();
    }

    // Remove the canvas from DOM
    const canvas = document.getElementById("paper-canvas");
    if (canvas) {
      canvas.remove();
    }
  } catch (error) {
    console.error("Error cleaning up paper.js:", error);
  }
}

// Convert our shape to a paper.js path
function shapeToPaperPath(shape: Shape): any {
  let path: any;

  if (shape.pathData) {
    try {
      // All shapes now have path data, so we can handle them uniformly
      console.log(
        `Creating path from data: ${shape.pathData.substring(0, 100)}...`,
      );

      // Handle multiple paths in the data (compound paths)
      if (
        shape.pathData.includes("M") &&
        shape.pathData.split("M").length > 2
      ) {
        // Multiple paths - create a compound path
        const compoundPath = new paper.CompoundPath({
          pathData: shape.pathData,
          fillRule: "evenodd",
        });
        path = compoundPath;
      } else {
        // Single path
        path = new paper.Path(shape.pathData);
      }

      // First scale the path to match the shape's size (path data is normalized to 100x100)
      const scaleX = shape.size.width / 100;
      const scaleY = shape.size.height / 100;
      path.scale(scaleX, scaleY, new paper.Point(0, 0)); // Scale from origin

      // Then translate the path to the shape's position
      path.translate(new paper.Point(shape.position.x, shape.position.y));

      console.log(
        `Created path from data, scaled by (${scaleX}, ${scaleY}) and translated to (${shape.position.x}, ${shape.position.y})`,
      );
    } catch (error) {
      console.error("Failed to create path from pathData:", error);
      console.error("PathData was:", shape.pathData);
      // Fallback to rectangle
      const rectangle = new paper.Rectangle(
        shape.position.x,
        shape.position.y,
        shape.size.width,
        shape.size.height,
      );
      path = new paper.Path.Rectangle(rectangle);
    }
  } else {
    // Fallback to rectangle for shapes without path data
    const rectangle = new paper.Rectangle(
      shape.position.x,
      shape.position.y,
      shape.size.width,
      shape.size.height,
    );
    path = new paper.Path.Rectangle(rectangle);
    console.log(
      `Created fallback rectangle at (${shape.position.x}, ${shape.position.y})`,
    );
  }

  path.fillColor = new paper.Color(shape.color);
  path.strokeColor = new paper.Color("#000000");
  path.strokeWidth = 2;

  return path;
}

// Perform boolean operation on shapes
export async function performBooleanOperation(
  shapes: Shape[],
  operation: BooleanOperation,
): Promise<Shape | null> {
  console.log(`Performing ${operation} on ${shapes.length} shapes`);

  // Ensure paper.js is loaded
  if (!paper) {
    await initializePaper();
  }

  let canvas: HTMLCanvasElement | null = null;

  try {
    // Create a temporary canvas for this operation
    canvas = document.createElement("canvas");
    canvas.width = 1000;
    canvas.height = 1000;
    canvas.style.display = "none";
    canvas.id = "temp-paper-canvas";
    document.body.appendChild(canvas);

    // Setup paper.js on this canvas
    paper.setup(canvas);

    // Set high precision for better curve quality
    paper.settings.handleSize = 4;
    paper.settings.hitTolerance = 0;

    if (shapes.length < 2) {
      console.log("Need at least 2 shapes for boolean operation");
      return null;
    }

    // Convert shapes to paper.js paths
    const paths = shapes.map((shape, index) => {
      console.log(`Converting shape ${index}:`, shape);
      return shapeToPaperPath(shape);
    });

    console.log(`Created ${paths.length} paper.js paths`);

    // Start with the first path
    let resultPath = paths[0].clone();

    // Apply operation with subsequent paths
    for (let i = 1; i < paths.length; i++) {
      const currentPath = paths[i];
      console.log(`Applying ${operation} with path ${i}`);

      let newResult: any;

      switch (operation) {
        case "union":
          newResult = resultPath.unite(currentPath);
          break;
        case "intersect":
          newResult = resultPath.intersect(currentPath);
          break;
        case "subtract":
          newResult = resultPath.subtract(currentPath);
          break;
        case "difference":
          newResult = resultPath.exclude(currentPath);
          break;
        default:
          console.error("Unknown operation:", operation);
          return null;
      }

      // Remove the old result path
      resultPath.remove();
      resultPath = newResult;

      if (!resultPath) {
        console.log("Operation resulted in null path");
        // Clean up remaining paths
        paths.slice(i).forEach((path) => path.remove());
        return null;
      }

      // Check if result is empty, but be more careful about it
      try {
        if (resultPath.isEmpty && resultPath.isEmpty()) {
          console.log("Operation resulted in empty path");
          // Clean up remaining paths
          paths.slice(i).forEach((path) => path.remove());
          return null;
        }
      } catch (emptyCheckError) {
        // Some complex paths might not have isEmpty method or it might throw
        console.log("Could not check if path is empty, continuing...");
      }
    }

    console.log(
      "Boolean operation successful, result path bounds:",
      resultPath.bounds,
    );

    // Get the SVG path data
    const bounds = resultPath.bounds;
    const fillColor = resultPath.fillColor?.toCSS(true) || shapes[0].color;

    // Don't simplify - preserve the original shape quality
    // resultPath.simplify(); // This was causing the rounding issue

    // Clone the result path and move it to origin for normalization
    const normalizedPath = resultPath.clone();

    // Translate to origin
    normalizedPath.translate(new paper.Point(-bounds.x, -bounds.y));

    // Scale to normalize to 100x100 units, but maintain aspect ratio
    const scaleX = 100 / bounds.width;
    const scaleY = 100 / bounds.height;
    normalizedPath.scale(scaleX, scaleY, new paper.Point(0, 0));

    // Get the path data - handle compound paths properly
    let pathData: string;
    if (normalizedPath.children && normalizedPath.children.length > 0) {
      // Handle compound path (multiple sub-paths)
      pathData = normalizedPath.children
        .map((child: any) => child.pathData)
        .join(" ");
    } else {
      // Simple path
      pathData = normalizedPath.pathData;
    }

    console.log("Generated normalized path data:", pathData);
    console.log("Result bounds:", bounds);

    if (!pathData || pathData.length === 0) {
      console.error("No path data generated");
      return null;
    }

    // Create the new shape with correct positioning
    const newShape: Shape = {
      id: `${operation}-${Date.now()}`,
      type: "path",
      position: { x: bounds.x, y: bounds.y }, // Use the actual bounds position
      size: { width: bounds.width, height: bounds.height }, // Use the actual bounds size
      color: fillColor,
      selected: false,
      pathData: pathData,
    };

    console.log("Created new shape:", newShape);

    // Clean up all paths
    paths.forEach((path) => path.remove());
    resultPath.remove();
    normalizedPath.remove();

    return newShape;
  } catch (error) {
    console.error("Boolean operation failed with error:", error);
    return null;
  } finally {
    // Always clean up the temporary canvas
    if (canvas) {
      try {
        paper.project?.clear();
        canvas.remove();
        console.log("Temporary canvas cleaned up");
      } catch (cleanupError) {
        console.error("Error cleaning up canvas:", cleanupError);
      }
    }
  }
}
