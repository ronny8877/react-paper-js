import styled from "styled-components";

export const Divider = styled.div`
  height: 1px;
  background-color: #e2e8f0;
  margin: 0;
  width: 100%;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1);
`;

export const DividerVertical = styled.div`
  width: 1px;
  background-color: #e2e8f0;
  height: 100%;
  box-shadow: inset 1px 0 0 rgba(255, 255, 255, 0.1);
  margin: 0;
  display: inline-block;
  vertical-align: middle;
`;
