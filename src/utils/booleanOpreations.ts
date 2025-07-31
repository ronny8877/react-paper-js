import type { Shape, BooleanOperation } from '../store/app-store';

// Dynamic import for paper.js
let paper: any = null;

// Initialize paper.js (call this once when the app starts)
export async function initializePaper() {
  try {
    if (!paper) {
      console.log('Loading paper.js');
      // Use dynamic import to load paper.js
      paper = await import('paper');
      // Handle both default and named exports
      if (paper.default) {
        paper = paper.default;
      }
      console.log('Paper.js loaded:', paper);
    }
    
    console.log('Paper object:', paper);
    console.log('Paper.setup function:', typeof paper.setup);
    
    if (!paper.project || !paper.project.activeLayer) {
      console.log('Initializing paper.js');
      
      // Create a canvas element for paper.js
      const canvas = document.createElement('canvas');
      canvas.width = 1000;
      canvas.height = 1000;
      canvas.style.display = 'none'; // Hidden canvas
      canvas.id = 'paper-canvas';
      document.body.appendChild(canvas);
      
      paper.setup(canvas);
      console.log('Paper.js initialized successfully');
    } else {
      console.log('Paper.js already initialized');
    }
  } catch (error) {
    console.error('Failed paper.js:', error);
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
    const canvas = document.getElementById('paper-canvas');
    if (canvas) {
      canvas.remove();
    }
    
    console.log('Paper.js cleaned up');
  } catch (error) {
    console.error('Error cleaning up paper.js:', error);
  }
}

// Convert our shape to a paper.js path
function shapeToPaperPath(shape: Shape): any {
  let path: any;
  
  if (shape.type === 'circle') {
    const center = new paper.Point(
      shape.position.x + shape.size.width / 2,
      shape.position.y + shape.size.height / 2
    );
    const radius = Math.min(shape.size.width, shape.size.height) / 2;
    
    // Create a high-quality circle with many segments for smoother curves
    // Using more segments to prevent wobbliness in boolean operations
    const segments = 64; // Much higher than default for smooth curves
    path = new paper.Path();
    
    for (let i = 0; i < segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      const x = center.x + Math.cos(angle) * radius;
      const y = center.y + Math.sin(angle) * radius;
      
      if (i === 0) {
        path.moveTo(new paper.Point(x, y));
      } else {
        path.lineTo(new paper.Point(x, y));
      }
    }
    path.closePath();
    
    // Apply smoothing to make it even more circular
    path.smooth();
    
    console.log(`Created high-quality circle at center (${center.x}, ${center.y}) with radius ${radius} and ${segments} segments`);
  } else if (shape.type === 'rectangle') {
    const rectangle = new paper.Rectangle(
      shape.position.x,
      shape.position.y,
      shape.size.width,
      shape.size.height
    );
    path = new paper.Path.Rectangle(rectangle);
    console.log(`Created rectangle at (${shape.position.x}, ${shape.position.y}) size ${shape.size.width}x${shape.size.height}`);
  } else if (shape.type === 'triangle') {
    const triangle = new paper.Path();
    triangle.moveTo(new paper.Point(shape.position.x + shape.size.width / 2, shape.position.y));
    triangle.lineTo(new paper.Point(shape.position.x, shape.position.y + shape.size.height));
    triangle.lineTo(new paper.Point(shape.position.x + shape.size.width, shape.position.y + shape.size.height));
    triangle.closePath();
    path = triangle;
    console.log(`Created triangle at (${shape.position.x}, ${shape.position.y}) size ${shape.size.width}x${shape.size.height}`);
  } else if (shape.type === 'path' && shape.pathData) {
    try {
      // Create path from the path data
      console.log(`Creating path from data: ${shape.pathData.substring(0, 100)}...`);
      
      // Handle multiple paths in the data (compound paths)
      if (shape.pathData.includes('M') && shape.pathData.split('M').length > 2) {
        // Multiple paths - create a compound path
        const compoundPath = new paper.CompoundPath({
          pathData: shape.pathData,
          fillRule: 'evenodd'
        });
        path = compoundPath;
      } else {
        // Single path
        path = new paper.Path(shape.pathData);
      }
      
      // The path data is relative to (0,0), so we need to translate it to the shape's position
      path.translate(new paper.Point(shape.position.x, shape.position.y));
      
      console.log(`Created path from data, translated to (${shape.position.x}, ${shape.position.y})`);
    } catch (error) {
      console.error('Failed to create path from pathData:', error);
      console.error('PathData was:', shape.pathData);
      // Fallback to rectangle
      const rectangle = new paper.Rectangle(
        shape.position.x,
        shape.position.y,
        shape.size.width,
        shape.size.height
      );
      path = new paper.Path.Rectangle(rectangle);
    }
  } else {
    // Fallback to rectangle
    const rectangle = new paper.Rectangle(
      shape.position.x,
      shape.position.y,
      shape.size.width,
      shape.size.height
    );
    path = new paper.Path.Rectangle(rectangle);
    console.log(`Created fallback rectangle at (${shape.position.x}, ${shape.position.y})`);
  }
  
  path.fillColor = new paper.Color(shape.color);
  path.strokeColor = new paper.Color('#000000');
  path.strokeWidth = 2;
  
  return path;
}



// Perform boolean operation on shapes
export async function performBooleanOperation(
  shapes: Shape[],
  operation: BooleanOperation
): Promise<Shape | null> {
  console.log(`Performing ${operation} on ${shapes.length} shapes`);
  
  // Ensure paper.js is loaded
  if (!paper) {
    await initializePaper();
  }
  
  let canvas: HTMLCanvasElement | null = null;
  
  try {
    // Create a temporary canvas for this operation
    canvas = document.createElement('canvas');
    canvas.width = 1000;
    canvas.height = 1000;
    canvas.style.display = 'none';
    canvas.id = 'temp-paper-canvas';
    document.body.appendChild(canvas);
    
    // Setup paper.js on this canvas
    paper.setup(canvas);
    
    // Set high precision for better curve quality
    paper.settings.handleSize = 4;
    paper.settings.hitTolerance = 0;
    
    if (shapes.length < 2) {
      console.log('Need at least 2 shapes for boolean operation');
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
        case 'union':
          newResult = resultPath.unite(currentPath);
          break;
        case 'intersect':
          newResult = resultPath.intersect(currentPath);
          break;
        case 'subtract':
          newResult = resultPath.subtract(currentPath);
          break;
        case 'difference':
          newResult = resultPath.exclude(currentPath);
          break;
        default:
          console.error('Unknown operation:', operation);
          return null;
      }
      
      // Remove the old result path
      resultPath.remove();
      resultPath = newResult;
      
      if (!resultPath) {
        console.log('Operation resulted in null path');
        // Clean up remaining paths
        paths.slice(i).forEach(path => path.remove());
        return null;
      }
      
      // Check if result is empty, but be more careful about it
      try {
        if (resultPath.isEmpty && resultPath.isEmpty()) {
          console.log('Operation resulted in empty path');
          // Clean up remaining paths
          paths.slice(i).forEach(path => path.remove());
          return null;
        }
      } catch (emptyCheckError) {
        // Some complex paths might not have isEmpty method or it might throw
        console.log('Could not check if path is empty, continuing...');
      }
    }
    
    console.log('Boolean operation successful, result path bounds:', resultPath.bounds);
    
    // Get the SVG path data
    const bounds = resultPath.bounds;
    const fillColor = resultPath.fillColor?.toCSS(true) || shapes[0].color;
    
    // Don't simplify - preserve the original shape quality
    // resultPath.simplify(); // This was causing the rounding issue
    
    // Move the path to origin (0,0) and get relative path data
    const translatedPath = resultPath.clone();
    translatedPath.translate(new paper.Point(-bounds.x, -bounds.y));
    
    // Get the path data - handle compound paths properly
    let pathData: string;
    if (translatedPath.children && translatedPath.children.length > 0) {
      // Handle compound path (multiple sub-paths)
      pathData = translatedPath.children.map((child: any) => child.pathData).join(' ');
    } else {
      // Simple path
      pathData = translatedPath.pathData;
    }
    
    console.log('Generated path data:', pathData);
    console.log('Result bounds:', bounds);
    
    if (!pathData || pathData.length === 0) {
      console.error('No path data generated');
      return null;
    }
    
    // Create the new shape
    const newShape: Shape = {
      id: `${operation}-${Date.now()}`,
      type: 'path',
      position: { x: bounds.x, y: bounds.y },
      size: { width: bounds.width, height: bounds.height },
      color: fillColor,
      selected: false,
      pathData: pathData
    };
    
    console.log('Created new shape:', newShape);
    
    // Clean up all paths
    paths.forEach(path => path.remove());
    resultPath.remove();
    translatedPath.remove();
    
    return newShape;
  } catch (error) {
    console.error('Boolean operation failed with error:', error);
    return null;
  } finally {
    // Always clean up the temporary canvas
    if (canvas) {
      try {
        paper.project?.clear();
        canvas.remove();
        console.log('Temporary canvas cleaned up');
      } catch (cleanupError) {
        console.error('Error cleaning up canvas:', cleanupError);
      }
    }
  }
}

// Check if two shapes actually intersect (more accurate than bounding box)
export async function shapesActuallyIntersect(shape1: Shape, shape2: Shape): Promise<boolean> {
  // Ensure paper.js is loaded
  if (!paper) {
    await initializePaper();
  }
  
  try {
    const path1 = shapeToPaperPath(shape1);
    const path2 = shapeToPaperPath(shape2);
    
    const intersection = path1.intersect(path2);
    const hasIntersection = !intersection.isEmpty();
    
    // Clean up
    path1.remove();
    path2.remove();
    intersection.remove();
    
    return hasIntersection;
  } catch (error) {
    console.error('Intersection check failed:', error);
    return false;
  }
}

// Get the intersection area of shapes
export async function getIntersectionArea(shapes: Shape[]): Promise<number> {
  if (shapes.length < 2) return 0;
  
  // Ensure paper.js is loaded
  if (!paper) {
    await initializePaper();
  }
  
  try {
    const paths = shapes.map(shape => shapeToPaperPath(shape));
    let intersectionPath = paths[0];
    
    for (let i = 1; i < paths.length; i++) {
      intersectionPath = intersectionPath.intersect(paths[i]);
    }
    
    const area = intersectionPath.area;
    
    // Clean up
    paths.forEach(path => path.remove());
    intersectionPath.remove();
    
    return area;
  } catch (error) {
    console.error('Area calculation failed:', error);
    return 0;
  }
}
