import React from "react";

export default function Loader({
  title = "Cargando...",
  titleClass = "fs-5",
}) {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center py-5">
      
      {/* TITULO */}
      <h5 className={`fw-bold text-secondary mb-4 ${titleClass}`}>
        {title}
      </h5>

      {/* SPINNER */}
      <div
        className="spinner-border text-primary"
        role="status"
        style={{
          width: "3rem",
          height: "3rem",
        }}
      >
        <span className="visually-hidden">
          Loading...
        </span>
      </div>
    </div>
  );
}