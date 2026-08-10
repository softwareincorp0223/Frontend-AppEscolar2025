import { useState } from "react";
import recoveryImage from "../../assets/AppEscolar-RecuperarContraseña-01.jpg";
import { resetPassword } from "../../functions/general/Auth";

export default function RecuperarPassword() {
  const [correo, setCorreo] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await resetPassword(correo);
      setMessage(
        response.message || "Se envio una nueva contraseña al correo registrado"
      );
    } catch (err) {
      setError(err.message || "No se pudo restaurar la contraseña");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-vh-100 bg-white">
      <div className="container-fluid px-3 px-lg-4 py-3">
        <div className="row g-0 min-vh-100 align-items-center">
          <div className="col-12 col-lg-6 col-xl-6">
            <div
              className="overflow-hidden"
              style={{
                borderRadius: "6px",
                height: "calc(100vh - 40px)",
                minHeight: "560px",
              }}
            >
              <img
                src={recoveryImage}
                alt="Aplicacion Escolar"
                className="w-100 h-100"
                style={{ objectFit: "cover", objectPosition: "center" }}
              />
            </div>
          </div>

          <div className="col-12 col-lg-6 col-xl-6">
            <section
              className="mx-auto text-start"
              style={{ maxWidth: "370px", padding: "32px 0" }}
            >
              <h1
                className="fw-bold mb-3"
                style={{ color: "#18345f", fontSize: "24px" }}
              >
                Recuperar contraseña
              </h1>
              <p
                className="mb-5"
                style={{ color: "#8d80a7", fontSize: "16px", lineHeight: "25px" }}
              >
                Ingresa tu correo, se te enviara una contraseña provisional
              </p>

              <form onSubmit={handleSubmit}>
                <input
                  type="email"
                  placeholder="Email"
                  className="form-control mb-4"
                  value={correo}
                  onChange={(event) => setCorreo(event.target.value)}
                  required
                  style={{
                    height: "40px",
                    borderRadius: "6px",
                    fontSize: "14px",
                    color: "#18345f",
                  }}
                />

                {message && (
                  <p className="text-success text-center small mb-3">{message}</p>
                )}
                {error && (
                  <p className="text-danger text-center small mb-3">{error}</p>
                )}

                <button
                  type="submit"
                  className="btn btn-primary-def text-white fw-bold w-100 mb-4 p-2"
                  style={{
                    height: "48px",
                    borderRadius: "6px",
                    fontSize: "13px",
                  }}
                  disabled={loading}
                >
                  {loading ? "ENVIANDO..." : "ENVIAR"}
                </button>

                <p className="text-center mb-0" style={{ color: "#8d80a7" }}>
                  Tengo una cuenta{" "}
                  <a
                    href="/"
                    className="fw-bold text-decoration-none"
                    style={{ color: "#e91e63" }}
                  >
                    Iniciar Sesion
                  </a>
                </p>
              </form>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
