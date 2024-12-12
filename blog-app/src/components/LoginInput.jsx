import styled from "styled-components";

const LoginInput = styled.input`
  padding: 10px;
  border: ${(props) => props.border || "1px solid #ccc"};
  border-radius: 4px;
  min-width: 200px;

  &:focus {
    outline: none;
    border: ${(props) => props.border || "1px solid blue"};
  }
`;

export default LoginInput;
