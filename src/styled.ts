import styled from 'styled-components';

export const EditorContainer = styled.div`
  display: flex;
  height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  background: #f8fafc;
`;

export const Sidebar = styled.div`
  width: 280px;
  background: #ffffff;
  border-right: 1px solid #e2e8f0;
  padding: 20px;
  box-shadow: 2px 0 4px rgba(0, 0, 0, 0.05);
`;

export const SidebarSection = styled.div`
  margin-bottom: 32px;

  h3 {
    font-size: 16px;
    font-weight: 600;
    color: #1a202c;
    margin-bottom: 16px;
    padding-bottom: 8px;
    border-bottom: 2px solid #e2e8f0;
  }
`;

export const ShapeGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 20px;
`;

export const ShapeButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  background: #f7fafc;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #edf2f7;
    border-color: #cbd5e0;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  svg {
    margin-bottom: 8px;
  }

  span {
    font-size: 12px;
    font-weight: 500;
    color: #4a5568;
  }
`;

export const BooleanOperationsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
`;

export const BooleanButton = styled.button<{ disabled?: boolean }>`
  padding: 8px 12px;
  background: ${props => props.disabled ? '#f7fafc' : '#3182ce'};
  color: ${props => props.disabled ? '#a0aec0' : '#ffffff'};
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: #2c5aa0;
  }

  &:disabled {
    opacity: 0.6;
  }
`;

export const HistoryControls = styled.div`
  display: flex;
  gap: 8px;
`;

export const HistoryButton = styled.button<{ disabled?: boolean }>`
  flex: 1;
  padding: 10px;
  background: ${props => props.disabled ? '#f7fafc' : '#48bb78'};
  color: ${props => props.disabled ? '#a0aec0' : '#ffffff'};
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: #38a169;
  }

  &:disabled {
    opacity: 0.6;
  }
`;

export const Canvas = styled.div`
  flex: 1;
  position: relative;
  background: #ffffff;
  overflow: hidden;
  cursor: crosshair;
`;

export const CanvasShape = styled.div<{ 
  selected: boolean; 
  isDragging?: boolean;
}>`
  position: absolute;
  cursor: ${props => props.isDragging ? 'grabbing' : 'grab'};
  transition: ${props => props.isDragging ? 'none' : 'transform 0.1s ease'};
  transform: ${props => props.selected ? 'scale(1.05)' : 'scale(1)'};
  
  &::after {
    content: '';
    position: absolute;
    top: -4px;
    left: -4px;
    right: -4px;
    bottom: -4px;
    border: 2px solid #3182ce;
    border-radius: inherit;
    opacity: ${props => props.selected ? 1 : 0};
    transition: opacity 0.2s ease;
    pointer-events: none;
  }

  &:hover::after {
    opacity: 0.5;
  }
`;

export const StatusBar = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 32px;
  background: #2d3748;
  color: #e2e8f0;
  display: flex;
  align-items: center;
  padding: 0 16px;
  font-size: 12px;
  gap: 16px;
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
  opacity: ${props => props.visible ? 1 : 0};
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
  opacity: ${props => props.isActive ? 1 : 0};
  left: ${props => Math.min(props.startX, props.endX)}px;
  top: ${props => Math.min(props.startY, props.endY)}px;
  width: ${props => Math.abs(props.endX - props.startX)}px;
  height: ${props => Math.abs(props.endY - props.startY)}px;
  z-index: 1000;
  transition: none;
  
  ${props => props.isActive && `
    border-color: #2563eb;
    background: rgba(37, 99, 235, 0.15);
  `}
`;

export const ResizeHandle = styled.div<{ 
  position: 'nw' | 'ne' | 'sw' | 'se' | 'n' | 's' | 'e' | 'w';
  visible: boolean;
}>`
  position: absolute;
  width: 8px;
  height: 8px;
  background: #3182ce;
  border: 2px solid #ffffff;
  border-radius: 50%;
  cursor: ${props => {
    switch (props.position) {
      case 'nw': return 'nw-resize';
      case 'ne': return 'ne-resize';
      case 'sw': return 'sw-resize';
      case 'se': return 'se-resize';
      case 'n': return 'n-resize';
      case 's': return 's-resize';
      case 'e': return 'e-resize';
      case 'w': return 'w-resize';
      default: return 'pointer';
    }
  }};
  opacity: ${props => props.visible ? 1 : 0};
  transition: opacity 0.2s ease;
  z-index: 10;

  ${props => {
    switch (props.position) {
      case 'nw': return 'top: -6px; left: -6px;';
      case 'ne': return 'top: -6px; right: -6px;';
      case 'sw': return 'bottom: -6px; left: -6px;';
      case 'se': return 'bottom: -6px; right: -6px;';
      case 'n': return 'top: -6px; left: 50%; transform: translateX(-50%);';
      case 's': return 'bottom: -6px; left: 50%; transform: translateX(-50%);';
      case 'e': return 'top: 50%; right: -6px; transform: translateY(-50%);';
      case 'w': return 'top: 50%; left: -6px; transform: translateY(-50%);';
      default: return '';
    }
  }}

  &:hover {
    background: #2c5aa0;
    transform: ${props => {
      const base = props.position === 'n' || props.position === 's' ? 'translateX(-50%)' : 
                   props.position === 'e' || props.position === 'w' ? 'translateY(-50%)' : '';
      return base ? `${base} scale(1.2)` : 'scale(1.2)';
    }};
  }
`;
