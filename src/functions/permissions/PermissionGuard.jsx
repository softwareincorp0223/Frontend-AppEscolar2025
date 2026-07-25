import React, { useEffect, useMemo, useState } from "react";
import { getUser, refreshUserPermissions } from "../general/Auth";
import { findPermissionByPath } from "../../components/getCurrentPage";

const HOME_URL = "/src/pages/home/index.html";

export function hasPermission(permissionKey) {
  if (!permissionKey) return true;

  const user = getUser();
  if (user?.tipo === "admin") return true;
  if (user && user.permisos_configurados === false) return true;

  const permissions = Array.isArray(user?.privilegios) ? user.privilegios : [];
  return permissions.includes(permissionKey);
}

export default function PermissionGuard({ children }) {
  const [allowed, setAllowed] = useState(null);
  const [secondsLeft, setSecondsLeft] = useState(5);

  const permissionKey = useMemo(
    () => findPermissionByPath(window.location.pathname),
    []
  );

  useEffect(() => {
    let active = true;

    const validate = async () => {
      await refreshUserPermissions();
      if (active) setAllowed(hasPermission(permissionKey));
    };

    validate();

    return () => {
      active = false;
    };
  }, [permissionKey]);

  useEffect(() => {
    if (allowed !== false) return;

    const redirectTimer = window.setTimeout(() => {
      window.location.href = HOME_URL;
    }, 5000);

    const countdownTimer = window.setInterval(() => {
      setSecondsLeft((current) => Math.max(current - 1, 0));
    }, 1000);

    return () => {
      window.clearTimeout(redirectTimer);
      window.clearInterval(countdownTimer);
    };
  }, [allowed]);

  if (allowed === null) return null;
  if (allowed) return children;

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light px-3">
      <div className="card border-0 shadow-sm" style={{ maxWidth: "420px" }}>
        <div className="card-body text-center p-4">
          <span className="material-icons text-danger mb-3" style={{ fontSize: "48px" }}>
            lock
          </span>
          <h1 className="fs-4 mb-2">Acceso no autorizado</h1>
          <p className="text-muted mb-3">No tienes acceso a este modulo.</p>
          <div className="alert alert-warning mb-0">
            Redireccionando en {secondsLeft} segundos
          </div>
        </div>
      </div>
    </div>
  );
}
