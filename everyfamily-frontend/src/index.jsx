import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./AuthContext.jsx";
import { ConfigProvider } from "antd";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")).render(
    <ConfigProvider
        theme={{
            token: {
                colorPrimary: "#92278F",
            },
        }}
    >
        <StrictMode>
            <BrowserRouter>
                <AuthProvider>
                    <App />
                </AuthProvider>
            </BrowserRouter>
        </StrictMode>
    </ConfigProvider>
);