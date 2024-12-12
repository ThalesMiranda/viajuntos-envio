import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import LoginInput from "../components/LoginInput";
import FormFrame from "../components/FormFrame";
import Logo from "../imagens/Logo_Viajuntos.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/login",
        { email, password },
        { withCredentials: true } // Habilitar cookies
      );
      alert(response.data.message);
      navigate("/home");
      setError(false);
    } catch (error) {
      setError(true);
    }
  };

  const goToRegister = () => {
    navigate("/register");
  };

  return (
    <FormFrame>
      <img src={Logo} width={250} alt="Descrição da imagem" />
      <h2>Login</h2>

      {error && (
        <p
          style={{
            color: "red",
            marginBottom: "10px",
            maxWidth: "250px",
            textAlign: "center",
          }}
        >
          Usuário ou senha incorretos. Preencha todos os campos.
        </p>
      )}

      <LoginInput
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <LoginInput
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button onClick={handleLogin}>Login</Button>
      <Button onClick={goToRegister}>Criar Conta</Button>
    </FormFrame>
  );
};

export default Login;
