import React from 'react';
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router-dom';

import { logout } from '../../utils/auth';

import './style.scss';

export default function Header() {

  const history = useHistory();

  function handleLogout() {
    logout();
    history.push('/login');
  }

  return (
    <header>
      <div className="header-container">
        <h1>Cadastro de cliente</h1>
        <Button variant="outlined" color="secondary" onClick={handleLogout}>Logout</Button>
      </div>
    </header>
  );
}
