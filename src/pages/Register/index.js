import React, { useState } from "react";
import { TextField, Button } from "@material-ui/core";
import { Link, useHistory } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

import api from "../../services/api";

import "./styles.scss";

export default function Login() {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const history = useHistory();

  async function handleRegister(event) {
    event.preventDefault();

    const data = {
      email,
      username: email,
      firstName: name,
      lastName,
      password,
    };

    try {
      await api.post("api/register/", data);
      history.push("/login");
    } catch (error) {
      alert("Erro ao cadastrar! Tente novamente");
    }
  }

  return (
    <div className="register-container">
      <div className="image"></div>
      <div className="form">
        <form onSubmit={handleRegister}>
          <TextField
            label="Nome"
            variant="outlined"
            style={{ marginBottom: 8 }}
            type="text"
            fullWidth
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <TextField
            label="Sobrenome"
            variant="outlined"
            style={{ marginBottom: 8 }}
            type="text"
            fullWidth
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
          />
          <TextField
            label="E-mail"
            variant="outlined"
            style={{ marginBottom: 8 }}
            type="email"
            fullWidth
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <TextField
            label="Senha"
            variant="outlined"
            style={{ marginBottom: 8 }}
            type="password"
            fullWidth
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <TextField
            label="Confirme sua senha"
            variant="outlined"
            style={{ marginBottom: 8 }}
            type="password"
            fullWidth
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
          />
          <Button
            size="large"
            variant="contained"
            color="secondary"
            type="submit"
            fullWidth
          >
            Cadastrar
          </Button>
          <Link className="link" to="/login">
            <FiArrowLeft size={16} color="#F50057" />
            Já sou cadastrado
          </Link>
        </form>
      </div>
    </div>
  );
}
