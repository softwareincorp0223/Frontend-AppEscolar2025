// src/components/Aside.jsx
import { logout } from "../functions/general/Auth";

export default function Header({ onToggleSidebar }) {

  const cerrarSesion = ()=> {
    logout();
  }
  return (
    <header className="color_fondo p-3 pb-3">
      <div className="d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          {/* Botón hamburguesa visible solo en móviles */}
          <button
            className="btn btn-outline-secondary d-md-none me-6"
            onClick={onToggleSidebar}
          >
            <i className="bi bi-list"></i>
          </button>

          <nav aria-label="breadcrumb">
            <ol className="">
              <li
                className="breadcrumb-item active text-dark fw-bold"
                aria-current="page"
              >
                Niveles, Grados, Grupos
              </li>
            </ol>
          </nav>
        </div>

        <div className="d-flex align-items-center">
          <span className="me-4 text-muted">Hola! angel@sistema.com</span>
          <button className="btn btn-outline-danger btn-sm px-4 py-1" onClick={cerrarSesion}>
            Cerrar sesión
          </button>
        </div>
      </div>
    </header>
  );
}
