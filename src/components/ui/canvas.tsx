import styled from "styled-components";

export const Canvas = styled.div<{ grid?: boolean }>`
  position: relative;
  width: 100%;
  height: 100%;
  background: #ffffff;
  overflow: hidden;
  border-radius: 16px;
  height: calc(100vh - 56px);
  margin-top: 28px;

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
