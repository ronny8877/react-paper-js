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
