import React, { Suspense } from "react";
import Route from "./routes";
import { BrowserRouter as Router } from "react-router-dom";

export default () => {
  return (
      <Suspense fallback={<p>Loading</p>}>
        <Router>
          <Route />
        </Router>
      </Suspense>
  );
};
