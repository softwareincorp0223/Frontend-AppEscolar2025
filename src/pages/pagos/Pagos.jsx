import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import Form from "../../components/Form";
import ActionButtons from "../../components/ActionButtons";
import CardPreview from "../../components/CardPreview";
import { obtenerNiveles, handleDelete, handleSave } from "../../functions/NivelesActions";

export default function Pagos() {

  const [selectedMethod, setSelectedMethod] = useState("tarjeta");
  const [niveles, setNiveles] = useState([]);
  const [editingNivel, setEditingNivel] = useState(null);

  // Campos dinámicos según el método de pago
  const paymentFields = {
    tarjeta: [
      { name: "nombre", label: "Nombre del titular", required: true },
      { name: "numero_tarjeta", label: "Número de tarjeta", required: true, type: "text" },
      { name: "mes", label: "Mes", required: true, type: "number" },
      { name: "anio", label: "Año", required: true, type: "number" },
      { name: "cvv", label: "CVV", required: true, type: "password" },
    ],

    transferencia: [
      { name: "banco", label: "Banco", type: "text", required: true },
      { name: "numero_referencia", label: "Número de referencia", required: true },
    ],

    efectivo: [
      { name: "persona_recibe", label: "Persona que recibe", required: true },
    ],
  };

  const handlePaymentSubmit = (values) => {
    console.log("Datos enviados:", values);
    alert("Pago procesado correctamente");
  };

  useEffect(() => {
    obtenerNiveles(setNiveles);
  }, []);



  return (
    <Layout>
      <div className="container-fluid py-4 py-lg-4">
        <div className="row g-4 g-lg-4">
          <div className="col-lg-6">
            <h5 className="mb-3">Método de pago</h5>

            <div className="d-flex gap-3 mb-4">
              <button
                className={`btn ${selectedMethod === "tarjeta" ? "btn-primary" : "btn-outline-primary"}`}
                onClick={() => setSelectedMethod("tarjeta")}
              >
                Tarjeta
              </button>

              <button
                className={`btn ${selectedMethod === "transferencia" ? "btn-primary" : "btn-outline-primary"}`}
                onClick={() => setSelectedMethod("transferencia")}
              >
                Transferencia
              </button>

              <button
                className={`btn ${selectedMethod === "efectivo" ? "btn-primary" : "btn-outline-primary"}`}
                onClick={() => setSelectedMethod("efectivo")}
              >
                Efectivo
              </button>
            </div>

            {/* Form dinámico */}
            <Form
              title="Detalles del Pago"
              fields={paymentFields[selectedMethod]}
              onSubmit={handlePaymentSubmit}
              columns={2}
            />

          </div>
          <div className="col-lg-6">
            <CardPreview
              nombre="Alice Smith"
              numero="**** **** **** 5678"
              saldo="$7,890"
              vence="09/29"
              tipo="Master Platinum"
            />
            <div className="card border mt-3">
              <div className="card-body">
                <h6 className="fw-bold">Resumen</h6>

                <div className="d-flex justify-content-between">
                  <span>Servicio:</span>
                  <strong>Cobro mensual</strong>
                </div>

                <div className="d-flex justify-content-between">
                  <span>Monto:</span>
                  <strong>$450.00 MXN</strong>
                </div>

                <div className="d-flex justify-content-between border-top mt-2 pt-2">
                  <span>Total:</span>
                  <strong className="text-success">$450.00 MXN</strong>
                </div>
              </div>
              <div className="card-footer">
                <button className="btn btn-success w-100 mt-4 py-2">
                  Confirmar Pago
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout >

  );
}
