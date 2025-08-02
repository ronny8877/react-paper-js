import styled from "styled-components";
import { Button, IconButton } from "../buttons";
import { H2, Title } from "../typography";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useCallback, useState } from "react";
import { Divider } from "../misc/divier";
import {
  IconCircle,
  IconJoinBevel,
  IconLayersIntersect,
  IconMenu2,
  IconMinus,
  IconPlus,
  IconPolygon,
  IconSquare,
  IconSquare9,
  IconSquareRoundedLetterT,
  IconTriangle,
} from "@tabler/icons-react";
import { appStore, type BooleanOperation } from "../../store/app-store";
import { observer } from "mobx-react-lite";

const SideBarContainer = styled.nav<{
  width: string;
  variant?: "floating" | "default";
}>`
  width: ${({ width }) => width};
  height: ${({ variant }) =>
    variant === "floating" ? "calc(100vh - 100px)" : "100vh"};
  background-color: #fff;
  border: 1px solid #d0d0d0;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  padding: 16px;
  border-radius: ${({ variant }) => (variant === "floating" ? "16px" : "0")};
  margin-top: ${({ variant }) => (variant === "floating" ? "20px" : "0")};
  margin-left: ${({ variant }) => (variant === "floating" ? "10px" : "0")};
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: width 0.3s ease;
  overflow: hidden;
  svg {
    width: 24px;
    height: 24px;
    fill: #4a5568;
  }
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

export const NavHeader = styled.div<{ open: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  gap: 8px;
  svg {
    width: 24px;
    height: 24px;
    fill: #4a5568;
  }
`;

export const SideBarTitle = styled(Title)<{ open: boolean }>`
  display: ${({ open }) => (open ? "block" : "none")};
  /* TThis is a valid css property yet the extension says otherwise */
  text-wrap: nowrap;
`;
export const SideBarTrigger = styled(Button)`
  width: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 20px;
  background-color: #000;
  color: #fff;
  cursor: pointer;
  transition: background-color 0.2s ease;
  &:hover {
    background-color: #2d2a2e;
  }
  svg {
    width: 20px;
    height: 20px;
    fill: #4a5568;
  }
`;

export const SideBarButton = styled(IconButton)<{ isOpen: boolean }>`
  padding: ${({ isOpen }) => (isOpen ? "12px 16px" : "12px 2px")};
  display: flex;
  align-items: center;
  justify-content: ${({ isOpen }) => (isOpen ? "flex-start" : "center")};
  // Hide the span if we are not open
  span {
    display: ${({ isOpen }) => (isOpen ? "inline" : "none")};
    margin-left: 8px;
    font-size: 14px;
    color: #4a5568;
  }
  svg {
    padding: 0;
    margin: 0;
    width: ${({ isOpen }) => (isOpen ? "24px" : "28px")};
    height: ${({ isOpen }) => (isOpen ? "24px" : "28px")};
    fill: #4a5568;
    transition:
      width 0.2s ease,
      height 0.2s ease;
  }
`;

export const SideBarLabel = styled(H2)<{ isOpen: boolean }>`
  display: ${({ isOpen }) => (isOpen ? "block" : "none")};
  white-space: nowrap;
`;

export const SideBarGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 16px;
  padding: 8px;
`;

export default observer(function AppSidebar() {
  //For smoother animations
  const [animationParent] = useAutoAnimate();
  const [sideBarOpen, setSideBarOpen] = useState(true);

  const handleBooleanOperation = useCallback(
    async (operation: BooleanOperation) => {
      await appStore.performBooleanOperation(operation);
    },
    [],
  );

  const handleAddShape = useCallback(
    (type: "circle" | "rectangle" | "triangle") => {
      // Add shape at center of canvas
      appStore.addShape(type, { x: 300, y: 300 });
    },
    [],
  );

  return (
    <SideBarContainer
      variant="floating"
      width={sideBarOpen ? "250px" : "60px"}
      ref={animationParent}
    >
      <NavHeader open={sideBarOpen}>
        {sideBarOpen && <IconPolygon />}
        <SideBarTitle open={sideBarOpen}>Poly Editor</SideBarTitle>
        <SideBarTrigger onClick={() => setSideBarOpen(!sideBarOpen)}>
          <IconMenu2 />
        </SideBarTrigger>
      </NavHeader>
      <Divider />
      <SideBarGroup>
        <SideBarLabel isOpen={sideBarOpen}>Shapes</SideBarLabel>
        <SideBarButton
          onClick={() => handleAddShape("rectangle")}
          isOpen={sideBarOpen}
        >
          <IconSquare fill="none" />
          <span> Rectangle</span>
        </SideBarButton>
        <SideBarButton
          onClick={() => handleAddShape("circle")}
          isOpen={sideBarOpen}
        >
          <IconCircle fill="none" />
          <span> Circle</span>
        </SideBarButton>
        <SideBarButton
          onClick={() => handleAddShape("triangle")}
          isOpen={sideBarOpen}
        >
          <IconTriangle fill="none" />
          <span> Triangle</span>
        </SideBarButton>
      </SideBarGroup>
      <Divider />
      <SideBarGroup>
        <SideBarLabel isOpen={sideBarOpen}> Operations</SideBarLabel>

        <SideBarButton
          onClick={() => handleBooleanOperation("union")}
          isOpen={sideBarOpen}
        >
          <IconPlus fill="none" />
          <span> Union</span>
        </SideBarButton>
        <SideBarButton
          onClick={() => handleBooleanOperation("subtract")}
          isOpen={sideBarOpen}
        >
          <IconMinus fill="none" />
          <span> Subtract</span>
        </SideBarButton>
        <SideBarButton
          onClick={() => handleBooleanOperation("intersect")}
          isOpen={sideBarOpen}
        >
          <IconLayersIntersect fill="none" />
          <span> Intersect</span>
        </SideBarButton>
        <SideBarButton
          onClick={() => handleBooleanOperation("difference")}
          isOpen={sideBarOpen}
        >
          <svg
            version="1.1"
            id="Capa_1"
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            viewBox="0 0 58 58"
          >
            <g>
              <g>
                <polygon points="42,16 42,0 0,0 0,42 16,42 16,16 		" />
                <polygon points="42,16 42,42 16,42 16,58 58,58 58,16 		" />
              </g>
              <rect x="16" y="16" width="26" height="26" />
            </g>
          </svg>
          <span> Exclude</span>
        </SideBarButton>
      </SideBarGroup>
    </SideBarContainer>
  );
});
