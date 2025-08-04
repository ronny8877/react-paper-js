import styled from "styled-components";
import { H2, Title } from "./typography";
import { Button, IconButton } from "./button";

export const SideBarContainer = styled.nav<{
  width: string;
  variant?: "floating" | "default";
}>`
  position: relative;
  width: ${({ width }) => width};
  height: ${({ variant }) =>
    variant === "floating" ? "calc(100vh - 90px)" : "full"};
  background-color: #fff;
  /* border: 1px solid #d0d0d0; */
  box-shadow: ${({ variant }) =>
    variant === "floating" ? "0 4px 6px rgba(0, 0, 0, 0.1)" : "none"};
  padding: ${({ variant }) => (variant === "floating" ? "20px" : "10px")};
  border-radius: ${({ variant }) => (variant === "floating" ? "16px" : "0")};
  margin-top: ${({ variant }) => (variant === "floating" ? "24px" : "0")};
  margin-left: ${({ variant }) => (variant === "floating" ? "10px" : "0")};
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: width 0.3s ease;
  overflow: hidden;
  svg {
    width: 24px;
    height: 24px;
    /* fill: #4a5568; */
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
    /* fill: #4a5568; */
  }
`;

export const SideBarTitle = styled(Title)<{ open: boolean }>`
  display: ${({ open }) => (open ? "block" : "none")};
  /* TThis is a valid css property yet the extension says otherwise */
  text-wrap: nowrap;
`;
export const SideBarTrigger = styled(Button)<{ open?: boolean }>`
  width: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8 20;
  margin: auto;
  background-color: #000;
  color: #fff;
  cursor: pointer;
  transition: background-color 0.2s ease;
  &:hover {
    background-color: #2d2a2e;
    color: #fff;
  }
  svg {
    width: 20px;
    height: 20px;
    /* fill: #4a5568; */
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
    /* fill: #4a5568; */
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

export const SideBarFooter = styled(SideBarGroup)`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
`;
