import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ConfigProvider } from "antd";
import theme from "./theme.js";

createRoot(document.getElementById("root")).render(
  <ConfigProvider theme={theme}>
    <StrictMode>
      <App />
    </StrictMode>
  </ConfigProvider>
);
