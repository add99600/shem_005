import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, useRoutes } from "react-router-dom";
import AppRoute from "./config/app-route.jsx";
import { MenuProvider } from "./contexts/MenuContext.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { DataManager } from "hanawebcore-frontend";
// bootstrap
import "bootstrap";

// css
import "@fortawesome/fontawesome-free/css/all.css";
import "react-perfect-scrollbar/dist/css/styles.css";
import "./index.css";
import "./scss/react.scss";
import "react-quill/dist/quill.snow.css";

const container = document.getElementById("root");
const root = createRoot(container);
function App() {
  let element = useRoutes(AppRoute);

  return element;
}

root.render(
  <BrowserRouter>
    <AuthProvider>
      <MenuProvider>
        <DataManager
          endpoint="http://localhost:5000/api/gcm/gcm_code_data"
          requesttype="get"
          where={{
            TOP_MENU: "Front메뉴",
          }}
        >
          <App />
        </DataManager>
      </MenuProvider>
    </AuthProvider>
  </BrowserRouter>
);
