import { showAlert } from "./general/Alerts";
import { fechaFormateada } from "./general/Functions";
import {
  InstitutoData,
  InstitutoDataAdd,
  InstitutoDataDelete,
  InstitutoDataFilter,
  InstitutoDataUpdate,
} from "./general/DataActions";

const toActiveString = (value) => (value ? "si" : "no");
const isActive = (value) =>
  value === true ||
  value === 1 ||
  String(value).toLowerCase() === "si" ||
  String(value).toLowerCase() === "true" ||
  String(value) === "1" ||
  String(value).toLowerCase() === "activo";

export const getEmptyPermissions = (permissionModules = []) =>
  Object.fromEntries(permissionModules.map((permission) => [permission.id, false]));

export const obtenerRolesConPermisos = async (setRoles, setPermissionModules) => {
  try {
    const [rolesApi, usuariosApi, permisosRolApi, privilegiosApi] = await Promise.all([
      InstitutoData("rol?sid_instituto="),
      InstitutoData("usuario?sid_instituto="),
      InstitutoDataFilter("privilegios_rol"),
      InstitutoDataFilter("privilegios"),
    ]);

    const permissionModules = privilegiosApi.map((permission) => ({
      id: permission.privilegios_id,
      name: permission.nombre_privilegio,
    }));

    const roles = rolesApi.map((rol) => {
      const rolePermissions = permisosRolApi.filter(
        (permission) => permission.sid_rol === rol.id_rol
      );
      const permissionsMap = getEmptyPermissions();

      rolePermissions.forEach((permission) => {
        permissionsMap[permission.sid_privilegios] = isActive(permission.activo);
      });

      return {
        ...rol,
        usuarios_count: usuariosApi.filter((user) => user.sid_rol === rol.id_rol).length,
        permisos: permissionsMap,
        permisos_relaciones: rolePermissions,
      };
    });

    setPermissionModules(permissionModules);
    setRoles(roles);
  } catch (error) {
    showAlert("error", error.message || "Error al obtener roles");
  }
};

const ensureRolePermissions = async (
  roleId,
  permissionsMap,
  existingRelations = [],
  permissionModules = []
) => {
  await Promise.all(
    permissionModules.map((permission) => {
      const existing = existingRelations.find(
        (relation) => relation.sid_privilegios === permission.id
      );

      const payload = {
        privilegios_rol_id: existing?.privilegios_rol_id || null,
        sid_rol: roleId,
        sid_privilegios: permission.id,
        activo: toActiveString(permissionsMap[permission.id]),
      };

      if (existing) {
        return InstitutoDataUpdate(
          `privilegios_rol/${existing.privilegios_rol_id}`,
          payload
        );
      }

      return InstitutoDataAdd("privilegios_rol", payload);
    })
  );
};

export const guardarRol = async (
  values,
  editingRole,
  setEditingRole,
  refreshRoles,
  permissionModules
) => {
  try {
    const sid_instituto = localStorage.getItem("sid_instituto");
    const fecha = fechaFormateada(new Date());

    if (editingRole) {
      const payload = {
        id_rol: editingRole.id_rol,
        sid_instituto,
        nombre: values.nombre,
        fecha_registro: editingRole.fecha_registro || fecha,
      };

      await InstitutoDataUpdate(`rol/${editingRole.id_rol}`, payload);
      await ensureRolePermissions(
        editingRole.id_rol,
        values.permisos,
        editingRole.permisos_relaciones,
        permissionModules
      );
      showAlert("success", "Rol actualizado correctamente");
      setEditingRole(null);
    } else {
      const created = await InstitutoDataAdd("rol", {
        id_rol: null,
        sid_instituto,
        nombre: values.nombre,
        fecha_registro: fecha,
      });

      await ensureRolePermissions(created.id_rol, values.permisos, [], permissionModules);
      showAlert("success", "Rol agregado correctamente");
    }

    await refreshRoles();
  } catch (error) {
    showAlert("error", error.message || "Error al guardar rol");
  }
};

export const eliminarRol = async (role, refreshRoles) => {
  if (role.usuarios_count > 0) {
    showAlert("error", "No puedes eliminar un rol que tiene usuarios asignados");
    return;
  }

  const result = await showAlert("delete", "Deseas eliminar este rol?");
  if (!result.isConfirmed) return;

  try {
    await Promise.all(
      role.permisos_relaciones.map((relation) =>
        InstitutoDataDelete(`privilegios_rol/${relation.privilegios_rol_id}`)
      )
    );

    await InstitutoDataDelete(`rol/${role.id_rol}`);
    await refreshRoles();
    showAlert("success", "Rol eliminado correctamente");
  } catch (error) {
    showAlert("error", error.message || "Error al eliminar rol");
  }
};
