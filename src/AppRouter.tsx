import React from 'react';
import {
  HashRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import { Gallery } from './gallery';
import { Playground } from './playground';

function AppRouter() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Gallery} />
        <Route path="/playground/:file?" component={Playground} />
        <Route path="/playground/:file/**" component={Playground} />
        <Route path="*">
          <Redirect to="/" />
        </Route>
      </Switch>
    </Router>
  );
}

export default AppRouter;
