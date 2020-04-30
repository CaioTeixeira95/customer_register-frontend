import React, { useState } from 'react';
import { TextField, Button } from '@material-ui/core';
import { Link, useHistory } from 'react-router-dom';
import { FiLogIn } from 'react-icons/fi';

import api from '../../services/api';
import { login } from '../../utils/auth';

import './styles.scss';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const history = useHistory();

  async function handleLogin(event) {
    event.preventDefault();

    const data = {
      username: email,
      password
    }

    try {
      const { data: { token, name } } = await api.post('api-token-auth/', data);
      login(token);
      localStorage.setItem('name', name);

      history.push('/');
    } catch (error) {
      alert('Usuário ou senha inválidos!');
    }


  }

  return (
    <div className="login-container">
      <div className="image"></div>
      <div className="form">
        <h3>Faça seu login</h3>
        <form onSubmit={handleLogin}>
          <TextField
            label="E-mail"
            variant="outlined"
            style={{marginBottom: 8}}
            type="email"
            value={email}
            onChange={event => setEmail(event.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Senha"
            variant="outlined"
            style={{marginBottom: 8}}
            type="password"
            value={password}
            onChange={event => setPassword(event.target.value)}
            required
            fullWidth
          />
          <Button size="large" type="submit" variant="contained" color="secondary" fullWidth>
            Login
          </Button>
          <Link className="link" to="/register">
            <FiLogIn size={16} color="#F50057" />
            Não tenho cadastro
          </Link>
        </form>
      </div>
    </div>
  )
}
