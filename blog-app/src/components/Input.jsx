import styled from "styled-components";

const Input = styled.input`
  padding: 10px;
  border: ${(props) => props.border || "1px solid #ccc"};
  border-radius: 4px;
  min-width: 500px;

  &:focus {
    outline: none;
    border: ${(props) => props.border || "1px solid blue"};
  }
`;

export default Input;
