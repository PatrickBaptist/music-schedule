import React, {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef,
} from "react";
import { useContext } from "react";
import { AuthService } from "../services/AuthService";

const ACTIVE_ORGANIZATION_KEY = "activeOrganizationId";

export interface OrganizationMembership {
  managementRole?: string;
  musicalRoles?: string[];
  roles?: string[];
  status?: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  type?: string;
  logo?: string;
  logoURL?: string;
  status?: string;
  membership?: OrganizationMembership;
}

interface OrganizationContextValue {
  organizations: Organization[];
  activeOrganization: Organization | null;
  activeOrganizationId: string | null;
  activeOrganizationSlug: string | null;
  isOrganizationReady: boolean;
  isLoadingOrganizations: boolean;
  organizationsError: string | null;
  refreshOrganizations: () => Promise<Organization[]>;
  selectOrganization: (organizationId: string) => void;
  clearOrganization: () => void;
}

export const OrganizationContext = createContext<OrganizationContextValue | undefined>(undefined);

const getOrganizationsFromResponse = (data: unknown): Organization[] => {
  const value = Array.isArray(data)
    ? data
    : data && typeof data === "object" && "organizations" in data
      ? (data as { organizations?: unknown }).organizations
      : [];

  if (!Array.isArray(value)) return [];

  return value.filter((organization): organization is Organization => {
    if (!organization || typeof organization !== "object") return false;
    const candidate = organization as Partial<Organization>;
    return Boolean(candidate.id && candidate.name && candidate.slug);
  });
};

export const OrganizationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { token, isAuthenticated, isAuthReady } = useContext(AuthService)!;
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const organizationsRef = useRef<Organization[]>([]);
  const [activeOrganizationId, setActiveOrganizationId] = useState<string | null>(null);
  const [isOrganizationReady, setIsOrganizationReady] = useState(false);
  const [isLoadingOrganizations, setIsLoadingOrganizations] = useState(false);
  const [organizationsError, setOrganizationsError] = useState<string | null>(null);

  const API_URL = import.meta.env.VITE_API_URL_PRODUTION;

  const clearOrganization = useCallback(() => {
    localStorage.removeItem(ACTIVE_ORGANIZATION_KEY);
    setActiveOrganizationId(null);
  }, []);

  const applyOrganizations = useCallback((nextOrganizations: Organization[]) => {
    organizationsRef.current = nextOrganizations;
    setOrganizations(nextOrganizations);
    setActiveOrganizationId((currentId) => {
      const storedId = localStorage.getItem(ACTIVE_ORGANIZATION_KEY);
      const preferredId = currentId || storedId;
      const preferredOrganization = nextOrganizations.find(({ id }) => id === preferredId);
      const nextActiveId = preferredOrganization?.id
        ?? (nextOrganizations.length === 1 ? nextOrganizations[0].id : null);

      if (nextActiveId) {
        localStorage.setItem(ACTIVE_ORGANIZATION_KEY, nextActiveId);
      } else {
        localStorage.removeItem(ACTIVE_ORGANIZATION_KEY);
      }

      return nextActiveId;
    });
  }, []);

  const refreshOrganizations = useCallback(async (): Promise<Organization[]> => {
    if (!token) {
      setOrganizations([]);
      clearOrganization();
      setOrganizationsError(null);
      setIsOrganizationReady(true);
      return [];
    }

    setIsLoadingOrganizations(true);
    setOrganizationsError(null);

    try {
      const response = await fetch(`${API_URL}/organizations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data: unknown = await response.json().catch(() => ({}));

      if (!response.ok) {
        const message = data && typeof data === "object" && "message" in data
          ? String((data as { message?: unknown }).message)
          : "Não foi possível carregar suas organizações.";
        throw new Error(message);
      }

      const nextOrganizations = getOrganizationsFromResponse(data);
      applyOrganizations(nextOrganizations);
      return nextOrganizations;
    } catch (error) {
      setOrganizations([]);
      clearOrganization();
      setOrganizationsError(
        error instanceof Error ? error.message : "Não foi possível carregar suas organizações."
      );
      throw error;
    } finally {
      setIsLoadingOrganizations(false);
      setIsOrganizationReady(true);
    }
  }, [API_URL, applyOrganizations, clearOrganization, token]);

  useEffect(() => {
    if (!isAuthReady) return;

    if (!isAuthenticated || !token) {
      setOrganizations([]);
      clearOrganization();
      setOrganizationsError(null);
      setIsOrganizationReady(true);
      return;
    }

    setIsOrganizationReady(false);
    void refreshOrganizations().catch(() => undefined);
  }, [clearOrganization, isAuthReady, isAuthenticated, refreshOrganizations, token]);

  const selectOrganization = useCallback((organizationId: string) => {
    const organization = organizationsRef.current.find(({ id }) => id === organizationId);
    if (!organization) {
      throw new Error("Esta organização não está disponível para sua conta.");
    }

    localStorage.setItem(ACTIVE_ORGANIZATION_KEY, organization.id);
    setActiveOrganizationId(organization.id);
  }, [organizations]);

  const activeOrganization = useMemo(
    () => organizations.find(({ id }) => id === activeOrganizationId) ?? null,
    [activeOrganizationId, organizations]
  );

  const contextValue = useMemo<OrganizationContextValue>(() => ({
    organizations,
    activeOrganization,
    activeOrganizationId: activeOrganization?.id ?? null,
    activeOrganizationSlug: activeOrganization?.slug ?? null,
    isOrganizationReady,
    isLoadingOrganizations,
    organizationsError,
    refreshOrganizations,
    selectOrganization,
    clearOrganization,
  }), [
    activeOrganization,
    clearOrganization,
    isLoadingOrganizations,
    isOrganizationReady,
    organizations,
    organizationsError,
    refreshOrganizations,
    selectOrganization,
  ]);

  return (
    <OrganizationContext.Provider value={contextValue}>
      <React.Fragment key={activeOrganization?.id ?? "without-organization"}>
        {children}
      </React.Fragment>
    </OrganizationContext.Provider>
  );
};
