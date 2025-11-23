import React from "react";
import mastercardLogo from "../assets/mastercard.png"; // Ajusta la ruta a tu logo

export default function CardPreview({
  nombre = "Alice Smith",
  numero = "**** **** **** 5678",
  saldo = "$7,890",
  vence = "09/29",
  tipo = "Master Platinum",
}) {
  return (
    <div
      className="p-4 rounded-4 shadow-lg mb-4 w-100"
      style={{
        background: "#0A3E63",
        color: "white",
        minHeight: "220px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ícono superior izquierda */}
      <div className="d-flex align-items-center gap-2">
        <span
          className="material-icons"
          style={{
            fontSize: "28px",
            opacity: 0.8,
          }}
        >
          credit_card
        </span>

        <h5 className="mb-0 fw-bold">{tipo}</h5>
      </div>

      {/* Logo Mastercard */}
      <img
        src={mastercardLogo}
        alt="mastercard"
        style={{
          width: "60px",
          position: "absolute",
          top: "20px",
          right: "20px",
          borderRadius: "4px",
        }}
      />

      {/* Saldo */}
      <h3 className="mt-4 fw-bold">{saldo}</h3>

      {/* Número */}
      <h5 className="mt-2 mb-0">{numero}</h5>

      <div className="mt-3 d-flex justify-content-between">
        <div>
          <small className="opacity-75">CARD HOLDER</small>
          <br />
          <strong>{nombre}</strong>
        </div>

        <div className="text-end">
          <small className="opacity-75">EXPIRES</small>
          <br />
          <strong>{vence}</strong>
        </div>
      </div>

      {/* Círculo decorativo */}
      <div
        style={{
          width: "180px",
          height: "180px",
          borderRadius: "50%",
          background: "rgba(240,240,255,0.08)",
          position: "absolute",
          bottom: "-40px",
          right: "-20px",
        }}
      ></div>
    </div>
  );
}
