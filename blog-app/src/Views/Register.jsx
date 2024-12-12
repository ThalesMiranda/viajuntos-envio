import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import FormFrame from "../components/FormFrame";
import Logo from "../imagens/Logo_Viajuntos.png";
import LoginInput from "../components/LoginInput";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const response = await axios.post("http://localhost:5000/register", {
        username,
        email,
        password,
      });
      setSuccess(true);
      alert(response.data.message);
      navigate("/");
    } catch (error) {
      alert(error);
      setSuccess(false);
    }
  };
  const goToLogin = () => {
    navigate("/");
  };

  return (
    <FormFrame>
      <img src={Logo} width={250} alt="Descrição da imagem" />
      <h2>Create Account</h2>
      <LoginInput
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <LoginInput
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <LoginInput
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {success && (
        <p
          style={{
            color: "green",
            marginBottom: "10px",
            maxWidth: "250px",
            textAlign: "center",
          }}
        >
          Usuário e senha cadastrados com sucesso!
        </p>
      )}
      <Button onClick={handleRegister}>Criar</Button>

      <Button onClick={goToLogin}>Já tenho uma conta</Button>
    </FormFrame>
  );
};

export default Register;
