import React from 'react';
import { Dashboard, Login, PrivateRoute, AuthWrapper, Error } from './pages';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';

function App() {
  return (
    
      <Router>
        <Switch>

          <Route exact path="/">
            <Dashboard/>
          </Route>

          <Route path="*">
            <Error/>
          </Route>
        </Switch>
      </Router>
    
  );
}

export default App;
