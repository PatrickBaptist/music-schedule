import { createContext, ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import useOrganizationContext from "../context/hooks/useOrganizationContext";

export interface ScheduleRoleDefinition {
  id: string;
  name: string;
  active: boolean;
  order: number;
  legacyKey?: string | null;
}

interface ScheduleRolesContextValue {
  roles: ScheduleRoleDefinition[];
  activeRoles: ScheduleRoleDefinition[];
  loading: boolean;
  refreshRoles: () => Promise<void>;
  createRole: (name: string) => Promise<ScheduleRoleDefinition>;
  setRoleActive: (roleId: string, active: boolean) => Promise<void>;
}

export const ScheduleRolesContext = createContext<ScheduleRolesContextValue | undefined>(undefined);

export const ScheduleRolesProvider = ({ children }: { children: ReactNode }) => {
  const { activeOrganizationId } = useOrganizationContext();
  const [roles, setRoles] = useState<ScheduleRoleDefinition[]>([]);
  const [loading, setLoading] = useState(false);
  const endpoint = `${import.meta.env.VITE_API_URL_PRODUTION}/organizations/${activeOrganizationId}/schedule-roles`;
  const headers = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });

  const refreshRoles = useCallback(async () => {
    if (!activeOrganizationId) { setRoles([]); return; }
    setLoading(true);
    try {
      const response = await fetch(endpoint, { headers: headers() });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Erro ao carregar funções");
      setRoles(data);
    } finally {
      setLoading(false);
    }
  }, [activeOrganizationId, endpoint]);

  useEffect(() => { void refreshRoles().catch(() => setRoles([])); }, [refreshRoles]);

  const createRole = useCallback(async (name: string) => {
    const response = await fetch(endpoint, { method: "POST", headers: headers(), body: JSON.stringify({ name }) });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Erro ao criar função");
    await refreshRoles();
    return data as ScheduleRoleDefinition;
  }, [endpoint, refreshRoles]);

  const setRoleActive = useCallback(async (roleId: string, active: boolean) => {
    const response = await fetch(`${endpoint}/${encodeURIComponent(roleId)}`, {
      method: "PATCH", headers: headers(), body: JSON.stringify({ active }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Erro ao alterar função");
    await refreshRoles();
  }, [endpoint, refreshRoles]);

  const value = useMemo(() => ({
    roles,
    activeRoles: roles.filter(role => role.active),
    loading,
    refreshRoles,
    createRole,
    setRoleActive,
  }), [roles, loading, refreshRoles, createRole, setRoleActive]);

  return <ScheduleRolesContext.Provider value={value}>{children}</ScheduleRolesContext.Provider>;
};
