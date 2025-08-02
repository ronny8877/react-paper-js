import styled from "styled-components";

export const Button = styled.button<{ active?: boolean; disabled?: boolean }>`
  padding: 12px;
  border: none;
  width: 100%;
  border-radius: 16px;
  background-color: ${({ active }) => (active ? "#2d2a2e" : "#f4f4f4;")};
  color: ${({ active }) => (active ? "#ffffff" : "#4a5568")};
  cursor: pointer;

  transition:
    background-color 0.2s ease,
    color 0.2s ease;

  &:disabled {
    background-color: #e2e8f0;
    color: #a0aec0;
    cursor: not-allowed;
  }

  &:hover {
    background-color: ${({ active }) => (active ? "#3e3a3f" : "#e2e8f0")};
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
    color: ${({ active }) => (active ? "#ffffff" : "#2d3748")};
  }
`;

export const IconButton = styled(Button)<{
  align?: "left" | "right" | "center";
}>`
  display: flex;
  align-items: center;
  justify-content: ${({ align }) =>
    align === "left"
      ? "flex-start"
      : align === "right"
        ? "flex-end"
        : "center"};
  text-decoration: none;
  font-weight: 500;

  svg {
    margin-right: 8px;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  gap: 8px;
  flex-wrap: nowrap;
  justify-content: center;
  margin: 16px 0;
`;
