// SVG path data for shapes normalized to 100x100 units
export const CIRCLE_PATH =
  "M50 10 C72.091 10 90 27.909 90 50 C90 72.091 72.091 90 50 90 C27.909 90 10 72.091 10 50 C10 27.909 27.909 10 50 10 Z";
export const RECTANGLE_PATH =
  "M10 10 L90 10 L90 90 L10 90 Z";
export const TRIANGLE_PATH = "M50 15 L85 85 L15 85 Z";

export const SHAPE_TYPES = {
  circle: CIRCLE_PATH,
  rectangle: RECTANGLE_PATH,
  triangle: TRIANGLE_PATH,
} as const;
