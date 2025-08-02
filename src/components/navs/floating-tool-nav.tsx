import styled from "styled-components";

export const FloatingContainer = styled.nav`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: #ffffff;
  border-radius: 16px;
  height: 30px;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 10px 20px;

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: row;
    gap: 10px;
    border-radius: 32px;

    li {
      a {
        text-decoration: none;
        color: #1a202c;
        font-weight: bold;

        &:hover {
          color: #2d3748;
        }
      }
    }
  }
`;

export const FloatingToolNav = () => {
  return (
    <FloatingContainer>
      <ul>
        <li>
          <a href="#home">Home</a>
        </li>
        <li>
          <a href="#about">About</a>
        </li>
        <li>
          <a href="#services">Services</a>
        </li>
        <li>
          <a href="#contact">Contact</a>
        </li>
      </ul>
    </FloatingContainer>
  );
};
