import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ConfigProvider } from "antd";

createRoot(document.getElementById("root")).render(
  <ConfigProvider
    theme={{
      token: {
        colorPrimary: "#92278F",
      },
    }}
  >
    <StrictMode>
      <App />
    </StrictMode>
  </ConfigProvider>
);
