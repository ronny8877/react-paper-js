import { observer } from "mobx-react-lite";
import {
  SideBarContainer,
  SideBarFooter,
  SideBarGroup,
  SideBarLabel,
  SideBarTitle,
} from "../ui/sidebar";
import React, { useCallback, useEffect, useState } from "react";
import { appStore } from "../../store/app-store";
import { Button, ButtonGroup, IconButton } from "../ui/button";
import { Divider } from "../ui/divier";
import { H2, P } from "../ui/typography";
import {
  IconArrowBack,
  IconArrowForward,
  IconCopy,
  IconDeviceFloppy,
} from "@tabler/icons-react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useDebounce } from "../../hooks/useDebounce";

export default observer(function UtilityWindow() {
  const [open, _] = useState(true);
  const [utilityAnimationParent] = useAutoAnimate<HTMLDivElement>();

  const [savedShapes, setSavedShapes] =
    useState<{ key: string; value: any }[]>();

  const debouncedColorChange = useDebounce((color: string) => {
    appStore.editorStore.updateSelectedShapeColor(color);
  }, 300);

  //Handle keyboard shortcuts for undo/redo and delete
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case "z":
          e.preventDefault();
          if (e.shiftKey) {
            appStore.editorStore.redo();
          } else {
            appStore.editorStore.undo();
          }
          break;
        case "y":
          e.preventDefault();
          appStore.editorStore.redo();
          break;
        case "d":
          e.preventDefault();
          appStore.editorStore.duplicateSelectedShape();
          break;
      }
    }

    // Handle delete key without modifiers
    if (e.key === "Delete" || e.key === "Backspace") {
      e.preventDefault();
      appStore.editorStore.deleteSelectedShapes();
    }
  }, []);

  // Add keyboard listeners FOR undo/redo and delete
  React.useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    const entries: { key: string; value: any }[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;
      const value = localStorage.getItem(key);

      // Optional: filter based on key prefix or value type
      if (key.startsWith("shapes-store-") && value) {
        entries.push({ key, value: JSON.parse(value) });
      }
    }
    setSavedShapes(entries);
  }, []);

  return (
    <>
      <SideBarContainer
        ref={utilityAnimationParent}
        variant={appStore.sideBarConfig.variant}
        width="380px"
      >
        <SideBarGroup>
          <SideBarTitle align="center" open={true}>
            Utility Window
          </SideBarTitle>
        </SideBarGroup>
        {appStore.editorStore.selectedShapes.length <= 0 && (
          <SideBarGroup>
            <Divider />
            <SideBarLabel isOpen={open}>UI / UX</SideBarLabel>
            {/* <Divider/> */}

            <P>Window Style</P>
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
            <Button onClick={() => appStore.editorStore.toggleGrid()}>
              {appStore.editorStore.canvasOptions.showGrid
                ? "Hide Grid"
                : "Show Grid"}
            </Button>
          </SideBarGroup>
        )}

        {appStore.editorStore.selectedShapes.length <= 0 && (
          <SideBarGroup>
            <Divider />
            <SideBarLabel isOpen={open}>Saved/Items</SideBarLabel>
            {/* <Divider/> */}

            {savedShapes && savedShapes.length > 0 ? (
              savedShapes.map((item) => (
                <Button
                  key={item.key}
                  onClick={() =>
                    appStore.editorStore.loadShapesFromLocalStorage(item.key)
                  }
                >
                  {new Date(parseInt(item.key.split("-")[2])).toLocaleString()}
                </Button>
              ))
            ) : (
              <P>No saved shapes found</P>
            )}
          </SideBarGroup>
        )}

        {appStore.editorStore.selectedShapes.length > 0 && (
          <SideBarGroup>
            <Divider />
            <SideBarLabel isOpen={open}>
              Shapes ({appStore.editorStore.shapes.length}){" "}
            </SideBarLabel>
            <P>
              Intersecting Shapes: {/* {appStore.editorStore.shapes..length} */}
            </P>
            <P>Selected Shapes: {appStore.editorStore.selectedShapes.length}</P>
          </SideBarGroup>
        )}
        {appStore.editorStore.selectedShapes.length > 0 && (
          <SideBarGroup>
            <Divider />
            {/* Options Like Chaing Color Delete etc */}
            <SideBarLabel isOpen={open}>Actions</SideBarLabel>

            <IconButton
              onClick={() => appStore.editorStore.deleteSelectedShapes()}
              disabled={appStore.editorStore.selectedShapes.length === 0}
            >
              <IconDeviceFloppy /> Delete
            </IconButton>
            <IconButton
              onClick={() => appStore.editorStore.duplicateSelectedShape()}
              disabled={appStore.editorStore.selectedShapes.length === 0}
            >
              <IconCopy /> Duplicate
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
          </SideBarGroup>
        )}

        {/* Footer */}
        <SideBarFooter>
          <ButtonGroup>
            <IconButton
              onClick={() => appStore.editorStore.undo()}
              disabled={!appStore.editorStore.canUndo}
            >
              <IconArrowBack fill="none" /> Undo
            </IconButton>
            <IconButton
              onClick={() => appStore.editorStore.redo()}
              disabled={!appStore.editorStore.canRedo}
            >
              <IconArrowForward fill="none" /> Redo
            </IconButton>
          </ButtonGroup>
          <IconButton
            onClick={() => appStore.editorStore.saveShapesToLocalStorage()}
          >
            <IconDeviceFloppy /> Save
          </IconButton>
          <IconButton
            onClick={() => appStore.editorStore.clearSelection()}
            disabled={appStore.editorStore.selectedShapes.length === 0}
          >
            <IconDeviceFloppy /> Clear Selection
          </IconButton>
        </SideBarFooter>
      </SideBarContainer>
    </>
  );
});
