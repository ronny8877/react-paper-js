import styled from "styled-components";

export const Title = styled.h1<{ align?: string }>`
  font-size: 24px;
  font-weight: 700;
  color: #2d3748;
  margin: 0;
  text-align: ${(props) => props.align || "left"};
`;

export const H2 = styled.h2<{ align?: string }>`
  font-size: 20px;
  font-weight: 600;
  color: #2d3748;
  margin: 0;
  text-align: ${(props) => props.align || "left"};
`;

export const P = styled.p`
  font-size: 16px;
  font-weight: 400;
  color: #4a5568;
  margin: 0;
  line-height: 1.5;
`;

export const AppTitle = styled(Title)`
  background: #fef9fa;
  width: 100%;
  margin-top: 8px;
  padding: 16px 0px;
  /* box-shadow: 0 2px 4px rgba(0,0,0,0.1); */
  border-bottom: 1px solid #eee;
  border-radius: 12px;
`;
