import loadable from '@loadable/component';
import React from 'react';
import {
  HashRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';

// react-router code-splitting
// https://reacttraining.com/react-router/web/guides/code-splitting
let Gallery = loadable(async () => {
  return (await import('./gallery')).Gallery;
});
let Playground = loadable(async () => {
  return (await import('./playground')).Playground;
});

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
