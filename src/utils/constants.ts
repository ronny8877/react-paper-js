// SVG path data for shapes normalized to 100x100 units
export const CIRCLE_PATH =
  "M50 5 C77.614 5 95 22.386 95 50 S77.614 95 50 95 S5 77.614 5 50 S22.386 5 50 5 Z";
export const RECTANGLE_PATH =
  "M5 5 L95 5 A8 8 0 0 1 95 13 L95 87 A8 8 0 0 1 87 95 L13 95 A8 8 0 0 1 5 87 L5 13 A8 8 0 0 1 13 5 Z";
export const TRIANGLE_PATH = "M50 10 L10 90 L90 90 Z";

export const SHAPE_TYPES = {
  circle: CIRCLE_PATH,
  rectangle: RECTANGLE_PATH,
  triangle: TRIANGLE_PATH,
} as const;
