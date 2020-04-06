import React from 'react';
import { HashRouter as Router, Route } from 'react-router-dom';
import { Gallery } from './gallery';
import { Playground } from './playground';

function AppRouter() {
  return (
    <Router>
      <Route path="/" exact component={Gallery} />
      <Route path="/playground/:file?" component={Playground} />
    </Router>
  );
}

export default AppRouter;
