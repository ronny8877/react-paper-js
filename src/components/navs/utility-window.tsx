import { observer } from "mobx-react-lite";
import {
  SideBarContainer,
  SideBarFooter,
  SideBarGroup,
  SideBarLabel,
  SideBarTitle,
} from "./sidebar";
import { useState } from "react";
import { appStore } from "../../store/app-store";
import { Button, ButtonGroup, IconButton } from "../buttons";
import { Divider } from "../misc/divier";
import { H2, P } from "../typography";
import {
  IconArrowBack,
  IconArrowForward,
  IconDeviceFloppy,
} from "@tabler/icons-react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useDebounce } from "../../hooks/useDebounce";

export default observer(function UtilityWindow() {
  const [open, setOpen] = useState(true);
  const [utilityAnimationParent] = useAutoAnimate<HTMLDivElement>();

  const debouncedColorChange = useDebounce((color: string) => {
    appStore.updateSelectedShapeColor(color);
  }, 100);

  return (
    <>
      <SideBarContainer
        ref={utilityAnimationParent}
        variant="default"
        width="350px"
      >
        <SideBarGroup>
          <SideBarTitle align="center" open={true}>
            Utility Window
          </SideBarTitle>
        </SideBarGroup>
        {appStore.selectedShapes.length <= 0 && (
          <SideBarGroup>
            <Divider />
            <SideBarLabel isOpen={open}>UI / UX</SideBarLabel>
            {/* <Divider/> */}

            <P>Sidebar Style</P>
            <Button
              onClick={() => appStore.setSideBarConfig({ variant: "floating" })}
              // disabled={appStore.sideBarConfig.variant === "floating"}
              active={appStore.sideBarConfig.variant === "floating"}
            >
              <span>Floating</span>
            </Button>
            <Button
              onClick={() => appStore.setSideBarConfig({ variant: "default" })}
              // disabled={appStore.sideBarConfig.variant === "default"}
              active={appStore.sideBarConfig.variant === "default"}
            >
              <span>Default</span>
            </Button>
            <P>Canvas Style</P>
            <Button onClick={() => appStore.toggleGrid()}>
              {appStore.canvasOptions.showGrid ? "Hide Grid" : "Show Grid"}
            </Button>
          </SideBarGroup>
        )}

        {appStore.selectedShapes.length > 0 && (
          <SideBarGroup>
            <Divider />
            <SideBarLabel isOpen={open}>
              Shapes ({appStore.shapes.length}){" "}
            </SideBarLabel>
            <P>Intersecting Shapes: {appStore.intersectingShapes.length}</P>
            <P>Selected Shapes: {appStore.selectedShapes.length}</P>
          </SideBarGroup>
        )}
        {appStore.selectedShapes.length > 0 && (
          <SideBarGroup>
            <Divider />
            {/* Options Like Chaing Color Delete etc */}
            <SideBarLabel isOpen={open}>Actions</SideBarLabel>

            <IconButton
              onClick={() => appStore.deleteSelectedShapes()}
              disabled={appStore.selectedShapes.length === 0}
            >
              <IconDeviceFloppy /> Delete
            </IconButton>
            <H2>Change Color</H2>
            <input
              type="color"
              onChange={(e) => debouncedColorChange(e.target.value)}
              style={{
                width: "100%",
                margin: "8px 0",
                borderRadius: "8px",
                padding: "8px",
                border: "1px solid #ccc",
                height: "40px",
              }}
            />
            {/* <IconButton onClick={() => appStore.toggleSelectionMode()} active={appStore.selectionMode}>
                    {appStore.selectionMode ? "Disable Selection" : "Enable Selection"}
                </IconButton>
                <IconButton onClick={() => appStore.toggleIntersectingShapes()} active={appStore.showIntersectingShapes}>
                    {appStore.showIntersectingShapes ? "Hide Intersecting Shapes" : "Show Intersecting Shapes"}
                </IconButton>
                <IconButton onClick={() => appStore.toggleSnapToGrid()} active={appStore.snapToGrid}>
                    {appStore.snapToGrid ? "Disable Snap to Grid" : "Enable Snap to Grid"}
                </IconButton> */}
          </SideBarGroup>
        )}

        {/* Footer */}
        <SideBarFooter>
          <ButtonGroup>
            <IconButton
              onClick={() => appStore.undo()}
              disabled={!appStore.canUndo}
            >
              <IconArrowBack fill="none" /> Undo
            </IconButton>
            <IconButton
              onClick={() => appStore.redo()}
              disabled={!appStore.canRedo}
            >
              <IconArrowForward fill="none" /> Redo
            </IconButton>
          </ButtonGroup>
          <IconButton>
            <IconDeviceFloppy /> Save
          </IconButton>
          <IconButton
            onClick={() => appStore.clearSelection()}
            disabled={appStore.selectedShapes.length === 0}
          >
            <IconDeviceFloppy /> Clear Selection
          </IconButton>
        </SideBarFooter>
      </SideBarContainer>
    </>
  );
});
