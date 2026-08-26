// src/components/Layout.jsx
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "material-icons/iconfont/material-icons.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Tooltip } from "bootstrap";
import { isAuthenticated } from "../functions/general/Auth";

import Aside from "./Aside";
import Header from "./Header";
import Footer from "./Footer";
import PermissionGuard from "../functions/permissions/PermissionGuard";

import "../index.css";

export default function Layout({ children }) {
  const [authChecked, setAuthChecked] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false); //  control del sidebar en móvil

  useEffect(() => {
    if (!isAuthenticated()) {
      window.location.href = "/src/pages/login/index.html";
    } else {
      setAuthChecked(true);
    }
  }, []);

  useEffect(() => {
    const tooltipTriggerList = document.querySelectorAll(
      '[data-bs-toggle="tooltip"]'
    );
    [...tooltipTriggerList].forEach((el) => new Tooltip(el));
  }, []);

  if (!authChecked) return null;

  return (
    <div className="d-flex color_fondo">
      {/* SIDEBAR */}
      <div
        className={`sidebar-container bg-light border-end ${
          showSidebar ? "d-block" : "d-none d-md-block"
        }`}
        style={{
          width: "250px",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          zIndex: 1050,
          transition: "all 0.3s ease-in-out",
        }}
      >
        <Aside />
      </div>

      {/* MAIN CONTENT */}
      <div
        className={`main-content d-flex flex-column ${
          showSidebar ? "sidebar-visible" : "sidebar-hidden"
        }`}
      >
        <Header onToggleSidebar={() => setShowSidebar(!showSidebar)} />

        <div className="container-fluid mt-3 px-3">
          <div className="row">
            <div className="col-12 col-md-12 col-lg-12 mx-auto">
              <main>
                <PermissionGuard>{children}</PermissionGuard>
              </main>
            </div>
          </div>
        </div>

        <Footer />
      </div>

      {/* OVERLAY OSCURO PARA MÓVIL */}
      {showSidebar && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-md-none"
          style={{ zIndex: 1040 }}
          onClick={() => setShowSidebar(false)}
        ></div>
      )}
    </div>
  );
}
