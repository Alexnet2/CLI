import React from "react";
import ReactDom from "react-dom";
import App from "./src/App";
import "@css/global.css"

ReactDom.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
