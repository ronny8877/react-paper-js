import styled from "styled-components";

export const Canvas = styled.div<{ grid?: boolean }>`
  position: relative;
  width: 100%;
  height: 100%;
  background: #ffffff;
  overflow: hidden;
  border-radius: 16px;
  height: calc(100vh - 106px);
  margin-top: 8px;

  ${({ grid }) =>
    grid &&
    `
    background-color: #ffffff;
    background-image:
      linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px),
      linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px);
    background-size: 24px 24px;
    `}
`;

export const EditorContainer = styled.div`
  display: flex;
  height: 100vh;
  background: #f4f4f4;
  gap: 20px;
  font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif;
`;

export const CanvasShape = styled.div<{
  selected: boolean;
  isDragging?: boolean;
}>`
  position: absolute;
  cursor: ${(props) => (props.isDragging ? "grabbing" : "grab")};

  &::after {
    content: "";
    position: absolute;
    top: -1px;
    left: -1px;
    right: -1px;
    bottom: -1px;
    border: 2px dashed #3182ce;
    border-radius: inherit;
    opacity: ${(props) => (props.selected ? 0.5 : 0)};
    transition: opacity 0.2s ease;
    pointer-events: none;
  }

  &:hover::after {
    opacity: 1;
  }
`;

export const IntersectionIndicator = styled.div<{ visible: boolean }>`
  position: absolute;
  top: 16px;
  right: 16px;
  background: #fed7d7;
  color: #c53030;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  opacity: ${(props) => (props.visible ? 1 : 0)};
  transition: opacity 0.3s ease;
  border: 1px solid #feb2b2;
`;

export const SelectionBox = styled.div<{
  isActive: boolean;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}>`
  position: absolute;
  border: 2px dashed #3182ce;
  background: rgba(49, 130, 206, 0.1);
  pointer-events: none;
  opacity: ${(props) => (props.isActive ? 1 : 0)};
  left: ${(props) => Math.min(props.startX, props.endX)}px;
  top: ${(props) => Math.min(props.startY, props.endY)}px;
  width: ${(props) => Math.abs(props.endX - props.startX)}px;
  height: ${(props) => Math.abs(props.endY - props.startY)}px;
  z-index: 1000;
  transition: none;

  ${(props) =>
    props.isActive &&
    `
    border-color: #2563eb;
    background: rgba(37, 99, 235, 0.15);
  `}
`;

export const ResizeHandle = styled.div<{
  position: "nw" | "ne" | "sw" | "se" | "n" | "s" | "e" | "w";
  visible: boolean;
}>`
  position: absolute;
  width: 8px;
  height: 8px;
  background: #3182ce;
  border: 2px solid #ffffff;
  border-radius: 50%;
  cursor: ${(props) => {
    switch (props.position) {
      case "nw":
        return "nw-resize";
      case "ne":
        return "ne-resize";
      case "sw":
        return "sw-resize";
      case "se":
        return "se-resize";
      case "n":
        return "n-resize";
      case "s":
        return "s-resize";
      case "e":
        return "e-resize";
      case "w":
        return "w-resize";
      default:
        return "pointer";
    }
  }};
  opacity: ${(props) => (props.visible ? 1 : 0)};
  transition: opacity 0.2s ease;
  z-index: 10;

  ${(props) => {
    switch (props.position) {
      case "nw":
        return "top: -6px; left: -6px;";
      case "ne":
        return "top: -6px; right: -6px;";
      case "sw":
        return "bottom: -6px; left: -6px;";
      case "se":
        return "bottom: -6px; right: -6px;";
      case "n":
        return "top: -6px; left: 50%; transform: translateX(-50%);";
      case "s":
        return "bottom: -6px; left: 50%; transform: translateX(-50%);";
      case "e":
        return "top: 50%; right: -6px; transform: translateY(-50%);";
      case "w":
        return "top: 50%; left: -6px; transform: translateY(-50%);";
      default:
        return "";
    }
  }}

  &:hover {
    background: #2c5aa0;
    transform: ${(props) => {
      const base =
        props.position === "n" || props.position === "s"
          ? "translateX(-50%)"
          : props.position === "e" || props.position === "w"
            ? "translateY(-50%)"
            : "";
      return base ? `${base} scale(1.2)` : "scale(1.2)";
    }};
  }
`;
