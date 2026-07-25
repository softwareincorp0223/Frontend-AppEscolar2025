import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import {
  eliminarRol,
  getEmptyPermissions,
  guardarRol,
  obtenerRolesConPermisos,
} from "../../functions/RolesActions";

export default function Roles() {
  const [roles, setRoles] = useState([]);
  const [permissionModules, setPermissionModules] = useState([]);
  const [editingRole, setEditingRole] = useState(null);
  const [formValues, setFormValues] = useState({
    nombre: "",
    permisos: getEmptyPermissions(),
  });

  const refreshRoles = () => obtenerRolesConPermisos(setRoles, setPermissionModules);

  useEffect(() => {
    refreshRoles();
  }, []);

  useEffect(() => {
    if (!editingRole) {
      setFormValues({ nombre: "", permisos: getEmptyPermissions(permissionModules) });
      return;
    }

    setFormValues({
      nombre: editingRole.nombre || "",
      permisos: { ...getEmptyPermissions(permissionModules), ...editingRole.permisos },
    });
  }, [editingRole, permissionModules]);

  const handlePermissionChange = (permissionId) => {
    setFormValues((current) => ({
      ...current,
      permisos: {
        ...current.permisos,
        [permissionId]: !current.permisos[permissionId],
      },
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formValues.nombre.trim()) return;

    await guardarRol(
      formValues,
      editingRole,
      setEditingRole,
      refreshRoles,
      permissionModules
    );
    setFormValues({ nombre: "", permisos: getEmptyPermissions(permissionModules) });
  };

  return (
    <Layout>
      <div className="card mb-4">
        <div className="card-body p-4">
          <h2 className="card-title fs-5 mb-4">
            {editingRole ? "Editar Rol" : "Agregar Rol"}
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-12 col-lg-4">
                <label className="form-label" htmlFor="nombre">
                  Nombre <span className="text-danger">*</span>
                </label>
                <input
                  id="nombre"
                  className="form-control"
                  type="text"
                  value={formValues.nombre}
                  onChange={(event) =>
                    setFormValues((current) => ({
                      ...current,
                      nombre: event.target.value,
                    }))
                  }
                  placeholder="Nombre del rol"
                />
              </div>

              <div className="col-12 col-lg-8">
                <label className="form-label">Modulos permitidos</label>
                <div className="row g-2">
                  {permissionModules.map((permission) => (
                    <div key={permission.id} className="col-12 col-sm-6 col-xl-4">
                      <div className="form-check form-switch border rounded p-2 ps-5 h-100">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id={`permission-${permission.id}`}
                          checked={!!formValues.permisos[permission.id]}
                          onChange={() => handlePermissionChange(permission.id)}
                        />
                        <label
                          className="form-check-label small"
                          htmlFor={`permission-${permission.id}`}
                        >
                          {permission.name}
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="text-end mt-4">
              {editingRole && (
                <button
                  className="btn btn-outline-secondary me-2"
                  type="button"
                  onClick={() => setEditingRole(null)}
                >
                  Cancelar
                </button>
              )}
              <button className="btn btn-success" type="submit">
                {editingRole ? "Actualizar" : "Guardar"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="container-fluid mt-4 mb-2 px-0">
        <div className="row g-4">
          {roles.map((role) => (
            <div key={role.id_rol} className="col-12 col-md-6 col-xl-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body p-3">
                  <div className="d-flex align-items-center mb-3">
                    <span
                      className="material-icons me-2 text-primary bg-primary-subtle p-2 rounded"
                      style={{ fontSize: "22px" }}
                    >
                      manage_accounts
                    </span>
                    <div>
                      <h6 className="fw-bold mb-0">{role.nombre}</h6>
                      <span className="text-muted small">
                        Usuarios usandolo: {role.usuarios_count}
                      </span>
                    </div>
                  </div>

                  <ul className="list-unstyled mb-0">
                    {permissionModules.map((permission) => (
                      <li
                        key={permission.id}
                        className="d-flex justify-content-between align-items-center py-1 border-bottom"
                      >
                        <span className="text-secondary small">{permission.name}</span>
                        <div className="form-check form-switch m-0">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={!!role.permisos[permission.id]}
                            readOnly
                          />
                        </div>
                      </li>
                    ))}
                  </ul>

                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <button
                      className="btn btn-outline-danger btn-sm d-inline-flex align-items-center"
                      type="button"
                      onClick={() => eliminarRol(role, refreshRoles)}
                    >
                      <span className="material-icons" style={{ fontSize: "18px" }}>
                        delete
                      </span>
                    </button>
                    <button
                      className="btn btn-outline-primary btn-sm d-inline-flex align-items-center"
                      type="button"
                      onClick={() => setEditingRole(role)}
                    >
                      <span className="material-icons" style={{ fontSize: "18px" }}>
                        edit
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
