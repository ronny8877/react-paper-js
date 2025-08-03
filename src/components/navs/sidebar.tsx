import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useCallback, useState } from "react";
import { Divider } from "../ui/divier";
import {
  IconCircle,
  IconLayersIntersect,
  IconMenu2,
  IconMinus,
  IconPlus,
  IconPolygon,
  IconSquare,
  IconTree,
  IconTriangle,
} from "@tabler/icons-react";
import { type BooleanOperation } from "../../store/editor-store";
import { observer } from "mobx-react-lite";
import {
  NavHeader,
  SideBarButton,
  SideBarContainer,
  SideBarGroup,
  SideBarLabel,
  SideBarTitle,
  SideBarTrigger,
} from "../ui/sidebar";
import { appStore } from "../../store/app-store";

//Sidebar
export default observer(function AppSidebar() {
  //For smoother animations
  const [animationParent] = useAutoAnimate();
  const [sideBarOpen, setSideBarOpen] = useState(false);

  const handleBooleanOperation = useCallback(
    async (operation: BooleanOperation) => {
      await appStore.editorStore.performBooleanOperation(operation);
    },
    [],
  );

  const handleAddShape = useCallback(
    (type: "circle" | "rectangle" | "triangle" | "tree") => {
      // Add shape at center of canvas
      appStore.editorStore.addShape(type, { x: 300, y: 300 });
    },
    [],
  );

  const sideBarWidth =
    appStore.sideBarConfig.variant === "floating" ? "300px" : "350px";
  const collapseWidth =
    appStore.sideBarConfig.variant === "floating" ? "60px" : "80px";
  return (
    <SideBarContainer
      variant={appStore.sideBarConfig.variant}
      width={sideBarOpen ? sideBarWidth : collapseWidth}
      ref={animationParent}
    >
      <NavHeader open={sideBarOpen}>
        {sideBarOpen && <IconPolygon />}
        <SideBarTitle open={sideBarOpen}>Poly Editor</SideBarTitle>
        <SideBarTrigger
          open={sideBarOpen}
          onClick={() => setSideBarOpen(!sideBarOpen)}
        >
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
        <SideBarButton
          onClick={() => handleAddShape("tree")}
          isOpen={sideBarOpen}
        >
          <IconTree fill="none" />
          <span> Tree</span>
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
