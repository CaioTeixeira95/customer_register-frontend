import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

import Customer from './pages/Customer';
import Login from './pages/Login';
import Register from './pages/Register';

import { isAuthenticated } from './utils/auth';

export default function Router() {

  const privateRoute = isAuthenticated() ? <Route path="/" exact component={Customer}/> : <Redirect to="/login" />
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        {privateRoute}
      </Switch>
    </BrowserRouter>
  )
}
