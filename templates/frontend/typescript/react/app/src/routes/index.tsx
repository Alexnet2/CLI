import { Home } from "../../app/src/pages";
import React from "react";
import {Route,Switch } from "react-router-dom";

export default () => {
  return (
    <Switch>
      <Route path="/" exact component={Home} />
    </Switch>
  );
};
