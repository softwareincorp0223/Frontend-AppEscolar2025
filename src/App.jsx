import { useState } from "react";
import logo from "./assets/logo_fondo.png";
import background from "./assets/1.png";
import "./index.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { login } from "./functions/general/Auth";
import { showAlert } from "./functions/general/Alerts";
//nuevos

export default function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const BASE_URL = window.location.hostname === "localhost" ? "" : "/sistema";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      await showAlert("success", "Sesion iniciada correctamente");
      window.location.href = `${BASE_URL}/src/pages/estadisticas/index.html`;
    } catch (err) {
      showAlert("error", err.message || "No se pudo iniciar sesion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex flex-column min-vh-100 text-center"
      style={{
        background: `url(${background}) no-repeat center center / cover`,
      }}
    >
      <div className="mt-4">
        <img
          src={logo}
          alt="Aplicacion Escolar"
          className="img-fluid"
          style={{ maxWidth: "350px", position: "relative", top: "70px" }}
        />
      </div>

      <div className="container flex-grow-1 d-flex justify-content-center align-items-center">
        <div
          className="card shadow-lg p-4 pb-0"
          style={{ maxWidth: "450px", width: "100%" }}
        >
          <div
            className="bg-primary-def rounded py-4 shadow-lg"
            style={{ position: "relative", top: "-55px" }}
          >
            <h4 className="text-white fw-bold mb-2">Iniciar sesion</h4>
            <p className="text-white small mb-0">BIENVENIDO A APLICACION ESCOLAR</p>
          </div>
          <div style={{ position: "relative", top: "-25px" }}>
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="Correo"
                className="form-control mb-3"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Contrasena"
                className="form-control mb-3"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="submit"
                className="btn btn-primary-def text-white fw-bold w-100 mb-2 roboto p-2"
                style={{ fontSize: "12px" }}
                disabled={loading}
              >
                {loading ? "Cargando..." : "INGRESAR"}
              </button>
              <a
                href="#!"
                className="btn btn-primary-def text-white fw-bold w-100 roboto mb-2 p-2"
                style={{ fontSize: "12px" }}
              >
                INGRESAR COMO PADRE
              </a>
            </form>
            <p className="mt-3 small mb-0 text-muted">
              Olvidaste tu contrasena?{" "}
              <a
                href="/src/pages/recuperar-password/index.html"
                className="fw-bold text-danger text-decoration-none"
              >
                Recuperar
              </a>
            </p>
          </div>
        </div>
      </div>

      <footer className="d-flex justify-content-between align-items-center px-4 py-2 text-white">
        <div className="bg-primary-def text-white px-3 py-2 rounded">
          &copy; {new Date().getFullYear()}, Hecho por aplicacion escolar
        </div>
        <div className="d-flex gap-3 fs-3 text-white">
          <a
            href="https://www.facebook.com/aplicacionescolar"
            target="_blank"
            rel="noreferrer"
            className="text-white"
          >
            <i className="bi bi-facebook"></i>
          </a>
          <a
            href="mailto:contacto@aplicacionescolar.com"
            target="_blank"
            rel="noreferrer"
            className="text-white"
          >
            <i className="bi bi-envelope"></i>
          </a>
          <a
            href="tel:7229247249"
            target="_blank"
            rel="noreferrer"
            className="text-white"
          >
            <i className="bi bi-telephone-fill"></i>
          </a>
          <a
            href="https://api.whatsapp.com/send?phone=527292775116&text=Hola%20quiero%20mas%20informacion"
            target="_blank"
            rel="noreferrer"
            className="text-white"
          >
            <i className="bi bi-whatsapp"></i>
          </a>
        </div>
      </footer>
    </div>
  );
}
