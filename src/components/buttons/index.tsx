import styled from "styled-components";

export const Button = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 16px;
  background-color: #f4f4f4;
  color: white;
  cursor: pointer;

  &:hover {
    background-color: #e9e9e9;
  }
`;

export const IconButton = styled(Button)`
  display: flex;
  align-items: center;
  padding: 12px;
  text-decoration: none;
  color: #2d3748;
  font-weight: 500;
  background-color: #f4f4f4;
  &:hover {
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
    color: #1a202c;
  }

  svg {
    margin-right: 8px;
  }
`;
